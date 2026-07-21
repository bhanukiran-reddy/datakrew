import { getWebPageSeoForPath } from '@/lib/seo/getWebPageSeoForPath';
import WebPageSchema from './WebPageSchema';

type RouteWebPageSchemaProps = {
  locale: string;
  /** Public path without locale prefix (e.g. `about-us`, `` for home). */
  path: string;
};

/**
 * Per-route WebPage JSON-LD.
 * Takes an explicit path — do not use headers()/connection() here (that forces dynamic SSR and kills ISR).
 */
export default async function RouteWebPageSchema({ locale, path }: RouteWebPageSchemaProps) {
  try {
    const seo = await getWebPageSeoForPath(locale, path);
    if (!seo) return null;

    return (
      <WebPageSchema
        locale={locale}
        path={seo.path}
        name={seo.name}
        description={seo.description}
        primaryImageUrl={seo.primaryImageUrl}
      />
    );
  } catch (err) {
    console.error('[RouteWebPageSchema]', err);
    return null;
  }
}
