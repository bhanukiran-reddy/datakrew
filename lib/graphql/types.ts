/**
 * GraphQL response types.
 * Maps to the actual responses from the CMS GraphQL schema.
 * Update these when the CMS schema changes.
 */

import type { CMSPage, Navigation, Redirect, SiteSettings } from '@/lib/types/cms';

/** Response shape for getPageBySlug query. */
export interface GetPageBySlugResponse {
    nodeByUri: CMSPage | null;
}

/** Response shape for getNavigation query. */
export interface GetNavigationResponse {
    navigation: Navigation;
}

/** Response shape for getRedirects query. */
export interface GetRedirectsResponse {
    redirects: Redirect[];
}

/** Response shape for getLocales query. */
export interface GetLocalesResponse {
    locales: Array<{ code: string; name: string; isDefault: boolean }>;
}

/** Response shape for getSiteSettings query. */
export interface GetSiteSettingsResponse {
    siteSettings: SiteSettings;
}

/** Footer: logo, newsletter, contact, bottom (copyright, legal, social). */
export interface FooterLogo {
  footerLogoImage?: { node?: { mediaItemUrl?: string } } | null;
  footerLogoLink?: { url?: string } | null;
}

export interface NewsletterSection {
  heading?: string | null;
  description?: string | null;
  formCode?: string | null;
}

export interface ContactSection {
  contactLink?: { menuHeading?: string | null; menuUrl?: string | null } | null;
  officeLocations?: Array<{ officeAddress?: string | null; officeName?: string | null }> | null;
}

export interface LegalLink {
  legalLabel?: string | null;
  legalUrl?: { target?: string | null; url?: string | null; title?: string | null } | null;
}

export interface SocialMediaItem {
  icon?: { node?: { mediaItemUrl?: string | null } } | null;
  url?: string | null;
}

export interface BottomSection {
  copyrightText?: string | null;
  legalLinks?: LegalLink[] | null;
  socialMedia?: SocialMediaItem[] | null;
}

export interface GlobalFooterFields {
  footerLogo?: FooterLogo | null;
  newsletterSection?: NewsletterSection | null;
  contactSection?: ContactSection | null;
  bottomSection?: BottomSection | null;
}

export interface GetFooterResponse {
  globalFooter: {
    globalFooterFields: GlobalFooterFields | null;
  } | null;
}

export interface MenuColumn {
  column?: {
    columnHeading?: string | null;
    columnLinks?: Array<{
      link?: {
        linkText?: string | null;
        linkUrl?: {
          target?: string | null;
          url?: string | null;
        } | null;
        linkImage?: {
          node?: {
            mediaItemUrl?: string | null;
          } | null;
        } | null;
      } | null;
    }> | null;
  } | null;
}

export interface GlobalFooterMegaMenuFields {
  footerLogo?: FooterLogo | null;
  menuColumnsSection?: {
    menuColumns?: MenuColumn[] | null;
  } | null;
  bottomSection?: BottomSection | null;
}

export interface GetFooterMegaMenuResponse {
  globalFooterMegaMenu: {
    globalFooterMegaMenuFields: GlobalFooterMegaMenuFields | null;
  } | null;
}

export interface HeaderLogo {
  headerLogoImage?: { node?: { altText?: string; mediaItemUrl?: string } } | null;
  headerLogoLink?: { url?: string } | null;
}

export interface AnnouncementSection {
  announcementText?: string | null;
  announcementCtaButton?: {
    announcementButtonText?: string | null;
    announcementButtonUrl?: { target?: string | null; url?: string | null } | null;
  } | null;
}

export interface NavLinkNode {
  id?: string;
  slug?: string;
  title?: string;
  uri?: string;
}

export interface FeaturedPanel {
  solPanelEyebrow?: string | null;
  solPanelTitle?: string | null;
  solPanelType?: string | null;
  solPanelDescription?: string | null;
  solPanelCtaText?: string | null;
  solPanelCtaUrl?: { target?: string | null; url?: string | null } | null;
  solPanelThumbnail?: { node?: { mediaItemUrl?: string | null; altText?: string | null } } | null;
  
  techPanelEyebrow?: string | null;
  techPanelTitle?: string | null;
  techPanelCtaText?: string | null;
  techPanelDescription?: string | null;
  techPanelType?: string | null;
  techPanelCtaUrl?: { target?: string | null; url?: string | null } | null;
  techPanelThumbnail?: { node?: { mediaItemUrl?: string | null; altText?: string | null } } | null;

  resPanelTitle?: string | null;
  resPanelType?: string | null;
  resPanelCtaUrl?: { target?: string | null; url?: string | null } | null;
  resPanelCtaText?: string | null;
  resPanelEyebrow?: string | null;
  resPanelThumbnail?: { node?: { mediaItemUrl?: string | null; altText?: string | null } } | null;
  resPanelDescription?: string | null;

  compPanelType?: string | null;
  compPanelTitle?: string | null;
  compPanelCtaUrl?: { target?: string | null; url?: string | null } | null;
  compPanelCtaText?: string | null;
  compPanelEyebrow?: string | null;
  compPanelThumbnail?: { node?: { mediaItemUrl?: string | null; altText?: string | null } } | null;
  compPanelDescription?: string | null;
}

export interface SolutionMenuColumn {
  solColumnHeading?: string | null;
  byNeedColumn?: {
    byNeedHeading?: string | null;
    byNeedLinks?: { nodes?: NavLinkNode[] } | null;
  } | null;
  byIndustryColumn?: {
    byIndustryHeading?: string | null;
    byIndustryLinks?: { nodes?: NavLinkNode[] } | null;
  } | null;
  byCustomerColumn?: {
    byCustomerHeading?: string | null;
    byCustomerLinks?: { nodes?: NavLinkNode[] } | null;
  } | null;
  solFeaturedPanel?: FeaturedPanel | null;
}

export interface TechStackMenuColumn {
  techColumnHeading?: string | null;
  hardwareColumn?: {
    hardwareHeading?: string | null;
    hardwareLinks?: { nodes?: NavLinkNode[] } | null;
  } | null;
  softwareColumn?: {
    softwareHeading?: string | null;
    softwareLinks?: { nodes?: NavLinkNode[] } | null;
  } | null;
  aiSolutionsColumn?: {
    aiSolutionsHeading?: string | null;
    aiSolutionsLinks?: { nodes?: NavLinkNode[] } | null;
  } | null;
  techFeaturedPanel?: FeaturedPanel | null;
  techstackOverviewCta?: OverviewCta[] | null;
}

export interface ResourceLink {
  resourceLinkLabel?: string | null;
  resourceLinkUrl?: { target?: string | null; url?: string | null } | null;
}

export interface CompanyLink {
  companyLinkLabel?: string | null;
  companyLinkUrl?: { target?: string | null; url?: string | null } | null;
}

export interface OverviewCta {
  techstackButtonText?: string | null;
  techstackButtonLink?: { target?: string | null; url?: string | null } | null;
  resourcesButtonText?: string | null;
  resourcesButtonLink?: { target?: string | null; url?: string | null } | null;
}

export interface ResourcesMenuColumn {
  resColumnHeading?: string | null;
  resourcesColumn?: {
    resourcesHeading?: string | null;
    resourcesLinks?: ResourceLink[] | null;
  } | null;
  resFeaturedPanel?: FeaturedPanel | null;
  resourcesOverviewCta?: OverviewCta[] | null;
}

export interface CompanyMenuColumn {
  compColumnHeading?: string | null;
  companyColumn?: {
    companyHeading?: string | null;
    companyLinks?: CompanyLink[] | null;
  } | null;
  compFeaturedPanel?: FeaturedPanel | null;
}

export interface NavItemFields {
  solutionMenuColumn?: SolutionMenuColumn | null;
  techStackMenuColumn?: TechStackMenuColumn | null;
  resourcesMenuColumn?: ResourcesMenuColumn | null;
  companyMenuColumn?: CompanyMenuColumn | null;
}

export interface HeaderCtaButton {
  buttonText?: string | null;
  buttonUrl?: { url?: string | null; target?: string | null } | null;
}

export interface GlobalHeaderMegaMenuFields {
  topBar?: { announcementSection?: AnnouncementSection | null } | null;
  headerLogo?: HeaderLogo | null;
  menuColumnsSection?: { navItems?: NavItemFields[] } | null;
  ctaSection?: {
    ctaButtons?: HeaderCtaButton[] | null;
  } | null;
}

export interface GetHeaderMegaMenuResponse {
  globalHeader: {
    globalHeaderMegaMenuFields: GlobalHeaderMegaMenuFields | null;
  } | null;
}
