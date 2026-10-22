# Design — DisTube (Supabase Developer Language)

A locked design system for DisTube engineered for clarity, technical density, and developer focus.
The marketing and documentation surfaces commit to `{colors.canvas}` (pure white), with text rendered in `{colors.ink}` (`#171717` — near-black, never pure black). The single chromatic event across the system is the **emerald green primary** (`#3ecf8e`), with composited product UI mockups and deep `{colors.canvas-night}` (`#1c1c1c`) code blocks doing the visual heavy lifting.

The system lives in `src/styles/custom.css`. The tokens below are the contract: when a page needs
something new, the system grows, it is not reinvented per page.

## Genre
modern-minimal

## Macrostructure family
- Marketing pages: Marquee Hero with composited product UI mockups (bot dashboard / queue inspector), tabbed install terminal, and structured feature grid.
- Content pages:   Long Document with clean monochrome typography, 1px hairlines, and dark code containers.
- App / API pages: Workbench with technical type chips, parameter matrices, and monospaced member blocks.

## Theme & Colors

### Brand & Accent
- `--colors-primary`:       #3ecf8e (Signature emerald green for filled CTAs and wordmark accents)
- `--colors-primary-deep`:  #24b47e (Pressed state lift)
- `--colors-primary-soft`:  #4ade80 (Secondary emerald for chart/status highlights)
- `--colors-on-primary`:    #171717 (Near-black text on emerald fill — NOT white; reads as a lit surface)
- `--colors-emerald-text`:  #047857 (Emerald for text on light surfaces — the fill green is too light to read as text)

### Surfaces
- `--colors-canvas`:             #ffffff (Default pure white canvas)
- `--colors-canvas-soft`:        #fafafa (Subtle off-white for alternate section panels)
- `--colors-canvas-night`:       #1c1c1c (Deep near-black for code blocks and mockup chrome)
- `--colors-canvas-night-soft`:  #202020 (Nested terminal and code chrome)
- `--colors-hairline`:           #dfdfdf (1px border on cards and tables)
- `--colors-hairline-strong`:    #c7c7c7 (Border emphasis on hover)
- `--colors-hairline-cool`:      #ededed (Subtle boundary line, and the rule above a section)

### Text
- `--colors-ink`:           #171717 (Default body text, near-black, never pure black)
- `--colors-ink-secondary`: #2d2d2d (Emphasis, one step above the body)
- `--colors-ink-mute`:      #595959 (Secondary helper copy — 7:1 on white)
- `--colors-ink-mute-2`:    #737373 (Tertiary text and labels)
- `--colors-ink-faint`:     #8a8a8a (Disabled / subtle placeholder text)
- `--colors-on-dark`:       #ffffff (High-contrast text on canvas-night surfaces)

### Dark mode
Dark mode is not an inversion of the light palette: it is the **developer workspace**, a deeper set of
surfaces with the same emerald. The ink values are raised, the hairlines are lowered, and
`--colors-emerald-text` becomes the primary green because the dark emerald fill does not read on a
dark canvas.

| Token | Dark |
| --- | --- |
| `--colors-canvas` | #171717 |
| `--colors-canvas-soft` | #1c1c1c |
| `--colors-canvas-night` | #121212 |
| `--colors-hairline` | #2e2e2e |
| `--colors-hairline-strong` | #3e3e3e |
| `--colors-hairline-cool` | #262626 |
| `--colors-ink` | #ededed |
| `--colors-ink-secondary` | #d1d5db |
| `--colors-ink-mute` | #9ca3af |
| `--colors-ink-mute-2` | #858585 |
| `--colors-ink-faint` | #71717a |
| `--colors-emerald-text` | #3ecf8e |

### The Starlight bridge
Starlight brings its own scale, so the system maps onto it instead of fighting it. The mapping is
written in the CSS with the contrast of each step on the canvas.

| Starlight | Role | Contrast on white |
| --- | --- | --- |
| `--sl-color-gray-1` | Body text | high |
| `--sl-color-gray-2` | Secondary text: theme select, pagination, search | 8.6:1 |
| `--sl-color-gray-3` | Tertiary text: footer, edit link, tabs | 6.8:1 |
| `--sl-color-gray-4` | Strong border | — |
| `--sl-color-gray-5` | Hairline border | — |
| `--sl-color-gray-6` | Soft surface | — |

## Typography

### Font Family
- Display & Body: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- Code & Tech: ui-monospace, Menlo, Monaco, Consolas, "Cascadia Code", monospace

### Scale & Tracking
- Display XXL (Hero): 64px (clamp 2.5rem, 1.4rem + 3.2vw, 4rem), weight 500, line-height 1.1, letter-spacing -1.92px
- Display XL (Section): 48px, weight 500, line-height 1.1, letter-spacing -1.44px
- Display LG (Sub-section): 36px, weight 500, line-height 1.15, letter-spacing -0.72px
- Display MD (Cards): 24px–28px, weight 500, line-height 1.2, letter-spacing -0.42px
- Body: 16px, weight 400, line-height 1.55, letter-spacing 0
- Code: 14px, weight 400, line-height 1.5

### Principles
- **Weight 500 across display.** Mid-weight reads as engineered, never decorative or overly heavy.
- **Negative letter-spacing on display.** -1.92px down to -0.42px tightens the letterforms into editorial density.
- **Humanizer prose standards.** Sentence-case headings, no buzzwords, no not-X-but-Y formulas, no decorative bolding.
- **The site asks for no font.** The stack is the system one, so a page never waits for a third party.

## Shapes & Radii
- `--rounded-xs`: 4px (Form inputs, tags)
- `--rounded-sm`: 6px (Signature button radius — square-ish, technical, NEVER pill-shaped)
- `--rounded-md`: 8px (Compact cards, alert boxes)
- `--rounded-lg`: 12px (Feature cards, pricing tiers, composited UI mockups)
- `--rounded-full`: 9999px (Status dots and avatar indicators only)

## Elevation & Depth
- Level 0: Flat with 1px hairline border
- Level 1: `0 1px 3px rgba(0, 0, 0, 0.06)`
- Level 2: `0 8px 24px rgba(0, 0, 0, 0.08)` (Used for floating composited UI mockups)
- Level 3: `0 16px 48px rgba(0, 0, 0, 0.12)`

## Components & Voice
- **`button-primary-green`**: Background `#3ecf8e`, text `#171717` (near-black), radius 6px (`--rounded-sm`), font-weight 500.
- **`button-secondary-outline`**: Background `#ffffff`, text `#171717`, 1px solid `#c7c7c7`, radius 6px.
- **Composited Product UI Mockup**: Floating dashboard queue inspector in `#1c1c1c` canvas-night with Level 2 shadow.
- **Code Blocks**: `#1c1c1c` canvas-night container with 6px radius and clean copy control.
- **Spectrum analyzer** (`src/components/Waveform.astro`): A canvas of 44 emerald bars that lives inside
  the mockup. It reacts to the pointer, and it flattens when the reader asked for less motion.
- **Tabbed install terminal**: `npm` / `pnpm` / `yarn` / `bun` over one command, with a copy control.
- **Wordmark**: the header carries the word `DisTube` as text. There is no logo image in the header;
  the mark of the site is the favicon.

## Motion
- Every transition is **140ms ease**. It is the only duration of the system: a hover, a border, a
  colour, a copy control. Nothing animates longer than it takes to read as a reaction.
- One orchestrated entrance on the load of the hero. No repetitive scroll fade.
- Reduced motion: the spectrum analyzer keeps its bars but flattens them, so nothing moves.

## Microinteractions
- Silent success: the icon of a copy control changes in place. No toast, no celebration.
- A hover changes a colour or a border, never the layout.
- A press of a button deepens the emerald. It never bounces, and it never shifts the box.

## Per-page allowances
- Marketing pages may use the spectrum analyzer and the mockups of the product.
- Content pages stay typographic: hairlines, dark code containers, and a focus on the text.
- The API reference is a workbench: type chips, parameter matrices, monospaced member blocks.
