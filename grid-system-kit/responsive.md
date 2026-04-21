# Responsiveness — how CandidRender does it

The grid handles **layout** reflow through tokens alone. But a real
marketing site also needs **component state**, **scroll choreography**,
**input handling**, and **iOS quirks** to change at specific viewports.
This file covers every responsive pattern in the CandidRender site in one
place, so a port can preserve the full system.

The mental model:

- **Grid tokens** (`--g-cols`, `--g-pad`, `--g-gap`) reflow layout. One
  source of truth, no per-component media queries.
- **CSS `@media` rules** handle decoration + pure-visual differences
  (card hover, animation variants, mobile helpers).
- **JS `matchMedia` + `window.innerWidth`** fork **behavior** — different
  scroll choreography constants, different component logic, different
  interaction models. Used sparingly, always with a resize listener.
- **Tailwind `md:` / `sm:` prefixes** handle **markup presence** — show
  one block on mobile, a different one on desktop (nav actions, footer
  layouts, animated-button variants).

---

## 1. Breakpoint strategy

### 1a. The four grid breakpoints

These are the only breakpoints that retoken `:root`:

```css
@media (max-width: 1200px) { :root { --g-cols: 12; } }
@media (max-width: 1024px) { :root { --g-cols: 8; } }
@media (max-width: 768px)  { :root { --g-cols: 4; --g-pad: 24px; } }
@media (max-width: 480px)  { :root { --g-cols: 2; --g-pad: 16px; --g-gap: 12px; } }
```

| Viewport        | Cols | Pad | Gap | Typical device                  |
|-----------------|------|-----|-----|----------------------------------|
| ≥ 1200          | 12   | 32  | 24  | Desktop                          |
| 1024–1199       | 12   | 32  | 24  | Small desktop, landscape tablet  |
| 768–1023        | 8    | 32  | 24  | Tablet portrait, large phone     |
| 481–767         | 4    | 24  | 24  | Phone landscape, small tablet    |
| ≤ 480           | 2    | 16  | 12  | Phone portrait                   |

**Rule**: never add a 5th breakpoint. If a layout needs more granularity,
adjust the semantic span (`.g-span-6` → `.g-span-4` + `.g-sm-full`)
instead of cutting a new viewport.

### 1b. Tailwind breakpoints in use

CandidRender uses Tailwind's defaults but only these four regularly:

| Prefix    | ≥ px  | Used for                                               |
|-----------|-------|--------------------------------------------------------|
| `sm:`     | 640   | Typography scale-up, show supporting copy              |
| `md:`     | 768   | Nav actions swap, footer 3-col, `md:hidden` mobile-only|
| `lg:`     | 1024  | Hero typography top-end (`text-5xl sm:text-7xl lg:text-8xl`) |
| `xl:` / `2xl:` | — | **Not used.** Stop at lg.                              |

> The Tailwind `md:` breakpoint (768px) intentionally coincides with the
> grid's mid-breakpoint (where `--g-cols` drops from 8 → 4). This is the
> primary "mobile vs. desktop" line in the system. Keep them aligned when
> porting.

### 1c. Audit breakpoints

Test layouts at these viewport widths:

`1280, 1024, 900, 820, 768, 700, 540, 480, 375`

The boundary values (769, 767, 481, 479) are where most breakage hides —
check both sides of every grid breakpoint.

---

## 2. Responsive via tokens — the "do nothing" pattern

Most layouts need zero explicit responsive rules because semantic spans
re-evaluate against `--g-cols` at each breakpoint:

```html
<div class="g-row">
  <div class="g-cell g-half-l">Logo</div>
  <div class="g-cell g-half-r">Actions</div>
</div>
```

| Viewport | --g-cols | `.g-half-l`   | `.g-half-r`   |
|----------|----------|---------------|---------------|
| Desktop  | 12       | `span 6`      | `span 6`      |
| Tablet   | 8        | `span 4`      | `span 4`      |
| Phone    | 4        | `span 2`      | `span 2`      |
| Small    | 2        | `span 1`      | `span 1`      |

Each cell stays half-width of its track at every breakpoint. **No code
change, no media query.**

Same for `.g-third-l/m/r`, `.g-mid-N`, `.g-full`. Use these by default.

---

## 3. Responsive via markup swaps (Tailwind `md:hidden` + `hidden md:block`)

When the **structure itself** needs to change — not just the column
count — render two parallel blocks, each `display: none` at the wrong
viewport. Used when:

- Mobile wants stacked rows with independent dividers; desktop wants one
  row with spans.
- Mobile wants a hamburger + drawer; desktop wants inline nav links.
- Mobile wants an inline video in the hero; desktop wants a floating
  assistive-touch popup.

### 3a. Footer — 3-up desktop vs. 3-stacked mobile

```tsx
{/* Mobile: each cell is its own row, dividers come from .g-row::after */}
<div className="md:hidden">
  <div className="g-row"><div className="g-cell g-full">{brand}</div></div>
  <div className="g-row"><div className="g-cell g-full">{product}</div></div>
  <div className="g-row"><div className="g-cell g-full">{connect}</div></div>
</div>
{/* Desktop: single row, 6+3+3 */}
<div className="hidden md:block">
  <div className="g-row footer-main-row">
    <div className="g-cell g-span-6">{brand}</div>
    <div className="g-cell g-span-3">{product}</div>
    <div className="g-cell g-span-3">{connect}</div>
  </div>
</div>
```

**Why two markup blocks** instead of one row with `.g-sm-hr-top`: each
stacked section gets a **full `.g-row::after` divider** that extends the
full viewport, identical to every other row divider on the page. The
single-row alternative works too and is more compact — pick whichever
reads cleaner in the component. Both are in the repo.

### 3b. Nav — inline links desktop, drawer mobile

```tsx
<div className="g-cell g-half-r">
  <div className="flex items-center justify-end gap-3">
    <a href="/login" className="hidden md:inline-flex">Login</a>
    <div className="hidden md:block"><Pill3DButton>Get Started</Pill3DButton></div>
    <button className="md:hidden" onClick={toggleMenu}>☰</button>
  </div>
</div>

{mobileMenuOpen && (
  <div className="g-row g-row--no-divider md:hidden"
       style={{ borderTop: '1px solid var(--g-divider)' }}>
    <div className="g-cell g-full">
      <a href="/login">Login</a>
      <a href="/app">Launch App →</a>
    </div>
  </div>
)}
```

Both login links and the pill button hide below 768; hamburger hides
above. The drawer renders as a **second `.g-row`** below the nav row —
it keeps the grid alignment when expanded.

### 3c. Hero CTA — swipe-to-unlock mobile, hover-expand desktop

Same component, different variant:

```tsx
{/* Mobile-only inline CTA */}
<div className="sm:hidden flex items-center justify-center">
  <AnimatedButton href="/app" shortLabel="TRY NOW" variant="white" size="small">
    TRY NOW
  </AnimatedButton>
</div>
{/* Desktop/tablet CTA */}
<div className="hidden sm:flex items-center justify-center">
  <AnimatedButton href="/app" shortLabel="TRY NOW" variant="white">
    TRY NOW
  </AnimatedButton>
</div>
```

`AnimatedButton` itself reads touch vs. hover internally — see §7.

### 3d. Supporting copy — present desktop, hidden mobile

```tsx
<p className="hidden sm:block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
  The Process
</p>
<h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] sm:mb-4 lowercase">
  how it works
</h2>
<p className="hidden sm:block text-lg text-gray-500 max-w-xl mx-auto">
  From render to reality in three simple steps
</p>
```

Eyebrows and sub-copy disappear below `sm:`. The headline carries the
meaning on mobile; secondary text would be too dense.

---

## 4. Responsive via CSS `@media` (decoration)

When only the **visual** changes — not the structure — keep it in CSS.
Never repeat these in JS.

### 4a. Card hover lift (desktop only)

```css
.card-hover { transition: all 0.3s ease; }
@media (min-width: 768px) {
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
  }
}
```

Mobile has no `:hover` state (tap focuses briefly then passes) — applying
the lift there leaves cards stuck in the lifted position after a tap.
Drop it entirely below 768.

### 4b. Scroll-reveal animation variant

```css
.animate-slide-in-right {
  opacity: 0;
  animation: fade-in-up 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
@media (min-width: 768px) {
  .animate-slide-in-right {
    animation: slide-in-right 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
}
```

The same class name plays a **vertical** fade-in-up on mobile and a
**horizontal** slide-in-right on desktop. Horizontal entrance feels
natural on a wide canvas; on a phone it goes off-screen and reads as
jank. Swap via a single class with a media-scoped override — one
IntersectionObserver, two trajectories.

### 4c. Drop the CSS transition where rAF is driving

```css
.hiw-envelope.is-snapping { transition: transform 180ms cubic-bezier(0.34, 1.3, 0.64, 1); }

@media (max-width: 767px) {
  .hiw-envelope.is-snapping { transition: none; }
}
```

Desktop uses a gentle transition to dampen each scroll-tick write.
Mobile has native touch-momentum firing writes at 60fps via rAF —
layering a CSS transition on top of that causes **visible stutter**
(every tick interrupts the previous transition). Drop it and let the
rAF per-frame cadence be the smoothing.

### 4d. Mobile-only helpers built into the grid

```css
@media (max-width: 768px) {
  .g-sm-full   { --g-col: 1 / -1; }
  .g-sm-hr-top { /* cell-top divider — see SKILL.md §4a */ }
}
```

Opt-in classes, applied inline on specific cells, that only activate
below 768. Keep them in the grid module — not the component.

---

## 5. Responsive via JS — component state forking

Use when the **behavior** differs, not just the layout. Two patterns:

### 5a. One-shot at mount with resize listener

Simplest form: measure once, listen for resize, re-render when it
changes. Used for display-state forking (inline vs. floating video,
drag-snap bounds, etc.).

```tsx
const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);
```

Used in `FloatingVideoPopup` (<768 → draggable assistive-touch, ≥768 →
fixed position) and `BeforeAfterSlider` (<640 → auto-animate,
≥640 → hover/scroll-preview).

### 5b. `matchMedia` with change listener (preferred for attach/detach)

When the whole **effect lifecycle** should run on one side only:

```tsx
useEffect(() => {
  const mq = window.matchMedia('(max-width: 639px)');
  let cleanup: (() => void) | null = null;

  const attach = () => { /* set up rAF loop, observers, listeners */ };
  const detach = () => { if (cleanup) { cleanup(); cleanup = null; } };

  const sync = () => { detach(); if (mq.matches) attach(); };
  sync();
  mq.addEventListener('change', sync);
  return () => { mq.removeEventListener('change', sync); detach(); };
}, []);
```

Used for the **mobile horizontal-pin** feature in `app/page.tsx`:
only attach the rAF loop and resize observers below 640. Above, the
desktop envelope-reveal takes over — different logic, different
lifecycle.

> Prefer `matchMedia` over `innerWidth` when the effect **mounts** a
> whole subsystem (rAF loop, observers). It lets you tear down cleanly
> when the viewport crosses the boundary, not just update state.

### 5c. Ref-mirroring for stable event handlers

When an `isMobile` boolean is read inside long-lived handlers (drag,
rAF loop) where a stale closure would be wrong:

```tsx
const isMobileRef = useRef(isMobile);
useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

// Inside a pointerdown handler attached once:
if (isMobileRef.current) { /* mobile drag path */ }
```

Avoids re-attaching the listener every time `isMobile` changes.
Required in `FloatingVideoPopup` where the drag handlers live across
many renders.

---

## 6. Responsive scroll choreography

Scroll-pinned effects (envelope reveal, horizontal pin, etc.) need
**different timing constants** per device class — touch momentum is
faster and less precise than mouse-wheel scroll, so phases have to be
longer and more forgiving.

### 6a. HIW envelope tuning

```tsx
const isMobile = window.innerWidth < 768;

// Spacer height between hero and HIW, in units of --vh
const SPACER_VH = isMobile ? 2.5 : 1.25;

// Phase A: distance over which HIW slides to its parked position
const PHASE_A_VH = isMobile ? 0.75 : 0.35;

// Phase B: where HIW parks (factor of vh below the hero)
const PARK_VH = isMobile ? 1.3 : 1.4;

// Publish as CSS var so the spacer reads the same constant the rAF math uses:
document.documentElement.style.setProperty('--spacer-vh', String(SPACER_VH));
```

**Why different on mobile:**

- `SPACER_VH` is **larger** because touch flicks traverse more pixels per
  gesture. A shorter spacer would skip past the pinned RM section during
  a fast scroll.
- `PHASE_A_VH` is **larger** so the envelope closes over more scroll
  distance, giving the user visual feedback during the reveal.
- `PARK_VH` is **smaller** so the pinned content sits closer to the
  viewport on phones where vh is shorter.

Keep the constants in one place (the effect) and expose them as
`--spacer-vh` so the spacer `<div>` reads the same value — mismatched
constants open a gap at the hero/HIW boundary.

### 6b. Horizontal pin — mobile-only

`matchMedia('(max-width: 639px)')` gates the whole effect. Desktop has
enough vertical viewport to run the envelope reveal; mobile converts
the same scroll into a horizontal card-track pan so the three steps
stay visible on a short screen.

Pan progression:

```tsx
const start = heroH * 0.7;
const end   = heroH + vh * 0.9;
const p     = Math.max(0, Math.min(1, (y - start) / range));
const tx    = -Math.round(p * maxPan);
```

Pan starts at 70% of the hero's height (not 100%) so the first
touch-scroll still dismisses the hero cleanly without immediately
panning — otherwise the user sees a double-action on one flick.

### 6c. Per-card viewport-center tilt

While pinning the track, each card rotates toward 0° as it passes
viewport center:

```tsx
for (const c of cards) {
  const rest = parseFloat(c.dataset.rest || '0');
  const cx = parent.offsetLeft + tx + parent.offsetWidth / 2;
  const d = Math.min(1, Math.abs(cx - vw / 2) / vw);
  c.style.transform = `rotate(${(rest * d).toFixed(2)}deg)`;
}
```

`d` is the normalized distance from viewport center (0 = centered,
1 = edge). `rest * d` makes the card fully tilted at the edges and
flat at center — same mechanism as a magazine spread rotating as you
turn the page.

---

## 7. Input-type responsiveness

Touch, mouse, and pointer events don't fire in the same combinations
across devices. Components that need drag or tap behavior handle all
three.

### 7a. Touch + pointer + mouse (the full matrix)

```tsx
<div
  onTouchStart={…} onTouchMove={…} onTouchEnd={…}
  onPointerDown={…} onPointerMove={…} onPointerUp={…}
  onMouseDown={…} onMouseMove={…} onMouseUp={…}
>
```

Not every device fires both `touch*` and `pointer*` reliably —
iOS Safari before 16 drops pointer events in some contexts. Safer to
wire both. Use a ref flag to prevent double-handling:

```tsx
const handlingRef = useRef(false);
const onTouchStart = (e: TouchEvent) => { handlingRef.current = true; /* … */ };
const onPointerDown = (e: PointerEvent) => {
  if (handlingRef.current) return;     // touch already handled this
  /* … */
};
```

### 7b. `touchAction: 'pan-y'` vs. `touchAction: 'none'`

- **`pan-y`** on horizontally-draggable pills (slide-to-unlock): lets
  the browser still handle vertical page scroll, so the user can flick
  up past the button without getting stuck.
- **`none`** on the drag target itself (the moving chip inside the
  button): prevents the browser from hijacking the gesture to scroll
  the page mid-drag.

Set both on the same component, different elements:

```tsx
<div style={{ touchAction: 'pan-y' }}>
  <div className="touch-none">{/* draggable pill */}</div>
</div>
```

### 7c. Hover state behind `@media (hover: hover)`

Reserve real hover interactions for devices that actually hover:

```css
@media (hover: hover) {
  .card-hover:hover { transform: translateY(-4px); }
}
```

Equivalent to `@media (min-width: 768px)` for most cases, but more
correct — covers iPad Pro with Magic Keyboard (≥1024 but touch-first)
and desktops with touch screens.

---

## 8. iOS-specific responsive concerns

### 8a. `--vh` cached vs. `100vh` / `100dvh`

iOS Safari animates its URL bar in/out during scroll. `vh` / `dvh`
change mid-scroll, so any layout built on them flickers. Fix:

```js
r.style.setProperty('--vh', window.innerHeight + 'px');
window.addEventListener('orientationchange', function () {
  r.style.setProperty('--vh', window.innerHeight + 'px');
});
```

- Set once at load.
- **Do not** update on `resize` (that would track the URL bar).
- Update only on `orientationchange` (real rotation, rare enough).
- Use `calc(var(--vh) * 2.5)` instead of `250vh`.

Fall-back pattern:

```css
height: calc(var(--vh, 100vh) * 2.5);
```

The `100vh` fallback applies before the inline script runs (first paint
during SSR, JS-disabled contexts).

### 8b. `overflow-anchor: none`

Prevents the browser from auto-adjusting scroll position when async
content loads (video metadata, images above the current viewport):

```css
body { overflow-anchor: none; }
```

Without this, a video element loading above the fold can scroll the
page up by its intrinsic height, mid-scroll. Catastrophic during a
pinned-section reveal.

### 8c. Autoplay video attributes

iOS blocks any video without the exact attribute combination:

```tsx
<video
  muted
  playsInline
  webkit-playsinline="true"
  preload="metadata"
  controls={false}
  className="…"
>
```

Miss any of these and autoplay fails silently on iPhone. All four are
required; `webkit-playsinline` is duplicated as an HTML attribute
specifically for older iOS Safari.

### 8d. Hide native video controls globally

```css
video::-webkit-media-controls,
video::-webkit-media-controls-enclosure,
video::-webkit-media-controls-overlay-play-button,
video::-webkit-media-controls-panel,
video::-webkit-media-controls-play-button {
  display: none !important;
  -webkit-appearance: none !important;
  opacity: 0 !important;
}
```

Otherwise iOS Safari overlays its own play button on first paint,
visible through transparent frames in the hero.

### 8e. `scrollbar-gutter: stable`

Already required by the grid (see SKILL.md §1c), but extra-important
on macOS where the scrollbar disappears after a pause, then reappears
on interaction. Without `stable`, every appearance nudges content left.

---

## 9. Responsive typography

Use Tailwind's responsive prefixes to ramp type up from mobile:

```tsx
{/* Hero */}
<h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-[-0.03em] leading-[1.0]">

{/* Section title */}
<h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] lowercase">

{/* Sub copy */}
<p className="text-base sm:text-xl text-gray-500 leading-relaxed">

{/* Supporting eyebrows — mobile hides */}
<p className="hidden sm:block text-xs font-semibold uppercase tracking-widest text-gray-400">
```

**Ramps**:
- Hero: `5xl (48) → 7xl (72) → 8xl (96)`. Three stops because the hero
  has to own the viewport at every size.
- Sections: `4xl (36) → 5xl (48)`. Two stops is enough — section titles
  don't need the same scale as the hero.
- Body: `base (16) → xl (20)` on supporting paragraphs, `sm (14) → sm`
  on dense copy (no ramp).

**Letter spacing** is tightened slightly as size grows:
- `tracking-[-0.03em]` on hero (8xl)
- `tracking-[-0.02em]` on section titles (5xl)
- `tracking-[-0.01em]` on card titles (lg)
- `tracking-[-0.04em]` on wordmarks (clamp)

Tight tracking compensates for Plus Jakarta's naturally wide setting at
large sizes. Without it, headlines look airy and uncertain.

---

## 10. Audit checklist when porting

Before calling a new page "responsive", check at every audit breakpoint
(§1c):

1. **Grid alignment**: overlay outer lines hit the row edges at all 9
   viewport widths. If they drift, `--g-sb` is misconfigured.
2. **Row dividers**: span the full viewport minus `--g-sb`. T-junction
   with overlay outer lines should be clean.
3. **Mobile helpers**: `.g-sm-full` / `.g-sm-hr-top` only activate
   below 768. Above, cells sit in their desktop track.
4. **Markup swaps**: exactly one of each `md:hidden` / `hidden md:block`
   block is visible at every size.
5. **Scroll choreography**: pinned sections have their device-specific
   constants; the spacer height reads the same `--vh * --spacer-vh`
   the rAF math uses.
6. **iOS URL bar**: pinned sections don't open a gap at the hero/HIW
   boundary when scrolling in Safari with the URL bar visible then
   hidden. If they do, you're still using `100vh` somewhere.
7. **Autoplay**: videos play on first visit on iPhone. If not, one of
   the four required attributes is missing.
8. **Touch gestures**: swipe-to-unlock and drag-to-snap both work on
   iPhone and Android Chrome. `touchAction` is set correctly.
9. **Hover**: only devices that hover show hover lifts. On iPad with
   touch-only, cards don't stick in the lifted state.
10. **Resize mid-interaction**: rotate the device during a pinned
    reveal. The effect should re-attach with new constants, not
    stutter or leave content off-screen.

---

## 11. Decision tree — which responsive tool to reach for

```
Is it purely layout (span, padding, alignment)?
  → Token overrides on :root. No media queries in components.

Is it decoration (hover, animation variant, border)?
  → CSS @media in globals.css.

Does the structure itself change (markup presence)?
  → Tailwind md:hidden / hidden md:block blocks.

Does component behavior change (drag path, component mounted at all)?
  → matchMedia (for attach/detach) or window.innerWidth (for state).

Does scroll choreography need different timing?
  → JS constants forked on window.innerWidth < 768, published via --spacer-vh.

Is it an iOS quirk (URL bar, autoplay, controls, scroll anchor)?
  → Fix in globals.css or the inline head script. Don't spread through components.
```

Follow the tree top-down. Most real features land in the first two
rows. JS forks are load-bearing only for scroll choreography and
complex interactions — everything else should stay declarative.
