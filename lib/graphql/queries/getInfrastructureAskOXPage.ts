import { cache } from 'react';
import { attachSeoKeywords } from '../mapSeo';
import { fetchGraphQL } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';

const GET_INFRASTRUCTURE_ASK_OX_PAGE = /* GraphQL */ `
query getInfrastructureAskOXPage($uri: ID!) {
  infrastructure(id: $uri, idType: URI) {
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
          mediaDetails {
            width
            height
          }
        }
      }
      innerpageHeroMobileImage {
        node {
          mediaItemUrl
          mediaDetails {
            width
            height
          }
        }
      }
    }
    secondaryNavSection {
      navItems {
        navAnchor
        navLabel
      }
    }
    imagePlusTextSection {
      imageTextDescription
      imageTextHeading
      imageTextLayout
      imageTextMedia {
        node {
          altText
          mediaItemUrl
        }
      }
      imageTextCtaButton {
        imageTextButtonText
        imageTextButtonUrl {
          target
          url
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
    centeredCtaBanner {
      centeredBannerHeading
      centeredBannerDescription
      centeredBackgroundImage {
        node {
          mediaItemUrl
        }
      }
      centeredCtaButton {
        centeredButtonLink {
          url
          target
        }
        centeredButtonText
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
      centeredMedia {
        node {
          altText
          mediaItemUrl
        }
      }
    }
    performanceMetricsSection {
      metricsDescription
      metricsHeading
      metricsItems {
        metricDescription
        metricTitle
        metricValue
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
    ctaBannerSection {
      ctaBannerHeading
      ctaBannerDescription
      ctaBannerBackgroundImage {
        node {
          altText
          mediaItemUrl
          mediaDetails {
            width
            height
          }
        }
      }
      bannerCtaButtons {
        buttonStyle
        buttonText
        buttonUrl {
          target
          url
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
    faqSection {
      faqSectionHeading
      faqItems {
        question
        answer
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
    hardwareSpecSection {
      centerImage {
        node {
          altText
          mediaItemUrl
        }
      }
      hardwareSpecSectionDescription
      hardwareSpecSectionHeading
      specLeftItems {
        leftItemDescription
        leftItemTitle
      }
      specRightItems {
        rightItemTitle
        rightItemDescription
      }
      specCtaButton {
        specButtonText
        specButtonUrl {
          target
          url
        }
      }
    }
  }
}
`;

export const getInfrastructureAskOXPage = cache(async (locale: string, slug: string) => {
  const defaultLocale = getDefaultLocaleSync();
  const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
  const uri = locale === defaultLocale ? `${cleanSlug}/` : `${locale}/${cleanSlug}/`;

  const response = await fetchGraphQL<{ infrastructure: any }>(
    GET_INFRASTRUCTURE_ASK_OX_PAGE,
    { uri }
  );
  
  const infrastructure = response.infrastructure;
  if (!infrastructure) return null;

  const sections: any[] = [];
  if (infrastructure.featureTabsSection?.enableFeatureTabsSection) {
    sections.push({
      id: 'fleetAgents',
      type: 'fleetAgents',
      data: {
        title: infrastructure.featureTabsSection.featureTabsSectionHeading,
        subheading: infrastructure.featureTabsSection.featureTabsSectionDescription,
        agents: infrastructure.featureTabsSection.tabs?.map((t: any) => ({
          id: t.tabLabel.toLowerCase().replace(/\s+/g, '-'),
          label: t.tabLabel,
          tabDescription: t.tabIntro,
          description: t.tabDescription,
          imageUrl: t.tabImage?.node?.mediaItemUrl
        })) || []
      }
    });
  }

  return attachSeoKeywords({
    ...infrastructure,
    sections,
    infrastructure
  });
});
