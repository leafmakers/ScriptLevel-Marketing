# Grid Patterns — Cookbook

Ready-to-paste HTML for every section type the CandidRender grid handles.
Copy the markup, then apply the design language of your target site. Every
pattern assumes `grid-system.css` is loaded and the inline head script from
`SKILL.md` §1b has run.

Conventions in this cookbook:

- `(a)` = variant A, `(b)` = variant B — pick whichever reads cleaner for
  your component structure.
- Inline styles show the **minimum override** — replace classnames with
  your own design-system classes, but keep the grid-token overrides.

---

## 1. Nav bar

A fixed nav with a centered row, logo left + actions right, optional
vertical-line overlay, and a mobile menu row.

### 1a. Structure

```html
<header class="site-nav-wrap">
  <nav class="site-nav">

    <!-- Local overlay — paints the vertical guides inside the nav -->
    <div class="g-overlay g-overlay--local" aria-hidden="true">
      <div class="g-overlay__inner" id="nav-overlay"></div>
    </div>

    <!-- Nav row: --g-row-min sets the fixed header height; --g-inset
         tightens the uniform inset to 16px so the logo + pill button
         aren't floating in 32px of space. -->
    <div
      class="g-row g-row--center"
      style="--g-row-min: 64px; --g-inset: 16px; position: relative; z-index: 2;"
    >
      <div class="g-cell g-half-l">
        <a href="/" class="nav-brand">
          <img src="/logo.svg" alt="" width="22" height="22" />
          <span>brand</span>
        </a>
      </div>
      <div class="g-cell g-half-r">
        <div class="nav-actions">
          <a href="/login" class="nav-link">Login</a>
          <a href="/app" class="btn btn--primary">Get Started</a>
          <button class="nav-hamburger md:hidden" aria-label="Menu">☰</button>
        </div>
      </div>
    </div>

    <!-- Mobile dropdown — second row, no bottom divider, border moved
         to top so the structural line reads correctly. -->
    <div
      class="g-row g-row--no-divider md:hidden"
      style="border-top: 1px solid var(--g-divider);"
      hidden
    >
      <div class="g-cell g-full">
        <a href="/login">Login</a>
        <a href="/app">Launch App →</a>
      </div>
    </div>
  </nav>
</header>
```

### 1b. Site-wrapper CSS

```css
.site-nav-wrap {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: opacity 0.3s, transform 0.3s;
}
.site-nav { position: relative; }  /* anchors .g-overlay--local */
.nav-brand { display: inline-flex; align-items: center; gap: 8px; }
.nav-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
```

### 1c. Why `g-half-l` / `g-half-r` (not `g-span-6` / `g-span-6`)

Both render identically at 12 cols. At 4 cols (tablet) `g-span-6` would span
1.5× the track — wraps weirdly. `g-half-l` / `g-half-r` use
`calc(var(--g-cols) / 2)`, so they stay half-width at every breakpoint
(6+6, 4+4, 2+2, 1+1).

### 1d. Reserve space for the fixed nav

```html
<main style="padding-top: 64px;">…</main>
```

Match `padding-top` to `--g-row-min` on the nav row.

---

## 2. Hero — full-bleed, centered

Single-column hero headline with the body offset below. No row divider
(the dashed line below is rendered separately).

```html
<section class="hero">
  <div class="g-overlay g-overlay--local" aria-hidden="true">
    <div class="g-overlay__inner" id="hero-overlay"></div>
  </div>

  <div class="g-row g-row--center g-row--no-divider" style="position: relative; z-index: 10;">
    <div class="g-cell g-full" style="text-align: center;">
      <h1 class="hero-headline">Fast, lively<br>architectural renders.</h1>
      <p class="hero-sub">…</p>
      <a class="btn btn--primary" href="/app">Try now →</a>
    </div>
  </div>
</section>
```

```css
.hero {
  position: relative;
  min-height: 55vh;
  display: flex; align-items: center; justify-content: center;
  background: white;
  overflow: hidden;
  z-index: 30;
}
```

> The cell's `--g-inset` inherits `--g-pad`, so the headline sits exactly
> `--g-pad` from the left and right grid lines. Same inset top and bottom.
> Symmetry is free.

---

## 3. Hero — split (headline left, visual right)

```html
<section class="hero">
  <div class="g-row g-row--center">
    <div class="g-cell g-half-l">
      <p class="eyebrow">Eyebrow</p>
      <h1 class="hero-headline">Headline here.</h1>
      <p class="hero-sub">Supporting copy.</p>
      <a class="btn btn--primary">CTA</a>
    </div>
    <div class="g-cell g-half-r">
      <div class="hero-visual">[ product screenshot ]</div>
    </div>
  </div>
</section>
```

At `--g-cols: 4` (tablet) this stays 2+2; at `--g-cols: 2` (mobile) it
becomes 1+1, which on narrow screens means each half gets its own column.
The `.g-row::after` divider will sit under both halves simultaneously.

> If you want the visual to stack **below** the headline on mobile instead
> of side-by-side, either (a) add `g-sm-full` to both cells, or (b) use
> `g-span-6` / `g-span-6` and let it wrap — the visual drops to its own row.

---

## 4. Stats row — 4 equal cells

Position-locked, so spans stay columns 1/4/7/10 of a 12-col track.
Collapses gracefully at narrower breakpoints because `g-span-3` wraps.

```html
<section class="stats">
  <div class="g-row g-row--center">
    <div class="g-cell g-span-3">
      <div class="stat-num">12,000+</div>
      <div class="stat-label">Active teams</div>
    </div>
    <div class="g-cell g-span-3">
      <div class="stat-num">99.99%</div>
      <div class="stat-label">Uptime</div>
    </div>
    <div class="g-cell g-span-3">
      <div class="stat-num">4.9/5</div>
      <div class="stat-label">Rating</div>
    </div>
    <div class="g-cell g-span-3">
      <div class="stat-num">2.1M</div>
      <div class="stat-label">Shipped / wk</div>
    </div>
  </div>
</section>
```

At 8 cols → two per row. At 4 cols → one per row. At 2 cols → one per row
(each cell spans 2, which is the whole track).

---

## 5. 3-column features — how-it-works pattern

Three steps with cell-top dividers on mobile. Each cell carries its step
number + title + visual. When cells stack, `.g-sm-hr-top` paints a
horizontal line above the 2nd and 3rd cells to mirror the grid system.

```html
<section class="features">

  <!-- Section header — its own row, centered -->
  <div class="g-row" style="margin-bottom: 2rem;">
    <div class="g-cell g-full" style="text-align: center;">
      <p class="eyebrow">The Process</p>
      <h2 class="section-title">how it works</h2>
    </div>
  </div>

  <!-- Three steps — g-span-4 so they wrap on mobile -->
  <div class="g-row">
    <div class="g-cell g-span-4">
      <div class="step-num">01</div>
      <h3>upload your render</h3>
      <div class="step-visual">…</div>
    </div>
    <div class="g-cell g-span-4 g-sm-hr-top">
      <div class="step-num">02</div>
      <h3>choose your mode</h3>
      <div class="step-visual">…</div>
    </div>
    <div class="g-cell g-span-4 g-sm-hr-top">
      <div class="step-num">03</div>
      <h3>generate &amp; download</h3>
      <div class="step-visual">…</div>
    </div>
  </div>
</section>
```

> `g-span-4` (three of them in a 12-col track) stacks cleanly on mobile
> because each span wraps when the track can't hold three at a time. At
> `--g-cols: 4`, all three cells span 4 and occupy their own row each.

---

## 6. 2-column split (50/50)

```html
<div class="g-row">
  <div class="g-cell g-half-l">
    <h2>Left column</h2>
    <p>Explanatory copy.</p>
  </div>
  <div class="g-cell g-half-r">
    <img src="/feature.png" alt="" />
  </div>
</div>
```

At mobile widths (2 cols) both halves become 1-col each and sit side-by-side.
If that feels cramped, replace with `g-sm-full` on each cell.

---

## 7. Dark CTA section

Full-width dark section with a centered card inside a full-bleed cell.

```html
<section class="g-section--dark cta-section">
  <div class="g-overlay g-overlay--local" aria-hidden="true">
    <div class="g-overlay__inner" id="cta-overlay"></div>
  </div>

  <div class="g-row g-row--no-divider" style="position: relative; z-index: 2;">
    <div class="g-cell g-full" style="text-align: center;">
      <!-- Content card — max-w + mx-auto centers it regardless of cell width,
           so it stays stable at every breakpoint. -->
      <div class="cta-card">
        <h2>Ready to transform<br>your renders?</h2>
        <a class="btn btn--white" href="/app">Try now →</a>
      </div>
    </div>
  </div>
</section>
```

```css
.cta-section { position: relative; background: #15151a; padding: 6rem 0; }
.cta-card    { max-width: 420px; margin: 0 auto;
               border: 1px solid rgba(255, 255, 255, 0.15);
               border-radius: 16px; padding: 2rem; color: white; }
```

> **Why not `.g-mid-4`?** At `--g-cols: 2`, `g-mid-4` would try to span 4
> of 2 columns — it collapses to a narrow sliver. A full-bleed cell with a
> content-width-capped inner `.cta-card` stays predictable everywhere.

---

## 8. Footer — desktop 3-col, mobile 3-stack

Two parallel markup blocks so each viewport gets its ideal row structure.
Mobile: three separate rows → three `.g-row::after` dividers. Desktop: one
row with three span-N cells and the single shared divider.

```html
<footer class="g-section--dark site-footer" id="site-footer">
  <div class="g-overlay g-overlay--local" aria-hidden="true">
    <div class="g-overlay__inner" id="footer-overlay"></div>
  </div>

  <!-- Mobile: three rows stacked, dividers come free from .g-row::after -->
  <div class="md:hidden">
    <div class="g-row"><div class="g-cell g-full">{ brand }</div></div>
    <div class="g-row"><div class="g-cell g-full">{ product }</div></div>
    <div class="g-row"><div class="g-cell g-full">{ connect }</div></div>
  </div>

  <!-- Desktop / tablet: single row, 6 + 3 + 3 span -->
  <div class="hidden md:block">
    <div class="g-row footer-main-row">
      <div class="g-cell g-span-6">{ brand }</div>
      <div class="g-cell g-span-3">{ product }</div>
      <div class="g-cell g-span-3">{ connect }</div>
    </div>
  </div>

  <!-- Wordmark — edge to edge, no row divider below -->
  <div class="g-row g-row--no-divider" style="--g-inset: 0;">
    <div class="g-cell g-full">
      <svg class="footer-wordmark" viewBox="…"><!-- auto-fit --></svg>
    </div>
  </div>

  <!-- Marquee — same edge-to-edge pattern -->
  <div class="g-row g-row--no-divider" style="--g-inset: 0;">
    <div class="g-cell g-full" style="padding: 0;">
      <div class="footer-marquee">…</div>
    </div>
  </div>
</footer>
```

```css
.site-footer { background: #15151a; position: relative; z-index: 10; }
/* Tighten row-gap when Product + Connect stack in a narrow split */
@media (max-width: 768px) { .footer-main-row { row-gap: 16px; } }
```

### 7a. Alternative footer — one row + `.g-sm-hr-top`

Fewer markup duplicates, same result.

```html
<footer class="g-section--dark site-footer">
  <div class="g-overlay g-overlay--local"><div class="g-overlay__inner"></div></div>

  <div class="g-row footer-main-row">
    <div class="g-cell g-span-6 g-sm-full">{ brand }</div>
    <div class="g-cell g-span-3 g-sm-full g-sm-hr-top">{ product }</div>
    <div class="g-cell g-span-3 g-sm-full g-sm-hr-top">{ connect }</div>
  </div>

  <div class="g-row g-row--no-divider" style="--g-inset: 0;"><!-- wordmark --></div>
  <div class="g-row g-row--no-divider" style="--g-inset: 0;"><!-- marquee --></div>
</footer>
```

Pick whichever reads cleaner in your framework — the rendered result is
identical.

---

## 9. Edge-to-edge media row (video, wordmark, marquee)

Whenever content should touch the left/right grid lines without padding,
zero out the inset and drop the divider:

```html
<div class="g-row g-row--no-divider" style="--g-inset: 0;">
  <div class="g-cell g-full">
    <video src="/demo.mp4" autoplay muted loop playsinline></video>
  </div>
</div>
```

Alternatively, the row-level shortcut:

```html
<div class="g-row g-row--tight g-row--no-divider">
  <div class="g-cell g-full"><!-- content flush --></div>
</div>
```

`g-row--tight` does `--g-inset: 0` in a class instead of inline style.

---

## 10. Mobile-stacked cards with per-cell dividers

When you want cards that are side-by-side on desktop but cleanly stacked
on mobile with divider lines between them:

```html
<div class="g-row">
  <div class="g-cell g-span-4">…</div>
  <div class="g-cell g-span-4 g-sm-hr-top">…</div>
  <div class="g-cell g-span-4 g-sm-hr-top">…</div>
</div>
```

`g-sm-hr-top` only activates below 768px, so desktop shows a single row
divider below the whole row, and mobile shows a divider above each stacked
cell.

---

## 11. Scroll-pinned section behind a scrolling section

If your page has a section that's `position: fixed; top: 0; z-index: 0`
behind the main scroll (e.g. a "rendering modes" panel revealed through
an envelope effect), you **must**:

1. Use `.g-overlay--local` inside each non-pinned section. A global
   `.g-overlay` at `position: fixed; z-index: 0` would fight the pinned
   layer.
2. Put the pinned section at `z-index: 0` and the scrolling layers at
   `z-index: 10` (or higher).
3. Use `--vh` (cached innerHeight from the inline head script) for any
   spacer or transform math — not `100vh`/`100dvh`, which jump with the
   iOS URL bar.

The pinned section itself can still use `.g-row` / `.g-cell` — its grid
aligns with the rest of the page because all rows share `--g-cols` and
`--g-pad`.

---

## 12. Grid-aware floating UI

For a floating button/popup that needs to respect the grid's outer
padding (e.g. an "assistive touch" element near the edge):

```js
const pad = parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue('--g-pad')
) || 32;
// Use `pad` as your minimum inset from the viewport edge.
// Re-read on 'resize' so it tracks breakpoint changes.
```

This way the floating element always sits at the same distance from the
edge as the grid's content, and moves together with it on breakpoint
change.

---

## 13. When to break the grid

Sometimes a visual element should ignore the grid entirely — full-bleed
photography, hero background video, decorative gradients. Put these as
`position: absolute; inset: 0;` **siblings** of the `.g-row`, not inside a
cell. The grid keeps carrying the content alignment; the decoration sits
behind it without distorting the tracks.

```html
<section style="position: relative;">
  <div class="bg-fill" style="position: absolute; inset: 0;">
    <img src="/hero-bg.jpg" style="width: 100%; height: 100%; object-fit: cover;" />
  </div>

  <div class="g-row" style="position: relative; z-index: 2;">
    <div class="g-cell g-full">…</div>
  </div>
</section>
```
