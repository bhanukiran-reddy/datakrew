/**
 * i18n: resolve the slug for a page in another locale.
 *
 * Used for:
 * - LanguageSwitcher: "Same page in French" → /fr/<resolved-slug>
 * - SEO alternates: hreflang URLs point to the correct slug per locale
 *
 * In WordPress/Polylang (or similar), the same logical page can have different slugs per language
 * (e.g. /en/about-us → /es/sobre-nosotros). The CMS stores translation links.
 *
 * Until your GraphQL API exposes "translated slug for this page in locale X", we return the same slug
 * (i.e. assume identical slugs across locales). When the CMS provides translation links, implement
 * a fetch here and return the translated slug.
 */

/**
 * Returns the path slug for the same logical page in the target locale.
 * @param slug - Current path (e.g. "about-us" or "" for home)
 * @param fromLocale - Current locale (reserved for CMS lookup)
 * @param toLocale - Target locale (reserved for CMS lookup)
 */
export async function resolveSlug(
  slug: string,
  fromLocale: string,
  toLocale: string,
): Promise<string> {
  void fromLocale;
  void toLocale;
  // Same slug for all locales until CMS translation links are available.
  // Example: return (await getTranslatedSlugFromCMS(slug, fromLocale, toLocale)) ?? slug;
  return slug;
}
