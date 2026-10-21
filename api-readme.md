# API reference

The reference of every exported member of DisTube.

The library is split in three layers:

| Layer | What it does |
| --- | --- |
| [`DisTube`](/api/classes/distube/) | The entry point. It holds the queues, the voice connections and the plugins. |
| [`Queue`](/api/classes/queue/) | The playback state of a guild: the songs, the filters, the volume. |
| [`Plugin`](/api/classes/plugin/) | A music source. It resolves the URLs, searches the tracks and gives the stream. |

## The classes

| Class | Description |
| --- | --- |
| [`DisTube`](/api/classes/distube/) | The main class. |
| [`Queue`](/api/classes/queue/) | The state of the playback of a guild. |
| [`Song`](/api/classes/song/) | A track. |
| [`Playlist`](/api/classes/playlist/) | A list of tracks. |
| [`SearchResult`](/api/classes/searchresult/) | The result of a search. |
| [`ExtractorPlugin`](/api/classes/extractorplugin/) | The base class of the music sources. |
| [`InfoExtractorPlugin`](/api/classes/infoextractorplugin/) | A source that only knows the metadata. |
| [`PlayableExtractorPlugin`](/api/classes/playableextractorplugin/) | A source that plays the tracks but cannot search. |
| [`PluginError`](/api/classes/pluginerror/) | The error a plugin raises. |
| [`DisTubeError`](/api/classes/distubeerror/) | The error of the library. |
| [`StreamServer`](/api/classes/streamserver/) | The local HTTP server the plugins stream through. |
| [`FilterManager`](/api/classes/filtermanager/) | The audio filters of a queue. |
| [`DisTubeVoice`](/api/classes/distubevoice/) | A voice connection. |
| [`DisTubeHandler`](/api/classes/distubehandler/) | Resolves the URLs and the searches. |

## The types

| Type | Description |
| --- | --- |
| [`DisTubeOptions`](/api/type-aliases/distubeoptions/) | The options of the client. |
| [`PlayOptions`](/api/interfaces/playoptions/) | The options of `DisTube#play()`. |
| [`SearchOptions`](/api/interfaces/searchoptions/) | The options of a search. |
| [`SongInfo`](/api/interfaces/songinfo/) | The raw data of a track. |
| [`Events`](/api/enumerations/events/) | The events of the library. |
| [`RepeatMode`](/api/enumerations/repeatmode/) | The repeat modes of a queue. |
| [`PluginType`](/api/enumerations/plugintype/) | The roles of a plugin. |
| [`PluginErrorCode`](/api/enumerations/pluginerrorcode/) | The error codes a plugin raises. |

## The constants

| Constant | Description |
| --- | --- |
| [`defaultFilters`](/api/variables/defaultfilters/) | The built-in audio filters. |
| [`defaultOptions`](/api/variables/defaultoptions/) | The default options of the client. |
| [`DEFAULT_VOLUME`](/api/variables/default_volume/) | The default volume of a queue. |
| [`AUDIO_SAMPLE_RATE`](/api/variables/audio_sample_rate/) | The sample rate of the audio. |
