/**
 * Build Next.js Metadata from CMS SEO fields.
 * Includes OpenGraph, Twitter Card, canonical, and self-referencing hreflang.
 */

import type { Metadata } from 'next';
import type { SEOFields } from '@/lib/types/cms';
import { siteConfig } from '@/lib/config/site';
import { buildSelfReferencingHreflang } from '@/lib/seo/alternates';
import { resolveCanonicalUrl } from '@/lib/seo/canonical';

/** Use CMS/page title as-is; only fall back to site name when empty. */
export function buildTitle(pageTitle?: string): string {
  const trimmed = pageTitle?.trim();
  return trimmed || siteConfig.name;
}

type MetadataFallback = {
  title?: string;
  description?: string;
  /** Site path without locale prefix, e.g. "about-us" or "articles-blogs/my-post". Use '' for home. */
  path?: string;
};

type CmsSeoInput = SEOFields | Record<string, unknown> | null | undefined;

function readSeoString(seo: CmsSeoInput, key: string): string | undefined {
  if (!seo || typeof seo !== 'object') return undefined;
  const value = (seo as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : undefined;
}

/** Split CMS keyword strings (comma or newline separated) into a trimmed list. */
function parseKeywordList(value?: string): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/[,;\n]+/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function buildKeywords(seo?: CmsSeoInput): string[] | undefined {
  const primary = parseKeywordList(readSeoString(seo, 'primaryKeywords'));
  const secondary = parseKeywordList(readSeoString(seo, 'secondaryKeywords'));
  const keywords = [...primary, ...secondary];
  return keywords.length > 0 ? keywords : undefined;
}

/** Convert CMS SEO fields into a Next.js Metadata object. */
export function buildMetadata(
  seo?: CmsSeoInput,
  locale?: string,
  fallback?: MetadataFallback
): Metadata {
  const title = buildTitle(readSeoString(seo, 'title') || fallback?.title);
  const rawDescription =
    readSeoString(seo, 'description') ??
    readSeoString(seo, 'metaDesc') ??
    fallback?.description;
  const description = rawDescription?.trim() || siteConfig.defaultDescription;
  const cmsCanonical =
    readSeoString(seo, 'canonicalUrl') ?? readSeoString(seo, 'canonical');
  const canonical = resolveCanonicalUrl(cmsCanonical, locale, fallback?.path);

  const keywords = buildKeywords(seo);

  const metadata: Metadata = {
    title,
    description,
    ...(keywords && { keywords }),
    robots: {
      index: !(seo as { noIndex?: boolean })?.noIndex,
      follow: !(seo as { noFollow?: boolean })?.noFollow,
    },
  };

  if (canonical) {
    metadata.alternates = buildSelfReferencingHreflang(canonical, locale ?? 'en');
  }

  const ogImage = seo && typeof seo === 'object' ? (seo as Record<string, unknown>).ogImage : undefined;
  const ogImages =
    ogImage &&
    typeof ogImage === 'object' &&
    ogImage !== null &&
    typeof (ogImage as Record<string, unknown>).url === 'string'
      ? [
          {
            url: (ogImage as Record<string, unknown>).url as string,
            width: (ogImage as Record<string, unknown>).width as number | undefined,
            height: (ogImage as Record<string, unknown>).height as number | undefined,
            alt: (ogImage as Record<string, unknown>).alt as string | undefined,
          },
        ]
      : [];

  metadata.openGraph = {
    type: 'website',
    title,
    description,
    locale: locale ?? undefined,
    url: canonical ?? undefined,
    siteName: siteConfig.name,
    ...(ogImages.length > 0 && { images: ogImages }),
  };

  metadata.twitter = {
    card: 'summary_large_image',
    title,
    description,
    ...(ogImages[0]?.url && { images: [ogImages[0].url] }),
  };

  return metadata;
}
