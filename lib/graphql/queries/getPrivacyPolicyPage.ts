import { cache } from 'react';
import { attachSeoKeywords } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';

const GET_PRIVACY_POLICY_PAGE = /* GraphQL */ `
query getPrivacyPolicyPage($id: ID!) {
  page(id: $id, idType: URI) {
    innerPageHeroSection {
      innerpageHeroHeading
      innerpageHeroDescription
      innerpageHeroImage {
        node {
          mediaItemUrl
          altText
        }
      }
      innerpageHeroMobileImage {
        node {
          altText
          mediaItemUrl
        }
      }
    }
    termsConditionSection {
      pageContent
    }
    seo {
      title
      metaDesc
      canonical
    }
    seoKeywords {
      primaryKeywords
      secondaryKeywords
    }
  }
}
`;

export type GetPrivacyPolicyPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getPrivacyPolicyPageUncached(
  locale: string,
  options?: GetPrivacyPolicyPageOptions
) {
  const defaultLocale = getDefaultLocaleSync();
  const id = locale === defaultLocale ? 'privacy-policy' : `${locale}/privacy-policy`;

  const tags = options?.tags ?? [`page-${locale}-privacy-policy`];
  const revalidate = options?.revalidate;

  try {
    const data = await fetchGraphQL<any>(
      GET_PRIVACY_POLICY_PAGE,
      { id },
      { tags, revalidate }
    );

    return data?.page ? attachSeoKeywords(data.page) : null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getPrivacyPolicyPage] Error fetching page:', error);
    }
    return null;
  }
}

export const getPrivacyPolicyPage = cache(getPrivacyPolicyPageUncached);
