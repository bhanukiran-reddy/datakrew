import PageJsonLd from './PageJsonLd';
import { buildPageCanonicalUrl } from '@/lib/seo/canonical';
import { buildWebPageJsonLd } from '@/lib/seo';

type WebPageSchemaProps = {
  /** Site path without locale, e.g. "" for home or "about-us". */
  path?: string;
  locale?: string;
  name?: string;
  description?: string;
  primaryImageUrl?: string;
};

/** Per-page WebPage JSON-LD linked to site WebSite + Organization graph. */
export default function WebPageSchema({
  path = '',
  locale = 'en',
  name,
  description,
  primaryImageUrl,
}: WebPageSchemaProps) {
  if (!name?.trim()) return null;

  const normalizedPath = path.replace(/^\/+|\/+$/g, '');
  const pageUrl = buildPageCanonicalUrl(locale, normalizedPath);
  if (!pageUrl) return null;

  return (
    <PageJsonLd
      schemas={[
        buildWebPageJsonLd({
          url: pageUrl,
          name: name.trim(),
          description: description?.trim() || undefined,
          inLanguage: locale,
          primaryImageUrl,
        }),
      ]}
    />
  );
}
