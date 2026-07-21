import PageJsonLd from './PageJsonLd';
import { getBaseUrl } from '@/lib/env';
import { buildFaqPageJsonLd, buildProductJsonLd, stripHtmlForSchema } from '@/lib/seo';
import type { FaqJsonLdItem } from '@/lib/seo';
import { PRODUCT_SCHEMA_SPECS } from '@/lib/seo/productSpecs';
import { resolveSchemaPageName } from '@/lib/seo/schemaPageNames';

type ProductPageSchemaProps = {
  /** Site path without leading slash, e.g. tech-stack/hardware/itus-max */
  path: string;
  /** Fallback when path is not in the canonical name map */
  name?: string;
  description?: string;
  image?: string;
  faqItems?: FaqJsonLdItem[];
};

export default function ProductPageSchema({
  path,
  name,
  description,
  image,
  faqItems,
}: ProductPageSchemaProps) {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.replace(/^\//, '');
  const schemaName = resolveSchemaPageName(normalizedPath, name);
  if (!baseUrl || !schemaName) return null;

  const url = `${baseUrl}/${normalizedPath}`;
  const specs = PRODUCT_SCHEMA_SPECS[normalizedPath];

  const schemas = [
    buildProductJsonLd({
      name: stripHtmlForSchema(schemaName),
      description: description ? stripHtmlForSchema(description) : undefined,
      image,
      url,
      additionalProperty: specs,
    }),
    faqItems?.length ? buildFaqPageJsonLd(faqItems) : null,
  ];

  return <PageJsonLd schemas={schemas} />;
}
