/**
 * Validated environment variables.
 * Uses Zod for runtime validation and type inference.
 * All user-facing strings are intended to come from the CMS; these are fallbacks.
 */

import { z } from 'zod';

const envSchema = z.object({
  /** GraphQL API URL. Required when making requests; empty at build if not set. */
  NEXT_PUBLIC_GRAPHQL_ENDPOINT: z.string().optional().default(''),

  /** Canonical site URL for metadata, OpenGraph, JSON-LD (e.g. https://example.com). */
  NEXT_PUBLIC_SITE_URL: z.string().optional().default(''),
  NEXT_PUBLIC_SITE_NAME: z.string().optional().default(''),
  NEXT_PUBLIC_DEFAULT_DESCRIPTION: z.string().optional().default(''),
  DEFAULT_LOCALE: z.string().optional().default('en'),
  /** Comma-separated (e.g. "en,fr,es") for middleware/static when CMS locales not used. */
  SUPPORTED_LOCALES: z.string().optional().default('en'),
  TITLE_SEPARATOR: z.string().optional().default('|'),
  NEXT_PUBLIC_ALLOW_ROBOTS: z.string().optional().default('false').transform((v) => v === 'true' || v === '1'),

  /** Comma-separated list of page names to mock (e.g. "home,oxred,itusmax"), or "all" */
  MOCK_PAGES: z.string().optional().default(''),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_DEFAULT_DESCRIPTION: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION,
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE,
  SUPPORTED_LOCALES: process.env.SUPPORTED_LOCALES,
  TITLE_SEPARATOR: process.env.TITLE_SEPARATOR,
  NEXT_PUBLIC_ALLOW_ROBOTS: process.env.NEXT_PUBLIC_ALLOW_ROBOTS,
  MOCK_PAGES: process.env.MOCK_PAGES,
});

if (!parsed.success && process.env.NODE_ENV === 'production') {
  console.error('[env] Invalid environment variables:', parsed.error.flatten());
  throw new Error('Invalid environment variables');
}

const raw = parsed.success ? parsed.data : {
  NEXT_PUBLIC_GRAPHQL_ENDPOINT: '',
  NEXT_PUBLIC_SITE_URL: '',
  NEXT_PUBLIC_SITE_NAME: '',
  NEXT_PUBLIC_DEFAULT_DESCRIPTION: '',
  DEFAULT_LOCALE: 'en',
  SUPPORTED_LOCALES: 'en',
  TITLE_SEPARATOR: '|',
  MOCK_PAGES: '',
  NEXT_PUBLIC_ALLOW_ROBOTS: false as boolean,
};

export const env = {
  graphqlEndpoint: raw.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? '',
  siteUrl: (raw.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '') || undefined,
  siteName: raw.NEXT_PUBLIC_SITE_NAME ?? '',
  defaultDescription: raw.NEXT_PUBLIC_DEFAULT_DESCRIPTION ?? '',
  defaultLocale: raw.DEFAULT_LOCALE ?? 'en',
  supportedLocales: raw.SUPPORTED_LOCALES ?? 'en',
  titleSeparator: raw.TITLE_SEPARATOR ?? '|',
  mockPages: raw.MOCK_PAGES ?? '',
  allowRobots: raw.NEXT_PUBLIC_ALLOW_ROBOTS === true,
} as const;

/** Canonical base URL for the site (metadata, alternates, sitemap). Prefers env.siteUrl, then Vercel. */
export function getBaseUrl(): string {
  if (env.siteUrl) return env.siteUrl;
  if (typeof process.env.VERCEL_URL !== 'undefined' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return '';
}

/** Origin for `<link rel="preconnect">` to the configured GraphQL endpoint. */
export function getGraphqlPreconnectOrigin(): string | undefined {
  const ep = env.graphqlEndpoint;
  if (!ep) return undefined;
  try {
    return new URL(ep).origin;
  } catch {
    return undefined;
  }
}
