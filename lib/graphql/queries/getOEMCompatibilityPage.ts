import { cache } from "react"
import { attachSeoKeywords } from '../mapSeo';
import { fetchGraphQL } from "../client"
import { getDefaultLocaleSync } from "../../config/locales"

const GET_OEM_COMPATIBILITY_PAGE = /*Graph Ql*/ `
query getOEMCompatibilityPage($id: ID!) {
  page(id: $id, idType: URI) {
    innerPageStatsBanner {
      innerpageStatsHeroHeading
      innerpageStatsHeroDescription
      innerpageStatsHeroImage {
        node {
          mediaItemUrl
        }
      }
      innerpageStatsHeroMobileImage {
        node {
          mediaItemUrl
        }
      }
      bannerStats {
        bannerStatsValue
        bannerStatsDescription
      }
    }
    oemCompatibilitySection {
      oemSectionHeading
      oemSectionDescription
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
  oemItems: allOemEcosystem(
    where: {status: PUBLISH, orderby: {field: TITLE, order: ASC}}
    first: 100
  ) {
    nodes {
      id
      title
      featuredImage {
        node {
          mediaItemUrl
        }
      }
    }
  }
}
`;

export const getOEMCompatibilityPage = cache(async (locale: string) => {
  const defaultLocale = getDefaultLocaleSync();
  const id = locale === defaultLocale ? "oem-compatibility" : `${locale}/oem-compatibility`;
  const response = await fetchGraphQL<{ page: any; oemItems: any }>(GET_OEM_COMPATIBILITY_PAGE, { id });
  return {
    page: response.page,
    oemItems: response.oemItems?.nodes || []
  };
});
