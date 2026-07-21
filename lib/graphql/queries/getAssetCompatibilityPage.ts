import { cache } from "react"
import { attachSeoKeywords } from '../mapSeo';
import { fetchGraphQL } from "../client"
import { getDefaultLocaleSync } from "../../config/locales"

const GET_ASSET_COMPATIBILITY_PAGE = /*Graph Ql*/ `
query getAssetCompatibilityPage($id: ID!) {
  page(id: $id, idType: URI) {
    innerPageStatsBanner {
      innerpageStatsHeroHeading
      innerpageStatsHeroDescription
      innerpageStatsHeroImage {
        node {
          mediaItemUrl
          mediaDetails {
            width
            height
          }
        }
      }
      innerpageStatsHeroMobileImage {
        node {
          mediaItemUrl
          mediaDetails {
            width
            height
          }
        }
      }
      bannerStats {
        bannerStatsValue
        bannerStatsDescription
      }
    }
    assetCompatibilitySection {
      assetSectionHeading
      assetSectionDescription
      assetSection {
        assetsSectionTitle
        powertrainsSectionTitle
      }
    }
    faqSection {
      faqSectionHeading
      faqItems {
        question
        answer
      }
    }
    prefooterCtaBannerSection {
      prefooterCtaBannerHeading
      prefooterCtaBannerDescription
      prefooterCtaBackgroundImage {
        node {
          mediaItemUrl
        }
      }
      prefooterBannerCtaButtons {
        buttonText
        buttonUrl {
          url
        }
      }
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
  assetCompatibilityItems: allAssetCompatibility(
    where: {status: PUBLISH}
    first: 50
  ) {
    nodes {
      id
      title
      featuredImage {
        node {
          mediaItemUrl
        }
      }
      assetCategories {
        nodes {
          slug
          name
        }
      }
    }
  }
}
`;

export const getAssetCompatibilityPage = cache(async (locale: string) => {
  const defaultLocale = getDefaultLocaleSync();
  const id = locale === defaultLocale ? "asset-compatibility" : `${locale}/asset-compatibility`;
  const response = await fetchGraphQL<{ page: any; assetCompatibilityItems: any }>(GET_ASSET_COMPATIBILITY_PAGE, { id });
  return {
    page: response.page,
    assetCompatibilityItems: response.assetCompatibilityItems?.nodes || []
  };
});
