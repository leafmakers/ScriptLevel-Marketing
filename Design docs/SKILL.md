---
name: candidrender-ui
description: Apply the CandidRender visual-design system — token-driven structural grid, Plus Jakarta typography with tight letter-spacing, tactile card-grain surfaces, yellow-300 assistive-touch accents on neutral-100, rAF-driven scroll choreography (horizontal pin, HIW envelope, per-card viewport-center tilt), and hand-crafted interactions like slide-to-unlock buttons and neon-flicker wordmarks. Trigger when building marketing sites, landing pages, or product surfaces that should feel editorial, tactile, and cinematic rather than generic SaaS.
---

# CandidRender UI Style

A reusable design-system skill distilled from candidrender.com. Apply this when you want a **marketing / landing-page surface that reads as editorial and tactile** — not generic SaaS. The signature beats: structural grid with visible guides, lowercase heavy headlines, `bg-neutral-100` cards with grain, `bg-yellow-300` assistive-touch accents, scroll-driven horizontal pins, and cinematic per-element motion.

## When to apply this skill

- Marketing pages, landing pages, product pages, portfolio sites.
- Any surface that needs **cinematic scroll choreography** (pinned sections, reveals, envelope transitions).
- Layouts where **vertical and horizontal grid guides should be visually present**, not just implied.
- Mobile-first surfaces with **persistent floating/assistive-touch UI** (dismissable video peek, contextual CTAs).

**Do not apply** to dashboards, internal tools, admin UIs, or anywhere users need dense data / cold utilitarian controls — the motion and typographic warmth will feel out of place.

---

## 1. Stack assumptions

- **Next.js 15/16, React 19, TypeScript, Tailwind v4** (`@import "tailwindcss"`).
- Smooth scrolling via **Lenis** (optional but assumed for Phase-B scroll-sync math; fall back to native scroll events).
- `next/font` for Plus Jakarta Sans.
- All scroll-reactive logic runs via **`requestAnimationFrame`**, never a throttled scroll listener. rAF guarantees one write per paint with no flicker on iOS.

```tsx
// app/layout.tsx
import { Plus_Jakarta_Sans } from "next/font/google";
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});
// <body className={`${plusJakarta.variable} font-sans antialiased bg-white text-gray-900`}>
```

A tiny inline script in `<head>` sets two CSS vars that the rest of the system relies on:

```html
<script>
  (function () {
    var r = document.documentElement;
    var sb = function () {
      r.style.setProperty('--g-sb', (window.innerWidth - r.clientWidth) + 'px');
    };
    sb();
    window.addEventListener('resize', sb);
    r.style.setProperty('--vh', window.innerHeight + 'px');
    window.addEventListener('orientationchange', function () {
      r.style.setProperty('--vh', window.innerHeight + 'px');
    });
  })();
</script>
```

- `--g-sb`: reserved scrollbar-gutter width. Full-bleed dividers (`100vw - var(--g-sb)`) stay aligned with content when the scrollbar appears.
- `--vh`: cached `innerHeight` (NOT `100vh` / `100dvh`). iOS URL-bar changes `dvh` mid-scroll and cause flicker; the cached `--vh` is updated only on `orientationchange`.

Also set `html { scrollbar-gutter: stable; overflow-x: clip; }` so full-bleed lines render without triggering a horizontal scrollbar.

Lenis setup cancels browser scroll restoration and double-resets `scrollTo(0, 0)` across two frames so async video/image loads can't nudge the page via scroll anchoring (`body { overflow-anchor: none; }`). `autoRaf: true`, `smoothWheel: true`, **no `syncTouch`** — iOS Safari momentum breaks if you fight it. Expose as `window.__lenis` so other components can `lenis.scrollTo(…)` instead of racing `window.scrollTo`.

---

## 2. Design tokens

### Color

| Token                       | Value                  | Use                                                   |
| --------------------------- | ---------------------- | ----------------------------------------------------- |
| `bg-white`                  | `#ffffff`              | Hero, cards, HIW section                              |
| `bg-neutral-100`            | `#f5f5f5`              | Panels behind cards; "quiet" surfaces                 |
| `bg-[#15151a]`              | near-black             | Footer / dark sections                                |
| `bg-yellow-300`             | `#fde047`              | Assistive-touch accents (floating play button, hints) |
| `border-yellow-400`         | `#facc15`              | 1px outline on yellow bubbles                         |
| `bg-emerald-500`            | `#10b981`              | Success state (swipe-to-unlock complete)              |
| `text-gray-500` / `-gray-400` | —                    | Supporting copy, supplementary text                   |
| `text-black` / `text-white` | —                      | Headings, primary text                                |
| Wordmark red (fill / stroke)| `#8b1a1a` / `#a52222`  | Footer wordmark at rest (dim)                         |
| Wordmark red (lit)          | `#b52828` / `#c23838`  | Footer wordmark flicker pulse                         |
| Accent dots                 | `rose-500` / `orange-500` / `emerald-500` | Before/after slider handle, state markers |

**Never** use vibrant primary colors as default CTA fills — primary buttons are **black → gray-900 gradient** (main) or **white** (on dark surfaces). Yellow is reserved for small contextual affordances, never for section backgrounds or large buttons.

### Typography

- **Font family**: Plus Jakarta Sans (300/400/500/600/700/800). CSS var: `--font-plus-jakarta`.
- **Headings**: `font-bold` or `font-black`, `tracking-[-0.02em]` to `tracking-[-0.04em]` (tighter on wordmarks), often **lowercase** for headlines. Example: `text-4xl sm:text-5xl font-bold tracking-[-0.02em] lowercase` → "how it works".
- **Body**: `text-sm text-gray-500` for supporting copy; `text-base` for primary body.
- **Eyebrows**: `text-xs font-semibold uppercase tracking-widest text-gray-400`.
- **Long-form wordmark** (e.g. footer "candidrender"): rendered as SVG text with auto-fit viewBox so it scales edge-to-edge at every breakpoint without glyph distortion.

### Spacing & radius

- Radius scale: `rounded-md` (buttons), `rounded-xl` (preview frames), `rounded-2xl` (cards), `rounded-full` (pills, floating bubbles).
- Shadows are layered and soft: `shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_-4px_rgba(0,0,0,0.10)]` (white buttons); `shadow-[0_32px_64px_-36px_rgba(0,0,0,0.12),0_6px_16px_-14px_rgba(0,0,0,0.05)]` (hero-to-section separation).
- Section separation often relies on **shadows on z-stacked fixed/absolute layers** rather than borders (see HIW envelope in §5).

### Selection color

`::selection { background: #e5e5e5; color: #0a0a0a; }` — neutral so the wordmark reds and yellow accents stay uncontested.

---

## 3. Structural Grid (v1.0)

The grid is the backbone. Two primitives — `.g-row` (column track) + `.g-cell` (placed item) — driven by four tokens.

```css
:root {
  --g-cols: 12;
  --g-gap: 24px;
  --g-pad: 32px;
  --g-max: 1200px;
  --g-inset: var(--g-pad);             /* uniform 4-side inset */
  --g-line: rgba(40, 40, 40, 0.14);    /* visible vertical line */
  --g-line-soft: transparent;          /* inner verticals hidden */
  --g-divider: rgba(40, 40, 40, 0.14); /* horizontal row divider */
  --g-row-min: 0;
}

@media (max-width: 1200px) { :root { --g-cols: 12; } }
@media (max-width: 1024px) { :root { --g-cols: 8; } }
@media (max-width: 768px)  { :root { --g-cols: 4; --g-pad: 24px; } }
@media (max-width: 480px)  { :root { --g-cols: 2; --g-pad: 16px; --g-gap: 12px; } }
```

### `.g-row`

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
  position: relative;
  z-index: 1;
}
/* Full-bleed divider, aligned with content-area scrollbar gutter */
.g-row::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -1px;
  width: calc(100vw - var(--g-sb, 0px));
  height: 1px;
  transform: translateX(-50%);
  background: var(--g-divider);
  pointer-events: none;
}
.g-row--no-divider::after { content: none; }
.g-row--center { align-items: center; }
.g-row--start  { align-items: start; }
.g-row--end    { align-items: end; }
.g-row--tight  { --g-inset: 0; }
```

### `.g-cell`

```css
.g-cell {
  grid-column: var(--g-col, auto);
  padding: var(--g-inset);
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.g-cell > * { max-width: 100%; }
```

Semantic spans reflow automatically with `--g-cols`:

```css
.g-full    { --g-col: 1 / -1; }
.g-half-l  { --g-col: 1 / span calc(var(--g-cols) / 2); }
.g-half-r  { --g-col: span calc(var(--g-cols) / 2) / -1; }
.g-third-l { --g-col: 1 / span calc(var(--g-cols) / 3); }
.g-third-m { --g-col: span calc(var(--g-cols) / 3) / span calc(var(--g-cols) / 3); }
.g-third-r { --g-col: span calc(var(--g-cols) / 3) / -1; }
.g-span-1 … .g-span-12 { --g-col: span N; }
.g-mid-2 … .g-mid-8 { /* centered span of N */ }
```

### Mobile helpers

```css
@media (max-width: 768px) {
  /* Opt-in: full-width wrap on mobile so a cell doesn't leave a dangling
     empty column when its siblings wrap beneath it. Use sparingly — prefer
     .g-full when a cell should always be full-width at every breakpoint. */
  .g-sm-full { --g-col: 1 / -1; }

  /* Cell-level divider, full viewport width. Matches .g-row::after exactly
     (width: 100vw - var(--g-sb)) so cell dividers align with row dividers
     regardless of the cell's offset. */
  .g-sm-hr-top { position: relative; }
  .g-sm-hr-top::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    width: calc(100vw - var(--g-sb, 0px));
    height: 1px;
    transform: translateX(-50%);
    background: var(--g-divider);
    pointer-events: none;
  }

  /* When sibling cells wrap onto their own rows, pull the row-gap in. */
  .footer-main-row { row-gap: 16px; }
}
```

### Dark-surface variant

```css
.g-section--dark {
  --g-line: rgba(255, 255, 255, 0.08);
  --g-line-soft: transparent;
  --g-divider: rgba(255, 255, 255, 0.08);
}
```

### Visible vertical guides

`<GridOverlay />` is a React component that paints `--g-cols` column `<div>`s inside an absolutely positioned inner grid, with `border-inline` on each column. Repaints via `ResizeObserver` watching `documentElement` so responsive breakpoint changes automatically repopulate the column count. Each overlay is **local** (`.g-overlay--local`, `position: absolute`) — never site-wide `position: fixed`, because the fixed Rendering Modes section sits at `z: 0` and would conflict.

```tsx
// components/GridOverlay.tsx — drop into any positioned ancestor
<div className="g-overlay g-overlay--local" aria-hidden>
  <div className="g-overlay__inner" ref={innerRef} />
</div>
// innerRef is repopulated with N <div class="g-overlay__col"> via ResizeObserver
```

### Rules of engagement

- **Never** write per-component media queries for layout. Token overrides in `@media` handle it.
- Reach for `--g-col: span N` rather than custom grid classes.
- Horizontal lines (row dividers) and vertical lines (overlay guides) share the same `--g-line` / `--g-divider` tokens — keep them in lock-step.
- When mobile breaks a 3-column row into 3 separate `.g-row`s (to preserve row dividers between stacked cells), re-use the same content locals in both branches — do **not** duplicate JSX.

---

## 4. Card surface language

Cards feel like physical prints: soft gradient fills, hairline borders, **noise grain overlay**, stacked shadows.

```css
.card-grain { position: relative; overflow: hidden; }
.card-grain::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  opacity: 0.45;
  mix-blend-mode: multiply;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='a' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
  background-size: 180px;
}
.card-grain > * { position: relative; z-index: 2; }
```

**Important**: only apply `.card-grain` to **tinted** surfaces (dark or accent). On pure white, `multiply @ 0.45` reads as dirt, not texture — drop the grain or use a lighter opacity.

Desktop-only hover lift:

```css
@media (min-width: 768px) {
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
  }
}
```

---

## 5. Scroll choreography

Three signature patterns. Tune them to your content, but preserve the underlying mechanics.

### 5a. HIW Envelope

The "How It Works" section opens like an envelope: it starts glued to the hero's bottom, the user scrolls, and it slides down to reveal a **fixed** section behind it. The spacer is driven by `--vh` so iOS URL-bar changes don't open a gap.

```css
.hiw-envelope {
  will-change: transform;
  /* SSR / first paint — already-closed envelope */
  transform: translate3d(0, calc(var(--vh, 100vh) * -2.5), 0);
}
.hiw-envelope.is-snapping {
  transition: transform 180ms cubic-bezier(0.34, 1.3, 0.64, 1);
}
@media (max-width: 767px) {
  /* Drop the transition on mobile — rAF per-frame writes ARE the smoothing */
  .hiw-envelope.is-snapping { transition: none; }
}
```

Phase constants (both desktop and mobile):

| Constant      | Desktop | Mobile | Meaning |
| ------------- | ------- | ------ | ------- |
| `SPACER_VH`   | 1.25    | 2.5    | Height of the RM reveal spacer, in `--vh` units |
| `PHASE_A_VH`  | 0.35    | 0.75   | Scroll range where HIW slides down to parked position |
| `PARK_VH`     | 1.4     | 1.3    | Target visual position of HIW bottom edge while parked |

```tsx
useEffect(() => {
  const vh = window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  const isMobile = window.innerWidth < 768;
  const SPACER_VH = isMobile ? 2.5 : 1.25;
  document.documentElement.style.setProperty('--spacer-vh', String(SPACER_VH));
  const PHASE_A_VH = isMobile ? 0.75 : 0.35;
  const PARK_VH = isMobile ? 1.3 : 1.4;
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const write = (y: number) => {
    const phaseAEnd = vh * PHASE_A_VH;
    const parkedVisual = vh * PARK_VH;
    const natural = heroH + vh * SPACER_VH - y;
    const inPhaseA = y <= phaseAEnd;
    const visualTarget = inPhaseA
      ? heroH + (parkedVisual - heroH) * easeOutCubic(y / phaseAEnd)
      : parkedVisual;
    const translate = Math.min(visualTarget - natural, 0);
    hiwEl.classList.toggle('is-snapping', inPhaseA);
    hiwEl.style.transform = `translate3d(0, ${Math.round(translate)}px, 0)`;
  };

  // Prefer Lenis's scroll event; fall back to native scroll + rAF throttle.
}, []);
```

**The spacer height must be driven by the same `--vh` the math uses**, otherwise iOS URL-bar changes create a gap:

```tsx
<div aria-hidden style={{ height: 'calc(var(--vh, 100vh) * var(--spacer-vh, 2.5))' }} />
```

### 5b. Mobile horizontal pin

Convert vertical scroll to a horizontal translate of a card track while the section is on screen. Re-use the **existing** scroll (hero → spacer → HIW) — don't add a second spacer. Cards overlap at rest (`-ml-[18vw]`) and tilt at a per-card `data-rest` angle; the tilt eases to 0° as the card pans through viewport center.

```tsx
const cards = Array.from(track.querySelectorAll('[data-mcard]')) as HTMLElement[];
const tick = () => {
  // ... compute tx from scrollY within the pinned range
  if (tx !== lastTx) {
    lastTx = tx;
    track.style.transform = `translate3d(${tx}px, 0, 0)`;
    // Per-card tilt: straighten as the card pans through viewport center
    for (const c of cards) {
      const rest = parseFloat(c.dataset.rest || '0');
      const parent = c.parentElement!;
      const cx = parent.offsetLeft + tx + parent.offsetWidth / 2;
      const d = Math.min(1, Math.abs(cx - vw / 2) / vw);
      c.style.transform = `rotate(${(rest * d).toFixed(2)}deg)`;
    }
  }
  rafId = requestAnimationFrame(tick);
};
```

Card markup:

```tsx
<div className="w-screen flex-shrink-0 px-5 box-border flex -ml-[18vw]">
  <div
    data-mcard
    data-rest="-6"  // rest rotation in degrees; alternating signs (-6, 3, -5…)
    className="rounded-2xl bg-white border border-gray-200 shadow-lg card-grain w-full h-full origin-center will-change-transform"
  >
    {content}
  </div>
</div>
```

### 5c. Scroll-triggered reveal

```css
@keyframes slide-in-right { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fade-in-up    { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.animate-slide-in-right {
  opacity: 0;
  animation: fade-in-up 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
@media (min-width: 768px) {
  .animate-slide-in-right {
    animation: slide-in-right 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
}
.animate-delay-1 { animation-delay: 0.1s; }
.animate-delay-2 { animation-delay: 0.2s; }
.animate-delay-3 { animation-delay: 0.35s; }
```

Pair with the `useScrollAnimation` hook (`hooks/useScrollAnimation.ts`):

```ts
// Two modes, controlled by `once`:
//   once = true  (default): latch on first intersection, never re-fire.
//   once = false:          reset `isVisible` on leave so the animation
//                          re-triggers every time the element scrolls
//                          back into view. Pair with a `key`-based remount
//                          (see Wordmark §6e) if the animation is CSS-driven
//                          and needs a full restart, not just a class toggle.
const { ref, isVisible } = useScrollAnimation(0.25, /* once */ false);
```

### Motion rules

- **Always** `requestAnimationFrame`, never `scroll` listener directly.
- **Always** `translate3d(…)` (never plain `translate`) to keep the compositor layer.
- **Always** `will-change: transform` on the element being animated.
- **Prefer** `cubic-bezier(0.34, 1.56, 0.64, 1)` (overshoot) on hover, `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart) on entrance, `cubic-bezier(0.68, -0.55, 0.27, 1.55)` on micro-nudges, `cubic-bezier(0.34, 1.3, 0.64, 1)` on envelope snaps.
- **Never** animate `top` / `left` / `height` for scroll-linked motion — compositor can't GPU-accelerate them.

---

## 6. Component vocabulary

Seven recognizable components. Port the mechanics, re-label for your product.

### 6a. 3D Pill Button (primary CTA, nav)

```tsx
<a
  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-gray-700 text-xs font-bold tracking-wide transition-all duration-150 ease-out hover:scale-105 active:scale-95"
  style={{
    boxShadow: isPressed
      ? '0 2px 4px rgba(0,0,0,0.1), inset 0 1px 2px rgba(0,0,0,0.05)'
      : '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08), inset 0 -1px 2px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.06)',
    transform: isPressed ? 'translateY(1px)' : 'translateY(0)',
  }}
  onMouseDown={…} onMouseUp={…} onMouseLeave={…}
>
  {children}
  <ArrowRight />
</a>
```

The "3D" comes from **three** layered shadows: outer drop, tighter drop, inset bottom highlight. On press, outer drops collapse to a shallower shadow + 1px Y nudge.

### 6b. Slide-to-Unlock Button (mobile-first CTA)

A short-label pill that **expands** on hover (desktop) or on horizontal swipe (mobile). The expanded state reveals a longer CTA + arrow. On mobile, crossing ~92% swipe-progress triggers navigation.

Key behaviors (`components/AnimatedButton.tsx`):

- Random **nudge** animation every 1.5–3.5s while idle and not hovered — draws the eye.
- Touch state computes progress with `deltaX / (containerWidth * 0.55)` capped [0,1].
- Minimum expanded width is clamped to fit "SHORTLABEL →" at touch start (`minSwipeIdealPx` 200/248, bounded to 40–100% of track) so narrow containers still expand cleanly.
- On release ≥ 0.92: success flash (`bg-emerald-500`), check icon, then `window.location.href = href`.
- On release < 0.92: snaps back.
- Track/ghost layer shows double-chevron hint while collapsed; fades out as the button expands.
- Variants: `black` (gradient gray-700→gray-900 + grain), `green` (emerald + grain), `white` (solid white, **no** grain).
- `onDark` prop uses `bg-white/10` translucent track for white buttons on dark surfaces.
- `touchAction: 'pan-y'` on the outer container so vertical scroll still works while the user is horizontally swiping.

### 6c. Floating Video Popup (mobile assistive-touch)

A draggable element that cycles between two states every 1.5s when minimized, and promotes to a larger "corner card" when the user is at the top of the page.

- **Peek cycle (minimized)**: alternates between a 48×48 yellow-300 play-button bubble and a 1.5× scaled circular video preview with a 500ms `opacity + scale(0.7→1)` crossfade. Reads as "living" rather than a dead icon.
- **Corner card** (optional initial state): larger preview that auto-collapses to the minimized peek on first scroll — tracked via `autoMinimizedRef` so a user-dismissed state isn't re-promoted.
- **Snap-to-edge**: after drag, snaps to nearest horizontal viewport edge with flung-velocity awareness. Use the *minimized width* (48px) to compute snap bounds when in minimized phase — do **not** use the corner-card width, or snapping inherits the wrong x-origin.
- Tap expands to fullscreen overlay.
- Persists "interacted" state to `localStorage` (`fvp_interacted = '1'`) so first-visit tooltips don't re-appear.
- Uses `createPortal(…, document.body)` and `position: fixed` with `z-[9999]` so it floats above all Lenis-transformed content.
- Video element has every native control hidden via `video::-webkit-media-controls-*` pseudo-selectors; always `muted + playsInline + webkit-playsinline="true"` for iOS autoplay.

### 6d. Before/After Slider

Image comparison with a draggable divider. Handle is a pill with double-chevron hint. Track is grain-free for clarity. Touch + mouse drag both supported.

Key behaviors (`components/BeforeAfterSlider.tsx`):

- **Desktop idle hint**: 1.5s after mount, slides 75% → 50% → 75% to telegraph draggability. Suppressed once `hasInteracted`.
- **Mobile auto-sweep**: if `window.innerWidth < 640`, the slider auto-oscillates between 20% and 80% every 3s with a `clip-path 2.5s ease-in-out` transition. No drag handle visible in this mode — the mobile UX is "watch, don't touch".
- **Scroll-linked position (optional)**: dispatch a `CustomEvent<number>('scroll-position', { detail: 0..100 })` on the container to drive the slider externally (e.g. from a scroll-progress hook). Suspended once the user drags (`hasInteracted` latch).
- **Accent dot**: `rose-500` / `orange-500` / `emerald-500` ring on the handle, chosen per-instance via `accentColor` prop to color-code side-by-side comparisons on the same page.
- Clip-path on the "before" image is the animated property, not width/left — GPU-friendly.

### 6e. 3D Range Slider (Slider3D)

Horizontal track + dark thumb pill that snaps to N equal steps. Used on the proxemics page for per-dimension dials.

Key behaviors (`components/Slider3D.tsx`):

- **Snapping math**: `percentage → Math.round(percentage * (steps - 1)) * (100 / (steps - 1))` so thumb clicks cleanly at 0 / 25 / 50 / 75 / 100 for `steps = 5`.
- **Thumb position math**: `left: calc(${percentage}% + ${thumbPadding}px - ${percentage * thumbPadding * 2 / 100}px)` combined with `translateX(-${percentage}%)`. This keeps the thumb centered inside the track at both ends without the usual 1-thumb-width overshoot you get from a naive `left: X%`.
- **Track labels**: optional `leftLabel` / `centerLabel` / `rightLabel` in `text-[8px] font-semibold uppercase tracking-wider text-gray-300`, positioned at 12px from each edge / 50% / 12px from right.
- **Description callback**: `descriptions[value]` + `onDescriptionChange` fires when the snapped value changes — drives a sibling "what this means" pane.
- Drag scale: thumb grows to `scale-110` while dragging (`isDragging`), reverts with 100ms ease-out.
- `touchAction: 'none'` on the track + `e.stopPropagation()` on touch handlers so a slider inside a horizontal pin doesn't compete with the pin's scroll hijack.
- **Accent-color prop** currently collapses all three variants (`rose`/`orange`/`emerald`) into the same gray palette — kept as an API for future color-coded sliders without a breaking change.

### 6f. Footer wordmark (neon flicker)

Large SVG wordmark whose `viewBox` is measured from the text's actual **inked** bounding box (not `measureText().width`), so the glyph fills edge-to-edge against the outer grid lines without clipping. A per-character `<tspan>` split with randomized `animation-delay` + `animation-duration` creates asynchronous flicker that reads as electrical noise rather than a metronome.

```css
@keyframes wordmark-flicker {
  0%, 40%, 45%, 58%, 67%, 79%, 83%, 100% { fill: #8b1a1a; stroke: #b52e2e; }
  42%, 60%, 63%, 81%                     { fill: #b52828; stroke: #c23838; }
}
```

Use `steps(1, end)` timing on each tspan so the flicker is instant jumps, not crossfades.

#### Neon-circuit clusters (not per-letter independence)

Real neon signs wire multiple letters onto the same transformer, so a failing tube usually takes its 2–3 neighbours with it. Group the letters into adjacent clusters that share a `{ delay, duration }`:

```ts
function buildFlickerPlans(count: number): FlickerPlan[] {
  const plans: FlickerPlan[] = new Array(count);
  let i = 0;
  while (i < count) {
    // 70% singleton, 22% pair, 8% triple → mostly-independent with rare synced runs
    const roll = Math.random();
    const desired = roll < 0.7 ? 1 : roll < 0.92 ? 2 : 3;
    const size = Math.min(desired, count - i);
    const plan = { delay: Math.random() * 1.2, duration: 1.6 + Math.random() * 0.6 };
    for (let k = 0; k < size; k++) plans[i + k] = plan;
    i += size;
  }
  return plans;
}
```

#### Re-trigger on scroll-back

Pair with `useScrollAnimation(0.25, false)` so `isVisible` toggles on every re-entry. But a CSS animation with `forwards` won't re-play just because a class is re-applied — the DOM nodes need to remount for the animation to restart. Keep a `flickerGen` counter in state and pass it as the React `key` on each `<tspan>`, so each tspan is a fresh node on every re-entry:

```tsx
{Array.from(children).map((ch, i) => (
  <FlickerChar key={`${flickerGen}-${i}`} char={ch} plan={flickerPlans[i]} />
))}
```

#### Edge-to-edge viewBox sizing — the rules you cannot skip

Placing a wordmark **flush against structural grid lines** means the cell has `--g-inset: 0` and `overflow: hidden`. There is no padding to absorb measurement error. If the viewBox is even ~1px too tight, the last glyph's bowl or stroke will visibly clip against the outer vertical grid line.

Three ways ink lands outside `measureText().width`:

1. **Glyph ink overshoot past the pen advance.** `m.width` is the **advance width** — where the pen ends after laying out the string. Round glyphs (`o`, `e`, `g`) bulge slightly past their advance; italics overshoot more. Canvas exposes the true inked edge via `m.actualBoundingBoxRight`.
2. **Stroke overhang from `paint-order: stroke fill`.** SVG strokes are **centered on the path** — half of `strokeWidth` sits **outside** the glyph outline.
3. **Subpixel descender overshoot.** Even text with no visible descenders (e.g. all-lowercase "candidrender" in Plus Jakarta Black) can render ~1–2px below `actualBoundingBoxDescent` at large sizes. Pad the height by ~6% of the ascent.

**Correct viewBox computation:**

```ts
// Inside the measure effect, after ctx.measureText(text):
const leftInk  = m.actualBoundingBoxLeft  ?? 0;          // positive = ink left of origin
const rightInk = m.actualBoundingBoxRight ?? m.width;
const inkedWidth = leftInk + Math.max(m.width, rightInk);

const strokePad = stroke ? strokeWidth / 2 + 1 : 0;       // +1 px subpixel buffer
const bottomPad = ascent * 0.06;                          // Plus Jakarta Black overshoots ~1-2px at 200px size

const x = -leftInk - strokePad;
const w = inkedWidth + strokePad * 2;
const y = -ascent   - strokePad;
const h = ascent + descent + bottomPad + strokePad * 2;
setViewBox(`${x} ${y} ${w} ${h}`);
```

#### Font-resolution + re-measure sequence

Canvas `measureText` uses whatever font happens to be loaded *right now*. Before the Plus Jakarta webfont finishes loading, canvas falls back to a system font with different metrics. Measure twice:

```ts
// 1. Resolve the actual family via a DOM probe (so canvas + SVG agree)
const probe = document.createElement('span');
probe.style.font = '900 200px var(--font-plus-jakarta), system-ui, sans-serif';
// …append, read computed font-family, remove

// 2. Measure now (fallback font) — paints something reasonable on first paint
measure();

// 3. Re-measure after fonts.ready (real font) — this is the "correct" value
document.fonts.ready.then(measure).catch(() => {});
```

**Rules to encode:**

1. **Never size a text viewBox from `m.width` alone.** Use `leftInk + max(width, rightInk)`.
2. **If you stroke the text, pad the viewBox by `strokeWidth / 2` on every side** (+1px subpixel).
3. **Pad the height by ~6% of ascent** for subpixel descender overshoot at large sizes.
4. **Stroke props belong in the measure hook's dependency array** (`[text, fontFamily, weight, letterSpacing, stroke, strokeWidth]`). Otherwise a later stroke-width change won't retrigger a remeasure and you'll get stale padding.
5. **Always call `document.fonts.ready.then(measure)`** so the first paint doesn't strand the viewBox sized to a fallback font's metrics.
6. **This fix is only required when the wordmark is flush against grid lines.** If the SVG sits inside a normally-inset cell (`--g-inset: 32px`), the cell padding absorbs the ~3–4px measurement error. The fix is still correct to apply everywhere — but it's *required* only at `--g-inset: 0`.

### 6g. Footer marquee

```css
.footer-marquee {
  overflow: hidden;
  white-space: nowrap;
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}
.footer-marquee__track {
  display: inline-flex;
  animation: marquee-x 40s linear infinite;
  will-change: transform;
}
@keyframes marquee-x { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
```

Content is **duplicated 16×** inside the track, then `translateX(-50%)` seamlessly loops the first half into the second. The gradient mask softens both edges.

---

## 7. Interaction idioms

- **Lowercase headlines** — "how it works", "upload your render". Reserve title-case for proper nouns and section eyebrows.
- **Tiny randomness** in idle states — buttons nudge, flicker seeds vary per letter, card rotations read as hand-placed rather than algorithmic.
- **Material Icons family for all arrows** — `arrow_outward` (M6 17.59L17.59 6H10V4h11v11h-2V7.41L7.41 19 6 17.59z), `arrow_downward` (M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z). Mix of icon families reads as inconsistent.
- **Video element hygiene** — hide every native control via `video::-webkit-media-controls-*` pseudo-selectors. Always `muted + playsInline + webkit-playsinline="true"` for iOS autoplay.
- **Nav hides when footer intersects** — `IntersectionObserver` on `#site-footer` at `threshold: 0.1`; header fades out and the footer wordmark stays the visual anchor.
- **Scroll-hint dash** — a small SVG "|" breathing at `1.8s ease-in-out infinite` (`@keyframes hero-dash`) at the hero bottom, with `opacity: 0.55 → 1` and `translateY: 0 → 4px`. Softer than a bouncing arrow.

---

## 8. Easter eggs (optional)

These are shipped animations but not wired by default — drop them onto elements to build playful secondary interactions. Each uses CSS custom properties so individual elements preserve their resting transform while sharing the keyframe.

### Card fall

```css
@keyframes card-fall {
  0%   { transform: translate(0, 0) rotate(var(--card-rest-rotate, 0deg)) scale(var(--card-rest-scale, 1)); }
  14%  { transform: translate(0, -10px) rotate(calc(var(--card-rest-rotate, 0deg) + var(--card-tilt, 0deg) * 0.15)) scale(var(--card-rest-scale, 1)); } /* anticipation lift */
  100% { transform: translate(var(--card-drift, 0px), 130vh) rotate(calc(var(--card-rest-rotate, 0deg) + var(--card-tilt, 8deg))) scale(var(--card-rest-scale, 1)); }
}
.animate-card-fall {
  animation: card-fall 0.6s cubic-bezier(0.55, 0.05, 0.85, 0.4) forwards;
  pointer-events: none;
}
```

### Swish-in return

```css
@keyframes swish-in {
  0%   { opacity: 0; transform: translateY(200px) rotate(20deg) scale(0.7); }
  60%  { opacity: 1; transform: translateY(-8px) rotate(-2deg) scale(1.02); }
  80%  { transform: translateY(3px) rotate(0.5deg) scale(0.99); }
  100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
}
.animate-swish-in { animation: swish-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
```

Per-card CSS vars (`--card-rest-rotate`, `--card-tilt`, `--card-drift`) let one keyframe drive multiple cards without collisions.

---

## 9. Common pitfalls

| Pitfall | Why it breaks | Fix |
| --- | --- | --- |
| Using `100vh` / `100dvh` for pinned sections | iOS URL bar resizes mid-scroll → flicker | Cache `innerHeight` into `--vh`, update only on `orientationchange` |
| `scroll` event listener for transform writes | iOS coalesces/drops events → stutter | `requestAnimationFrame` tick reading `window.scrollY` or `lenis.on('scroll')` |
| Lenis `syncTouch: true` | Fights native iOS momentum → stutter | Leave touch to the OS; only wheel/anchor sync via Lenis |
| Grain on pure white | Reads as dirt | Drop `.card-grain` on white; keep on tinted/dark surfaces only |
| Per-component media queries for layout | Drifts from `--g-cols` overrides | Use `.g-span-N` and let `--g-cols` reflow |
| `translate(…)` on scroll-linked elements | CPU-rasterized | `translate3d(…)` + `will-change: transform` |
| Hiding step titles to get equal padding | Content loss | Use `.g-inset` token overrides; keep content intact |
| Animating `height` on collapses | Repaints, no GPU | Animate `transform: scaleY(…)` or use grid-row tricks |
| Shared spacer height decoupled from rAF math | Gap opens on mobile | Spacer height must reference the same `--vh` constant the math reads |
| Sizing a wordmark viewBox from `measureText().width` | `width` is pen advance, not ink edge; strokes sit half outside the path | Use `leftInk + max(width, rightInk)` + pad `strokeWidth/2 + 1` on every side + 6% ascent bottom pad |
| Measuring text before `document.fonts.ready` | Canvas uses fallback font; metrics drift from the rendered SVG | Measure once for fast paint, then re-measure in `document.fonts.ready.then(…)` |
| Re-applying a CSS animation class and expecting restart | `forwards` sticks on the last frame — class toggle doesn't reset the animation | Remount the DOM node by changing its React `key` (e.g. a `flickerGen` counter) |
| `e.preventDefault()` missing on horizontal-pin touchmove | Page vertical scroll fights the pin | `preventDefault()` inside rAF window, `touchAction: 'pan-y'` on outer containers |
| FloatingVideoPopup snapping the corner card by minimized-button width | Corner card pops to wrong edge x | Always pass `elWidth` explicitly to `snapToEdge` based on current `mobilePhase` |
| Restoring scroll position on reload into a `position: fixed` section | User lands mid-pin, choreography broken | `window.history.scrollRestoration = 'manual'` + double-RAF `scrollTo(0, 0)` |

---

## 10. Quick-start checklist

When applying this skill to a fresh project:

1. Install Plus Jakarta Sans via `next/font`, wire `--font-plus-jakarta`.
2. Paste the Structural Grid CSS (§3) into `globals.css`.
3. Add the inline `<head>` script that sets `--g-sb` + `--vh` (§1).
4. Set `html { scrollbar-gutter: stable; overflow-x: clip; scroll-behavior: smooth; }` and `body { overflow-anchor: none; }`.
5. Add `.card-grain`, animation keyframes, marquee + flicker CSS (§4, §6g).
6. Install Lenis for smooth scroll (`autoRaf: true`, no `syncTouch`), or skip and use native scroll + rAF. Disable browser scroll restoration.
7. Drop in `<GridOverlay />` where you want visible vertical guides. Always local (`.g-overlay--local`), never site-wide fixed.
8. Use `<div className="g-row"><div className="g-cell g-half-l">…</div>…</div>` as the default layout — **never** raw flex rows for content structure.
9. Build the signature hero → RM-behind → HIW envelope if you have a reveal moment; otherwise just borrow the grid + cards + typography.
10. Every CTA button is either (a) 3D pill or (b) slide-to-unlock — pick one per context; don't mix on the same screen.
11. For any long SVG wordmark flush against grid lines: use the full viewBox recipe (§6f), not `measureText().width`.

---

## 11. File layout reference

```
app/
  globals.css        # grid, tokens, keyframes, utility classes
  layout.tsx         # font, inline head script, SmoothScrollProvider
  page.tsx           # scroll choreography effects, section composition
  pricing/           # tiered pricing page (same grid system)
  proxemics/         # proxemics explainer (uses Slider3D)
components/
  GridOverlay.tsx      # repaints --g-cols column divs via ResizeObserver
  Header.tsx           # fixed nav, IntersectionObserver on footer to auto-hide
  Footer.tsx           # dark surface, wordmark, marquee
  AnimatedButton.tsx   # slide-to-unlock
  FloatingVideoPopup.tsx  # assistive-touch floating video with peek cycle
  BeforeAfterSlider.tsx   # drag on desktop, auto-sweep on mobile
  Slider3D.tsx         # stepped range slider with description callback
  WordmarkSVG.tsx      # auto-fit viewBox + neon-circuit flicker clusters
  SmoothScrollProvider.tsx  # Lenis wrapper, exposes window.__lenis
  SwipeCardStack.tsx   # stacked cards, swipe to dismiss
  Interactive3DCube.tsx   # CSS-transform 3D cube
hooks/
  useScrollAnimation.ts   # IntersectionObserver → isVisible; `once` param for re-fire
grid-system-kit/          # portable export of §3 + §5c (patterns, porting, responsive guides)
```

Keep this structure when porting — the cross-references (Header observing footer, page.tsx writing `--vh`, spacer reading `--spacer-vh`) form the backbone that lets the cinematic choreography stay flicker-free.
