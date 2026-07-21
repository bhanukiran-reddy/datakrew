import { fetchGraphQL } from '@/lib/graphql/client';
import { withSeoKeywordsOnField } from '../mapSeo';

export const GET_WHITEPAPERS_OVERVIEW_PAGE = /* GraphQL */ `
query getWhitepapersOverviewPage($first: Int, $after: String) {
  page(id: "whitepapers", idType: URI) {
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
  allWhitepapers(
    first: $first
    after: $after
    where: {orderby: {field: DATE, order: DESC}, status: PUBLISH}
  ) {
    nodes {
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      title
      slug
      whitepaperAdditionalFields {
        accessType
        briefDescription
        whitepaperFile {
          node {
            mediaItemUrl
          }
        }
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

export interface GetWhitepapersOverviewPageResponse {
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
  allWhitepapers: {
    nodes: Array<{
      featuredImage: {
        node: {
          altText: string;
          mediaItemUrl: string;
        };
      };
      title: string;
      slug: string;
      whitepaperAdditionalFields: {
        accessType: string;
        briefDescription: string;
        whitepaperFile: {
          node: {
            mediaItemUrl: string;
          };
        } | null;
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

export async function getWhitepapersOverviewPage(first = 10, after?: string) {
  const data = await fetchGraphQL<GetWhitepapersOverviewPageResponse>(
    GET_WHITEPAPERS_OVERVIEW_PAGE,
    { first, after }
  );
  return data ? withSeoKeywordsOnField(data, 'page') : data;
}
