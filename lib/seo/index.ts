/**
 * SEO entry point: metadata, alternates, JSON-LD.
 */

export { buildPageCanonicalUrl, resolveCanonicalUrl, alignCanonicalToSiteHost } from './canonical';
export {
  buildMetadata,
  buildTitle,
  buildAlternates,
  buildSelfReferencingHreflang,
} from './buildMetadata';
export {
  buildSiteOrganizationJsonLd,
  buildSiteWebSiteJsonLd,
  buildWebPageJsonLd,
  buildWebSiteJsonLd,
  buildSiteNavigationJsonLd,
  buildBreadcrumbJsonLd,
  buildBreadcrumbJsonLdFromItems,
  buildArticleJsonLd,
  buildPersonJsonLd,
  buildServiceJsonLd,
  buildProductJsonLd,
  buildFaqPageJsonLd,
  buildSoftwareApplicationJsonLd,
  buildEventJsonLd,
  stripHtmlForSchema,
  toAbsoluteSchemaUrl,
} from './jsonld';
export type {
  BreadcrumbSchemaItem,
  ArticleJsonLdInput,
  PersonJsonLdInput,
  ServiceJsonLdInput,
  ProductJsonLdInput,
  ProductPropertyValue,
  FaqJsonLdItem,
  SoftwareApplicationJsonLdInput,
  EventJsonLdInput,
  WebPageJsonLdInput,
} from './jsonld';
