import { cache } from 'react';
import { attachSeoKeywords } from '../mapSeo';
import { fetchGraphQL } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';

const GET_INFRASTRUCTURE_OXRED_AUTOCERT_PAGE = /* GraphQL */ `
query getInfrastructureOXREDAutoCertPage($uri: ID!) {
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
          }
        }
        processStepDescription
        processStepNumber
        processStepTitle
        processStepType
      }
      processCenteredImage {
        node {
          mediaItemUrl
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
    secondaryNavSection {
      navItems {
        navAnchor
        navLabel
      }
    }
  }
}
`;

export const getInfrastructureOXREDAutoCertPage = cache(async (locale: string, slug: string) => {
  const defaultLocale = getDefaultLocaleSync();
  const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
  const uri = locale === defaultLocale ? `${cleanSlug}/` : `${locale}/${cleanSlug}/`;

  const response = await fetchGraphQL<{ infrastructure: any }>(
    GET_INFRASTRUCTURE_OXRED_AUTOCERT_PAGE,
    { uri }
  );

  const infrastructure = response.infrastructure;
  if (!infrastructure) return null;

  // Add a section mapping to stay consistent with other page queries
  // This helps when the page template expects page.sections
  const sections: any[] = [];

  if (infrastructure.innerPageHeroSection) {
    sections.push({
      id: 'banner',
      type: 'innerPageBanner',
      data: {
        title: infrastructure.innerPageHeroSection.innerpageHeroHeading,
        description: infrastructure.innerPageHeroSection.innerpageHeroDescription,
        backgroundImage: {
          url: infrastructure.innerPageHeroSection.innerpageHeroImage?.node?.mediaItemUrl,
          alt: infrastructure.innerPageHeroSection.innerpageHeroImage?.node?.altText || ''
        },
        mobileImage: infrastructure.innerPageHeroSection.innerpageHeroMobileImage?.node?.mediaItemUrl ? {
          url: infrastructure.innerPageHeroSection.innerpageHeroMobileImage.node.mediaItemUrl,
          alt: infrastructure.innerPageHeroSection.innerpageHeroMobileImage.node.altText || ''
        } : undefined,
        ctaButtons: infrastructure.innerPageHeroSection.innerpageHeroCTAButtons?.map((btn: any) => ({
          label: btn.buttonText,
          url: btn.buttonUrl?.url || '#'
        })) || []
      }
    });
  }

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
      id: 'completeYourIntelligence',
      type: 'completeYourIntelligence',
      data: {
        stackSectionHeader: infrastructure.intelligenceStackSection.stackSectionHeader,
        stackSectionDescription: infrastructure.intelligenceStackSection.stackSectionDescription,
        stackCtaButton: infrastructure.intelligenceStackSection.stackCtaButton,
        stackDetails: infrastructure.intelligenceStackSection.stackDetails
      }
    });
  }

  return attachSeoKeywords({
    ...infrastructure,
    sections,
    infrastructure // Keep a nested copy for pages that expect it
  });
});
