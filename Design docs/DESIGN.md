# CandidRender — Visual Design Reference

A one-page cheatsheet for the system documented in full in [SKILL.md](./SKILL.md).
Read this to port the look to a new project in an afternoon.

## The five-word summary

**Editorial grid, tactile cards, cinematic scroll.**

Nothing here is generic SaaS. The page reads as a physical artefact — visible
grid lines, noise-grain on surfaces, hand-placed rotations on cards, neon
flicker on the wordmark. Motion is scroll-driven and per-element, not library
defaults.

---

## Stack

| Piece | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15/16 + React 19 | App Router, `next/font` |
| Styles | Tailwind v4 (`@import "tailwindcss"`) | Utility-first, arbitrary values acceptable |
| Typography | Plus Jakarta Sans 300–800 via `next/font` | Tight letter-spacing, clean wordmarks |
| Smooth scroll | Lenis (`autoRaf: true`, no `syncTouch`) | Wheel sync without breaking iOS momentum |
| Motion | `requestAnimationFrame` writes, `translate3d`, `will-change: transform` | No `scroll` listeners, no `top`/`left` animations |

---

## Tokens

### Color

```
white           #ffffff    Hero, cards, HIW section
neutral-100     #f5f5f5    Quiet background panels
[#15151a]       near-black Footer, dark sections
yellow-300      #fde047    Assistive-touch bubbles, hints (never CTAs)
emerald-500     #10b981    Success state
wordmark red    #8b1a1a / #a52222 rest  →  #b52828 / #c23838 lit
gray-500/400    —          Supporting copy
```

Primary CTAs are **black→gray-900 gradient** or **solid white**, never colored
fills. Yellow is only for small floating affordances.

### Grid tokens

```css
--g-cols:   12 → 8 → 4 → 2    (≤1024 / ≤768 / ≤480)
--g-gap:    24 → 24 → 12 px
--g-pad:    32 → 24 → 16 px
--g-max:    1200px
--g-inset:  var(--g-pad)      (uniform 4-side padding inside cells)
--g-line / --g-divider: rgba(40,40,40,0.14) light / rgba(255,255,255,0.08) dark
--g-sb:     reserved scrollbar width (set via inline <head> script)
--vh:       cached innerHeight (not 100vh — iOS flickers)
```

### Typography scale

| Role | Classes |
| --- | --- |
| Heading | `text-4xl sm:text-5xl font-bold tracking-[-0.02em] lowercase` |
| Wordmark | `font-black tracking-[-0.04em]` (SVG, auto-fit viewBox) |
| Body | `text-base` (primary) / `text-sm text-gray-500` (supporting) |
| Eyebrow | `text-xs font-semibold uppercase tracking-widest text-gray-400` |

---

## The three signature moves

### 1. Structural grid with visible lines

Every content section uses `.g-row` + `.g-cell` driven by tokens. Vertical
guides via `<GridOverlay />` (local, not fixed). Horizontal dividers are
pseudo-elements on each row that extend full viewport width
(`100vw - var(--g-sb)`) so they stay aligned with the scrollbar gutter.

```tsx
<div className="g-row">
  <div className="g-cell g-half-l">Left half</div>
  <div className="g-cell g-half-r">Right half</div>
</div>
```

Reflow is automatic — `--g-cols` changes at breakpoints and `calc(var(--g-cols) / 2)`
spans follow. **Never** write per-component media queries for layout.

### 2. HIW envelope + fixed Rendering Modes

Hero → tall `--vh`-driven spacer → "How It Works" section that's been
translated up to sit glued to the hero bottom. As the user scrolls, HIW slides
down, revealing a `position: fixed` section behind it. Pure `requestAnimationFrame`
write, single `translate3d` per frame, phase constants differ desktop vs
mobile (see SKILL.md §5a).

### 3. Mobile horizontal pin with per-card tilt

Vertical scroll maps to `translateX` on a horizontal card track. Cards
overlap at rest (`-ml-[18vw]`), each with a `data-rest="±N"` tilt angle;
the tilt eases to 0° as the card's x-center crosses viewport center. No
second spacer — re-uses the hero → HIW scroll range.

---

## Component vocabulary

| Component | File | One-line purpose |
| --- | --- | --- |
| 3D Pill Button | `Header.tsx` (inline) | Nav CTA — three-shadow "3D" feel, press-sink |
| Slide-to-Unlock | `AnimatedButton.tsx` | Expands on hover / swipe; 92% progress → navigate |
| Floating Video | `FloatingVideoPopup.tsx` | Draggable yellow bubble ↔ circular peek, fullscreen on tap |
| Before/After | `BeforeAfterSlider.tsx` | Desktop drag + mobile auto-sweep (20%↔80% / 3s) |
| Slider3D | `Slider3D.tsx` | Stepped range dial with description callback |
| Wordmark | `WordmarkSVG.tsx` | Canvas-measured viewBox + neon-circuit flicker clusters |
| Grid Overlay | `GridOverlay.tsx` | Paints `--g-cols` column dividers, ResizeObserver-driven |

See SKILL.md §6 for the full recipe of each.

---

## Card surface: grain, not flat

```css
.card-grain::before {
  inset: 0;
  opacity: 0.45;
  mix-blend-mode: multiply;
  background: url("…fractalNoise baseFrequency='.75'…") 180px;
}
```

Apply to **tinted** surfaces only (dark / accent). On pure white, `multiply @ 0.45`
reads as dirt — drop grain or lower opacity. Desktop-only hover lift:
`translateY(-4px)` + deep shadow.

---

## Motion rules (the non-negotiables)

1. `requestAnimationFrame` — never a `scroll` listener.
2. `translate3d(…)`, never plain `translate`.
3. `will-change: transform` on any scroll-driven element.
4. Easing:
   - Hover overshoot → `cubic-bezier(0.34, 1.56, 0.64, 1)`
   - Entrance → `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out quart)
   - Micro-nudge → `cubic-bezier(0.68, -0.55, 0.27, 1.55)`
   - Envelope snap → `cubic-bezier(0.34, 1.3, 0.64, 1)`
5. Never animate `top` / `left` / `height` / `width` for scroll motion.

---

## Do / don't

| Do | Don't |
| --- | --- |
| Use `--vh` for pinned heights | Use `100vh` / `100dvh` (iOS URL bar → flicker) |
| `cached innerHeight`, update only on `orientationchange` | Listen to `resize` for viewport height |
| `window.history.scrollRestoration = 'manual'` + double-RAF `scrollTo(0,0)` | Leave browser scroll restoration on with a fixed section |
| Lowercase headlines | Title-case everything |
| Hand-placed card rotations (`-6°`, `3°`, `-5°`) | Algorithmic zero-rotation grids |
| Material-Icons family for arrows, uniformly | Mix Heroicons + Material + custom SVGs |
| Measure wordmarks with `actualBoundingBox*` + stroke pad | Size viewBox from `measureText().width` |
| Grain on tinted surfaces | Grain on pure white |
| Re-measure wordmarks after `document.fonts.ready` | Measure once during first paint only |
| Remount tspans via React `key` to re-fire flicker | Toggle a class on existing nodes |

---

## Quick-start (15 minutes, fresh project)

1. `pnpm add lenis`; enable Plus Jakarta via `next/font`.
2. Drop the inline `<head>` script from SKILL.md §1 (sets `--g-sb` + `--vh`).
3. Paste the Structural Grid CSS (§3) into `globals.css`.
4. Set `html { scrollbar-gutter: stable; overflow-x: clip; }` + `body { overflow-anchor: none; }`.
5. Add `.card-grain`, the entrance keyframes, and `@keyframes wordmark-flicker` from §6f.
6. Wrap `<body>` children in `<SmoothScrollProvider />`.
7. Build sections as `.g-row > .g-cell.g-half-l` — never raw flex rows.
8. Pick ONE CTA style per screen (3D pill OR slide-to-unlock).
9. If you need a reveal moment, port the HIW envelope (§5a). Otherwise just use grid + cards + typography.

---

## Files in this folder

- **SKILL.md** — full Claude Code skill, drop into `.claude/skills/<name>/SKILL.md`
- **DESIGN.md** — this quick reference

Copy both to a new project to take the system with you.
