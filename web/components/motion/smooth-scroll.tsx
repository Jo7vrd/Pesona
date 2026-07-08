"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    const w = window as typeof window & { __lenis?: Lenis };
    w.__lenis = lenis;
    return () => {
      lenis.destroy();
      delete w.__lenis;
    };
  }, []);

  return null;
}
