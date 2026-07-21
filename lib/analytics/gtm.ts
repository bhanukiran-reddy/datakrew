/** Google Tag Manager container ID for www.datakrew.com */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PF5WKDS4';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push custom events to GTM dataLayer (forms, CTAs, downloads, etc.). */
export function pushToDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}
