/**
 * LazyMotion `features` loader — async chunk so `domAnimation` is not parsed
 * on the critical path with the main framer bundle.
 */
export function loadDomAnimation() {
  return import("framer-motion").then((mod) => mod.domAnimation);
}
