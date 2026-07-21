/**
 * CMS data shapes — re-exported from GraphQL Code Generator output.
 * Regenerate schema types with: npm run codegen
 */

import type {
  MediaImage as GqlMediaImage,
  SEO as GqlSEO,
  Section as GqlSection,
  Page as GqlPage,
  NavItem as GqlNavItem,
  Navigation as GqlNavigation,
  Redirect as GqlRedirect,
  SiteSettings as GqlSiteSettings,
} from '@/lib/graphql/generated/schema-types';

/** Image from the CMS media library. */
export type CMSImage = GqlMediaImage;

/** SEO fields provided by the CMS for each page. */
export type SEOFields = GqlSEO & {
  primaryKeywords?: string | null;
  secondaryKeywords?: string | null;
};

/** A single section/block on a CMS page. */
export type CMSSection = GqlSection;

/** A CMS page returned by getPageBySlug. */
export type CMSPage = Omit<GqlPage, 'seo'> & {
  seo: SEOFields;
};

/** Navigation item from the CMS menu. */
export type NavItem = GqlNavItem;

/** Navigation response from the CMS. */
export type Navigation = GqlNavigation;

/** Redirect rule from the CMS. */
export type Redirect = GqlRedirect;

/** Site settings from the CMS. */
export type SiteSettings = GqlSiteSettings;
