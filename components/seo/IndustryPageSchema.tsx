import PageJsonLd from './PageJsonLd';
import { getBaseUrl } from '@/lib/env';
import { buildFaqPageJsonLd, buildServiceJsonLd, stripHtmlForSchema } from '@/lib/seo';
import type { FaqJsonLdItem } from '@/lib/seo';
import { resolveSchemaPageName } from '@/lib/seo/schemaPageNames';

type IndustryPageSchemaProps = {
  /** Industry slug, e.g. transportation-delivery */
  slug: string;
  name?: string;
  description?: string;
  faqItems?: FaqJsonLdItem[];
};

export default function IndustryPageSchema({
  slug,
  name,
  description,
  faqItems,
}: IndustryPageSchemaProps) {
  const baseUrl = getBaseUrl();
  const path = `industry/${slug.replace(/^\//, '')}`;
  const schemaName = resolveSchemaPageName(path, name);
  if (!baseUrl || !schemaName) return null;

  const url = `${baseUrl}/${path}`;
  const schemas = [
    buildServiceJsonLd({
      name: stripHtmlForSchema(schemaName),
      description: description ? stripHtmlForSchema(description) : undefined,
      url,
    }),
    faqItems?.length ? buildFaqPageJsonLd(faqItems) : null,
  ];

  return <PageJsonLd schemas={schemas} />;
}
