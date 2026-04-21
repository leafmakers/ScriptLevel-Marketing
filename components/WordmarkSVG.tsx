'use client';

import { type CSSProperties, useEffect, useRef, useState } from 'react';

type WordmarkSVGProps = {
  children: string;
  fontFamily?: string;
  fontWeight?: number | string;
  letterSpacing?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  flicker?: boolean;
  className?: string;
  textClassName?: string;
};

type FlickerPlan = { delay: number; duration: number };

/**
 * Build clustered flicker plans — 70% singletons, 22% pairs, 8% triples.
 * Mimics real neon where 2–3 adjacent letters share a transformer and
 * flicker together, rather than every letter being independent.
 */
function buildFlickerPlans(count: number, seed = 0): FlickerPlan[] {
  let s = seed || 1;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const plans: FlickerPlan[] = new Array(count);
  let i = 0;
  while (i < count) {
    const roll = rnd();
    const desired = roll < 0.7 ? 1 : roll < 0.92 ? 2 : 3;
    const size = Math.min(desired, count - i);
    const plan: FlickerPlan = {
      delay: +(rnd() * 1.4).toFixed(2),
      duration: +(1.8 + rnd() * 0.8).toFixed(2),
    };
    for (let k = 0; k < size; k++) plans[i + k] = plan;
    i += size;
  }
  return plans;
}

/**
 * Convert a CSS length string ("-0.04em", "-8px", etc.) to pixels at a
 * given font-size. Returns 0 for unrecognized input.
 */
function cssLengthToPx(value: string | undefined, fontSizePx: number): number {
  if (!value) return 0;
  const m = value.trim().match(/^(-?[\d.]+)(em|px|rem)?$/);
  if (!m) return 0;
  const num = parseFloat(m[1]);
  const unit = m[2] || 'px';
  if (unit === 'em' || unit === 'rem') return num * fontSizePx;
  return num;
}

/**
 * WordmarkSVG — auto-fit viewBox SVG wordmark with optional flicker.
 *
 * The viewBox is sized to the **true inked bounding box** of the text,
 * not the pen-advance width. This matters when the SVG is placed flush
 * against structural grid lines (no cell padding): any viewBox overshoot
 * clips ink; any undershoot leaves visible whitespace.
 *
 * Four rules encoded here (see grid-system docs for full explanation):
 *
 *   1. Never size a text viewBox from `measureText().width` alone.
 *      `width` is the pen-advance — round glyphs (o, e, g) and italics
 *      bulge past it. Use `leftInk + max(width, rightInk)` for a true
 *      inked width. Vertical uses `ascent + descent + padding`.
 *
 *   2. If stroking, pad the viewBox by `strokeWidth / 2 + 1` on every
 *      side. `paint-order: stroke fill` centers the stroke on the path,
 *      so half sits outside the fill outline. `measureText()` doesn't
 *      know about stroke. +1 covers subpixel rounding.
 *
 *   3. Set `ctx.letterSpacing` before measuring. Canvas 2D's default
 *      `measureText()` ignores CSS `letter-spacing`, so negative
 *      tracking on the SVG side would leave the viewBox ~wider than
 *      the rendered text — the wordmark would sit inset inside the SVG
 *      frame even though the SVG fills the cell.
 *
 *   4. Re-measure after `document.fonts.ready`. First measurement uses
 *      whatever font is resolved NOW (usually a system fallback). Once
 *      the real webfont loads, metrics differ slightly — measure again.
 *      Stroke props belong in the effect's dependency array so a later
 *      prop change re-triggers measurement.
 */
export default function WordmarkSVG({
  children,
  fontFamily = 'var(--font-plus-jakarta), system-ui, sans-serif',
  fontWeight = 900,
  letterSpacing = '-0.04em',
  fill = 'var(--wordmark-red-fill-rest)',
  stroke = 'var(--wordmark-red-stroke-rest)',
  strokeWidth = 2,
  flicker = false,
  className = '',
  textClassName = '',
}: WordmarkSVGProps) {
  const canvasFontSize = 200;
  const [viewBox, setViewBox] = useState('0 0 1200 240');
  const [flickerGen, setFlickerGen] = useState(0);
  const flickerGenRef = useRef(0);
  const text = children;

  useEffect(() => {
    const measure = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Resolve actual font family via DOM probe so canvas + SVG agree
      // on which font is measured (avoids fallback-font drift).
      const probe = document.createElement('span');
      probe.style.cssText = `position:absolute;visibility:hidden;font:${fontWeight} ${canvasFontSize}px ${fontFamily};letter-spacing:${letterSpacing};white-space:pre;`;
      probe.textContent = text;
      document.body.appendChild(probe);
      const resolvedFamily = getComputedStyle(probe).fontFamily;
      document.body.removeChild(probe);

      ctx.font = `${fontWeight} ${canvasFontSize}px ${resolvedFamily}`;
      // Rule 3 — mirror SVG's letter-spacing on the canvas so measured
      // advance matches what SVG will actually paint. Convert em→px.
      try {
        const spacingPx = cssLengthToPx(letterSpacing, canvasFontSize);
        // Canvas letterSpacing accepts CSS <length> strings; set only
        // if non-zero and the API exists. Wrapped in try/catch for
        // older engines that throw on unknown property.
        if (spacingPx !== 0 && 'letterSpacing' in ctx) {
          (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${spacingPx}px`;
        }
      } catch {
        /* older engines — fall back to untracked measurement */
      }

      const m = ctx.measureText(text);
      const leftInk = m.actualBoundingBoxLeft ?? 0;
      const rightInk = m.actualBoundingBoxRight ?? m.width;
      const ascent = m.actualBoundingBoxAscent ?? canvasFontSize * 0.8;
      const descent = m.actualBoundingBoxDescent ?? canvasFontSize * 0.2;

      // Rule 1 — use the true RIGHT-INK edge, not the pen advance. Advance
      // includes trailing space after the last glyph (so "scriptlevel" gets
      // empty padding on the right). rightInk IS where paint stops; for
      // glyphs that overshoot past advance (round bowls, italic terminals),
      // rightInk is already larger than width. Either way, rightInk wins.
      const inkedWidth = leftInk + rightInk;

      // Rule 2 — stroke sits half outside the path; +1 px subpixel buffer.
      const strokePad = stroke ? strokeWidth / 2 + 1 : 0;

      // Subpixel descender overshoot at large font sizes (~6% of ascent)
      const bottomPad = ascent * 0.06;

      const x = -leftInk - strokePad;
      const w = inkedWidth + strokePad * 2;
      const y = -ascent - strokePad;
      const h = ascent + descent + bottomPad + strokePad * 2;
      setViewBox(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
    };

    measure();
    // Rule 4 — first measurement uses whatever font is resolved now;
    // re-measure after the real webfont loads (metrics differ).
    if ('fonts' in document) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [text, fontFamily, fontWeight, letterSpacing, stroke, strokeWidth]);

  // Remount tspans on scroll re-entry so flicker restarts cleanly
  useEffect(() => {
    if (!flicker) return;
    flickerGenRef.current += 1;
    setFlickerGen(flickerGenRef.current);
  }, [flicker]);

  const plans = flicker ? buildFlickerPlans(text.length, flickerGen + 1) : [];

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      className={className}
      aria-label={text}
      role="img"
    >
      <text
        x="0"
        y="0"
        className={textClassName}
        style={
          {
            fontFamily,
            fontWeight,
            fontSize: canvasFontSize,
            letterSpacing,
            fill,
            stroke,
            strokeWidth: stroke ? strokeWidth : 0,
            paintOrder: 'stroke fill',
            // Optical letter-pair adjustment via font kerning table
            fontKerning: 'normal',
            fontFeatureSettings: '"kern" 1, "calt" 1, "liga" 1',
            textRendering: 'geometricPrecision',
          } as CSSProperties
        }
      >
        {flicker
          ? Array.from(text).map((ch, i) => {
              const p = plans[i];
              const charStyle: CSSProperties = {
                animationName: 'wordmark-flicker',
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                animationTimingFunction: 'steps(1, end)',
                animationIterationCount: 'infinite',
              };
              return (
                <tspan
                  key={`${flickerGen}-${i}`}
                  className="wordmark-flicker"
                  style={charStyle}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </tspan>
              );
            })
          : text}
      </text>
    </svg>
  );
}
