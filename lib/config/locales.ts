/**
 * Locales: from CMS (getLocales) at runtime; sync fallback from env for middleware.
 * No hardcoded locale list — backend or env only.
 */

import { env } from '@/lib/env';

function getSupportedLocalesFromEnv(): string[] {
  return env.supportedLocales.split(',').map((s) => s.trim()).filter(Boolean);
}

/** Sync list for middleware and static params when CMS is not used. */
export function getSupportedLocalesSync(): string[] {
  const list = getSupportedLocalesFromEnv();
  return list.length > 0 ? list : [env.defaultLocale];
}

/** Default locale (from env when CMS not used). */
export function getDefaultLocaleSync(): string {
  return env.defaultLocale;
}

export const defaultLocale = env.defaultLocale;

/** Locales array for backward compatibility; prefer getSupportedLocalesSync() or getLocales() from GraphQL. */
export const locales = getSupportedLocalesSync() as readonly string[];

export type Locale = string;

/** Type guard: checks if a string is a supported locale. */
export function isValidLocale(value: string, allowed?: string[]): boolean {
  const list = allowed ?? getSupportedLocalesSync();
  return list.includes(value);
}
