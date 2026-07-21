import { cache } from "react"
import { attachSeoKeywords, defaultSeo, mapCmsSeo } from '../mapSeo';
import { fetchGraphQL } from "../client"
import { getDefaultLocaleSync } from "../../config/locales"

const GET_INVESTORS_PAGE = /*Graph Ql*/ `
query getInvestorsPage($id: ID!) {
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
    innerPageHeroSection {
      innerpageHeroDescription
      innerpageHeroHeading
      innerpageHeroCTAButtons {
        buttonText
        buttonUrl {
          target
          url
        }
      }
      innerpageHeroImage {
        node {
          mediaItemUrl
        }
      }
      innerpageHeroMobileImage {
        node {
          mediaItemUrl
        }
      }
    }
    textImageStatsSection {
      textImageStatsHeading
      textImageStatsDescription
      textImageStatsMedia {
        node {
          mediaItemUrl
        }
      }
      stats {
        statsDescription
        statsValue
      }
    }
    investorsSection {
      investorSectionHeading
      investorSectionDescription
      investorItems {
        nodes {
          ... on Investor {
            title
            featuredImage {
              node {
                mediaItemUrl
                altText
              }
            }
          }
        }
      }
    }
        featureTabsSection {
      enableFeatureTabsSection
      featureTabsSectionDescription
      featureTabsSectionHeading
      tabs {
        tabLabel
        tabIntro
        tabDescription
        tabImage {
          node {
            altText
            mediaItemUrl
          }
        }
      }
    }
    staggeredGridSection {
      gridSectionHeading
      gridSectionDescription
      gridCTAButton {
        gridButtonText
        gridButtonUrl {
          target
          url
        }
      }
      gridItems {
        gridItemTitle
        gridItemDescription
        gridItemIconImage {
          node {
            mediaItemUrl
          }
        }
      }
    }
    prefooterCtaBannerSection {
      prefooterBannerCtaButtons {
        buttonStyle
        buttonText
        buttonUrl {
          target
          url
        }
      }
      prefooterCtaBackgroundImage {
        node {
          mediaItemUrl
        }
      }
      prefooterCtaBannerDescription
      prefooterCtaBannerHeading
    }
    mediaMentionsSection {
      mmSectionHeading
      mmSectionDescription
      mmSectionCTAButton {
        mmButtonText
        mmButtonUrl
      }
      mediaItems {
        mmItemImage {
          node {
            mediaItemUrl
            altText
          }
        }
        mmItemDate
        mmItemTitle
        mmCtaButton {
          mmButtonURL
          mmButtonText
        }
      }
    }
    seo{
      metaDesc
      title
      canonical
    }
  }
}
`;

export const getInvestorsPage = cache(async (locale: string) => {
  const defaultLocale = getDefaultLocaleSync();
  const id = locale === defaultLocale ? "investors" : `${locale}/investors`;
  const response = await fetchGraphQL<{ page: any }>(GET_INVESTORS_PAGE, { id });
  return attachSeoKeywords(response.page);
});
