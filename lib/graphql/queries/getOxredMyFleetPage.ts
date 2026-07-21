import { cache } from 'react';
import { attachSeoKeywords } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';
import type { SEOFields } from '../../types/cms';
import { env } from '../../env';


const GET_INFRASTRUCTURE_OXRED_MYFLEET_PAGE = /* GraphQL */ `
query getInfrastructureOXREDMyFleetPage($uri: ID!) {
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
        }
      }
      innerpageHeroMobileImage {
        node {
          mediaItemUrl
        }
      }
    }
    secondaryNavSection {
      navItems {
        navAnchor
        navLabel
      }
    }
    textImageStatsSection {
      enableTextImageStatsSection
      textImagePosition
      textImageStatsDescription
      textImageStatsHeading
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
        featureCardTitle
        featureCardIconImage {
          node {
            mediaItemUrl
            altText
          }
        }
      }
      featuresCardDescription
      featuresCardHeading
      featuresCardLayout
    }
    processWithMediaSection {
      enableProcessWithMediaSection
      processMediaCtaButtons {
        procesButtonStyle
        processButtonText
        processButtonUrl {
          target
          url
        }
      }
      processMediaSectionDescription
      processMediaSectionHeading
      processSteps {
        processMedia {
          node {
            mediaItemUrl
          }
        }
        processStepDescription
        processStepNumber
        processStepTitle
        processStepType
      }
      processCenteredImage {
        node {
          altText
          mediaItemUrl
        }
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
    productModulesSection {
      productModulesSectionDescription
      productModulesSectionHeading
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
    testimonialSection {
      testimonialHeading
      testimonialsDetails {
        nodes {
          ... on Testimonials {
            id
            testimonialsFields {
              testifierCompanyName
              testifierDescription
              testifierDesignation
              testifierImage {
                node {
                  mediaItemUrl
                }
              }
            }
            title
            uri
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
    singleMediaSection {
      singleMediaSectionHeading
      singleMediaSectionDescription
      singleMedia {
        node {
          mediaItemUrl
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
          }
        }
        gridItemDescription
        gridItemTitle
        gridLayoutStyle
      }
    }
  }
}
`;

export const getInfrastructureOXREDMyFleetPage = cache(async (locale: string, slug: string) => {
  const defaultLocale = getDefaultLocaleSync();
  const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
  const uri = locale === defaultLocale ? `${cleanSlug}/` : `${locale}/${cleanSlug}/`;

  const response = await fetchGraphQL<{ infrastructure: any }>(
    GET_INFRASTRUCTURE_OXRED_MYFLEET_PAGE,
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

  if (infrastructure.intelligenceStackSection) {
    sections.push({
      id: "completeYourIntelligence",
      type: "completeYourIntelligence",
      data: {
        stackSectionHeader: infrastructure.intelligenceStackSection.stackSectionHeader,
        stackSectionDescription: infrastructure.intelligenceStackSection.stackSectionDescription,
        stackCtaButton: infrastructure.intelligenceStackSection.stackCtaButton,
        stackDetails: infrastructure.intelligenceStackSection.stackDetails,
      },
    });
  }

  return attachSeoKeywords({
    ...infrastructure,
    sections,
    infrastructure
  });
});
