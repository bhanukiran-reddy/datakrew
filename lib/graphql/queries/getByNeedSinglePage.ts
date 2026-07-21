import { cache } from 'react';
import { attachSeoKeywords } from '@/lib/graphql/mapSeo';
import { fetchGraphQL } from '@/lib/graphql/client';

export const GET_BY_NEED_SINGLE_PAGE = /* GraphQL */ `
query getByNeedSinglePage($id: ID!, $idType: ByNeedIdType!) {
  byNeed(id: $id, idType: $idType) {
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
    comparisionTableSection {
      ctSectionHeading
      ctSectionDescription
      ctCtaButtons {
        ctButtonText
        ctButtonUrl {
          url
          target
        }
      }
      tableColumnItems {
        columnHeading
        columnValues {
          columnText
        }
      }
    }
    featureTabsSection {
      featureTabsSectionHeading
      featureTabsSectionDescription
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
    statsSection {
      statsHeading
      statsImage {
        node {
          mediaItemUrl
          altText
        }
      }
      statsCTAButton {
        buttonStyle
        buttonUrl {
          target
          url
        }
        buttonText
      }
      metricsDetails {
        metricCellType
        metricNumber
        metricSuffix
        metricLabel
        metricImage {
          node {
            mediaItemUrl
            altText
          }
        }
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
              featuredCardImage {
                node {
                  mediaItemUrl
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
    stepsWithMediaSection {
      enableStepsWithMediaSection
      stepsMediaSectionHeading
      stepsMediaSectionDescription
      stepMediaCtaButton {
        stepMediaButtonText
        stepMediaButtonUrl {
          target
          url
        }
      }
      stepStyle
      stepsLayout
      steps {
        stepNumber
        stepTitle
        stepDescription
      }
      showStepConnector
      centeredMedia {
        node {
          mediaItemUrl
          altText
        }
      }
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
      singleMobileMedia {
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
    caseStudyCarouselSection {
      csCarouselHeading
      csCarouselDescription
      csCarouselItems {
        nodes {
          ... on CaseStudies {
            id
            title
            uri
            featuredImage {
              node {
                mediaItemUrl
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
    prefooterCtaBannerSection {
      prefooterCtaBannerHeading
      prefooterCtaBannerDescription
      prefooterCtaBackgroundImage {
        node {
          mediaItemUrl
          altText
        }
      }
      prefooterBannerCtaButtons {
        buttonStyle
        buttonText
        buttonUrl {
          target
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
}
`;

export const GET_BY_NEED_SLUGS = /* GraphQL */ `
query getByNeedSlugs {
  allByNeed(first: 100) {
    nodes {
      slug
    }
  }
}
`;

interface GetByNeedSlugsResponse {
  allByNeed: {
    nodes: Array<{ slug: string }>;
  };
}

interface GetByNeedSinglePageResponse {
  byNeed: any;
}

async function getByNeedSinglePageUncached(id: string, idType: 'URI' | 'SLUG' = 'URI') {
  try {
    const { byNeed } = await fetchGraphQL<GetByNeedSinglePageResponse>(
      GET_BY_NEED_SINGLE_PAGE,
      { id, idType }
    );
    return byNeed ? attachSeoKeywords(byNeed) : null;
  } catch (error) {
    console.error('Error fetching byNeed page:', error);
    return null;
  }
}

async function getByNeedSlugsUncached() {
  try {
    const { allByNeed } = await fetchGraphQL<GetByNeedSlugsResponse>(
      GET_BY_NEED_SLUGS
    );
    return allByNeed.nodes.map(node => node.slug);
  } catch (error) {
    console.error('Error fetching byNeed slugs:', error);
    return [];
  }
}

export const getByNeedSinglePage = cache(getByNeedSinglePageUncached);
export const getByNeedSlugs = cache(getByNeedSlugsUncached);
