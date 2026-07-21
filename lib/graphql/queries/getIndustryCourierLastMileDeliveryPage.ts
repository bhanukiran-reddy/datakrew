import { cache } from 'react';
import { attachSeoKeywords, defaultSeo, mapCmsSeo } from '../mapSeo';
import { fetchGraphQL } from '../client';

const GET_INDUSTRY_COURIER_LAST_MILE_DELIVERY_PAGE = /* GraphQL */ `
query getIndustryCourierandLastMileDeliveryPage($uri: ID!) {
  industry(id: $uri, idType: URI) {
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
        innerpageHeroHeading
        innerpageHeroDescription
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
            altText
          }
        }
        innerpageHeroMobileImage {
          node {
            mediaItemUrl
            altText
          }
        }
      }
    featuresCardSection {
      featureCardCta {
        featureCardCTAText
        featureCardCTAURL {
          target
          url
        }
      }
      featureCards {
        featureCardDescription
        featureCardIconClass
        featureCardIconImage {
          node {
            mediaItemUrl
            altText
          }
        }
        featureCardTitle
      }
      featuresCardDescription
      featuresCardHeading
      featuresCardLayout
    }
    textImageStatsSection {
      enableTextImageStatsSection
      textImagePosition
      textImageStatsDescription
      textImageStatsHeading
      textImageStatsMedia {
        node {
          mediaItemUrl
          altText
        }
      }
      stats {
        statsDescription
        statsValue
      }
    }
    imagePlusTextSection {
      imageTextHeading
      imageTextDescription
      imageTextMedia {
        node {
          mediaItemUrl
          altText
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
      enableStaggeredGridSection
      gridSectionHeading
      gridSectionDescription
      gridIconPosition
      gridItems {
        gridCellType
        gridIconClass
        gridItemIconImage {
          node {
            mediaItemUrl
            altText
          }
        }
        gridItemDescription
        gridItemTitle
        gridLayoutStyle
      }
    }
    intelligenceStackSection {
      stackSectionHeader
      stackSectionDescription
      stackCtaButton{
        stackButtonText
        stackButtonUrl{
          target
          url
        }
      }
      stackDetails {
        nodes {
          ... on Infrastructure {
            id
            title
            infrastructureCategory {
              nodes {
                name
              }
            }
            productFeatures {
              featuredCardImage{
                node{
                  mediaItemUrl
                  altText
                }
              }
              featureDescription
              featuresList {
                featureText
              }
              featureCtaText
              featureCtaUrl
            }
          }
        }
      }
    }
    caseStudyCarouselSection {
      csCarouselHeading
      csCarouselItems {
        nodes {
          ... on CaseStudies {
            id
            title
            uri
            featuredImage {
              node {
                mediaItemUrl
                altText
              }
            }
            caseStudyCardFields {
              csClientName
              csClientTitle
              csCtaText
              csDescription
              csClientPhoto {
                node {
                  mediaItemUrl
                  altText
                }
              }
              csKeyMetrics {
                csMetricLabel
                csMetricValue
              }
            }
          }
        }
      }
    }
    ctaBannerSection {
      ctaBannerHeading
      ctaBannerDescription
      ctaBannerBackgroundImage {
        node {
          mediaItemUrl
          altText
        }
      }
      bannerCtaButtons {
        buttonText
        buttonUrl {
          target
          url
        }
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
          altText
        }
      }
      prefooterCtaBannerDescription
      prefooterCtaBannerHeading
    }
    singleMediaSection {
      singleMediaSectionHeading
      singleMediaSectionDescription
      singleMedia {
        node {
          mediaItemUrl
          altText
        }
      }
      singleMediaCtaButtons {
        singleMediaButtonText
        singleMediaButtonUrl {
          target
          url
        }
      }
    }
  }
}
`;

export const getIndustryCourierandLastMileDeliveryPage = cache(async (locale: string, uri: string) => {
  const response = await fetchGraphQL<{ industry: any }>(
    GET_INDUSTRY_COURIER_LAST_MILE_DELIVERY_PAGE,
    { uri }
  );
  return response?.industry ? attachSeoKeywords(response.industry) : undefined;
});
