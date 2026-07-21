import { getDefaultLocaleSync, getSupportedLocalesSync } from '@/lib/config/locales';

/** Request header set by proxy with the public URL path (no locale prefix for default locale). */
export const PUBLIC_PATH_HEADER = 'x-public-path';

/**
 * Derive the public site path from a request pathname.
 * Examples: `/` → ``, `/tech-stack` → `tech-stack`, `/fr/about-us` → `about-us`.
 */
export function computePublicPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  const supportedLocales = getSupportedLocalesSync();

  if (first && supportedLocales.includes(first)) {
    return segments.slice(1).join('/');
  }

  return segments.join('/');
}

/** Read the public path from request headers (undefined when not set). */
export function getPublicPathFromHeaders(headersList: Headers): string | undefined {
  const value = headersList.get(PUBLIC_PATH_HEADER);
  if (value === null) return undefined;
  return value;
}

/** Locale segment when present in the URL; otherwise the default locale. */
export function getLocaleFromPathname(pathname: string): string {
  const defaultLocale = getDefaultLocaleSync();
  const supportedLocales = getSupportedLocalesSync();
  const first = pathname.split('/').filter(Boolean)[0];
  if (first && supportedLocales.includes(first)) return first;
  return defaultLocale;
}
