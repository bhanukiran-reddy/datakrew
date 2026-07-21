/**
 * JSON-LD structured data for SEO (schema.org).
 * Use in layout or page head for Organization, BreadcrumbList, etc.
 */

import { env, getBaseUrl } from '@/lib/env';
import {
  SCHEMA_AREA_SERVED,
  SCHEMA_BOOK_DEMO_PATH,
  SCHEMA_ORG_DESCRIPTION,
  SCHEMA_ORG_NAME,
  SCHEMA_ORG_SAME_AS,
  SCHEMA_ORG_TELEPHONE,
  SCHEMA_ORG_URL,
  SCHEMA_PUBLISHER_LOGO_URL,
  SCHEMA_SERVICE_TYPE,
  schemaOrganizationId,
  schemaSiteRootUrl,
  schemaWebPageId,
  schemaWebSiteId,
} from './schemaConstants';

export function stripHtmlForSchema(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Build an absolute URL from a site path or pass through full URLs. */
export function toAbsoluteSchemaUrl(pathOrUrl: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

export interface BreadcrumbSchemaItem {
  name: string;
  url?: string;
}

export interface OrganizationInput {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  telephone?: string;
  sameAs?: string[];
}

/**
 * Site-wide Organization schema (root layout). Uses SEO constants; override per field if needed.
 */
export function buildSiteOrganizationJsonLd(
  overrides?: Partial<OrganizationInput>,
): string {
  return buildOrganizationJsonLd({
    name: SCHEMA_ORG_NAME,
    url: env.siteUrl || SCHEMA_ORG_URL,
    logo: SCHEMA_PUBLISHER_LOGO_URL,
    description: SCHEMA_ORG_DESCRIPTION,
    telephone: SCHEMA_ORG_TELEPHONE,
    sameAs: [...SCHEMA_ORG_SAME_AS],
    ...overrides,
  });
}

/**
 * Organization schema for the site (footer/layout).
 */
export function buildOrganizationJsonLd(input: OrganizationInput): string {
  const siteRoot = schemaSiteRootUrl(input.url ?? env.siteUrl ?? SCHEMA_ORG_URL);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': schemaOrganizationId(siteRoot),
    name: input.name,
    url: siteRoot,
    ...(input.logo && { logo: input.logo }),
    ...(input.description && { description: input.description }),
    ...(input.telephone && { telephone: input.telephone }),
    ...(input.sameAs?.length && { sameAs: input.sameAs }),
  };
  return JSON.stringify(data);
}

export interface WebSiteInput {
  name: string;
  url?: string;
}

export interface WebPageJsonLdInput {
  /** Canonical page URL (no hash). Home: https://www.datakrew.com */
  url: string;
  name: string;
  description?: string;
  inLanguage?: string;
  primaryImageUrl?: string;
}

/**
 * WebPage schema — one per page; links to site WebSite + Organization @id graph.
 */
export function buildWebPageJsonLd(input: WebPageJsonLdInput): string {
  const siteRoot = schemaSiteRootUrl(env.siteUrl ?? SCHEMA_ORG_URL);
  const pageUrl = input.url.replace(/\/$/, '') || siteRoot;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': schemaWebPageId(pageUrl),
    url: pageUrl,
    name: stripHtmlForSchema(input.name),
    ...(input.description && { description: stripHtmlForSchema(input.description) }),
    inLanguage: input.inLanguage ?? 'en',
    isPartOf: {
      '@type': 'WebSite',
      '@id': schemaWebSiteId(siteRoot),
      name: SCHEMA_ORG_NAME,
      url: siteRoot,
    },
    about: {
      '@type': 'Organization',
      '@id': schemaOrganizationId(siteRoot),
      name: SCHEMA_ORG_NAME,
      url: siteRoot,
    },
    ...(input.primaryImageUrl && {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: input.primaryImageUrl,
      },
    }),
  };

  return JSON.stringify(data);
}

export function buildSiteWebSiteJsonLd(
  overrides?: Partial<WebSiteInput>,
): string {
  return buildWebSiteJsonLd({
    name: SCHEMA_ORG_NAME,
    url: env.siteUrl || SCHEMA_ORG_URL,
    ...overrides,
  });
}

export interface NavItem {
  name: string;
  url: string;
}

/**
 * WebSite schema — signals to Google that this is a website and supports search.
 * Helps trigger the Sitelinks Search Box in search results.
 */
export function buildWebSiteJsonLd(input: WebSiteInput): string {
  const siteRoot = schemaSiteRootUrl(input.url ?? env.siteUrl ?? SCHEMA_ORG_URL);
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': schemaWebSiteId(siteRoot),
    name: input.name,
    url: siteRoot,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteRoot}/resources/news?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
  return JSON.stringify(data);
}

/**
 * SiteNavigationElement schema — explicitly tells Google the most important pages.
 * This is a strong signal for generating sitelinks in search results.
 */
export function buildSiteNavigationJsonLd(items: NavItem[]): string {
  const itemListElement = items.map((item, index) => ({
    '@type': 'SiteNavigationElement',
    position: index + 1,
    name: item.name,
    url: item.url,
  }));
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement,
  };
  return JSON.stringify(data);
}

/**
 * Breadcrumb schema for a page path (e.g. /fr/about → Home > About).
 * @deprecated Prefer buildBreadcrumbJsonLdFromItems with explicit labels and URLs.
 */
export function buildBreadcrumbJsonLd(path: string): string {
  const baseUrl = env.siteUrl ?? '';
  const segments = path.split('/').filter(Boolean);
  const itemListElement = segments.map((segment, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    item: `${baseUrl}/${segments.slice(0, index + 1).join('/')}`,
  }));
  if (itemListElement.length === 0) {
    itemListElement.push({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl || '/',
    });
  }
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
  return JSON.stringify(data);
}

/** Breadcrumb schema from explicit nav items (matches visible breadcrumbs). */
export function buildBreadcrumbJsonLdFromItems(items: BreadcrumbSchemaItem[]): string {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: stripHtmlForSchema(item.name),
    ...(item.url ? { item: item.url } : {}),
  }));
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
  return JSON.stringify(data);
}

export interface ArticleJsonLdInput {
  headline: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  description?: string;
  image?: string;
  type?: 'Article' | 'NewsArticle';
}

export function buildArticleJsonLd(input: ArticleJsonLdInput): string {
  const siteUrl = env.siteUrl ?? '';
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': input.type ?? 'Article',
    headline: stripHtmlForSchema(input.headline),
    ...(input.description && { description: stripHtmlForSchema(input.description) }),
    ...(input.image && { image: input.image }),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@type': 'Organization',
      name: SCHEMA_ORG_NAME,
      ...(siteUrl && { url: siteUrl }),
    },
    publisher: {
      '@type': 'Organization',
      name: SCHEMA_ORG_NAME,
      logo: {
        '@type': 'ImageObject',
        url: SCHEMA_PUBLISHER_LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
  };
  return JSON.stringify(data);
}

export interface PersonJsonLdInput {
  name: string;
  jobTitle?: string;
  image?: string;
  sameAs?: string;
}

export function buildPersonJsonLd(input: PersonJsonLdInput): string {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: stripHtmlForSchema(input.name),
    ...(input.jobTitle && { jobTitle: stripHtmlForSchema(input.jobTitle) }),
    worksFor: {
      '@type': 'Organization',
      name: SCHEMA_ORG_NAME,
    },
    ...(input.image && { image: input.image }),
    ...(input.sameAs &&
      input.sameAs !== '#' && {
        sameAs: input.sameAs,
      }),
  };
  return JSON.stringify(data);
}

export interface ServiceJsonLdInput {
  name: string;
  url: string;
  description?: string;
  serviceType?: string;
  areaServed?: string;
}

export function buildServiceJsonLd(input: ServiceJsonLdInput): string {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: stripHtmlForSchema(input.name),
    ...(input.description && { description: stripHtmlForSchema(input.description) }),
    provider: {
      '@type': 'Organization',
      name: SCHEMA_ORG_NAME,
    },
    serviceType: input.serviceType ?? SCHEMA_SERVICE_TYPE,
    url: input.url,
    areaServed: input.areaServed ?? SCHEMA_AREA_SERVED,
  };
  return JSON.stringify(data);
}

export interface ProductPropertyValue {
  name: string;
  value: string;
}

export interface ProductJsonLdInput {
  name: string;
  url: string;
  description?: string;
  image?: string;
  additionalProperty?: ProductPropertyValue[];
}

export function buildProductJsonLd(input: ProductJsonLdInput): string {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: stripHtmlForSchema(input.name),
    ...(input.description && { description: stripHtmlForSchema(input.description) }),
    brand: {
      '@type': 'Brand',
      name: SCHEMA_ORG_NAME,
    },
    manufacturer: {
      '@type': 'Organization',
      name: SCHEMA_ORG_NAME,
    },
    ...(input.image && { image: input.image }),
    url: input.url,
    ...(input.additionalProperty?.length && {
      additionalProperty: input.additionalProperty.map((prop) => ({
        '@type': 'PropertyValue',
        name: prop.name,
        value: prop.value,
      })),
    }),
  };
  return JSON.stringify(data);
}

export interface FaqJsonLdItem {
  question: string;
  answer: string;
}

export function buildFaqPageJsonLd(items: FaqJsonLdItem[]): string {
  const mainEntity = items
    .filter((item) => item.question?.trim() && item.answer?.trim())
    .map((item) => ({
      '@type': 'Question',
      name: stripHtmlForSchema(item.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtmlForSchema(item.answer),
      },
    }));

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
  return JSON.stringify(data);
}

export interface SoftwareApplicationJsonLdInput {
  name: string;
  url: string;
  description?: string;
  image?: string;
  applicationCategory?: string;
  applicationSubCategory?: string;
  offersUrl?: string;
  providerUrl?: string;
}

/** Software and AI solution pages — schema.org SoftwareApplication per SEO templates. */
export function buildSoftwareApplicationJsonLd(
  input: SoftwareApplicationJsonLdInput,
): string {
  const baseUrl = getBaseUrl();
  const providerUrl = input.providerUrl ?? baseUrl;
  const offersUrl =
    input.offersUrl ??
    (baseUrl ? `${baseUrl}${SCHEMA_BOOK_DEMO_PATH}` : undefined);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: stripHtmlForSchema(input.name),
    url: input.url,
    ...(input.description && { description: stripHtmlForSchema(input.description) }),
    applicationCategory: input.applicationCategory ?? 'BusinessApplication',
    ...(input.applicationSubCategory && {
      applicationSubCategory: input.applicationSubCategory,
    }),
    operatingSystem: 'Web',
    ...(input.image && { image: input.image }),
    ...(providerUrl && {
      provider: {
        '@type': 'Organization',
        name: SCHEMA_ORG_NAME,
        url: providerUrl,
      },
    }),
    ...(offersUrl && {
      offers: {
        '@type': 'Offer',
        url: offersUrl,
      },
    }),
  };
  return JSON.stringify(data);
}

export interface EventJsonLdInput {
  name: string;
  url: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  image?: string;
  location?: string;
}

export function buildEventJsonLd(input: EventJsonLdInput): string {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: stripHtmlForSchema(input.name),
    url: input.url,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    ...(input.startDate && { startDate: input.startDate }),
    ...(input.endDate && { endDate: input.endDate }),
    ...(input.description && { description: stripHtmlForSchema(input.description) }),
    ...(input.image && { image: input.image }),
    ...(input.location && {
      location: {
        '@type': 'Place',
        name: stripHtmlForSchema(input.location),
      },
    }),
    organizer: {
      '@type': 'Organization',
      name: env.siteName || 'Datakrew',
      ...(env.siteUrl && { url: env.siteUrl }),
    },
  };
  return JSON.stringify(data);
}
