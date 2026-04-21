"use client";

import { type ReactNode, useEffect } from "react";
import Lenis from "lenis";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    // Disable browser scroll restoration so reloads always land at the top
    // instead of restoring the last scroll position (which was leaving
    // users parked mid-page inside the fixed Rendering Modes section).
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Cancel any browser-native scroll the tab may have inherited, then
    // start Lenis. Two frames of reset defeat async layout shifts from
    // video/image loads that can nudge the page via scroll anchoring.
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      // Touch left to native iOS/Android momentum. syncTouch interferes
      // with the OS's own scroll inertia and causes visible stutter on
      // iOS Safari, so we don't use it here.
      anchors: true,
    });

    // Belt-and-braces: also tell Lenis to start at the top.
    lenis.scrollTo(0, { immediate: true, force: true });

    // Expose to other components (e.g. the hero dash drag handler) so
    // they can talk to Lenis directly instead of fighting it via
    // window.scrollTo.
    window.__lenis = lenis;

    return () => {
      if (window.__lenis === lenis) delete window.__lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
