import { fetchGraphQL } from '@/lib/graphql/client';
import { withSeoKeywordsOnField } from '../mapSeo';

export const GET_NEWS_OVERVIEW_PAGE = /* GraphQL */ `
query getNewsOverviewPage($first: Int, $after: String) {
  page(id: "news", idType: URI) {
    innerPageHeroSection {
      innerpageHeroCTAButtons {
        buttonText
        buttonUrl {
          target
          url
        }
      }
      innerpageHeroDescription
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
    prefooterCtaBannerSection {
      prefooterBannerCtaButtons {
        buttonText
        buttonUrl {
          target
          url
        }
      }
      prefooterCtaBackgroundImage {
        node {
          mediaItemUrl
          altText
        }
      }
      prefooterCtaBannerDescription
      prefooterCtaBannerHeading
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
  allNews(
    first: $first
    after: $after
    where: {
      orderby: {field: DATE, order: DESC}
      status: PUBLISH
    }
  ) {
    nodes {
      title
      slug
      date
      excerpt
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      newsAdditionalFields {
        isFeaturedNews
        newsPublishedLink
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
  }
}
`;

export interface GetNewsOverviewPageResponse {
  page: {
    innerPageHeroSection: {
      innerpageHeroCTAButtons: Array<{
        buttonText: string;
        buttonUrl: {
          target: string;
          url: string;
        };
      }>;
      innerpageHeroDescription: string;
      innerpageHeroHeading: string;
      innerpageHeroImage: {
        node: {
          mediaItemUrl: string;
          altText: string;
        };
      };
      innerpageHeroMobileImage: {
        node: {
          mediaItemUrl: string;
          altText: string;
        };
      };
    };
    prefooterCtaBannerSection: {
      prefooterBannerCtaButtons: Array<{
        buttonText: string;
        buttonUrl: {
          target: string;
          url: string;
        };
      }>;
      prefooterCtaBackgroundImage: {
        node: {
          mediaItemUrl: string;
          altText: string;
        };
      };
      prefooterCtaBannerDescription: string;
      prefooterCtaBannerHeading: string;
    };
    seo: {
      title: string;
      metaDesc: string;
    };
  };
  allNews: {
    nodes: Array<{
      title: string;
      slug: string;
      date: string;
      excerpt: string;
      featuredImage: {
        node: {
          altText: string;
          mediaItemUrl: string;
        };
      };
      newsAdditionalFields: {
        isFeaturedNews: boolean;
        newsPublishedLink: string;
      };
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      endCursor: string;
      startCursor: string;
    };
  };
}

export async function getNewsOverviewPage(first = 100, after?: string) {
  const data = await fetchGraphQL<GetNewsOverviewPageResponse>(
    GET_NEWS_OVERVIEW_PAGE,
    { first, after }
  );
  return data ? withSeoKeywordsOnField(data, 'page') : data;
}
