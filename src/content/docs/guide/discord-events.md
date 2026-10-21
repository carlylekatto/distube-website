---
title: Discord.js events
description: The discord.js events you need to handle a music bot properly.
---

DisTube manages the playback. The events of discord.js are what you need to handle the things
around it: a user who leaves, a bot that is moved, a channel that empties.

## Leave the voice channel when it is empty

The most common one. Without it, the bot stays alone in a voice channel forever.

```js
const { isVoiceChannelEmpty } = require("distube");

client.on("voiceStateUpdate", (oldState, newState) => {
  if (!isVoiceChannelEmpty(oldState)) return;

  const voice = distube.voices.get(oldState);
  if (voice) voice.leave();
});
```

## Pause the queue when nobody is left

```js
client.on("voiceStateUpdate", (oldState, newState) => {
  if (!isVoiceChannelEmpty(oldState)) return;

  const queue = distube.getQueue(oldState);
  if (queue) queue.pause();
});
```

And resume it when somebody comes back:

```js
client.on("voiceStateUpdate", (oldState, newState) => {
  if (isVoiceChannelEmpty(oldState)) return;

  const queue = distube.getQueue(oldState);
  if (queue && queue.paused) queue.resume();
});
```

## Leave after a period of inactivity

```js
const timers = new Map();

client.on(Events.FINISH, (queue) => {
  timers.set(
    queue.id,
    setTimeout(() => {
      queue.voice.leave();
      timers.delete(queue.id);
    }, 5 * 60 * 1000),
  );
});

client.on(Events.PLAY_SONG, (queue) => {
  clearTimeout(timers.get(queue.id));
});

client.on(Events.DELETE_QUEUE, (queue) => {
  clearTimeout(timers.get(queue.id));
  timers.delete(queue.id);
});
```

## The bot is moved to another channel

```js
client.on("voiceStateUpdate", (oldState, newState) => {
  if (oldState.member?.id !== client.user?.id) return;
  if (oldState.channelId === newState.channelId) return;

  const queue = distube.getQueue(oldState);
  queue?.textChannel?.send(`Moved to <#${newState.channelId}>`);
});
```

## Slash commands

DisTube works with any command handler. A chat input command looks like this:

```js
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "play") return;

  const query = interaction.options.getString("query");
  const voiceChannel = interaction.member.voice?.channel;

  if (!voiceChannel) {
    await interaction.reply("You have to be in a voice channel.");
    return;
  }

  await interaction.deferReply();

  try {
    await distube.play(voiceChannel, query, {
      member: interaction.member,
      textChannel: interaction.channel,
      interaction,
    });
    await interaction.editReply("Added to the queue.");
  } catch (error) {
    await interaction.editReply(`Could not play that: ${error.message}`);
  }
});
```

:::tip
Use `interaction.deferReply()` before the `play()` call: resolving a track can take a moment, and
Discord only gives you fifteen seconds.
:::

## The client is ready

```js
client.once("ready", () => {
  console.log(`${client.user.tag} is ready.`);
});
```

Destroy DisTube before the client goes away, so every queue is stopped and every plugin is disposed.

```js
client.on("destroy", async () => {
  await distube.destroy();
});
```
