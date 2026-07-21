/**
 * Slug utilities for parsing and building URL paths.
 */

import { getDefaultLocaleSync } from '@/lib/config/locales';

/** Join a slug array into a path string. Returns '' for homepage. */
export function joinSlug(slug?: string[]): string {
    if (!slug || slug.length === 0) return '';
    return slug.join('/');
}

/** Split a path string into a slug array. */
export function splitSlug(path: string): string[] {
    return path.split('/').filter(Boolean);
}

/** Build a full locale-prefixed path (legacy; prefer localizedPath for default-locale-aware URLs). */
export function buildLocalePath(locale: string, slug?: string[]): string {
    const path = joinSlug(slug);
    return localizedPath(locale, path ? `/${path}` : '/');
}

/** True for http(s) or protocol-relative URLs — must not be treated as site paths. */
export function isAbsoluteUrl(path: string): boolean {
    const trimmed = path.trim();
    return /^https?:\/\//i.test(trimmed) || trimmed.startsWith('//');
}

/** Remove the default locale prefix from a path (e.g. /en/careers → /careers). */
export function stripDefaultLocalePrefix(path: string): string {
    const defaultLocale = getDefaultLocaleSync();
    if (!path) return path;
    if (isAbsoluteUrl(path)) return path;
    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (normalized === `/${defaultLocale}`) return '/';
    if (normalized.startsWith(`/${defaultLocale}/`)) {
        return normalized.slice(defaultLocale.length + 1) || '/';
    }
    return normalized;
}

/**
 * Public URL path for a locale. Default locale (en) has no prefix: /careers, not /en/careers.
 */
export function localizedPath(locale: string, path: string): string {
    const defaultLocale = getDefaultLocaleSync();
    if (isAbsoluteUrl(path)) return path;
    const clean = stripDefaultLocalePrefix(path.startsWith('/') ? path : `/${path}`);
    if (locale === defaultLocale) {
        return clean || '/';
    }
    if (clean === '/' || clean === '') {
        return `/${locale}`;
    }
    return `/${locale}${clean}`;
}

/** Remove leading/trailing slashes and normalize. */
export function normalizeSlug(raw: string): string {
    return raw.replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/');
}
