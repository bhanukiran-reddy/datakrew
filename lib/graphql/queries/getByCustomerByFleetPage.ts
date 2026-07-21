import { cache } from 'react';
import { attachSeoKeywords, defaultSeo, mapCmsSeo, type RawCmsSeoKeywords } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';
import type { CMSPage, CMSSection, SEOFields } from '../../types/cms';
import { env } from '../../env';

const GET_BY_CUSTOMER_BY_FLEET_PAGE = /* GraphQL */ `
query getByCustomerByFleetPage($id: ID!) {
  byCustomer(id: $id, idType: URI) {
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
    performanceMetricsSection {
      metricsHeading
      metricsDescription
      metricsItems {
        metricValue
        metricTitle
        metricDescription
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
    testimonialSection {
      testimonialHeading
      testimonialsDetails {
        nodes {
          ... on Testimonials {
            id
            title
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
    oemCompatibilitySection {
      oemSectionHeading
      oemSectionDescription
    }
  }
  oemItems: allOemEcosystem(where: {status: PUBLISH, orderby: {field: TITLE, order: ASC}}, first: 100) {
    nodes {
      id
      title
      oemEcosystemAdditionalFields {
        logoTransparent {
          node {
            mediaItemUrl
            altText
          }
        }
      }
    }
  }
}
`;

interface ByCustomerResponse {
  byCustomer: {
    id: string;
    title: string;
    slug: string;
    uri: string;
    seo?: {
      title?: string | null;
      metaDesc?: string | null;
      canonical?: string | null;
    } | null;
    seoKeywords?: RawCmsSeoKeywords;
    innerPageHeroSection?: {
      innerpageHeroDescription?: string;
      innerpageHeroHeading?: string;
      innerpageHeroCTAButtons?: Array<{
        buttonText?: string;
        buttonUrl?: {
          target?: string;
          url?: string;
        };
      }>;
      innerpageHeroImage?: {
        node?: {
          mediaItemUrl?: string;
          mediaDetails?: {
            width?: number;
            height?: number;
          };
        };
      };
      innerpageHeroMobileImage?: {
        node?: {
          mediaItemUrl?: string;
          mediaDetails?: {
            width?: number;
            height?: number;
          };
        };
      };
    };
    featuresCardSection?: {
      featureCardCta?: {
        featureCardCTAText?: string;
        featureCardCTAURL?: {
          target?: string;
          url?: string;
        };
      };
      featureCards?: Array<{
        featureCardDescription?: string;
        featureCardIconClass?: string;
        featureCardIconImage?: {
          node?: {
            mediaItemUrl?: string;
            altText?: string;
          };
        };
        featureCardTitle?: string;
      }>;
      featuresCardDescription?: string;
      featuresCardHeading?: string;
      featuresCardLayout?: string[];
    };
    featureTabsSection?: {
      enableFeatureTabsSection?: boolean;
      featureTabsSectionDescription?: string;
      featureTabsSectionHeading?: string;
      tabs?: Array<{
        tabLabel?: string;
        tabIntro?: string;
        tabDescription?: string;
        tabImage?: {
          node?: {
            altText?: string;
            mediaItemUrl?: string;
          };
        };
      }>;
    };
    centeredCtaBanner?: {
      centeredBannerHeading?: string;
      centeredBannerDescription?: string;
      centeredBackgroundImage?: {
        node?: {
          mediaItemUrl?: string;
        };
      };
      centeredCtaButton?: {
        centeredButtonLink?: {
          url?: string;
          target?: string;
        };
        centeredButtonText?: string;
      };
    };
    intelligenceStackSection?: {
      stackSectionHeader?: string;
      stackSectionDescription?: string;
      stackCtaButton?: {
        stackButtonText?: string;
        stackButtonUrl?: {
          target?: string;
          url?: string;
        };
      };
      stackDetails?: {
        nodes?: Array<{
          id: string;
          title: string;
          uri: string;
          infrastructureCategory?: {
            nodes?: Array<{ name: string }>;
          };
          productFeatures?: {
            featuredCardImage?: {
              node?: {
                altText?: string;
                mediaItemUrl?: string;
              };
            };
            featureDescription?: string;
            featuresList?: Array<{ featureText: string }>;
            featureCtaText?: string;
          };
        }>;
      };
    };
    performanceMetricsSection?: {
      metricsHeading?: string;
      metricsDescription?: string;
      metricsItems?: Array<{
        metricValue?: string;
        metricTitle?: string;
        metricDescription?: string;
      }>;
    };
    staggeredGridSection?: {
      enableStaggeredGridSection?: boolean;
      gridSectionHeading?: string;
      gridSectionDescription?: string;
      gridIconPosition?: string;
      gridItems?: Array<{
        gridCellType?: string[];
        gridIconClass?: string;
        gridItemIconImage?: {
          node?: {
            mediaItemUrl?: string;
          };
        };
        gridItemDescription?: string;
        gridItemTitle?: string;
        gridLayoutStyle?: string[];
      }>;
    };
    caseStudyCarouselSection?: {
      csCarouselHeading?: string;
      csCarouselDescription?: string;
      csCarouselItems?: {
        nodes?: Array<{
          id: string;
          featuredImage?: {
            node?: {
              mediaItemUrl?: string;
            };
          };
          caseStudyCardFields?: {
            csClientName?: string;
            csClientTitle?: string;
            csCtaText?: string;
            csDescription?: string;
            csClientPhoto?: {
              node?: {
                mediaItemUrl?: string;
              };
            };
            csKeyMetrics?: Array<{
              csMetricLabel?: string;
              csMetricValue?: string;
            }>;
          };
        }>;
      };
    };
    testimonialSection?: {
      testimonialHeading?: string;
      testimonialsDetails?: {
        nodes?: Array<{
          id: string;
          title: string;
          testimonialsFields?: {
            testifierCompanyName?: string;
            testifierDescription?: string;
            testifierDesignation?: string;
            testifierImage?: {
              node?: {
                mediaItemUrl?: string;
              };
            };
          }
        }>;
      }
    };
    ctaBannerSection?: {
      ctaBannerHeading?: string;
      ctaBannerDescription?: string;
      ctaBannerBackgroundImage?: {
        node?: {
          altText?: string;
          mediaItemUrl?: string;
        };
      };
      bannerCtaButtons?: Array<{
        buttonStyle?: string[];
        buttonText?: string;
        buttonUrl?: {
          target?: string;
          url?: string;
        };
      }>;
    };
    faqSection?: {
      faqSectionHeading?: string;
      faqItems?: Array<{
        question?: string;
        answer?: string;
      }>;
    };
    prefooterCtaBannerSection?: {
      prefooterBannerCtaButtons?: Array<{
        buttonStyle?: string[];
        buttonText?: string;
        buttonUrl?: {
          target?: string;
          url?: string;
        } | null;
      }>;
      prefooterCtaBackgroundImage?: {
        node?: {
          mediaItemUrl?: string;
        };
      };
      prefooterCtaBannerDescription?: string;
      prefooterCtaBannerHeading?: string;
    };
    oemCompatibilitySection?: {
      oemSectionHeading?: string;
      oemSectionDescription?: string;
    } | null;
  } | null;
  oemItems?: {
    nodes?: Array<{
      id: string;
      title: string;
      oemEcosystemAdditionalFields?: {
        logoTransparent?: {
          node?: {
            mediaItemUrl?: string;
            altText?: string;
          };
        };
      } | null;
    }>;
  };
}

function buildSectionsFromResponse(
  data: NonNullable<ByCustomerResponse['byCustomer']>,
  oemItems?: ByCustomerResponse['oemItems']
): CMSSection[] {
  const sections: CMSSection[] = [];

  // Hero
  const hero = data.innerPageHeroSection;
  if (hero) {
    sections.push({
      id: 'hero',
      type: 'innerPageBanner',
      data: {
        title: hero.innerpageHeroHeading ?? '',
        description: hero.innerpageHeroDescription ?? '',
        backgroundImage: hero.innerpageHeroImage?.node?.mediaItemUrl
          ? {
            url: hero.innerpageHeroImage.node.mediaItemUrl,
            alt: '',
            width: hero.innerpageHeroImage.node.mediaDetails?.width || 1920,
            height: hero.innerpageHeroImage.node.mediaDetails?.height || 676
          }
          : undefined,
        mobileImage: hero.innerpageHeroMobileImage?.node?.mediaItemUrl
          ? {
            url: hero.innerpageHeroMobileImage.node.mediaItemUrl,
            alt: '',
            width: hero.innerpageHeroMobileImage.node.mediaDetails?.width || 768,
            height: hero.innerpageHeroMobileImage.node.mediaDetails?.height || 1024
          }
          : undefined,
        breadcrumbItems: [
          { label: 'Home', href: '/' },
          { label: 'Solutions' },
          { label: 'By customer' },
          { label: data.title ?? 'Byfleet' }
        ],
        ctaButtons: hero.innerpageHeroCTAButtons?.map(btn => ({
          label: btn.buttonText ?? '',
          url: btn.buttonUrl?.url ?? '#',
          variant: 'primary'
        })) ?? []
      }
    });
  }

  // Features Card Section -> OperationalCertaintySection
  const features = data.featuresCardSection;
  if (features) {
    // Extract title and highlight from featuresCardHeading (e.g., "Where fleets bleed<span> time and cost</span>")
    const heading = features.featuresCardHeading ?? '';
    let title = heading;
    let titleHighlight = '';

    if (heading.includes('<span>')) {
      const parts = heading.split('<span>');
      title = parts[0].trim();
      titleHighlight = parts[1].replace('</span>', '').trim();
    }

    sections.push({
      id: 'operational-certainty',
      type: 'operationalCertainty',
      data: {
        title: title,
        titleHighlight: titleHighlight,
        description: features.featuresCardDescription,
        ctaText: features.featureCardCta?.featureCardCTAText,
        ctaHref: features.featureCardCta?.featureCardCTAURL?.url,
        cards: features.featureCards?.map(card => ({
          title: card.featureCardTitle,
          description: card.featureCardDescription,
          iconClass: card.featureCardIconClass,
          iconImage: card.featureCardIconImage?.node?.mediaItemUrl,
          iconAlt: card.featureCardIconImage?.node?.altText
        }))
      }
    });
  }

  // Feature Tabs Section -> FleetAgentsSection
  const featureTabs = data.featureTabsSection;
  if (featureTabs && featureTabs.enableFeatureTabsSection) {
    sections.push({
      id: 'fleet-agents',
      type: 'fleetAgents',
      data: {
        title: featureTabs.featureTabsSectionHeading,
        subheading: featureTabs.featureTabsSectionDescription,
        agents: featureTabs.tabs?.map((tab, idx) => ({
          id: `tab-${idx}`,
          label: tab.tabLabel,
          tabDescription: tab.tabIntro,
          description: tab.tabDescription,
          imageUrl: tab.tabImage?.node?.mediaItemUrl
        }))
      }
    });
  }

  // Centered CTA Banner -> BgTitleDescriptionSection (bgTitleDescription2)
  const centeredCta = data.centeredCtaBanner;
  if (centeredCta) {
    sections.push({
      id: 'centered-cta-banner',
      type: 'bgTitleDescription2',
      data: {
        title: centeredCta.centeredBannerHeading,
        description: centeredCta.centeredBannerDescription,
        backgroundImage: centeredCta.centeredBackgroundImage?.node?.mediaItemUrl
          ? { url: centeredCta.centeredBackgroundImage.node.mediaItemUrl, alt: '', width: 1920, height: 600 }
          : undefined,
        button: centeredCta.centeredCtaButton?.centeredButtonText ? {
          label: centeredCta.centeredCtaButton.centeredButtonText,
          url: centeredCta.centeredCtaButton.centeredButtonLink?.url ?? '#'
        } : undefined
      }
    });
  }

  // Intelligence Stack Section -> CompleteYourIntelligence
  const stack = data.intelligenceStackSection;
  if (stack) {
    sections.push({
      id: 'complete-your-intelligence',
      type: 'completeYourIntelligence',
      data: {
        stackSectionHeader: stack.stackSectionHeader,
        stackSectionDescription: stack.stackSectionDescription,
        stackDetails: stack.stackDetails,
        stackCtaButton: stack.stackCtaButton
      }
    });
  }

  // Performance Metrics Section -> OutcomesSection
  const metrics = data.performanceMetricsSection;
  if (metrics) {
    sections.push({
      id: 'performance-metrics',
      type: 'outcomes',
      data: {
        title: metrics.metricsHeading,
        description: metrics.metricsDescription,
        outcomes: metrics.metricsItems?.map(item => ({
          percentage: item.metricValue,
          title: item.metricTitle,
          description: item.metricDescription
        }))
      }
    });
  }

  // Customer Logo Section -> PartnersSection (via global OEM ecosystem)
  const oemNodes = oemItems?.nodes;
  if (oemNodes && oemNodes.length > 0) {
    const oemPartners = oemNodes.map((n) => ({
      name: n.title ?? '',
      image: n.oemEcosystemAdditionalFields?.logoTransparent?.node?.mediaItemUrl ?? '',
    }));
    sections.push({
      id: 'partners',
      type: 'partners',
      data: {
        title: data.oemCompatibilitySection?.oemSectionHeading || 'Compatibility Ecosystem',
        description: data.oemCompatibilitySection?.oemSectionDescription || '',
        partners: oemPartners.filter((p) => p.image),
      },
    });
  }

  // Staggered Grid Section -> UltraSecureDesignSection
  const staggeredGrid = data.staggeredGridSection;
  if (staggeredGrid && staggeredGrid.enableStaggeredGridSection) {
    sections.push({
      id: 'ultra-secure-design',
      type: 'ultraSecureDesign',
      data: {
        title: staggeredGrid.gridSectionHeading,
        subtitle: staggeredGrid.gridSectionDescription,
        columns: 3, // Defaults to 3 for side-by-side layout in grid
        cells: staggeredGrid.gridItems?.map((item, index) => {
          // Even-indexed (2nd, 4th, 6th...) cells are borderless as requested
          const type = (index % 2 !== 0) ? 'borderless-content' : (item.gridLayoutStyle?.includes('bordered') ? 'content' : 'borderless-content');
          return {
            type: type,
            title: item.gridItemTitle,
            description: item.gridItemDescription,
            iconClass: item.gridIconClass,
            icon: item.gridItemIconImage?.node?.mediaItemUrl,
            iconWidth: 47,
            iconHeight: 41
          };
        })
      }
    });
  }

  // Case Study Carousel -> QuantifiedImpactSection
  const caseStudy = data.caseStudyCarouselSection;
  if (caseStudy) {
    sections.push({
      id: 'quantified-impact',
      type: 'quantifiedImpact',
      data: {
        csCarouselHeading: caseStudy.csCarouselHeading,
        csCarouselDescription: caseStudy.csCarouselDescription,
        csCarouselItems: caseStudy.csCarouselItems
      }
    });
  }

  // Testimonial Section
  const testimonial = data.testimonialSection;
  if (testimonial) {
    const heading = testimonial.testimonialHeading ?? '';
    let title = heading;
    let titleHighlight = '';

    if (heading.includes('<span>')) {
      const parts = heading.split('<span>');
      title = parts[0].trim();
      titleHighlight = parts[1].replace('</span>', '').replace('</sapn>', '').trim();
    }

    sections.push({
      id: 'testimonial',
      type: 'testimonial',
      data: {
        title: title,
        titleHighlight: titleHighlight,
        testimonials: testimonial.testimonialsDetails?.nodes?.map(node => ({
          quote: node.testimonialsFields?.testifierDescription,
          authorName: node.title,
          authorTitle: `${node.testimonialsFields?.testifierDesignation}, ${node.testimonialsFields?.testifierCompanyName}`,
          image: { url: node.testimonialsFields?.testifierImage?.node?.mediaItemUrl || '', alt: node.title }
        }))
      }
    });
  }

  // CTA Banner Section -> BgTitleDescriptionSection (bgTitleDescription)
  const ctaBanner = data.ctaBannerSection;
  if (ctaBanner) {
    // Extract title and highlight handling <span> tags if present
    const heading = ctaBanner.ctaBannerHeading ?? '';
    let title = heading;
    let titleHighlight = '';

    if (heading.includes('<span>')) {
      const parts = heading.split('<span>');
      title = parts[0].trim();
      titleHighlight = parts[1].replace('</span>', '').trim();
    }

    sections.push({
      id: 'cta-banner',
      type: 'bgTitleDescription',
      data: {
        title: title,
        titleHighlight: titleHighlight,
        description: ctaBanner.ctaBannerDescription,
        backgroundImage: ctaBanner.ctaBannerBackgroundImage?.node?.mediaItemUrl
          ? {
            url: ctaBanner.ctaBannerBackgroundImage.node.mediaItemUrl,
            alt: ctaBanner.ctaBannerBackgroundImage.node.altText ?? '',
            width: 1920,
            height: 600
          }
          : undefined,
        button: ctaBanner.bannerCtaButtons?.[0] ? {
          label: ctaBanner.bannerCtaButtons[0].buttonText ?? '',
          url: ctaBanner.bannerCtaButtons[0].buttonUrl?.url ?? '#',
          variant: ctaBanner.bannerCtaButtons[0].buttonStyle?.includes('primary-btn') ? 'primary' : 'secondary'
        } : undefined
      }
    });
  }

  // FAQ Section
  const faq = data.faqSection;
  if (faq) {
    sections.push({
      id: 'faq',
      type: 'faq',
      data: {
        title: faq.faqSectionHeading ?? '',
        items: faq.faqItems?.map(item => ({
          question: item.question,
          answer: item.answer
        }))
      }
    });
  }

  // Prefooter CTA Section -> ContactStripSection
  const prefooter = data.prefooterCtaBannerSection;
  if (prefooter) {
    sections.push({
      id: 'contact-strip',
      type: 'contactStrip',
      data: {
        prefooterCtaBannerHeading: prefooter.prefooterCtaBannerHeading,
        prefooterCtaBannerDescription: prefooter.prefooterCtaBannerDescription,
        prefooterCtaBackgroundImage: prefooter.prefooterCtaBackgroundImage,
        prefooterBannerCtaButtons: prefooter.prefooterBannerCtaButtons
      }
    });
  }

  return sections;
}

export type GetByCustomerByFleetPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getByCustomerByFleetPageUncached(
  locale: string,
  slug: string,
  options?: GetByCustomerByFleetPageOptions
): Promise<CMSPage | null> {
  // Use the hardcoded ID from the user's request as the default if slug matches byfleet
  const id = slug.includes('byfleet') ? "customer/fleet-management/" : slug;

  const tags = options?.tags ?? [`customer-${locale}-${slug}`];
  const revalidate = options?.revalidate;

  const data = await fetchGraphQL<ByCustomerResponse>(
    GET_BY_CUSTOMER_BY_FLEET_PAGE,
    { id },
    { tags, revalidate }
  );

  const byCustomer = data?.byCustomer;
  if (!byCustomer) return null;

  const sections = buildSectionsFromResponse(byCustomer, data?.oemItems);

  const cmsPage = {
    id: byCustomer.id,
    title: byCustomer.title,
    slug: byCustomer.slug,
    locale,
    pageTemplate: 'customer_single',
    seo: mapCmsSeo(byCustomer.seo, byCustomer.title, byCustomer.seoKeywords),
    sections,
    byCustomer,
  };

  return cmsPage as any;
}

export const getByCustomerByFleetPage = cache(getByCustomerByFleetPageUncached);
