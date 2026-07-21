import type { SEOFields } from '@/lib/types/cms';

/** GraphQL fields for CMS seoKeywords ACF group (sibling of seo). */
export const SEO_KEYWORDS_FIELDS = /* GraphQL */ `
    seoKeywords {
      primaryKeywords
      secondaryKeywords
    }`;

export type RawCmsSeo = {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
} | null | undefined;

export type RawCmsSeoKeywords = {
  primaryKeywords?: string | null;
  secondaryKeywords?: string | null;
} | null | undefined;

export function defaultSeo(title: string): SEOFields {
  return {
    title: title?.trim() || 'Home',
    description: '',
    canonicalUrl: undefined,
    ogImage: undefined,
    noIndex: false,
    noFollow: false,
  };
}

/** Map Yoast seo + optional seoKeywords into CMS SEOFields. */
export function mapCmsSeo(
  seo: RawCmsSeo,
  fallbackTitle: string,
  seoKeywords?: RawCmsSeoKeywords,
): SEOFields {
  const base = seo
    ? {
        title: seo.title ?? fallbackTitle,
        description: seo.metaDesc ?? '',
        canonicalUrl: seo.canonical ?? undefined,
      }
    : defaultSeo(fallbackTitle);

  const primaryKeywords = seoKeywords?.primaryKeywords?.trim() || undefined;
  const secondaryKeywords = seoKeywords?.secondaryKeywords?.trim() || undefined;

  return {
    ...base,
    ...(primaryKeywords && { primaryKeywords }),
    ...(secondaryKeywords && { secondaryKeywords }),
  };
}

/** Attach keyword fields to a raw Yoast seo object for buildMetadata(). */
export function attachSeoKeywords<T extends object>(entity: T): T {
  const record = entity as T & {
    seo?: Record<string, unknown>;
    seoKeywords?: RawCmsSeoKeywords;
  };
  const seoKeywords = record.seoKeywords;
  if (!seoKeywords?.primaryKeywords && !seoKeywords?.secondaryKeywords) {
    return entity;
  }

  const seo = (record.seo && typeof record.seo === 'object' ? record.seo : {}) as Record<
    string,
    unknown
  >;
  const primaryKeywords = seoKeywords.primaryKeywords?.trim();
  const secondaryKeywords = seoKeywords.secondaryKeywords?.trim();

  return {
    ...entity,
    seo: {
      ...seo,
      ...(primaryKeywords && { primaryKeywords }),
      ...(secondaryKeywords && { secondaryKeywords }),
    },
  };
}

/** Attach seo keywords on a nested field without mutating Apollo frozen results. */
export function withSeoKeywordsOnField<T extends object, K extends keyof T>(
  data: T,
  field: K,
): T {
  const value = data[field];
  if (!value || typeof value !== 'object') return data;
  return { ...data, [field]: attachSeoKeywords(value as object) };
}

/** Attach seo keywords on multiple nested fields without mutating Apollo frozen results. */
export function withSeoKeywordsOnFields<T extends object>(
  data: T,
  fields: (keyof T)[],
): T {
  return fields.reduce(
    (acc, field) => withSeoKeywordsOnField(acc, field),
    data,
  );
}
