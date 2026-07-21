import { cache } from 'react';
import { attachSeoKeywords, defaultSeo, mapCmsSeo } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';
import type { SEOFields } from '../../types/cms';
import { env } from '../../env';

const GET_INFRASTRUCTURE_ITUS_AUTOSCAN_PAGE = /* GraphQL */ `
query getInfrastructureITUSAutoscanPage($uri: ID!) {
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
      innerpageHeroMobileImage{
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
    faqSection {
      faqSectionHeading
      faqItems {
        question
        answer
      }
    }
    
  }
}
`;

export type GetInfrastructureITUSAutoscanPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getInfrastructureITUSAutoscanPageUncached(
  locale: string,
  slug: string,
  options?: GetInfrastructureITUSAutoscanPageOptions
): Promise<any | null> {
  const defaultLocale = getDefaultLocaleSync();
  const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
  const uri = locale === defaultLocale ? `${cleanSlug}/` : `${locale}/${cleanSlug}/`;

  const tags = options?.tags ?? [`page-${locale}-infrastructure-${slug}`];
  const revalidate = options?.revalidate;

  const data = await fetchGraphQL<any>(
    GET_INFRASTRUCTURE_ITUS_AUTOSCAN_PAGE,
    { uri },
    { tags, revalidate }
  );

  const infrastructure = data?.infrastructure;
  if (!infrastructure) return null;

  const sections: any[] = [];

  if (infrastructure.innerPageHeroSection) {
    sections.push({
      id: 'banner',
      type: 'innerPageBanner',
      data: {
        title: infrastructure.innerPageHeroSection.innerpageHeroHeading || '',
        description: infrastructure.innerPageHeroSection.innerpageHeroDescription || '',
        backgroundImage: {
          url: infrastructure.innerPageHeroSection.innerpageHeroImage?.node?.mediaItemUrl || '',
          width: 1920,
          height: 1080,
          alt: infrastructure.innerPageHeroSection.innerpageHeroImage?.node?.altText || infrastructure.innerPageHeroSection.innerpageHeroHeading || ''
        },
        mobileImage: {
          url: infrastructure.innerPageHeroSection.innerpageHeroMobileImage?.node?.mediaItemUrl || '',
          width: 768,
          height: 1024,
          alt: infrastructure.innerPageHeroSection.innerpageHeroMobileImage?.node?.altText || ''
        },
        breadcrumbItems: [
          { label: 'Home', href: '/' },
          { label: 'Tech Stack', href: '/tech-stack' },
          { label: 'Hardware'},
          { label: infrastructure.title || 'ITUS AutoScan' }
        ],
        ctaButtons: infrastructure.innerPageHeroSection.innerpageHeroCTAButtons?.map((btn: any) => ({
          label: btn.buttonText,
          url: btn.buttonUrl?.url || '#'
        })) || []
      }
    });
  }

  if (infrastructure.secondaryNavSection) {
    sections.push({
      id: 'nav',
      type: 'secondaryNav',
      data: {
        navItems: infrastructure.secondaryNavSection.navItems?.map((n: any) => ({
          label: n.navLabel,
          anchor: n.navAnchor
        })) || []
      }
    });
  }

  if (infrastructure.textImageStatsSection?.enableTextImageStatsSection) {
    sections.push({
      id: 'textImage',
      type: 'textImage',
      data: {
        sectionHeading: infrastructure.textImageStatsSection.textImageStatsHeading,
        sectionDescription: infrastructure.textImageStatsSection.textImageStatsDescription,
        image: {
          url: infrastructure.textImageStatsSection.textImageStatsMedia?.node?.mediaItemUrl || '',
          width: 800,
          height: 600,
          alt: ''
        },
        stats: infrastructure.textImageStatsSection.stats?.map((s: any) => ({
          statsDescription: s.statsDescription,
          statsValue: s.statsValue
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

  if (infrastructure.stepsWithMediaSection?.enableStepsWithMediaSection) {
    const btn = infrastructure.stepsWithMediaSection.stepMediaCtaButton;
    sections.push({
      id: 'installItus',
      type: 'installItus',
      data: {
        title: infrastructure.stepsWithMediaSection.stepsMediaSectionHeading,
        image: {
          url: infrastructure.stepsWithMediaSection.centeredMedia?.node?.mediaItemUrl,
          width: 800,
          height: 600,
          alt: infrastructure.stepsWithMediaSection.centeredMedia?.node?.altText || ''
        },
        steps: infrastructure.stepsWithMediaSection.steps?.map((s: any) => ({
          number: s.stepNumber,
          title: s.stepTitle,
          description: s.stepDescription
        })) || [],
        ctaButtons: (btn && btn.stepMediaButtonText) ? [{
          label: btn.stepMediaButtonText,
          url: btn.stepMediaButtonUrl?.url || '#'
        }] : []
      }
    });
  }

  if (infrastructure.hardwareSpecSection) {
    sections.push({
      id: 'protectedByDesign',
      type: 'protectedByDesign',
      data: {
        title: infrastructure.hardwareSpecSection.hardwareSpecSectionHeading,
        subheading: infrastructure.hardwareSpecSection.hardwareSpecSectionDescription,
        centerImageUrl: infrastructure.hardwareSpecSection.centerImage?.node?.mediaItemUrl,
        specLeftItems: infrastructure.hardwareSpecSection.specLeftItems,
        specRightItems: infrastructure.hardwareSpecSection.specRightItems,
        ctaText: infrastructure.hardwareSpecSection.specCtaButton?.specButtonText,
        ctaHref: infrastructure.hardwareSpecSection.specCtaButton?.specButtonUrl?.url || '#'
      }
    });
  }

  if (infrastructure.ctaBannerSection) {
    const bgNode = infrastructure.ctaBannerSection.ctaBannerBackgroundImage?.node;
    const btn = infrastructure.ctaBannerSection.bannerCtaButtons?.[0];
    sections.push({
      id: 'bgTitleDescription',
      type: 'bgTitleDescription',
      data: {
        title: infrastructure.ctaBannerSection.ctaBannerHeading,
        description: infrastructure.ctaBannerSection.ctaBannerDescription,
        backgroundImage: bgNode ? {
          url: bgNode.mediaItemUrl,
          width: 1920,
          height: 443,
          alt: bgNode.altText || ''
        } : undefined,
        button: btn ? { label: btn.buttonText, url: btn.buttonUrl?.url || '#' } : undefined
      }
    });
  }

  if (infrastructure.testimonialSection) {
    sections.push({
      id: 'testimonial',
      type: 'testimonial',
      data: {
        title: infrastructure.testimonialSection.testimonialHeading,
        testimonials: infrastructure.testimonialSection.testimonialsDetails?.nodes?.map((n: any) => ({
          quote: n.testimonialsFields?.testifierDescription,
          authorName: n.title,
          authorTitle: `${n.testimonialsFields?.testifierDesignation || ""}${n.testimonialsFields?.testifierDesignation && n.testimonialsFields?.testifierCompanyName ? ", " : ""}${n.testimonialsFields?.testifierCompanyName || ""}`,
          image: {
            url: n.testimonialsFields?.testifierImage?.node?.mediaItemUrl,
            width: 100,
            height: 100,
            alt: n.title
          }
        })) || []
      }
    });
  }

  if (infrastructure.caseStudyCarouselSection) {
    sections.push({
      id: 'quantifiedImpact',
      type: 'quantifiedImpact',
      data: {
        title: infrastructure.caseStudyCarouselSection.csCarouselHeading,
        description: infrastructure.caseStudyCarouselSection.csCarouselDescription,
        items: infrastructure.caseStudyCarouselSection.csCarouselItems?.nodes?.map((n: any) => ({
          id: n.id,
          clientName: n.caseStudyCardFields?.csClientName,
          clientTitle: n.caseStudyCardFields?.csClientTitle,
          description: n.caseStudyCardFields?.csDescription,
          ctaText: n.caseStudyCardFields?.csCtaText,
          featuredImage: n.featuredImage?.node?.mediaItemUrl,
          clientPhoto: n.caseStudyCardFields?.csClientPhoto?.node?.mediaItemUrl,
          metrics: n.caseStudyCardFields?.csKeyMetrics?.map((m: any) => ({
            label: m.csMetricLabel,
            value: m.csMetricValue
          }))
        })) || []
      }
    });
  }

  if (infrastructure.faqSection) {
    sections.push({
      id: 'faq',
      type: 'faq',
      data: {
        faqSectionHeading: infrastructure.faqSection.faqSectionHeading,
        faqItems: infrastructure.faqSection.faqItems
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

  return {
    id: infrastructure.id,
    title: infrastructure.title,
    slug: infrastructure.slug,
    locale,
    pageTemplate: 'itus_autoscan',
    seo: mapCmsSeo(infrastructure.seo, infrastructure.title, infrastructure.seoKeywords),
    sections,
    infrastructure
  };
}

export const getInfrastructureITUSAutoscanPage = cache(getInfrastructureITUSAutoscanPageUncached);
