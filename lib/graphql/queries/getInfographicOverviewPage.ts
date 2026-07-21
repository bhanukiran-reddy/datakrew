import { fetchGraphQL } from "../client";
import { attachSeoKeywords } from '../mapSeo';
import { cache } from "react";

export const GET_INFOGRAPHIC_OVERVIEW_PAGE = `
query getInfographicOverviewPage($first: Int, $after: String) {
  page(id: "infographics", idType: URI) {
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
  allInfographics(
    first: $first
    after: $after
    where: {orderby: {field: DATE, order: DESC}, status: PUBLISH}
  ) {
    nodes {
      id
      title
      slug
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      infographicsAdditionalFields {
        accessType
        briefDescription
        infographicsFile {
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

export const getInfographicOverviewPage = cache(async (first = 100, after = "") => {
  try {
    const data = await fetchGraphQL<any>(GET_INFOGRAPHIC_OVERVIEW_PAGE, {
      first,
      after,
    });
    return data;
  } catch (error) {
    console.error("Error fetching infographic overview page:", error);
    return null;
  }
});
