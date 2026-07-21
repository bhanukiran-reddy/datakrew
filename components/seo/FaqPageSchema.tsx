import PageJsonLd from './PageJsonLd';
import { buildFaqPageJsonLd } from '@/lib/seo';
import type { FaqJsonLdItem } from '@/lib/seo';

type FaqPageSchemaProps = {
  items: FaqJsonLdItem[];
};

/** FAQPage JSON-LD from CMS FAQ items (SEO template format). */
export default function FaqPageSchema({ items }: FaqPageSchemaProps) {
  if (!items?.length) return null;
  return <PageJsonLd schemas={[buildFaqPageJsonLd(items)]} />;
}
