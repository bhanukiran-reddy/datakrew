import { getBaseUrl } from '@/lib/env';
import { isAbsoluteUrl, localizedPath } from '@/lib/utils/slugUtils';

/** Strip leading www. for host comparison (datakrew.com vs www.datakrew.com). */
function apexHost(hostname: string): string {
  return hostname.replace(/^www\./i, '');
}

/**
 * Align canonical hostname/protocol with NEXT_PUBLIC_SITE_URL (e.g. force www when env uses www).
 */
export function alignCanonicalToSiteHost(url: string): string {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return url;

  try {
    const canonical = new URL(url);
    const preferred = new URL(baseUrl);
    if (apexHost(canonical.hostname) !== apexHost(preferred.hostname)) {
      return url;
    }
    canonical.protocol = preferred.protocol;
    canonical.hostname = preferred.hostname;
    const normalized = canonical.toString();
    // Home: prefer no trailing slash (matches SEO examples).
    if (canonical.pathname === '/' && !canonical.search && !canonical.hash) {
      return `${canonical.protocol}//${canonical.host}`;
    }
    return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  } catch {
    return url;
  }
}

/**
 * Build an absolute canonical URL from locale + site path (no locale prefix in path arg).
 * Home: pathWithoutLocale = '' → https://www.example.com
 */
export function buildPageCanonicalUrl(
  locale: string,
  pathWithoutLocale = '',
): string | undefined {
  const baseUrl = getBaseUrl();
  if (!baseUrl || !locale) return undefined;

  const normalized = pathWithoutLocale.replace(/^\/+|\/+$/g, '');
  const pathname = localizedPath(locale, normalized ? `/${normalized}` : '/');
  const origin = baseUrl.replace(/\/$/, '');
  if (pathname === '/') return alignCanonicalToSiteHost(origin);
  return alignCanonicalToSiteHost(`${origin}${pathname}`);
}

/**
 * CMS canonical wins when non-empty; otherwise fall back to the page URL.
 * Host is aligned to NEXT_PUBLIC_SITE_URL (www when configured).
 */
export function resolveCanonicalUrl(
  cmsCanonical: string | undefined,
  locale: string | undefined,
  pathWithoutLocale?: string,
): string | undefined {
  const trimmed = cmsCanonical?.trim();
  if (trimmed) {
    let resolved: string;
    if (isAbsoluteUrl(trimmed)) {
      resolved = trimmed;
    } else {
      const baseUrl = getBaseUrl();
      if (baseUrl) {
        const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        resolved = `${baseUrl.replace(/\/$/, '')}${path}`;
      } else {
        resolved = trimmed;
      }
    }
    return alignCanonicalToSiteHost(resolved);
  }

  if (locale !== undefined && pathWithoutLocale !== undefined) {
    return buildPageCanonicalUrl(locale, pathWithoutLocale);
  }

  return undefined;
}
