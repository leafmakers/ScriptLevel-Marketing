---
name: structural-grid
description: Modular, token-driven structural grid system (v1.1). Two primitives (.g-row, .g-cell), full-bleed row dividers, optional column-guide overlay, dark-surface variant, and mobile cell-top dividers — all responsive through token overrides only. Use when adding Tailwind/Vercel-style visible grid lines, building a column-aligned navbar/hero/section/footer, or porting the CandidRender grid to another site.
version: 1.1
---

# Structural Grid System v1.1

A modular CSS grid for building **editorial, visibly-lined layouts** — navbars,
heroes, feature sections, dark CTAs, and footers that all align to the same
vertical column track and horizontal row dividers, with pixel-perfect alignment
at every breakpoint. This is the system used on candidrender.com.

Two primitives. Ten tokens. Everything is responsive through token overrides —
never per-component media queries.

---

## The seven rules (the philosophy)

1. **Single source of truth.** All spatial values are CSS custom properties on
   `:root` (`--g-cols`, `--g-gap`, `--g-pad`, `--g-max`, `--g-inset`). Never
   hardcode a gap, pad, margin, or `grid-column` in a component.
2. **Two primitives.** `.g-row` (a horizontal section bound to the column
   track) and `.g-cell` (a placed item with a uniform 4-side inset). Every
   other class is a modifier or decoration.
3. **Decoration is separable.** The visible vertical-line overlay is a
   `.g-overlay` layer. Toggling it does not change layout behavior.
4. **Responsive through tokens.** `--g-cols` / `--g-gap` / `--g-pad` change at
   breakpoints. Semantic spans (`.g-half-l`, `.g-third-m`, `.g-span-N`)
   reflow automatically.
5. **Inset = outer pad.** By default `--g-inset` resolves to `var(--g-pad)`, so
   content is the **same distance** from every grid line — vertical or
   horizontal. This is the geometric contract that makes the whole thing feel
   designed rather than ad-hoc. Only override when a row needs to sit flush
   (wordmarks, marquees, hero video — `--g-inset: 0`).
6. **Dividers extend full viewport width.** `.g-row::after` paints a
   `100vw - var(--g-sb)` horizontal line so every row divider, cell-top
   divider, and overlay outer edge share the same x-coordinates regardless
   of the row's max-width.
7. **Dark surfaces re-tint the tokens.** `.g-section--dark` is a single
   modifier that swaps `--g-line` / `--g-divider` alpha to white. No
   per-component dark overrides.

---

## Files in this skill

| File                                   | Purpose                                     |
|----------------------------------------|---------------------------------------------|
| [`SKILL.md`](SKILL.md)                 | This reference                              |
| [`grid-system.css`](grid-system.css)   | Drop-in CSS module                          |
| [`grid-demo.html`](grid-demo.html)     | Runnable standalone reference               |
| [`patterns.md`](patterns.md)           | Cookbook: nav, hero, 3-col, dark CTA, footer|
| [`responsive.md`](responsive.md)       | Full CandidRender responsive model — breakpoints, markup swaps, scroll tuning, input variants, iOS quirks |
| [`react-snippets.md`](react-snippets.md)| Next.js/React port — head script, GridOverlay, layout wiring |
| [`porting.md`](porting.md)             | 10-step procedure for applying this grid to a new site, sacred-vs-swappable map, starter prompt templates, common porting mistakes |

---

## 1. Install

### 1a. Drop in the CSS

```html
<link rel="stylesheet" href="grid-system.css" />
```

Or paste its contents into your `globals.css` / `styles.css`.

### 1b. Add the inline head script (required)

Two CSS variables must be set **before paint** so dividers, overlays, and
pinned sections stay aligned on the first frame:

```html
<script>
  (function () {
    var r = document.documentElement;
    // --g-sb = reserved scrollbar-gutter width (so full-bleed dividers
    //         match the content area when a scrollbar appears)
    var sb = function () {
      r.style.setProperty('--g-sb', (window.innerWidth - r.clientWidth) + 'px');
    };
    sb();
    window.addEventListener('resize', sb);
    // --vh = cached innerHeight (NOT 100vh / 100dvh). iOS URL-bar mid-
    //        scroll changes would otherwise flicker pinned sections.
    r.style.setProperty('--vh', window.innerHeight + 'px');
    window.addEventListener('orientationchange', function () {
      r.style.setProperty('--vh', window.innerHeight + 'px');
    });
  })();
</script>
```

`--vh` is only required if you do any scroll-pinned sections on top of the
grid. If you don't, you can skip it — `--g-sb` is the one that matters for
the grid itself.

### 1c. Required `html` rules

```css
html {
  scrollbar-gutter: stable;  /* locks scrollbar width so --g-sb is stable */
  overflow-x: clip;          /* prevents 100vw dividers from triggering H-scroll */
  scroll-behavior: smooth;   /* optional, but expected by the aesthetic */
}
body { overflow-anchor: none; }  /* prevents async layout shifts from nudging scroll */
```

---

## 2. Tokens

All defined on `:root`. Override per row with inline `style={{ '--g-inset': '0' }}` when needed.

| Token            | Default              | Purpose                                         |
|------------------|----------------------|-------------------------------------------------|
| `--g-cols`       | `12`                 | Column count                                    |
| `--g-gap`        | `24px`               | Gutter between cells                            |
| `--g-pad`        | `32px`               | Outer page padding (inside `.g-row`)            |
| `--g-max`        | `1200px`             | Content max-width (before outer padding)        |
| `--g-inset`      | `var(--g-pad)`       | Uniform padding inside each cell                |
| `--g-line`       | `rgba(40,40,40,.14)` | Outer vertical grid line (overlay edges)        |
| `--g-line-soft`  | `transparent`        | Inner vertical lines (hidden by default)        |
| `--g-divider`    | `rgba(40,40,40,.14)` | Horizontal row dividers                         |
| `--g-row-min`    | `0`                  | Optional row min-height (navbars often `64px`)  |
| `--g-sb`         | *(set by script)*    | Reserved scrollbar-gutter width                 |

> **The `--g-inset: var(--g-pad)` trick.** Because the cell's padding equals
> the row's outer padding, content is exactly one `--g-pad` away from the
> nearest **vertical** grid line (row edge) **and** the nearest **horizontal**
> grid line (row divider). That symmetry is what makes the grid read as a
> designed system rather than a wrapper with random padding.

---

## 3. Primitives

### 3a. `.g-row` — the column track

```html
<section class="g-row">
  <div class="g-cell g-half-l">…</div>
  <div class="g-cell g-half-r">…</div>
</section>
```

```css
.g-row {
  width: 100%;
  max-width: calc(var(--g-max) + var(--g-pad) * 2);
  margin-inline: auto;
  padding-inline: var(--g-pad);
  display: grid;
  grid-template-columns: repeat(var(--g-cols), minmax(0, 1fr));
  gap: var(--g-gap);
  align-items: stretch;
  min-height: var(--g-row-min);
  position: relative;       /* anchor for ::after divider */
  z-index: 1;
}

.g-row::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -1px;
  width: calc(100vw - var(--g-sb, 0px));  /* viewport-wide, scrollbar-aware */
  height: 1px;
  transform: translateX(-50%);
  background: var(--g-divider);
  pointer-events: none;
}
```

**Modifiers:**

| Class                 | Effect                                            |
|-----------------------|---------------------------------------------------|
| `.g-row--center`      | `align-items: center` (navbars, hero cells)       |
| `.g-row--start`       | `align-items: start`                              |
| `.g-row--end`         | `align-items: end`                                |
| `.g-row--no-divider`  | Removes the `::after` line (hero, wordmark rows)  |
| `.g-row--tight`       | `--g-inset: 0` (edge-to-edge content)             |

### 3b. `.g-cell` — a placed item

```css
.g-cell {
  grid-column: var(--g-col, auto);
  padding: var(--g-inset);
  min-width: 0;              /* prevents grid overflow from long words */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.g-cell > * { max-width: 100%; }
```

Place via a semantic alias, or inline `style={{ '--g-col': 'span 3 / -1' }}`
for one-offs (e.g. right-flushed nav actions).

### 3c. Semantic span aliases

Each one evaluates against the current `--g-cols`, so the same class
reflows cleanly at 12 / 8 / 4 / 2 cols.

```css
.g-full    { --g-col: 1 / -1; }
.g-half-l  { --g-col: 1 / span calc(var(--g-cols) / 2); }
.g-half-r  { --g-col: span calc(var(--g-cols) / 2) / -1; }
.g-third-l { --g-col: 1 / span calc(var(--g-cols) / 3); }
.g-third-m { --g-col: span calc(var(--g-cols) / 3) / span calc(var(--g-cols) / 3); }
.g-third-r { --g-col: span calc(var(--g-cols) / 3) / -1; }

/* Centered-N (use for even column counts) */
.g-mid-2 /* through */ .g-mid-8

/* Non-position-locked — wraps to next row on overflow */
.g-span-1 /* through */ .g-span-12
```

**Pick the right one:**

- `.g-full` for full-bleed hero, wordmark, marquee, dark CTA.
- `.g-half-l` / `.g-half-r` for split rows (nav logo + actions, hero + screenshot).
- `.g-third-l/m/r` for 3-column sections (features, stats) — **position-locked**.
- `.g-span-N` for 3-column grids that should **wrap naturally** on small screens
  (how-it-works steps, footer Product/Connect lists).
- `.g-mid-N` for centered banners.

> Use `.g-span-4` + `.g-span-4` + `.g-span-4` (not `.g-third-l/m/r`) when you
> want cells to **wrap** on mobile. Third-positioned cells stay locked to
> columns 1 / 5 / 9 of whatever track is active and can leave gaps.

---

## 4. Responsive

The only media queries in the whole system live on `:root`:

```css
@media (max-width: 1200px) { :root { --g-cols: 12; } }
@media (max-width: 1024px) { :root { --g-cols: 8; } }
@media (max-width: 768px)  { :root { --g-cols: 4; --g-pad: 24px; } }
@media (max-width: 480px)  { :root { --g-cols: 2; --g-pad: 16px; --g-gap: 12px; } }
```

Since spans are semantic (`.g-half-l` = `1 / span calc(--g-cols / 2)`), cells
reflow with zero per-component rules.

**Audit at:** 1280, 1024, 900, 820, 768, 700, 540, 480, 375. The common
footgun is a cell using a raw `style={{ '--g-col': 'span 3' }}` — it stops
being half a 6-col grid at 4 cols. Always prefer the semantic class.

> Layout reflow is only one layer of responsiveness. Real sites also need
> different **markup** (nav drawer vs. inline links), **behavior** (mobile
> swipe vs. desktop hover), and **scroll timing** (spacer heights, phase
> lengths) per device. See [`responsive.md`](responsive.md) for the full
> CandidRender responsive model — Tailwind `md:` swaps, `matchMedia`
> forks, per-device rAF constants, iOS URL-bar handling, autoplay quirks,
> and a 10-point port audit.

### 4a. Mobile helpers

```css
@media (max-width: 768px) {
  .g-sm-full { --g-col: 1 / -1; }   /* force full-row at mobile */
  .g-sm-hr-top { position: relative; }
  .g-sm-hr-top::before {
    content: '';
    position: absolute; top: -8px; left: 50%;
    width: calc(100vw - var(--g-sb, 0px));
    height: 1px;
    transform: translateX(-50%);
    background: var(--g-divider);
  }
}
```

`.g-sm-hr-top` paints a horizontal divider **above** the cell when cells
stack on mobile. Use it on the 2nd and 3rd cell of a multi-column row so
each stacked cell reads as its own "row" with a grid-aligned separator —
matches the `.g-row::after` mechanism exactly so lines align across the page.

---

## 5. The visible-line overlay

Optional decoration. Paints `--g-cols` vertical `<div>`s behind content, each
with a `border-inline` on the two outer edges (`--g-line`) and transparent
inner dividers (`--g-line-soft` defaults to transparent — flip it if you want
the full Tailwind-style interior grid).

### 5a. CSS

```css
.g-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
}
.g-overlay--local { position: absolute; }   /* scoped to a positioned ancestor */

.g-overlay__inner {
  width: 100%;
  max-width: calc(var(--g-max) + var(--g-pad) * 2);
  padding-inline: var(--g-pad);
  display: grid;
  grid-template-columns: repeat(var(--g-cols), minmax(0, 1fr));
  gap: var(--g-gap);
  height: 100%;
}
.g-overlay__col { border-inline: 1px solid var(--g-line-soft); }
.g-overlay__col:first-child { border-inline-start-color: var(--g-line); }
.g-overlay__col:last-child  { border-inline-end-color:   var(--g-line); }
```

### 5b. Populate the columns with JS

The overlay needs exactly `--g-cols` children. Repopulate on breakpoint
change via `ResizeObserver` watching `documentElement`:

```js
const paint = () => {
  const inner = document.querySelector('.g-overlay__inner');
  const n = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--g-cols'), 10) || 12;
  if (inner.childElementCount === n) return;
  inner.replaceChildren();
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'g-overlay__col';
    inner.appendChild(c);
  }
};
paint();
new ResizeObserver(paint).observe(document.documentElement);
```

### 5c. Local vs. global overlay

**Use `.g-overlay--local` per section** whenever any part of the page has a
`position: fixed` element at a lower z-index (like a pinned section sitting
at `z-index: 0` behind scrolling content). A global fixed `.g-overlay` would
paint across that layer and conflict visually.

Rule of thumb: **prefer `.g-overlay--local`** and render one inside each
section that needs guides (nav, hero, HIW, CTA, footer). The `position:
relative` on the section anchors it. If your page has no pinned-behind
sections, a single global `.g-overlay` at the top of `<body>` is fine.

### 5d. Global toggles

```css
.g-no-overlay .g-overlay, .g-no-overlay .g-overlay--local { display: none; }
.g-no-dividers .g-row::after { content: none; }
```

Apply on `<body>` to kill decoration globally (handy during design review).

---

## 6. Dark-surface variant

Dark backgrounds need more alpha to match the light surface's perceived
contrast. One modifier re-tints all three line tokens at once:

```css
.g-section--dark {
  --g-line:       rgba(255, 255, 255, 0.08);
  --g-line-soft:  transparent;
  --g-divider:    rgba(255, 255, 255, 0.08);
}
```

Apply to the section element (CTA, footer). Every row, every cell, and the
overlay inside this section automatically pick up white lines. Never write
per-component dark overrides — one class does it.

```html
<footer class="g-section--dark bg-[#15151a]">
  <div class="g-overlay g-overlay--local"><div class="g-overlay__inner"></div></div>
  <div class="g-row"><div class="g-cell g-full">…</div></div>
</footer>
```

---

## 7. Alignment math (how the lines agree)

Three lines are involved, and the math for each is independent but tuned so
they coincide at the same x-coordinates:

1. **Row divider** (`.g-row::after`): `width = 100vw - var(--g-sb)`,
   centered by `left: 50%; transform: translateX(-50%)`. Sits in
   **viewport space**, so it spans the visible area regardless of the row's
   `max-width`.
2. **Overlay outer column edge**: `.g-overlay__inner` is
   `max-width: calc(--g-max + --g-pad * 2)` wide, centered by
   `justify-content: center` on the parent. Sits in **content space**.
3. **Row outer edge** (start of the column track): same width as the
   overlay (`calc(--g-max + --g-pad * 2)`), centered.

The overlay and row share the same max-width and center, so the left and
right visible vertical lines land exactly at the row's padding-box edges.
The row divider spans the viewport, so it crosses those vertical lines as
a clean T-junction.

**The `--g-sb` subtraction** keeps the divider from sliding left under a
reserved scrollbar gutter. Without it, the divider would sit flush to the
physical viewport edge but the content would be offset right by ~15px — a
visible T-junction misalignment.

**When to override `--g-inset`:**

| Case                                      | `--g-inset`        | Example                |
|-------------------------------------------|--------------------|------------------------|
| Default cell (text, images, cards)        | `var(--g-pad)`     | Most sections          |
| Edge-to-edge content (wordmark, marquee)  | `0`                | Footer wordmark row    |
| Nav (tighter vertically)                  | `16px`             | `--g-row-min: 64px`    |
| Hero with custom vertical rhythm          | `32px` or custom   | As needed              |

Set per-row via inline style: `style={{ '--g-inset': '0' }}`, not on `:root`.

---

## 8. Navbar — full recipe

A fixed nav using `.g-row--center`, a logo on the left half, actions on the
right half, with a local overlay so the vertical guides extend the full nav
height and match the rest of the page.

```tsx
<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
  <nav className="relative">
    {/* Local overlay — anchored to the relative nav, paints vertical guides */}
    <GridOverlay />

    {/* The nav row — override --g-row-min and --g-inset just for the nav */}
    <div
      className="g-row g-row--center relative z-[2]"
      style={{ '--g-row-min': '64px', '--g-inset': '16px' } as React.CSSProperties}
    >
      <div className="g-cell g-half-l">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="" width="22" height="22" />
          <span className="font-black tracking-[-0.04em]">brand</span>
        </Link>
      </div>
      <div className="g-cell g-half-r">
        <div className="flex items-center justify-end gap-3">
          <a href="/login" className="hidden md:inline-flex">Login</a>
          <Pill3DButton href="/app">Get Started</Pill3DButton>
          <button className="md:hidden">☰</button>
        </div>
      </div>
    </div>

    {/* Mobile dropdown — second .g-row below, no bottom divider */}
    {mobileMenuOpen && (
      <div
        className="g-row g-row--no-divider md:hidden"
        style={{ borderTop: '1px solid var(--g-divider)', borderBottom: 'none' }}
      >
        <div className="g-cell g-full">…</div>
      </div>
    )}
  </nav>
</header>
```

**What's going on:**

- `position: relative` on `<nav>` anchors `.g-overlay--local`.
- `--g-row-min: 64px` matches the fixed header height (used for `<main className="pt-16">` offset).
- `--g-inset: 16px` tightens vertical padding in the nav row — logo + pill
  button look cramped at the default `32px` inset.
- `g-half-l` / `g-half-r` makes the nav reflow from 12 cols (6 + 6) to 2 cols
  (1 + 1) with no custom rules. Logo stays left, actions stay right at every
  breakpoint.
- Inner content (`flex items-center justify-end gap-3`) is **not** a grid
  concern — the cell provides the track position, flex inside handles
  micro-alignment of the actions.

**Mobile hamburger overlay**: second `.g-row` stacks below the nav row.
`border-top + no-divider` flips the divider from below the row to above the
dropdown so the structural line reads correctly.

---

## 9. Footer — 3-col desktop, stacked mobile

The footer is a dark section with three problem-children: a **three-column
Brand/Product/Connect** row, an **edge-to-edge wordmark**, and an **edge-to-edge
marquee**. All share the same grid.

```tsx
<footer id="site-footer" className="g-section--dark bg-[#15151a] relative">
  <GridOverlay />

  {/* Mobile: one .g-row per section → dividers come from .g-row::after */}
  <div className="md:hidden">
    <div className="g-row"><div className="g-cell g-full">{brand}</div></div>
    <div className="g-row"><div className="g-cell g-full">{product}</div></div>
    <div className="g-row"><div className="g-cell g-full">{connect}</div></div>
  </div>

  {/* Desktop: single .g-row, 6 + 3 + 3 span */}
  <div className="hidden md:block">
    <div className="g-row footer-main-row">
      <div className="g-cell g-span-6">{brand}</div>
      <div className="g-cell g-span-3">{product}</div>
      <div className="g-cell g-span-3">{connect}</div>
    </div>
  </div>

  {/* Wordmark — edge to edge, no vertical padding, no row divider below */}
  <div className="g-row g-row--no-divider" style={{ '--g-inset': '0' }}>
    <div className="g-cell g-full">
      <WordmarkSVG /* auto-fit viewBox */ >brand</WordmarkSVG>
    </div>
  </div>

  {/* Marquee — same pattern, p-0 on the cell for flush edges */}
  <div className="g-row g-row--no-divider" style={{ '--g-inset': '0' }}>
    <div className="g-cell g-full p-0">
      <div className="footer-marquee">…</div>
    </div>
  </div>
</footer>
```

**Why the mobile/desktop split uses different row structures**:

- **One row with three span-4 cells** would stack vertically on mobile (cells
  wrap to new lines), but they'd all share a single `.g-row::after` — only
  one divider for three stacked sections.
- **Three separate rows**, each with its own `::after`, gives three
  independent dividers that extend across the viewport. The grid aligns
  perfectly because every `.g-row::after` is keyed to the same `100vw -
  var(--g-sb)` formula.

**Alternative**: one row with three `g-span-N` cells and `.g-sm-hr-top` on
the 2nd and 3rd cells. Slightly less markup, same visual result. Pick the
pattern that reads cleaner in the component.

---

## 10. Dark CTA section

A full-width dark section with a centered card floating inside it. The grid
is still carrying the alignment so the outer vertical lines (from overlay)
match the rest of the page.

```html
<section class="g-section--dark relative bg-[#15151a] py-24">
  <div class="g-overlay g-overlay--local"><div class="g-overlay__inner"></div></div>

  <div class="g-row g-row--no-divider">
    <div class="g-cell g-full text-center">
      <!-- Centered card inside a full-bleed cell — use max-w + mx-auto so
           the card's width is decoupled from the column count. -->
      <div class="mx-auto max-w-[420px] rounded-2xl border border-white/15">
        …
      </div>
    </div>
  </div>
</section>
```

**Why `.g-cell g-full` + `max-w + mx-auto` instead of `.g-mid-4`**: at mobile
breakpoints (`--g-cols: 2`), `.g-mid-4` would ask for a 4-col span in a
2-col grid — it collapses to a narrow sliver. A full-width cell with a
content-width-capped inner div stays predictable at every breakpoint.

---

## 11. Migration from ad-hoc grids

| Old                                      | New                                        |
|------------------------------------------|--------------------------------------------|
| `<div class="max-w-7xl mx-auto px-4">`   | `<section class="g-row">` + `.g-cell`s     |
| `grid-cols-1 md:grid-cols-3 gap-8`       | `.g-row` + three `.g-cell g-span-4`         |
| Per-component `@media` with grid-column  | Nothing — spans reflow via `--g-cols`      |
| `.grid-row { display: grid; ... }`       | `.g-row`                                   |
| `.stat { grid-column: 1 / span 3 }`      | `.g-cell.g-span-3`                         |
| Hand-authored `.grid-lines` markup       | `.g-overlay` + ResizeObserver              |
| `padding-top:Xpx; margin-top:0;`         | `--g-inset: Xpx;` on the row               |
| `bg-neutral-900` + `border-white/10`     | `.g-section--dark` modifier                |
| Hairline `<hr>` between footer sections  | One `.g-row` per section — divider is free |

---

## 12. Gotchas

| Gotcha                                             | Why it breaks                                                          | Fix                                                                       |
|----------------------------------------------------|------------------------------------------------------------------------|---------------------------------------------------------------------------|
| Removing `html { scrollbar-gutter: stable }`       | `--g-sb` becomes 0 when the scrollbar appears → dividers left-shift    | Keep `scrollbar-gutter: stable` — it's in the module and required         |
| Omitting the inline head script                    | `--g-sb` unset on first paint → dividers visibly jump                  | Inline the script in `<head>`, NOT in a client component that hydrates    |
| A global `.g-overlay` over a fixed-behind section  | Overlay paints on top of the pinned content                            | Use `.g-overlay--local` inside each non-pinned section                    |
| Long unbreakable word overflows a cell             | `min-width: auto` (grid default) lets children dictate track size      | Kept for you — `.g-cell` sets `min-width: 0`                              |
| Mixing `.g-third-m` with `.g-span-4` on mobile     | `.g-third-m` is position-locked; collapses weirdly when `--g-cols < 3` | Use `.g-span-N` trio for wrappable sections; `.g-third` for locked rows   |
| Setting `--g-inset` on children instead of the row | Children fight the cell's padding                                      | Set `--g-inset` on the `.g-row` (or inline per-row), let cells inherit    |
| Using `--g-mid-6` in a 4-col grid                  | Span > cols → row jumps                                                | Use `.g-full` or `.g-mid-2` for narrow-screen contexts                    |
| Animating cell `height`                            | Repaints, breaks grid alignment                                         | Animate `transform: scaleY(…)` or use grid-row tricks                     |
| `g-row` inside another `g-row`                     | Nested row re-centers, adds another `--g-pad` — double indent          | Don't nest rows. One row per horizontal band, cells carry everything else |

---

## 13. Quick-start checklist

When dropping this grid into a fresh project:

1. Paste `grid-system.css` into your stylesheet (or link it).
2. Add the inline head script that sets `--g-sb` + `--vh`.
3. Set `html { scrollbar-gutter: stable; overflow-x: clip; }` and
   `body { overflow-anchor: none; }`.
4. Build sections as `<section><div class="g-row"><div class="g-cell …">…</div></div></section>`.
5. For a visible vertical grid, drop `<GridOverlay />` (or the HTML+JS from
   §5) inside each section that needs it. **Scope locally** unless your page
   has no pinned-behind layers.
6. Navbar: `.g-row g-row--center` with `--g-row-min` and `--g-inset` overrides.
7. Footer: either three stacked rows on mobile + one row desktop, or one row
   with `.g-sm-hr-top` helpers.
8. Dark surfaces: add `.g-section--dark` to the section element. Don't
   re-tint lines anywhere else.
9. Edge-to-edge content (wordmarks, videos, marquees): `style={{ '--g-inset':
   '0' }}` on the row + `.g-row--no-divider`.
10. Audit at 1280 / 1024 / 900 / 820 / 768 / 700 / 540 / 480 / 375. If any
    breakpoint looks wrong, fix the **token override**, not the component.

---

## 14. See also

- **[patterns.md](patterns.md)** — section-by-section cookbook (nav, hero,
  3-col features, stats row, dark CTA, footer desktop/mobile, scroll-pinned
  interop).
- **[responsive.md](responsive.md)** — full CandidRender responsive model:
  breakpoint strategy (grid + Tailwind), markup swaps via `md:hidden`,
  matchMedia-based behavior forks, per-device scroll-choreography
  constants, input-type variants (touch/pointer/mouse), iOS URL-bar and
  autoplay quirks, responsive typography scale, and a port audit checklist.
- **[react-snippets.md](react-snippets.md)** — Next.js/React port: head
  script as `<Script>`, `<GridOverlay />` component, layout wiring, inline
  style casts, breakpoint-aware hooks.
- **[porting.md](porting.md)** — the **10-step procedure** for applying
  this grid to a new site: sacred-vs-swappable map, step-by-step setup,
  starter prompt templates for fresh projects, retrofitting an existing
  site, and common porting mistakes with fixes.
- **[grid-demo.html](grid-demo.html)** — a standalone HTML file you can open
  in a browser to see every primitive, modifier, and the overlay in action.
