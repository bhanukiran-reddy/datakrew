/**
 * Site config: from CMS (getSiteSettings) when available, else env fallbacks.
 * No hardcoded user-facing strings — backend or env only.
 */

import { env } from '@/lib/env';
import { getSiteSettings } from '@/lib/graphql/queries/getSiteSettings';

export interface SiteConfig {
  name: string;
  defaultDescription: string;
  defaultLocale: string;
  titleSeparator: string;
  defaultRevalidate: number;
}

/** Sync fallback for middleware/root layout when CMS is not called. */
export function getSiteConfigFallback(): Omit<SiteConfig, 'defaultRevalidate'> & { defaultRevalidate: number } {
  return {
    name: env.siteName,
    defaultDescription: env.defaultDescription || '',
    defaultLocale: env.defaultLocale,
    titleSeparator: env.titleSeparator,
    defaultRevalidate: 60,
  };
}

/** Load site config from CMS; falls back to env when fetch fails or is skipped. */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const settings = await getSiteSettings();
    const seo = settings.defaultSeo;
    return {
      name: settings.siteName,
      defaultDescription: seo?.description ?? env.defaultDescription,
      defaultLocale: env.defaultLocale,
      titleSeparator: env.titleSeparator,
      defaultRevalidate: 60,
    };
  } catch {
    const fallback = getSiteConfigFallback();
    return { ...fallback };
  }
}

/** @deprecated Use getSiteConfig() or getSiteConfigFallback(). Kept for gradual migration. */
export const siteConfig = {
  get name() {
    return getSiteConfigFallback().name;
  },
  get defaultDescription() {
    return getSiteConfigFallback().defaultDescription;
  },
  get defaultLocale() {
    return getSiteConfigFallback().defaultLocale;
  },
  get titleSeparator() {
    return getSiteConfigFallback().titleSeparator;
  },
  defaultRevalidate: 60,
} as const;
