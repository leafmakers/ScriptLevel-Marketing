'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(threshold = 0.1, once = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Latch on first intersection when `once` is true so callers
          // that only want a one-shot reveal animation aren't re-fired
          // by later scroll-into-view events.
          if (once) observer.disconnect();
        } else if (!once) {
          // Toggle mode — reset so the next scroll-into-view re-triggers
          // whatever animation the caller drives off this flag.
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, isVisible };
}
