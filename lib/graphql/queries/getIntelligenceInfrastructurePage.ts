/**
 * Tech Stack (formerly Intelligence Infrastructure) page — GraphQL query and section mapping.
 * Fetches the page via page(id: $id, idType: URI) and maps ACF sections
 * to CMSPage/sections for the template.
 */

import { cache } from 'react';
import { mapCmsSeo, type RawCmsSeoKeywords } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';
import type { CMSPage, CMSSection, SEOFields } from '../../types/cms';
import { env } from '../../env';

/* ------------------------------------------------------------------ */
/*  Query — matches CMS Tech Stack page ACF                          */
/* ------------------------------------------------------------------ */

const GET_INTELLIGENCE_INFRASTRUCTURE_PAGE = /* GraphQL */ `
  query getIntelligenceInfrastructurePage {
    page(id: "intelligence-infrastructure", idType: URI) {
      seo {
        title
        metaDesc
        canonical
      }
    seoKeywords {
      primaryKeywords
      secondaryKeywords
    }
      uri
      title
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
          }
        }
        innerpageHeroMobileImage {
          node {
            mediaItemUrl
          }
        }
      }
      infrastructureDetailsSection {
        infrastructureSectionHeading
        infrastructureSectionDescription
        infrastructureItems {
          itemTabIconClass
          itemTabTitle {
            nodes {
              ... on InfrastructureCategory {
                id
                name
                uri
              }
            }
          }
          itemTabContent {
            nodes {
              ... on Infrastructure {
                id
                title
                uri
                featuredImage {
                  node {
                    mediaItemUrl
                  }
                }
                productFeatures {
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
      }
      imagePlusTextSection {
        imageTextHeading
        imageTextDescription
        imageTextLayout
        imageTextMedia {
          node {
            mediaItemUrl
          }
        }
      }
      featuresCardSection {
        featuresCardHeading
        featuresCardDescription
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
      }
      ctaBannerSection {
        ctaBannerHeading
        ctaBannerDescription
        bannerCtaButtons {
          buttonStyle
          buttonText
          buttonUrl {
            target
            url
          }
        }
        ctaBannerBackgroundImage {
          node {
            mediaItemUrl
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

/* ------------------------------------------------------------------ */
/*  Response type                                                      */
/* ------------------------------------------------------------------ */

interface IntelligenceInfrastructurePageResponse {
  page: {
    id?: string;
    uri?: string | null;
    title?: string | null;
    seo?: {
      title?: string | null;
      metaDesc?: string | null;
      canonical?: string | null;
    } | null;
    seoKeywords?: RawCmsSeoKeywords;
    innerPageHeroSection?: {
      innerpageHeroHeading?: string;
      innerpageHeroDescription?: string;
      innerpageHeroCTAButtons?: Array<{ buttonText?: string; buttonUrl?: { url?: string; target?: string } }>;
      innerpageHeroImage?: { node?: { mediaItemUrl?: string } };
      innerpageHeroMobileImage?: { node?: { mediaItemUrl?: string } };
    } | null;
    infrastructureDetailsSection?: Record<string, unknown> | null;
    imagePlusTextSection?: {
      imageTextHeading?: string;
      imageTextDescription?: string;
      imageTextLayout?: string;
      imageTextMedia?: { node?: { mediaItemUrl?: string } };
    } | null;
    featuresCardSection?: Record<string, unknown> | null;
    ctaBannerSection?: Record<string, unknown> | null;
    testimonialSection?: Record<string, unknown> | null;
    caseStudyCarouselSection?: Record<string, unknown> | null;
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
    } | null;
    intelligenceFaqSection?: Record<string, unknown> | null;
    faqSection?: Record<string, unknown> | null;
    prefooterCtaBannerSection?: Record<string, unknown> | null;
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

/* ------------------------------------------------------------------ */
/*  Map API response → CMSPage sections (display order)                */
/* ------------------------------------------------------------------ */

function buildSectionsFromResponse(
  page: NonNullable<IntelligenceInfrastructurePageResponse['page']>,
  oemItems?: IntelligenceInfrastructurePageResponse['oemItems']
): CMSSection[] {
  const sections: CMSSection[] = [];

  // Hero (InnerPageBanner)
  const hero = page.innerPageHeroSection;
  if (hero && (hero.innerpageHeroHeading || hero.innerpageHeroDescription || (hero.innerpageHeroCTAButtons?.length ?? 0) > 0)) {
    const ctaButtons = (hero.innerpageHeroCTAButtons ?? [])
      .filter((b) => b?.buttonText)
      .map((b) => ({
        label: b.buttonText ?? '',
        url: b.buttonUrl?.url ?? '#',
      }));
    const heroImageUrl = hero.innerpageHeroImage?.node?.mediaItemUrl;
    const heroMobileImageUrl = hero.innerpageHeroMobileImage?.node?.mediaItemUrl;
    sections.push({
      id: 'ii-hero',
      type: 'hero',
      data: {
        title: hero.innerpageHeroHeading ?? '',
        subtitle: hero.innerpageHeroDescription ?? '',
        description: hero.innerpageHeroDescription ?? '',
        ctaButtons,
        ...(heroImageUrl ? { backgroundImage: { url: heroImageUrl, alt: '', width: 1920, height: 1080 } } : {}),
        ...(heroMobileImageUrl ? { mobileImage: { url: heroMobileImageUrl, alt: '', width: 768, height: 1024 } } : {}),
      },
    });
  }

  // Infrastructure details → productStack (itemTabContent is now a connection with nodes)
  const infra = page.infrastructureDetailsSection as {
    infrastructureSectionHeading?: string;
    infrastructureSectionDescription?: string;
    infrastructureItems?: Array<{
      itemTabIconClass?: string;
      itemTabTitle?: { nodes?: Array<{ name?: string; id?: string; uri?: string }> };
      itemTabContent?: {
        nodes?: Array<{
          id?: string;
          title?: string;
          uri?: string;
          featuredImage?: { node?: { mediaItemUrl?: string } };
            productFeatures?: {
              featureDescription?: string;
              featuresList?: Array<{ featureText?: string }>;
              featureCtaText?: string;
              featureCtaUrl?: string;
            };
        }>;
      } | null;
    }>;
  } | undefined;
  if (infra?.infrastructureItems?.length) {
    const tabs = (infra.infrastructureItems ?? []).map((item) => {
      const tabTitle = item.itemTabTitle?.nodes?.[0]?.name ?? '';
      const contentNodes = item.itemTabContent?.nodes ?? [];
      const products = contentNodes.map((node) => {
        const pf = node.productFeatures;
        return {
          name: node.title ?? '',
          description: pf?.featureDescription ?? '',
          image: node.featuredImage?.node?.mediaItemUrl,
          features: (pf?.featuresList ?? [])
            .map((f) => f.featureText ?? '')
            .filter((t) => t.length > 0),
          ctaText: pf?.featureCtaText ?? undefined,
          ctaHref: pf?.featureCtaUrl ?? node.uri ?? undefined,
        };
      });
      return {
        title: tabTitle,
        iconClass: item.itemTabIconClass ?? undefined,
        products,
      };
    });
    sections.push({
      id: 'ii-productStack',
      type: 'productStack',
      data: {
        title: infra.infrastructureSectionHeading ?? undefined,
        description: infra.infrastructureSectionDescription ?? undefined,
        variant: 'cards',
        tabs,
      },
    });
  }

  // Image + text → vehicleInsight
  const imageText = page.imagePlusTextSection;
  if (imageText && (imageText.imageTextHeading || imageText.imageTextDescription || imageText.imageTextMedia?.node?.mediaItemUrl)) {
    sections.push({
      id: 'ii-vehicleInsight',
      type: 'vehicleInsight',
      data: {
        title: imageText.imageTextHeading ?? undefined,
        description: imageText.imageTextDescription ?? undefined,
        layout: imageText.imageTextLayout ?? undefined,
        image: imageText.imageTextMedia?.node?.mediaItemUrl
          ? { url: imageText.imageTextMedia.node.mediaItemUrl }
          : undefined,
      },
    });
  }

  // Features cards → operationalCertainty
  const features = page.featuresCardSection as {
    featuresCardHeading?: string;
    featuresCardDescription?: string;
    featureCardCta?: { featureCardCTAText?: string; featureCardCTAURL?: { url?: string; target?: string } };
    featureCards?: Array<{
      featureCardIconClass?: string;
      featureCardTitle?: string;
      featureCardDescription?: string;
      featureCardIconImage?: {
        node?: {
          mediaItemUrl?: string;
          altText?: string;
        };
      };
    }>;
  } | undefined;
  if (features?.featureCards?.length) {
    const cards = (features.featureCards ?? []).map((c) => ({
      title: c.featureCardTitle ?? '',
      description: c.featureCardDescription ?? '',
      iconClass: c.featureCardIconClass ?? undefined,
      iconImage: c.featureCardIconImage?.node?.mediaItemUrl ?? undefined,
      iconAlt: c.featureCardIconImage?.node?.altText ?? undefined,
    }));
    sections.push({
      id: 'ii-operationalCertainty',
      type: 'operationalCertainty',
      data: {
        title: features.featuresCardHeading ?? undefined,
        description: features.featuresCardDescription ?? undefined,
        cards,
        ctaText: features.featureCardCta?.featureCardCTAText ?? undefined,
        ctaHref: features.featureCardCta?.featureCardCTAURL?.url ?? undefined,
      },
    });
  }

  // OEM ecosystem → partners
  const oemConf = page.oemCompatibilitySection;
  const oemNodes = oemItems?.nodes;

  if (oemNodes && oemNodes.length > 0) {
    const partners = oemNodes.map((n) => ({
      name: n.title ?? '',
      image: n.oemEcosystemAdditionalFields?.logoTransparent?.node?.mediaItemUrl ?? '',
    }));
    sections.push({
      id: 'ii-partners',
      type: 'partners',
      data: {
        title: oemConf?.oemSectionHeading ?? undefined,
        description: oemConf?.oemSectionDescription ?? undefined,
        partners,
      },
    });
  }

  // Testimonial
  const testimonial = page.testimonialSection as {
    testimonialHeading?: string;
    testimonialsDetails?: {
      nodes?: Array<{
        id?: string;
        title?: string;
        uri?: string;
        testimonialsFields?: {
          testifierCompanyName?: string;
          testifierDescription?: string;
          testifierDesignation?: string;
          testifierImage?: { node?: { mediaItemUrl?: string } };
        };
      }>;
    };
  } | undefined;
  if (testimonial?.testimonialsDetails?.nodes?.length) {
    const testimonials = (testimonial.testimonialsDetails.nodes ?? []).map((n) => {
      const f = n?.testimonialsFields;
      return {
        quote: f?.testifierDescription ?? '',
        authorName: n?.title ?? f?.testifierCompanyName ?? '',
        authorTitle: `${f?.testifierDesignation || ""}${f?.testifierDesignation && f?.testifierCompanyName ? ", " : ""}${f?.testifierCompanyName || ""}`,
        image: {
          url: f?.testifierImage?.node?.mediaItemUrl ?? '',
          alt: n?.title ?? '',
        },
      };
    });
    sections.push({
      id: 'ii-testimonial',
      type: 'testimonial',
      data: {
        title: testimonial.testimonialHeading ?? undefined,
        testimonials,
      },
    });
  }

  // Case Study Carousel → quantifiedImpact
  const caseStudy = page.caseStudyCarouselSection as any;
  if (caseStudy && (caseStudy.csCarouselHeading || (caseStudy.csCarouselItems?.nodes?.length ?? 0) > 0)) {
    sections.push({
      id: 'ii-quantifiedImpact',
      type: 'quantifiedImpact',
      data: {
        csCarouselHeading: caseStudy.csCarouselHeading ?? undefined,
        csCarouselDescription: caseStudy.csCarouselDescription ?? undefined,
        csCarouselItems: caseStudy.csCarouselItems ?? undefined,
      },
    });
  }

  // Feature Tabs -> fleetAgents
  const featureTabs = page.featureTabsSection;
  if (featureTabs && featureTabs.enableFeatureTabsSection) {
    sections.push({
      id: 'ii-fleetAgents',
      type: 'fleetAgents',
      data: {
        title: featureTabs.featureTabsSectionHeading ?? undefined,
        subheading: featureTabs.featureTabsSectionDescription ?? undefined,
        agents: (featureTabs.tabs ?? []).map((tab, idx) => ({
          id: `agent-${idx}`,
          label: tab.tabLabel ?? '',
          tabDescription: tab.tabIntro ?? '',
          description: tab.tabDescription ?? '',
          imageUrl: tab.tabImage?.node?.mediaItemUrl ?? undefined,
        })),
      },
    });
  } else {
    sections.push({
      id: 'ii-fleetAgents',
      type: 'fleetAgents',
      data: {},
    });
  }

  // CTA banner → callToActionBanner (BgTitleDescriptionSection)
  const ctaBanner = page.ctaBannerSection as {
    ctaBannerHeading?: string;
    ctaBannerDescription?: string;
    ctaBannerBackgroundImage?: { node?: { mediaItemUrl?: string } };
    bannerCtaButtons?: Array<{ buttonText?: string; buttonUrl?: { url?: string } }>;
  } | undefined;
  if (ctaBanner && (ctaBanner.ctaBannerHeading || ctaBanner.ctaBannerDescription || (ctaBanner.bannerCtaButtons?.length ?? 0) > 0)) {
    const firstBtn = ctaBanner.bannerCtaButtons?.[0];
    const bgUrl = ctaBanner.ctaBannerBackgroundImage?.node?.mediaItemUrl;
    sections.push({
      id: 'ii-callToActionBanner',
      type: 'callToActionBanner',
      data: {
        title: ctaBanner.ctaBannerHeading ?? '',
        description: ctaBanner.ctaBannerDescription ?? '',
        titleHighlight: undefined,
        backgroundImage: bgUrl ? { url: bgUrl, alt: '', width: 1920, height: 1080 } : undefined,
        button: {
          label: firstBtn?.buttonText ?? '',
          url: firstBtn?.buttonUrl?.url ?? '#',
        },
      },
    });
  }

  // FAQ — prioritize faqSection (repeater) else intelligenceFaqSection (nodes)
  const faqRaw = page.faqSection as any;
  const legacyFaqRaw = page.intelligenceFaqSection as any;

  if (faqRaw || legacyFaqRaw) {
    const title = faqRaw?.faqSectionHeading || legacyFaqRaw?.intelligenceFAQSectionHeading;
    const items = faqRaw?.faqItems?.length
      ? faqRaw.faqItems.map((n: any) => ({
        question: n.question || n.title,
        answer: n.answer || n.content,
      }))
      : legacyFaqRaw?.intelligenceFaqs?.nodes?.map((n: any) => ({
        id: n.id,
        question: n.title,
        answer: n.content,
      })) || [];

    if (items.length > 0 || (title ?? '').trim()) {
      sections.push({
        id: 'ii-faq',
        type: 'faq',
        data: {
          title: title,
          items: items,
        },
      });
    }
  }

  // Prefooter CTA → contactStrip
  const prefooter = page.prefooterCtaBannerSection as {
    prefooterCtaBannerHeading?: string;
    prefooterCtaBannerDescription?: string;
    prefooterCtaBackgroundImage?: { node?: { mediaItemUrl?: string } };
    prefooterBannerCtaButtons?: Array<{ buttonText?: string; buttonUrl?: { url?: string } }>;
  } | undefined;
  if (prefooter && ((prefooter.prefooterBannerCtaButtons?.length ?? 0) > 0 || prefooter.prefooterCtaBannerHeading || prefooter.prefooterCtaBannerDescription)) {
    const ctas = (prefooter.prefooterBannerCtaButtons ?? [])
      .filter((b) => b?.buttonText)
      .map((b) => ({
        text: b.buttonText ?? '',
        url: b.buttonUrl?.url ?? '#',
      }));
    const backgroundImageUrl = prefooter.prefooterCtaBackgroundImage?.node?.mediaItemUrl;
    sections.push({
      id: 'ii-contactStrip',
      type: 'contactStrip',
      data: {
        title: prefooter.prefooterCtaBannerHeading ?? '',
        description: prefooter.prefooterCtaBannerDescription ?? '',
        ctas,
        ...(backgroundImageUrl ? { backgroundImageUrl } : {}),
      },
    });
  }

  return sections;
}

export type GetIntelligenceInfrastructurePageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getIntelligenceInfrastructurePageUncached(
  locale: string,
  options?: GetIntelligenceInfrastructurePageOptions,
): Promise<CMSPage | null> {
  const defaultLocale = getDefaultLocaleSync();
  const id = locale === defaultLocale ? 'tech-stack' : `/${locale}/tech-stack/`;

  const tags = options?.tags ?? [`page-${locale}-tech-stack`];
  const revalidate = options?.revalidate;

  const data = await fetchGraphQL<IntelligenceInfrastructurePageResponse>(
    GET_INTELLIGENCE_INFRASTRUCTURE_PAGE,
    {},
    { tags, revalidate },
  );

  const page = data?.page;
  if (!page) return null;

  const sections = buildSectionsFromResponse(page, data?.oemItems);

  const cmsPage: CMSPage = {
    id: page.id ?? 'intelligence-infrastructure',
    title: page.title ?? 'Tech Stack',
    slug: 'intelligence-infrastructure',
    locale,
    pageTemplate: 'intelligence_infrastructure',
    seo: mapCmsSeo(page.seo, page.title ?? 'Tech Stack', page.seoKeywords),
    sections,
  };

  return cmsPage;
}

export const getIntelligenceInfrastructurePage = cache(getIntelligenceInfrastructurePageUncached);
