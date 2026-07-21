import { cache } from "react"
import { attachSeoKeywords } from '../mapSeo';
import { fetchGraphQL } from "../client"
import { getDefaultLocaleSync } from "../../config/locales"

const GET_INFRASTRUCTURE_OXRED_LENS_PAGE = /*Graph Ql*/ `
query getInfrastructureOXRELensPage($uri: ID!) {
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
          altText
        }
      }
      stats {
        statsDescription
        statsValue
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
            altText
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
      modulesRightItems {
        modRightItemDescription
        modRightItemIconClass
        modRightItemTitle
      }
      modulesLeftItems {
        modLeftItemDescription
        modLeftItemIconClass
        modLeftItemTitle
      }
      productModulesCenterImage {
        node {
          mediaItemUrl
          altText
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
          altText
          mediaItemUrl
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
                  altText
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

export const getInfrastructureOXRedLensPage = cache(async (locale: string, slug: string) => {
  const defaultLocale = getDefaultLocaleSync();
  const cleanSlug = slug.startsWith("/") ? slug.slice(1) : slug
  const uri = locale === defaultLocale ? `${cleanSlug}/` : `${locale}/${cleanSlug}/`;
  
  const response = await fetchGraphQL<{ infrastructure: any; }>(GET_INFRASTRUCTURE_OXRED_LENS_PAGE, { uri });
  
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