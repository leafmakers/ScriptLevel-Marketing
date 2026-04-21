'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Big display wordmark that fits its container exactly without distorting
 * the glyphs.
 *
 * Measurement strategy:
 *   We avoid SVG getBBox() because some browsers return the full em-box
 *   (inflated by ascender/descender padding even for text with no real
 *   descenders). Canvas 2D measureText returns actualBoundingBoxAscent
 *   and actualBoundingBoxDescent, which are the true inked pixel bounds
 *   — the tight box we actually want.
 *
 *   The measured width / ascent / descent become the SVG viewBox, and
 *   the SVG scales proportionally via `width: 100%` to fill its parent.
 *   No textLength distortion, no letterform stretch — just real glyphs
 *   cropped to their exact inked bounds.
 */
type WordmarkSVGProps = {
  children: string;
  className?: string;
  textClassName?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontWeight?: number | string;
  letterSpacing?: string;
};

type FlickerPlan = { delay: number; duration: number };

/**
 * Build flicker plans for every character in the wordmark, grouped into
 * adjacent "clusters" of 1–3 letters that share the same delay +
 * duration. Real neon signs wire multiple letters onto the same
 * circuit, so a failing tube usually takes its 2–3 neighbours with it;
 * this mirrors that behaviour. Most clusters are singletons; the
 * occasional 2- or 3-letter run adds the synchronised blink.
 */
function buildFlickerPlans(count: number): FlickerPlan[] {
  const plans: FlickerPlan[] = new Array(count);
  let i = 0;
  while (i < count) {
    // Cluster size: 70% chance singleton, 22% pair, 8% triple. Biased
    // toward singletons so the wordmark stays mostly-independent with
    // rare synchronised runs instead of constant synchrony.
    const roll = Math.random();
    const desired = roll < 0.7 ? 1 : roll < 0.92 ? 2 : 3;
    const size = Math.min(desired, count - i);
    const plan: FlickerPlan = {
      delay: Math.random() * 1.2,
      duration: 1.6 + Math.random() * 0.6,
    };
    for (let k = 0; k < size; k++) plans[i + k] = plan;
    i += size;
  }
  return plans;
}

function FlickerChar({ char, plan }: { char: string; plan: FlickerPlan }) {
  return (
    <tspan
      style={{
        animation: `wordmark-flicker ${plan.duration}s steps(1, end) ${plan.delay}s forwards`,
      }}
    >
      {char}
    </tspan>
  );
}

export default function WordmarkSVG({
  children,
  className = '',
  textClassName = '',
  fill = '#fff',
  stroke,
  strokeWidth = 2,
  fontWeight = 900,
  letterSpacing = '-0.04em',
}: WordmarkSVGProps) {
  const textRef = useRef<SVGTextElement>(null);
  // Sensible SSR fallback — tight ratio close to Plus Jakarta Black's
  // natural metrics for "candidrender" so pre-hydration layout is close
  // to the measured value.
  const [viewBox, setViewBox] = useState('0 -150 1200 150');
  // Flicker plans regenerate every time the `wordmark-flicker` class is
  // newly applied. flickerGen doubles as a React key on each tspan so
  // the DOM nodes (and their CSS animations) remount on each re-trigger
  // — not just when `children` changes. Callers using
  // useScrollAnimation(…, once: false) therefore see the flicker fire
  // again every time the wordmark scrolls back into view.
  const hasFlicker = textClassName?.includes('wordmark-flicker') ?? false;
  const [flickerGen, setFlickerGen] = useState(0);
  const [flickerPlans, setFlickerPlans] = useState<FlickerPlan[] | null>(null);
  useEffect(() => {
    if (hasFlicker) {
      setFlickerPlans(buildFlickerPlans(children.length));
      setFlickerGen((g) => g + 1);
    }
  }, [hasFlicker, children]);

  useEffect(() => {
    // Resolve the actual computed font family so canvas measurement and
    // SVG rendering use the same font.
    const resolveFamily = () => {
      if (typeof window === 'undefined') return 'sans-serif';
      const probe = document.createElement('span');
      probe.style.font = '900 200px var(--font-plus-jakarta), system-ui, sans-serif';
      probe.style.letterSpacing = letterSpacing;
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      probe.textContent = 'x';
      document.body.appendChild(probe);
      const family = getComputedStyle(probe).fontFamily;
      document.body.removeChild(probe);
      return family || 'sans-serif';
    };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const measure = () => {
      const family = resolveFamily();
      ctx.font = `${fontWeight} 200px ${family}`;
      // letterSpacing on CanvasRenderingContext2D is supported in Chrome,
      // Safari 16.4+, Firefox 120+. Silently ignored elsewhere.
      try { (ctx as unknown as { letterSpacing: string }).letterSpacing = letterSpacing; } catch {}
      const m = ctx.measureText(children);
      const ascent = (m.actualBoundingBoxAscent ?? 150);
      const descent = (m.actualBoundingBoxDescent ?? 0);
      // m.width is the PEN ADVANCE, not the ink edge. Round glyphs bulge
      // past their advance; strokes (paint-order: stroke fill) sit half
      // outside the path. Use actualBoundingBox[Left|Right] + stroke pad
      // so the viewBox covers every painted pixel — required when the
      // wordmark is flush against grid lines (--g-inset: 0) where the
      // cell has no padding to absorb overshoot.
      const leftInk = m.actualBoundingBoxLeft ?? 0;
      const rightInk = m.actualBoundingBoxRight ?? m.width;
      const inkedWidth = leftInk + Math.max(m.width, rightInk);
      const strokePad = stroke ? strokeWidth / 2 + 1 : 0;
      if (inkedWidth > 0 && ascent + descent > 0) {
        const bottomPad = ascent * 0.06;
        const x = -leftInk - strokePad;
        const w = inkedWidth + strokePad * 2;
        const y = -ascent - strokePad;
        const h = ascent + descent + bottomPad + strokePad * 2;
        setViewBox(`${x} ${y} ${w} ${h}`);
      }
    };

    measure();
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      // Re-measure once the Plus Jakarta webfont is loaded — before this
      // point canvas falls back to a system font and the glyph advances
      // differ.
      document.fonts.ready.then(measure).catch(() => {});
    }
  }, [children, letterSpacing, fontWeight, stroke, strokeWidth]);

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={`block w-full ${className}`}
      role="img"
      aria-label={children}
    >
      <text
        ref={textRef}
        className={textClassName}
        x={0}
        y={0}
        fontSize={200}
        fontWeight={fontWeight}
        fill={fill}
        stroke={stroke}
        strokeWidth={stroke ? strokeWidth : undefined}
        paintOrder="stroke fill"
        style={{
          fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif',
          letterSpacing,
        }}
      >
        {/* When flicker is active, split into per-char tspans so each
            letter can start its flicker on a staggered random delay.
            Otherwise render as a single string so canvas metrics and
            layout stay identical to the pre-flicker behaviour. */}
        {hasFlicker && flickerPlans
          ? Array.from(children).map((ch, i) => (
              <FlickerChar key={`${flickerGen}-${i}`} char={ch} plan={flickerPlans[i]} />
            ))
          : children}
      </text>
    </svg>
  );
}
