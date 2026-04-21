'use client';

import { useEffect, useRef } from 'react';

/**
 * Structural-grid v1.0 visible-line overlay.
 *
 * Lives inside a positioned ancestor (position: relative) and paints
 * a column-track decoration aligned to the shared --g-cols / --g-gap
 * / --g-pad / --g-max tokens.
 *
 * The column count is repopulated via ResizeObserver so the overlay
 * always matches the current breakpoint's --g-cols value without any
 * per-component media queries.
 */
export default function GridOverlay({ className = '' }: { className?: string }) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const paint = () => {
      const cs = getComputedStyle(document.documentElement);
      const raw = cs.getPropertyValue('--g-cols').trim();
      const cols = Math.max(1, parseInt(raw, 10) || 12);

      // Skip work if already the right count
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
