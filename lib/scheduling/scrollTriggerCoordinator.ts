import { ScrollTrigger } from "gsap/ScrollTrigger";

let outerRafId: number | null = null;

/**
 * Coalesces ScrollTrigger.refresh() into a chained double-rAF so work runs
 * after the current frame paints (reduces contention with LCP / hydration).
 */
export function scheduleScrollTriggerRefresh(): void {
  if (typeof window === "undefined") return;
  if (outerRafId != null) return;
  outerRafId = window.requestAnimationFrame(() => {
    outerRafId = null;
    window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  });
}
