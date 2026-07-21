import PageJsonLd from './PageJsonLd';
import { getBaseUrl } from '@/lib/env';
import {
  buildFaqPageJsonLd,
  buildSoftwareApplicationJsonLd,
  stripHtmlForSchema,
} from '@/lib/seo';
import type { FaqJsonLdItem } from '@/lib/seo';
import { SOFTWARE_APPLICATION_SUBCATEGORIES } from '@/lib/seo/softwareApplicationSpecs';
import { resolveSchemaPageName } from '@/lib/seo/schemaPageNames';

type SoftwareApplicationPageSchemaProps = {
  /** Site path without leading slash, e.g. tech-stack/software/oxred-myfleet */
  path: string;
  /** CMS page title; canonical map takes precedence for known product paths */
  name?: string;
  description?: string;
  image?: string;
  applicationSubCategory?: string;
  faqItems?: FaqJsonLdItem[];
};

export default function SoftwareApplicationPageSchema({
  path,
  name,
  description,
  image,
  applicationSubCategory,
  faqItems,
}: SoftwareApplicationPageSchemaProps) {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.replace(/^\//, '');
  const schemaName = resolveSchemaPageName(normalizedPath, name);
  if (!baseUrl || !schemaName) return null;

  const url = `${baseUrl}/${normalizedPath}`;
  const subCategory =
    applicationSubCategory ?? SOFTWARE_APPLICATION_SUBCATEGORIES[normalizedPath];

  const schemas = [
    buildSoftwareApplicationJsonLd({
      name: stripHtmlForSchema(schemaName),
      description: description ? stripHtmlForSchema(description) : undefined,
      image,
      url,
      applicationSubCategory: subCategory,
    }),
    faqItems?.length ? buildFaqPageJsonLd(faqItems) : null,
  ];

  return <PageJsonLd schemas={schemas} />;
}
