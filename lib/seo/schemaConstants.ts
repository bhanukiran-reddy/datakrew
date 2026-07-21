/** Shared schema.org constants aligned with SEO templates. */
export const SCHEMA_ORG_NAME = 'Datakrew';

export const SCHEMA_ORG_URL = 'https://www.datakrew.com';

export const SCHEMA_PUBLISHER_LOGO_URL =
  'https://api.datakrew.com/wp-content/uploads/2026/02/Datakrew-Horizontal-Logo-1.svg';

export const SCHEMA_ORG_DESCRIPTION =
  'Datakrew delivers EV battery intelligence, fleet analytics, and AI-powered mobility solutions for smarter, safer, and more sustainable fleet operations.';

export const SCHEMA_ORG_TELEPHONE = '+65 3138 7169';

export const SCHEMA_ORG_SAME_AS = [
  'https://www.linkedin.com/company/datakrew/',
] as const;

export const SCHEMA_SERVICE_TYPE = 'Fleet Management Software';

export const SCHEMA_AREA_SERVED = 'Worldwide';

export const SCHEMA_BOOK_DEMO_PATH = '/book-a-demo';

export const SCHEMA_HOME_PRIMARY_IMAGE_URL =
  'https://api.datakrew.com/wp-content/uploads/2026/05/homepage-banner-redesign-1.svg';

export function schemaSiteRootUrl(url?: string): string {
  return (url || SCHEMA_ORG_URL).replace(/\/$/, '');
}

export function schemaOrganizationId(siteRootUrl?: string): string {
  return `${schemaSiteRootUrl(siteRootUrl)}/#organization`;
}

export function schemaWebSiteId(siteRootUrl?: string): string {
  return `${schemaSiteRootUrl(siteRootUrl)}/#website`;
}

export function schemaWebPageId(pageUrl: string): string {
  return `${pageUrl.replace(/\/$/, '')}/#webpage`;
}
