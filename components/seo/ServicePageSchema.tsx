import PageJsonLd from './PageJsonLd';
import { getBaseUrl } from '@/lib/env';
import { buildFaqPageJsonLd, buildServiceJsonLd, stripHtmlForSchema } from '@/lib/seo';
import type { FaqJsonLdItem } from '@/lib/seo';
import { resolveSchemaPageName } from '@/lib/seo/schemaPageNames';

type ServicePageSchemaProps = {
  /** Site path without leading slash, e.g. customer/oem */
  path: string;
  /** CMS page title or short name; canonical map takes precedence when defined */
  name?: string;
  description?: string;
  faqItems?: FaqJsonLdItem[];
};

export default function ServicePageSchema({
  path,
  name,
  description,
  faqItems,
}: ServicePageSchemaProps) {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.replace(/^\//, '');
  const schemaName = resolveSchemaPageName(normalizedPath, name);
  if (!baseUrl || !schemaName) return null;

  const url = `${baseUrl}/${normalizedPath}`;
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
