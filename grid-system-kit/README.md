# CandidRender Grid System Kit

A self-contained, portable bundle of everything needed to implement the
**exact** CandidRender structural grid on any new marketing site.

Drop this entire folder (`grid-system-kit/`) into the root of a new
project. Open Claude in that project. Paste one of the starter prompts
below. The grid you see on candidrender.com — the column alignment,
the row dividers, the dark-surface footer, the responsive breakpoints,
the iOS-safe scroll choreography — will be reproduced on the new site.

You customize the **design language** (font, colors, brand accents,
radii, animations). You do NOT modify the **grid mechanics**. That
distinction is everything. More in [`porting.md`](porting.md).

---

## How to use this kit

### Option A — Fresh marketing project

1. Copy this entire `grid-system-kit/` folder into the root of your new
   Next.js project.
2. Open Claude Code in the project root.
3. Paste the **Fresh project** starter prompt from below (or from
   [`porting.md`](porting.md)).
4. Claude reads the kit's docs, scaffolds the grid, stubs Header +
   Footer + a sample hero, and overlays your brand tokens.
5. Iterate on content and design from there.

### Option B — Retrofit an existing site

1. Drop the kit into the existing project.
2. Paste the **Retrofit** starter prompt from below.
3. Claude shows you diffs before applying — it replaces layout
   wrappers with `.g-row`/`.g-cell` while preserving your content,
   routing, and existing design tokens.

### Option C — Add one grid-aligned section

1. Drop the kit in.
2. Tell Claude: *"Add a pricing section using
   `grid-system-kit/patterns.md` §5 (3-column features pattern)"*.
3. Claude uses the pattern recipe and keeps your existing design tokens.

---

## What's in this folder

### Documentation (read in this order)

| File                                     | Role                                                                                          |
|------------------------------------------|-----------------------------------------------------------------------------------------------|
| [`README.md`](README.md)                 | **You are here.** Entry point and starter prompts.                                            |
| [`porting.md`](porting.md)               | **The 10-step procedure** for applying the grid to a new site. Sacred-vs-swappable map, common mistakes. |
| [`SKILL.md`](SKILL.md)                   | The primary reference — 7 philosophy rules, tokens, primitives (`.g-row`, `.g-cell`), alignment math, modifiers, dark variant. |
| [`patterns.md`](patterns.md)             | Cookbook — 13 copy-paste recipes (nav, hero, stats, 3-col features, dark CTA, footer, edge-to-edge). |
| [`responsive.md`](responsive.md)         | Full responsive model — grid breakpoints, Tailwind `md:` mapping, markup swaps, JS `matchMedia` forks, per-device scroll tuning, iOS URL-bar quirks, typography scale, 10-point audit. |
| [`react-snippets.md`](react-snippets.md) | Next.js/React port — head script as JSX, `<GridOverlay />`, typed CSS-var styles, layout wiring, `useGridTokens` hook. |

### Drop-in CSS

| File                                     | Role                                                                 |
|------------------------------------------|----------------------------------------------------------------------|
| [`grid-system.css`](grid-system.css)     | The complete CSS module. Paste into your `globals.css` unmodified, or `@import` it. **This is the sacred layer.** |

### Runnable demo

| File                                     | Role                                                                 |
|------------------------------------------|----------------------------------------------------------------------|
| [`grid-demo.html`](grid-demo.html)       | Standalone HTML you can open in a browser. Shows nav, hero, stats, 3-col features, dark CTA, 3-col footer, wordmark, marquee — all using the grid primitives. Your reference for "does it look right". |

### Production React components (from candidrender.com)

Drop these into your new project's `components/` directory, then
customize the content:

| File                                               | Role                                                                                 |
|----------------------------------------------------|--------------------------------------------------------------------------------------|
| [`components/GridOverlay.tsx`](components/GridOverlay.tsx) | ResizeObserver that paints `--g-cols` column divs. **Do not modify.**                |
| [`components/Header.tsx`](components/Header.tsx)   | Fixed nav with local overlay, logo left / actions right, mobile drawer. Swap brand, keep structure. |
| [`components/Footer.tsx`](components/Footer.tsx)   | Dark footer with 3-row mobile / 6+3+3 desktop, edge-to-edge wordmark, marquee. Swap content, keep structure. |
| [`components/WordmarkSVG.tsx`](components/WordmarkSVG.tsx) | Auto-fit viewBox wordmark with optional neon-flicker. Optional.              |
| [`components/AnimatedButton.tsx`](components/AnimatedButton.tsx) | Slide-to-unlock CTA (mobile swipe + desktop hover-expand). Optional.    |
| [`components/SmoothScrollProvider.tsx`](components/SmoothScrollProvider.tsx) | Lenis wrapper for butter-smooth scroll. Optional — native scroll also works. |

### Hooks

| File                                                    | Role                                                                 |
|---------------------------------------------------------|----------------------------------------------------------------------|
| [`hooks/useScrollAnimation.ts`](hooks/useScrollAnimation.ts) | IntersectionObserver → `isVisible` flag for scroll-reveal animations. |

### Full-file examples (reference, do not copy wholesale)

| File                                       | Role                                                                       |
|--------------------------------------------|----------------------------------------------------------------------------|
| [`examples/layout.tsx`](examples/layout.tsx) | Real Next.js `app/layout.tsx` from candidrender.com. Shows the inline head script, Plus Jakarta font, and header/footer wiring in context. |
| [`examples/globals.css`](examples/globals.css) | Real `globals.css` showing the grid block + CandidRender design tokens + animation keyframes. Use to cross-check your own globals. |

---

## Starter prompts

### Fresh project

```
I'm starting a new marketing site at this project root (Next.js 15,
TypeScript, Tailwind v4). Apply the grid-system-kit/ folder to bootstrap
the structural grid foundation.

Brand tokens:
  - Font: [Plus Jakarta Sans / Inter / Geist / <your choice>]
  - Primary accent: #__
  - Dark surface: #__
  - Max content width: 1200px

Follow the 10-step procedure in grid-system-kit/porting.md:
  1. Paste grid-system-kit/grid-system.css into app/globals.css (unmodified).
  2. Copy the inline head script from grid-system-kit/examples/layout.tsx
     into the new app/layout.tsx <head>.
  3. Copy grid-system-kit/components/GridOverlay.tsx into components/.
  4. Stub components/Header.tsx from grid-system-kit/components/Header.tsx
     as a template — keep .g-row--center, --g-row-min: 64px, --g-inset:
     16px, g-half-l/r structure. Swap the brand content.
  5. Stub components/Footer.tsx from grid-system-kit/components/Footer.tsx
     as a template — keep .g-section--dark + 3-row mobile / 6+3+3 desktop
     + edge-to-edge wordmark row. Swap content.
  6. Stub app/page.tsx with a sample hero from grid-system-kit/patterns.md §2.
  7. Overlay my brand tokens as a block in globals.css AFTER the grid block.

Do NOT modify the grid CSS module, the inline head script, scrollbar-gutter
rule, --g-cols media queries, or the .g-row::after divider math. Only
customize the design-token layer I listed.
```

### Retrofit an existing site

```
Retrofit the structural grid from grid-system-kit/ into this existing site.

Scope:
  - Keep existing routes, components, content, typography, colors.
  - Replace layout wrappers (max-w-Xxl mx-auto, custom grid containers)
    with .g-row / .g-cell following grid-system-kit/patterns.md.
  - Remove per-component @media queries that duplicate what --g-cols
    token overrides already handle.
  - Add the inline head script from grid-system-kit/examples/layout.tsx
    if it's not already present.

Start with: [app/layout.tsx / components/Header.tsx / app/page.tsx]
Show me the diffs before applying changes.
```

### Add one grid-aligned section

```
Add a new section to [page path] using grid-system-kit/ patterns.

Section: "[e.g., pricing tiers — three cards side-by-side with feature lists]"

Pattern to follow: grid-system-kit/patterns.md §[N] ([section name]).

Use .g-row + three .g-cell.g-span-4 with .g-sm-hr-top on the 2nd and
3rd cells for mobile dividers. Match the existing site's design tokens
(don't introduce new colors or fonts).
```

### Audit an existing grid implementation

```
Audit this site's structural grid implementation against
grid-system-kit/responsive.md §10 (the 10-point audit checklist).

Report for each of the 9 viewport widths (1280, 1024, 900, 820, 768,
700, 540, 480, 375):
  - Whether overlay outer lines hit the row edges
  - Whether row dividers span viewport - --g-sb correctly
  - Whether mobile helpers (.g-sm-full, .g-sm-hr-top) activate correctly
  - Whether markup swaps (md:hidden / hidden md:block) show exactly one
    block
  - Any drift, gaps, or alignment issues

Do not modify code yet — just report findings.
```

---

## The sacred vs. swappable rule (one-paragraph version)

**Sacred** (copy verbatim, never modify): `grid-system.css` (all tokens,
primitives, media queries, overlay CSS, `.g-section--dark`, `.g-sm-*`
helpers, `.g-row::after` divider math), the inline `<head>` script,
`html { scrollbar-gutter: stable; overflow-x: clip; }`, `body {
overflow-anchor: none; }`, and `GridOverlay.tsx`'s ResizeObserver logic.

**Swappable** (customize freely): font family, color palette, `--g-max`
content width, `--g-line`/`--g-divider` alpha, component styling
(button variants, card radii, shadows), animation keyframes, section
content, section rhythm (via per-row `--g-inset` overrides).

The full table with every item classified is in
[`porting.md`](porting.md) §"The sacred vs. swappable map".

---

## Decision tree — which doc to read first

```
Just want to apply the grid to a new site?
  → porting.md (the 10-step procedure)

Want to understand how the primitives work?
  → SKILL.md (the primary reference)

Building a specific section (hero, footer, CTA)?
  → patterns.md (section-by-section cookbook)

Something responsive isn't behaving correctly?
  → responsive.md (breakpoints, markup swaps, iOS quirks)

Porting to React/Next.js and need snippets?
  → react-snippets.md (head script, GridOverlay, typed styles)

Just want to see it running?
  → grid-demo.html (open in browser)
```

---

## License / attribution

This kit is extracted from candidrender.com's internal design system.
It's meant to be forked freely across the Made by Wind / CandidRender
ecosystem. Credit the source when you ship a site built on it so
future maintainers know where the patterns come from.

---

## One-line TL;DR

> Drop this folder into a new project, tell Claude *"bootstrap this
> site using grid-system-kit/porting.md"*, paste your brand tokens.
> Ten minutes later you have a grid-aligned, responsive, iOS-safe
> marketing shell ready for content.
