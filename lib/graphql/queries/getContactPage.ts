/**
 * Contact page — fetches via page(id: $id, idType: URI).
 */
import { cache } from 'react';
import { attachSeoKeywords, defaultSeo } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import type { SEOFields } from '../../types/cms';

const GET_CONTACT_PAGE = /* GraphQL */ `
  query getContactPage($id: ID!) {
    page(id: $id, idType: URI) {
      seo {
        title
        metaDesc
        canonical
      }
    seoKeywords {
      primaryKeywords
      secondaryKeywords
    }
      id
      title
      slug
      uri
      contactBannerSection {
        contactBannerHeading
        # contactBannerDescription
        contactBannerImage {
          node {
            altText
            mediaItemUrl
          }
        }
        contactMobileBannerImage {
          node {
            altText
            mediaItemUrl
          }
        }
        contactInfo {
          infoDetails {
            infoIconClass
            infoText
          }
        }
      }
      contactInformationSection {
        officeLocations {
          googleMapImage {
            node {
              mediaItemUrl
            }
          }
          officeTitle
          officeAddress
        }
        formHeading
        contactForm
        sectionHeading
      }
      prefooterCtaBannerSection {
        prefooterCtaBackgroundImage {
          node {
            mediaItemUrl
          }
        }
        prefooterCtaBannerDescription
        prefooterCtaBannerHeading
      }
    }
  }
`;

export interface ContactBannerSection {
  contactBannerHeading?: string | null;
  contactBannerImage?: {
    node?: {
      mediaItemUrl?: string | null;
      altText?: string | null;
    } | null;
  } | null;
  contactMobileBannerImage?: {
    node?: {
      mediaItemUrl?: string | null;
      altText?: string | null;
    } | null;
  } | null;
  /** API returns array of { infoDetails: { infoIconClass, infoText } } or group with infoDetails array */
  contactInfo?:
  | {
    infoDetails?: Array<{
      infoIconClass?: string | null;
      infoText?: string | null;
    }> | null;
  }
  | Array<{
    infoDetails?: {
      infoIconClass?: string | null;
      infoText?: string | null;
    } | null;
    infoIconClass?: string | null;
    infoText?: string | null;
  }>
  | null;
}

export interface ContactInformationSection {
  officeLocations?: Array<{
    googleMapImage?: {
      node?: { mediaItemUrl?: string | null } | null;
    } | null;
    officeTitle?: string | null;
    officeAddress?: string | null;
  }> | null;
  formHeading?: string | null;
  contactForm?: string | null;
  sectionHeading?: string | null;
}

export interface PrefooterCtaBannerSection {
  prefooterCtaBackgroundImage?: {
    node?: { mediaItemUrl?: string | null } | null;
  } | null;
  prefooterCtaBannerDescription?: string | null;
  prefooterCtaBannerHeading?: string | null;
}

export interface ContactPageData {
  id: string;
  title: string;
  slug: string;
  uri: string;
  contactBannerSection?: ContactBannerSection | null;
  contactInformationSection?: ContactInformationSection | null;
  prefooterCtaBannerSection?: PrefooterCtaBannerSection | null;
  seo?: { title?: string | null; metaDesc?: string | null; canonical?: string | null; } | null;
}

interface GetContactPageResponse {
  page: ContactPageData | null;
}

export type GetContactPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getContactPageUncached(
  id: string = 'contact-us',
  options?: GetContactPageOptions
): Promise<ContactPageData | null> {
  const tags = options?.tags ?? ['contact-page'];
  const revalidate = options?.revalidate;

  try {
    const data = await fetchGraphQL<GetContactPageResponse>(GET_CONTACT_PAGE, { id }, { tags, revalidate });
    return data?.page ? attachSeoKeywords(data.page) : null;
  } catch (error) {
    console.error(`[getContactPage] Failed to fetch contact page:`, error);
    return null;
  }
}

export const getContactPage = cache(getContactPageUncached);

export function getContactPageSeo(page: ContactPageData | null): any {
  if (!page) return defaultSeo('Contact Us');
  return page.seo || defaultSeo(page.title);
}

export const CONTACT_BANNER_FALLBACK_URL =
  'https://dev-datakrew.pantheonsite.io/wp-content/uploads/2026/02/Guardian-AI-Hero-banner-02-19-26-v4-copy.webp';

