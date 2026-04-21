# React / Next.js snippets

The grid is framework-agnostic CSS, but every CandidRender-ecosystem site
ports it into Next.js with React components. These are the reference
snippets.

---

## 1. Head script — Next.js `app/layout.tsx`

Inline the `--g-sb` and `--vh` setup so both are set **before paint**.
Don't put it in a client component that hydrates — the first frame would
miss it and full-bleed dividers would jump.

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              var r = document.documentElement;
              var sb = function(){
                r.style.setProperty('--g-sb', (window.innerWidth - r.clientWidth) + 'px');
              };
              sb();
              window.addEventListener('resize', sb);
              r.style.setProperty('--vh', window.innerHeight + 'px');
              window.addEventListener('orientationchange', function(){
                r.style.setProperty('--vh', window.innerHeight + 'px');
              });
            })();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 2. `<GridOverlay />` component

Repaints `--g-cols` children via `ResizeObserver` watching
`documentElement`. Always render as a **local** overlay inside a
positioned ancestor — global fixed overlays conflict with any pinned layer
at `z-index: 0`.

```tsx
// components/GridOverlay.tsx
'use client';
import { useEffect, useRef } from 'react';

export default function GridOverlay({ className = '' }: { className?: string }) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const paint = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue('--g-cols').trim();
      const cols = Math.max(1, parseInt(raw, 10) || 12);
      if (inner.childElementCount === cols) return;
      inner.replaceChildren();
      for (let i = 0; i < cols; i++) {
        const col = document.createElement('div');
        col.className = 'g-overlay__col';
        inner.appendChild(col);
      }
    };

    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`g-overlay g-overlay--local ${className}`} aria-hidden="true">
      <div className="g-overlay__inner" ref={innerRef} />
    </div>
  );
}
```

**Usage:**

```tsx
<section style={{ position: 'relative' }}>
  <GridOverlay />
  <div className="g-row">
    <div className="g-cell g-full">…</div>
  </div>
</section>
```

---

## 3. Inline `--g-inset` / `--g-row-min` overrides — TypeScript casts

Inline CSS variables need a cast because React's `CSSProperties` doesn't
know about them:

```tsx
<div
  className="g-row g-row--center"
  style={{
    '--g-row-min': '64px',
    '--g-inset': '16px',
  } as React.CSSProperties}
>
  …
</div>
```

Alternatively, type once and reuse:

```ts
type CSSVars = React.CSSProperties & { [k: `--${string}`]: string };
const navRowStyle: CSSVars = { '--g-row-min': '64px', '--g-inset': '16px' };
```

---

## 4. Fixed Header with local overlay

```tsx
// components/Header.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GridOverlay from './GridOverlay';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  // Auto-hide nav when footer scrolls into view
  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const io = new IntersectionObserver(
      ([e]) => setFooterVisible(e.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        footerVisible
          ? 'opacity-0 -translate-y-4 pointer-events-none'
          : 'bg-white/80 backdrop-blur-xl border-b border-gray-100'
      }`}
    >
      <nav className="relative">
        <GridOverlay />
        <div
          className="g-row g-row--center relative z-[2]"
          style={{ '--g-row-min': '64px', '--g-inset': '16px' } as React.CSSProperties}
        >
          <div className="g-cell g-half-l">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="" width={22} height={22} />
              <span className="font-black tracking-[-0.04em]">brand</span>
            </Link>
          </div>
          <div className="g-cell g-half-r">
            <div className="flex items-center justify-end gap-3">
              <a href="/login" className="hidden md:inline-flex text-sm">Login</a>
              <a href="/app" className="btn-primary">Get Started</a>
              <button
                className="md:hidden"
                onClick={() => setMobileOpen(v => !v)}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div
            className="g-row g-row--no-divider md:hidden"
            style={{ borderTop: '1px solid var(--g-divider)' }}
          >
            <div className="g-cell g-full">
              <a href="/login">Login</a>
              <a href="/app">Launch App →</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
```

---

## 5. Dark Footer with grid-aligned wordmark + marquee

```tsx
// components/Footer.tsx
'use client';
import GridOverlay from './GridOverlay';

export default function Footer() {
  return (
    <footer id="site-footer" className="g-section--dark relative z-10 bg-[#15151a]">
      <GridOverlay />

      {/* Mobile: one .g-row per column → dividers come from .g-row::after */}
      <div className="md:hidden">
        <div className="g-row"><div className="g-cell g-full">{/* brand */}</div></div>
        <div className="g-row"><div className="g-cell g-full">{/* product */}</div></div>
        <div className="g-row"><div className="g-cell g-full">{/* connect */}</div></div>
      </div>

      {/* Desktop: single row, 6 + 3 + 3 */}
      <div className="hidden md:block">
        <div className="g-row footer-main-row">
          <div className="g-cell g-span-6">{/* brand */}</div>
          <div className="g-cell g-span-3">{/* product */}</div>
          <div className="g-cell g-span-3">{/* connect */}</div>
        </div>
      </div>

      {/* Wordmark — flush to grid lines */}
      <div
        className="g-row g-row--no-divider"
        style={{ '--g-inset': '0' } as React.CSSProperties}
      >
        <div className="g-cell g-full">
          <svg>{/* WordmarkSVG auto-fit */}</svg>
        </div>
      </div>

      {/* Marquee — same flush treatment */}
      <div
        className="g-row g-row--no-divider"
        style={{ '--g-inset': '0' } as React.CSSProperties}
      >
        <div className="g-cell g-full p-0">
          <div className="footer-marquee">…</div>
        </div>
      </div>
    </footer>
  );
}
```

---

## 6. Tailwind v4 compatibility

Grid classes don't conflict with Tailwind — they're scoped under `.g-*`.
Use Tailwind for internal component styling; use `.g-row` + `.g-cell` for
structural alignment only.

```tsx
<div className="g-row g-row--center">
  <div className="g-cell g-half-l">
    <h2 className="text-5xl font-bold tracking-[-0.02em]">Headline</h2>
    <p className="text-gray-500 mt-4">Body.</p>
  </div>
  <div className="g-cell g-half-r">
    <img className="rounded-2xl shadow-lg" src="/hero.jpg" alt="" />
  </div>
</div>
```

If you want the grid tokens available to Tailwind utilities, expose them
via `@theme inline` (Tailwind v4):

```css
/* globals.css */
@import "tailwindcss";

@theme inline {
  --spacing-gpad: var(--g-pad);
  --spacing-ginset: var(--g-inset);
}
```

Then `px-gpad`, `py-ginset`, etc. resolve to the live token values. Use
sparingly — `.g-row` already manages outer padding, so this is mainly for
non-grid elements that want to align with the grid edge.

---

## 7. `useGridTokens` hook

For components that need to read live grid-token values (e.g. a floating
UI element respecting `--g-pad`):

```tsx
// hooks/useGridTokens.ts
'use client';
import { useEffect, useState } from 'react';

export function useGridTokens() {
  const [tokens, setTokens] = useState({ cols: 12, gap: 24, pad: 32 });

  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      setTokens({
        cols: parseInt(cs.getPropertyValue('--g-cols'), 10) || 12,
        gap:  parseFloat(cs.getPropertyValue('--g-gap'))    || 24,
        pad:  parseFloat(cs.getPropertyValue('--g-pad'))    || 32,
      });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  return tokens;
}
```

Example:

```tsx
function EdgeFloatingButton() {
  const { pad } = useGridTokens();
  return (
    <button
      className="fixed bottom-6"
      style={{ right: pad, transition: 'right 0.2s' }}
    >
      Chat
    </button>
  );
}
```

---

## 8. `g-no-overlay` / `g-no-dividers` toggles from React

Useful for design-review modes:

```tsx
export default function DesignModeToggle() {
  const [raw, setRaw] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('g-no-overlay', raw);
    document.body.classList.toggle('g-no-dividers', raw);
  }, [raw]);
  return <button onClick={() => setRaw(v => !v)}>{raw ? 'Show grid' : 'Hide grid'}</button>;
}
```

---

## 9. SSR / first-paint considerations

- **The inline head script must be in `<head>`** (not a client component).
  Otherwise `--g-sb` is unset on first paint and all full-bleed dividers
  slide ~15px on hydration.
- **The overlay's column count is inherently client-side** (relies on
  computed-style + DOM). On SSR, `.g-overlay__inner` is empty — the
  `ResizeObserver` populates it after mount. No visual jump because the
  outer lines (`:first-child` / `:last-child` borders) only appear once
  the children exist. Until then, the overlay is invisible, which is
  correct.
- **Don't use `100vh` / `100dvh` for pinned sections.** iOS URL-bar
  changes resize `vh`/`dvh` mid-scroll, causing flicker. Always use the
  cached `--vh` from the head script.

---

## 10. File layout reference

```
app/
  globals.css        ← paste grid-system.css contents here (or @import)
  layout.tsx         ← inline head script lives here
  page.tsx           ← uses .g-row / .g-cell in JSX
components/
  GridOverlay.tsx    ← ResizeObserver paints --g-cols columns
  Header.tsx         ← fixed nav with local overlay
  Footer.tsx         ← dark section with wordmark row
hooks/
  useGridTokens.ts   ← (optional) live tokens for floating UI
```

This is the same structure CandidRender uses. Keep it symmetrical across
your ecosystem so porting between projects is copy-paste rather than
re-architect.
