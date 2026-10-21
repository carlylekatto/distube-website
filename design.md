# Design — DisTube (Supabase Developer Language)

A locked design system for DisTube engineered for clarity, technical density, and developer focus.
The marketing and documentation surfaces commit to `{colors.canvas}` (pure white), with text rendered in `{colors.ink}` (`#171717` — near-black, never pure black). The single chromatic event across the system is the **emerald green primary** (`#3ecf8e`), with composited product UI mockups and deep `{colors.canvas-night}` (`#1c1c1c`) code blocks doing the visual heavy lifting.

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

### Surfaces
- `--colors-canvas`:             #ffffff (Default pure white canvas)
- `--colors-canvas-soft`:        #fafafa (Subtle off-white for alternate section panels)
- `--colors-canvas-night`:       #1c1c1c (Deep near-black for code blocks and mockup chrome)
- `--colors-canvas-night-soft`:  #202020 (Nested terminal and code chrome)
- `--colors-hairline`:           #dfdfdf (1px border on cards and tables)
- `--colors-hairline-strong`:    #c7c7c7 (Border emphasis on hover)
- `--colors-hairline-cool`:      #ededed (Subtle boundary line)

### Text
- `--colors-ink`:           #171717 (Default body text, near-black, never pure black)
- `--colors-ink-secondary`: #212121 (Slightly cooler near-black for emphasis)
- `--colors-ink-mute`:      #707070 (Secondary helper copy)
- `--colors-ink-mute-2`:    #9a9a9a (Tertiary text and labels)
- `--colors-ink-faint`:     #b2b2b2 (Disabled / subtle placeholder text)
- `--colors-on-dark`:       #ffffff (High-contrast text on canvas-night surfaces)

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
