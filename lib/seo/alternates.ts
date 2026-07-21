/**
 * SEO: hreflang alternates for multilingual pages.
 * Used in generateMetadata via metadata.alternates.languages so search engines get correct locale URLs.
 */

import type { Metadata } from 'next';
import { getLanguages } from '@/lib/i18n/getLanguages';
import { resolveSlug } from '@/lib/i18n/resolveSlug';

/**
 * Self-referencing hreflang for the canonical URL (current locale + x-default).
 * Next.js renders these as <link rel="alternate" hreflang="..."> in <head>.
 */
export function buildSelfReferencingHreflang(
  canonicalUrl: string,
  locale = 'en',
): NonNullable<Metadata['alternates']> {
  return {
    canonical: canonicalUrl,
    languages: {
      [locale]: canonicalUrl,
      'x-default': canonicalUrl,
    },
  };
}

/**
 * Build Metadata.alternates.languages for the current page across all locales.
 * Call from generateMetadata in [locale]/[[...slug]]/page.tsx when you have the current path.
 *
 * @param currentLocale - Current locale (e.g. from params).
 * @param pathWithoutLocale - Path without leading /locale (e.g. "" or "about").
 * @param baseUrl - Site origin (e.g. process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://yoursite.com').
 */
export async function buildAlternates(
  currentLocale: string,
  pathWithoutLocale: string,
  baseUrl: string,
): Promise<Metadata['alternates']> {
  const languages = await getLanguages();
  const languagesRecord: Record<string, string> = {};

  await Promise.all(
    languages.map(async (lang) => {
      const slug = await resolveSlug(pathWithoutLocale, currentLocale, lang.code);
      const path = slug ? `/${slug}` : '';
      const isDefault = lang.code === 'en';
      const url = `${baseUrl.replace(/\/$/, '')}${isDefault ? '' : `/${lang.code}`}${path}`;
      languagesRecord[lang.code] = url;
    }),
  );

  return { languages: languagesRecord };
}
