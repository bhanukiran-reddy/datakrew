/**
 * Next.js Proxy (formerly Middleware)
 *
 * Responsibilities:
 * 1. Default locale (e.g. en) must NOT show in the URL — use / and /tech-stack, not /en or /en/tech-stack.
 * 2. Redirect /en and /en/* → / and /* so the default locale is never visible.
 * 3. Rewrite / and /* (when no locale prefix) → /defaultLocale and /defaultLocale/* internally so [locale] route receives the default; URL stays without locale.
 * 4. Non-default locales keep prefix: /fr, /fr/tech-stack (next()).
 * 5. Works without backend: default/supported locales from env (DEFAULT_LOCALE, SUPPORTED_LOCALES) when CMS is not used.
 * 6. Security headers on all responses.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDefaultLocaleSync, getSupportedLocalesSync } from '@/lib/config/locales';
import { computePublicPath, PUBLIC_PATH_HEADER } from '@/lib/seo/publicPath';

const defaultLocale = getDefaultLocaleSync();
const supportedLocales = getSupportedLocalesSync();

/** Security headers applied to every response. */
const securityHeaders = new Headers({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
});

/** Paths that should bypass proxy entirely. */
const PUBLIC_FILE_PATTERN = /\.(.*)$/;
const SKIP_PATHS = ['/_next', '/api', '/favicon.ico'];

function requestHeadersWithPublicPath(request: NextRequest): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PUBLIC_PATH_HEADER, computePublicPath(request.nextUrl.pathname));
  return requestHeaders;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_FILE_PATTERN.test(pathname) ||
    SKIP_PATHS.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // 1) Default locale must not appear in URL: redirect /en and /en/* → / and /*
  if (firstSegment === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = segments.length > 1 ? `/${segments.slice(1).join('/')}` : '/';
    // 301 so crawlers consolidate signals on the canonical URL (default locale has no /en prefix).
    const res = NextResponse.redirect(url, 301);
    securityHeaders.forEach((value, key) => res.headers.set(key, value));
    return res;
  }

  // 2) Path has a non-default locale (e.g. /fr/...) — pass through
  if (firstSegment && supportedLocales.includes(firstSegment)) {
    const response = NextResponse.next({
      request: { headers: requestHeadersWithPublicPath(request) },
    });
    securityHeaders.forEach((value, key) => response.headers.set(key, value));
    return response;
  }

  // 3) No locale in path (/, /tech-stack, /blog, ...) — rewrite to /defaultLocale/... so [locale] route works; URL stays the same
  const rewritePath = pathname === '/' || pathname === '' ? `/${defaultLocale}` : `/${defaultLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
  const rewriteUrl = new URL(rewritePath, request.url);
  const response = NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeadersWithPublicPath(request) },
  });
  securityHeaders.forEach((value, key) => response.headers.set(key, value));
  return response;
}

export default proxy;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
