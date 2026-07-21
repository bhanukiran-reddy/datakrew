/**
 * i18n: locale list for routing and LanguageSwitcher.
 * From CMS only (getLocales) — no hardcoded display names.
 */

import { getLocales } from '@/lib/graphql/queries/getLocales';
import { getSupportedLocalesSync, getDefaultLocaleSync } from '@/lib/config/locales';

export interface Language {
  code: string;
  name: string;
  isDefault: boolean;
}

/**
 * Get all supported languages from the CMS (code, name, isDefault).
 * Falls back to env-driven list (code only, name = code) when CMS is unavailable.
 */
export async function getLanguages(): Promise<Language[]> {
  try {
    const list = await getLocales();
    const defaultCode = getDefaultLocaleSync();
    return list.map((item) => ({
      code: item.code,
      name: item.name,
      isDefault: item.isDefault ?? item.code === defaultCode,
    }));
  } catch {
    const codes = getSupportedLocalesSync();
    const defaultCode = getDefaultLocaleSync();
    return codes.map((code) => ({
      code,
      name: code,
      isDefault: code === defaultCode,
    }));
  }
}

/** Sync fallback for when async getLanguages is not available (e.g. middleware). */
export function getDefaultLocale(): string {
  return getDefaultLocaleSync();
}
