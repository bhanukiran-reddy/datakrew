import { cache } from 'react';
import { attachSeoKeywords, defaultSeo, mapCmsSeo } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';

const GET_TERMS_AND_CONDITION_PAGE = /* GraphQL */ `
query getTermsandConditionPage($id: ID!) {
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
    innerPageHeroSection {
      innerpageHeroHeading
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
    termsConditionSection{
      pageContent
    }
  }
}
`;

export type GetTermsAndConditionPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getTermsAndConditionPageUncached(
  locale: string,
  options?: GetTermsAndConditionPageOptions
) {
  const defaultLocale = getDefaultLocaleSync();
  // Using the exact ID from user's query: "teams-and-condition"
  const id = locale === defaultLocale ? 'teams-and-condition' : `${locale}/teams-and-condition`;

  const tags = options?.tags ?? [`page-${locale}-terms-conditions`];
  const revalidate = options?.revalidate;

  try {
    const data = await fetchGraphQL<any>(
      GET_TERMS_AND_CONDITION_PAGE,
      { id },
      { tags, revalidate }
    );

    return data?.page ? attachSeoKeywords(data.page) : null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getTermsAndConditionPage] Error fetching page:', error);
    }
    return null;
  }
}

export const getTermsAndConditionPage = cache(getTermsAndConditionPageUncached);
