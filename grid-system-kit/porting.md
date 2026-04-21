# Porting the grid to a new site

How to apply the **exact** CandidRender grid — same primitives, same
alignment math, same responsive behavior — to a different product or
brand. The visual language can change; the grid mechanics cannot.

---

## The sacred vs. swappable map

Read this before you start. It's the single most important idea.

### Sacred — copy verbatim, do NOT modify

| What | Why |
|------|-----|
| `grid-system.css` (entire file) | The load-bearing contract — tokens, primitives, overlay, dark variant, mobile helpers. |
| The inline `<head>` script | Sets `--g-sb` (scrollbar gutter) and `--vh` (cached innerHeight) before paint. Any delay = visible jump on first frame. |
| `html { scrollbar-gutter: stable; overflow-x: clip; }` | Required so `--g-sb` is stable and 100vw dividers don't trigger an H-scroll bar. |
| `body { overflow-anchor: none; }` | Prevents async layout shifts from nudging scroll mid-reveal. |
| The four `:root` media queries | `1200/1024/768/480` → 12/8/4/2 cols. Changing these breaks every semantic span alias. |
| `.g-row::after` math: `width: calc(100vw - var(--g-sb, 0px))` | How row dividers align across the viewport regardless of max-width. |
| `.g-section--dark` token values | Brightness-tuned for perceived contrast; avoid retuning unless the brand truly demands it. |
| `GridOverlay.tsx` (the ResizeObserver repaint logic) | How the overlay tracks breakpoint changes. |

### Swappable — customize to your brand

| What | Where |
|------|-------|
| `--g-max` (content width) | `:root` in `globals.css`. Common values: 1200, 1280, 1440. |
| `--g-line`, `--g-divider` color/alpha | For brand tints — keep alpha low (0.08–0.14). |
| Typography (font family, scale, letter-spacing) | `next/font` import + Tailwind utilities. |
| Color tokens (bg, text, accents) | Your `@theme` or CSS vars. |
| Component styling (buttons, cards, radii, shadows) | Your component CSS. |
| Animation keyframes | `globals.css` animations section. |
| Section rhythm (`--g-inset` per row) | Inline `style={{ '--g-inset': '…' }}` on specific rows. |
| Content + copy | Obviously. |

**The rule:** if you're writing a grid token override on `:root` or
touching anything in §3 of `SKILL.md` (primitives), you're probably
about to break alignment. Stop and see if you can solve it with a
per-row `--g-inset` override or a semantic span change instead.

---

## The 10-step procedure

### Step 0 — Have these ready

- A Next.js 15/16 project (or vanilla HTML — the grid works either way).
- Tailwind v4 installed if you want the typography conventions
  (`@import "tailwindcss"`).
- The design tokens you want to override: font family, color palette,
  dark-surface color, primary brand accent, max content width.
- A clear list of sections: nav, hero, features, CTA, footer (standard
  marketing). Plus any scroll-pinned sections (envelope, horizontal pin).

### Step 1 — Invoke the skill in a fresh Claude session

Open Claude Code in your new project root and start with a prompt like:

```
I'm setting up a new marketing site at this project root. Apply the
structural-grid skill to bootstrap the grid foundation. Brand:
  - Font: [Inter / Plus Jakarta / custom]
  - Brand accent: [#hex]
  - Dark surface: [#hex]
  - Max content width: [1200px]
Keep all grid tokens and mechanics exactly as specified — I only want
to customize the design-token layer.
```

The `structural-grid` and `candidrender-ui` skills will auto-trigger.

### Step 2 — Drop in the grid CSS (sacred)

Paste the contents of `~/.claude/skills/structural-grid/grid-system.css`
into your `app/globals.css` (or link it). Do not modify anything except
the final **Design language** block at the bottom, which you'll add in
Step 6.

Quick check: search for `--g-cols` and `--g-pad` — they should appear
on `:root` and in four `@media` rules. That's the reflow engine.

### Step 3 — Add the inline head script (sacred)

Paste this into `app/layout.tsx` inside `<head>`, before anything else:

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){var r=document.documentElement;var sb=function(){r.style.setProperty('--g-sb',(window.innerWidth-r.clientWidth)+'px');};sb();window.addEventListener('resize',sb);r.style.setProperty('--vh',window.innerHeight+'px');window.addEventListener('orientationchange',function(){r.style.setProperty('--vh',window.innerHeight+'px');});})();`,
  }}
/>
```

**Do not** replace with a `next/script` component — that's deferred and
runs after hydration. The inline tag must run before first paint.

### Step 4 — Copy `GridOverlay.tsx`

Paste the React component from `react-snippets.md §2` into
`components/GridOverlay.tsx`. No changes. It's 30 lines and it's perfect.

### Step 5 — Build the Header (structural, then design)

Start from the pattern in `react-snippets.md §4`. **Structural bits
that must stay**:

- `<nav className="relative">` (anchors the local overlay).
- `<GridOverlay />` inside the nav.
- `<div className="g-row g-row--center" style={{ '--g-row-min': '64px', '--g-inset': '16px' }}>`.
- `<div className="g-cell g-half-l">` for the logo slot.
- `<div className="g-cell g-half-r">` for the actions slot.
- Mobile menu as a second `.g-row g-row--no-divider md:hidden` row
  beneath.

**Swap freely**:

- Logo image + wordmark text.
- Button styles inside the actions slot (Pill3DButton, AnimatedButton,
  plain link — your call).
- Backdrop (`bg-white/80 backdrop-blur-xl` vs. solid, etc.).

Set `<main className="pt-16">` (or match `--g-row-min`) so content
clears the fixed nav.

### Step 6 — Build the Footer (structural, then design)

Start from `react-snippets.md §5`. **Structural bits that must stay**:

- `<footer id="site-footer" className="g-section--dark relative">`.
- `<GridOverlay />` inside.
- Mobile: three separate `.g-row`s, each with a single `.g-cell.g-full`.
- Desktop: one `.g-row` with `.g-cell.g-span-6` + `.g-span-3` + `.g-span-3`.
- Edge-to-edge rows (wordmark, marquee) use `.g-row--no-divider` with
  inline `style={{ '--g-inset': '0' }}`.

**Swap freely**:

- Wordmark text, colors, whether to use the flicker animation.
- Marquee content, whether to even have one.
- Social icons, link destinations.
- Background color (override via `bg-[#hex]` — `.g-section--dark`
  doesn't set a background, just retints the lines).

### Step 7 — Build sections using `patterns.md` recipes

`patterns.md` has 13 copy-paste-ready HTML blocks. Match your sections
to a pattern:

| Your section | Pattern to use |
|--------------|----------------|
| Full-bleed hero with centered headline | §2 (hero full-bleed) |
| Hero with product screenshot on the right | §3 (hero split 50/50) |
| Row of numbers/metrics | §4 (stats row) |
| Three steps / features / benefits | §5 (3-column features) |
| Text left + image right | §6 (2-col split) |
| Call-to-action on a dark background | §7 (dark CTA) |
| Edge-to-edge image/video strip | §9 (edge-to-edge media) |

**Always** build sections out of `.g-row` + `.g-cell` — never a raw
`flex` / `max-w-7xl mx-auto` wrapper. That's the difference between
"uses the grid" and "ignores the grid while pretending to follow it".

### Step 8 — Overlay the design-token layer

Now you customize the look. This is the **only** layer where your
brand diverges from CandidRender. Put it in `globals.css` **after**
the grid block:

```css
/* === Your brand tokens (below the grid block) === */
:root {
  --background: #ffffff;       /* or #fafaf7 for warm off-white */
  --foreground: #0a0a0a;
  --accent: #6366f1;           /* your primary accent */
  --dark-surface: #0b0c10;     /* your dark-section bg */
}

/* Override grid aesthetics (optional) */
:root {
  --g-max: 1280px;             /* wider content if your brand wants it */
  --g-line: rgba(40, 40, 40, 0.10);  /* softer lines */
}

/* Typography */
@theme inline {
  --font-sans: var(--font-your-font), system-ui, sans-serif;
}

body { background: var(--background); color: var(--foreground); }
```

And swap `next/font` in `layout.tsx`:

```tsx
import { Inter } from "next/font/google";
const font = Inter({ subsets: ["latin"], variable: "--font-your-font" });
```

### Step 9 — Bring in interaction components selectively

From the CandidRender repo, the following components port cleanly
(they're grid-agnostic):

- `AnimatedButton.tsx` — slide-to-unlock CTA with touch + hover paths.
- `FloatingVideoPopup.tsx` — mobile assistive-touch video peek.
- `BeforeAfterSlider.tsx` — image-compare slider.
- `WordmarkSVG.tsx` — auto-fit viewBox wordmark with optional flicker.
- `Interactive3DCube.tsx` / `Slider3D.tsx` — decorative widgets.

Copy only the ones your site actually uses. Resist the urge to port
everything "just in case" — each one carries assumptions about
breakpoints and motion that may or may not match your product.

If you want the envelope-reveal scroll choreography (hero → pinned
features → HIW closes over it), copy the relevant effect block from
CandidRender's `app/page.tsx` lines 250–490 and the `.hiw-envelope`
CSS from `globals.css`. Follow `responsive.md §6` for per-device
constant tuning.

### Step 10 — Verify at every breakpoint

Run the 9-point audit from `responsive.md §10`:

1. Overlay outer lines hit row edges at 1280 / 1024 / 900 / 820 / 768 / 700 / 540 / 480 / 375.
2. Row dividers span the viewport minus `--g-sb`.
3. Mobile helpers (`.g-sm-full`, `.g-sm-hr-top`) activate below 768.
4. Markup swaps (`md:hidden` vs. `hidden md:block`) show exactly one block each.
5. Scroll choreography spacer heights match the rAF math constants.
6. iOS URL bar doesn't open a gap at the hero/HIW boundary.
7. Videos autoplay on iPhone (four required attributes set).
8. Touch gestures work on iPhone + Android.
9. Hover lifts don't stick on touch-only devices.
10. Rotating mid-interaction re-attaches cleanly.

Then open the site in Safari iOS and Chrome Android on real devices.
Simulators miss the URL-bar behavior that `--vh` is fixing.

---

## Starter prompt templates

### Fresh Next.js project (bootstrap)

```
Set up a new marketing site using the structural-grid skill.

Project: /path/to/new-project (Next.js 15, TypeScript, Tailwind v4)
Brand tokens:
  - Font: [Plus Jakarta Sans / Inter / Geist / Your Font]
  - Primary accent: #__
  - Dark surface: #__
  - Max content width: 1200px

Steps I want you to do:
1. Add grid-system.css contents to app/globals.css (keep it unmodified).
2. Paste the inline head script into app/layout.tsx.
3. Create components/GridOverlay.tsx from the skill.
4. Stub Header.tsx using the nav pattern — g-row--center, --g-row-min: 64px, --g-inset: 16px, g-half-l (logo) + g-half-r (actions).
5. Stub Footer.tsx using the dark-section pattern — 3-row mobile / 6+3+3 desktop + edge-to-edge wordmark row.
6. Stub a sample hero in app/page.tsx using .g-row--no-divider + .g-cell.g-full.
7. Overlay my design tokens as a separate block after the grid CSS.

Do NOT modify anything in the grid module (tokens, primitives, overlay
CSS, media queries, divider math). Only customize the design-token
layer I listed above.
```

### Adding the grid to an existing site

```
Retrofit the structural grid into this existing site.

Scope:
  - Keep existing routing, components, content.
  - Replace layout wrappers (max-w-Xxl mx-auto, custom grid containers)
    with .g-row / .g-cell from the structural-grid skill.
  - Preserve existing typography and color tokens.
  - Remove per-component media queries that duplicate what the grid's
    token overrides already do.

Start with: [app/layout.tsx / components/Header.tsx / app/page.tsx]
Show me the diffs before applying.
```

### Adding a single grid-aligned section

```
Add a new section to this page using the structural-grid skill.

Section: "[Pricing tiers — three cards side-by-side with feature lists]"

Pattern to follow: patterns.md §5 (3-column features) or §4 (stats row).

Use .g-row + three .g-cell.g-span-4 with .g-sm-hr-top on the 2nd and
3rd cells for mobile dividers. Keep the existing site's design tokens.
```

---

## Common porting mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Moving the inline head script into a client component | Dividers jump ~15px on first hydration | Put it back in `<head>` as `dangerouslySetInnerHTML` |
| Deleting `scrollbar-gutter: stable` to "clean up" | Dividers shift when scrollbar appears | Restore it — it's load-bearing |
| Changing `--g-cols` to 16 for "more design flexibility" | Every semantic span alias breaks | Use `--g-max` widening instead; keep cols at 12 |
| Nesting `.g-row` inside `.g-cell` | Content double-indented by `--g-pad` | One row per horizontal band. Never nest. |
| Using `.g-third-m` where cells need to wrap | Empty gaps at narrow breakpoints | Use `.g-span-4` trio for wrappable, `.g-third-m` for position-locked |
| Setting `--g-inset` on a cell child | Children fight cell padding | Set `--g-inset` on the row (or inline per-row); let cells inherit |
| Replacing the `ResizeObserver` with a `useEffect` | Overlay column count stuck at mount value | Keep the observer — breakpoint changes need repaint |
| Porting the envelope-reveal without `--vh` | Gap opens at hero/HIW on iOS | Cache `innerHeight` into `--vh` via the head script |
| Using `100dvh` instead of `--vh` | Flicker on iOS scroll | `--vh` is cached. `dvh` changes mid-scroll. |
| Per-component `@media` for layout | Drifts from grid tokens | Use `.g-span-N` + `.g-sm-full`; let tokens reflow |

---

## When to deviate

Two cases where you might deliberately break this playbook:

1. **You're building a documentation site or dense-data UI.** The
   grid is tuned for editorial marketing surfaces. Dashboards need
   different density (narrower rows, tighter gaps, per-component
   density modes). Consider a different system — this one's motion
   and spacing aesthetics won't fit.

2. **Your brand has a strong custom layout identity** (asymmetric
   grids, magazine-style overlaps, zero-lines). In that case, keep
   the token + primitive architecture but replace the overlay CSS
   and the `.g-row::after` divider. The mechanics still help; the
   decoration can be whatever you want.

Otherwise: follow the procedure. The opinionated choices here exist
because they solve real alignment / iOS / scroll-timing problems
across dozens of ports. Don't rediscover them.
