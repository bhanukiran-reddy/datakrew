import { cache } from 'react';
import { attachSeoKeywords, defaultSeo, mapCmsSeo } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';
import type { CMSPage, CMSSection, SEOFields } from '../../types/cms';
import { env } from '../../env';

const GET_BY_CUSTOMER_OEM_PAGE = /* GraphQL */ `
query getByCustomerOEMPage($id: ID!) {
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
    singleMediaSection {
      singleMediaSectionHeading
      singleMediaSectionDescription
       singleVideo{
        node{
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
    engagementModelSection {
      engagementSectionHeading
      engagementSectionDescription
      modelItems {
        modelHeading
        modelDescription
      }
      modelCtaButton {
        modelButtonText
        modelButtonUrl {
          target
          url
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

export type GetByCustomerOEMPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getByCustomerOEMPageUncached(
  locale: string,
  slug: string,
  options?: GetByCustomerOEMPageOptions
): Promise<any | null> {
  const defaultLocale = getDefaultLocaleSync();
  // For local development or mixed environments, slug might be just 'customer/oem/'
  const cleanSlugWithoutSlashes = slug.replace(/^\/+|\/+$/g, '');
  const uri = locale === defaultLocale ? `/${cleanSlugWithoutSlashes}/` : `/${locale}/${cleanSlugWithoutSlashes}/`;

  const tags = options?.tags ?? [`page-${locale}-oem-${slug}`];
  const revalidate = options?.revalidate;

  const queryData = await fetchGraphQL<any>(
    GET_BY_CUSTOMER_OEM_PAGE,
    { id: uri },
    { tags, revalidate }
  );

  const data = queryData?.byCustomer;
  const oemItems = queryData?.oemItems;
  if (!data) return null;

  const sections: CMSSection[] = [];

  // Map innerPageHeroSection to innerPageBanner
  if (data.innerPageHeroSection) {
    sections.push({
      id: 'banner',
      type: 'innerPageBanner',
      data: {
        title: data.innerPageHeroSection.innerpageHeroHeading || '',
        description: data.innerPageHeroSection.innerpageHeroDescription || '',
        breadcrumbItems: [
          { label: 'Home', href: '/' },
          { label: 'Solutions' },
          { label: 'By customer' },
          { label: 'OEM', href: '/customer/oem' }
        ],
        backgroundImage: {
          url: data.innerPageHeroSection.innerpageHeroImage?.node?.mediaItemUrl || '',
          alt: data.innerPageHeroSection.innerpageHeroImage?.node?.altText || '',
          width: 1920,
          height: 1080
        },
        mobileImage: data.innerPageHeroSection.innerpageHeroMobileImage?.node?.mediaItemUrl ? {
          url: data.innerPageHeroSection.innerpageHeroMobileImage.node.mediaItemUrl,
          alt: data.innerPageHeroSection.innerpageHeroMobileImage.node.altText || '',
          width: 768,
          height: 1024
        } : undefined,
        ctaButtons: data.innerPageHeroSection.innerpageHeroCTAButtons?.map((btn: any) => ({
          label: btn.buttonText,
          url: btn.buttonUrl?.url || '#'
        })) || []
      }
    });
  }

  // Map featuresCardSection to fleetGaps
  if (data.featuresCardSection) {
    const heading = data.featuresCardSection.featuresCardHeading || '';
    let title = heading;
    let titleHighlight = '';

    if (heading.includes('<span>')) {
      const parts = heading.split('<span>');
      title = parts[0].trim();
      titleHighlight = parts[1].replace('</span>', '').trim();
    }

    sections.push({
      id: 'fleetGaps',
      type: 'fleetGaps',
      data: {
        title: title,
        titleHighlight: titleHighlight,
        subtitle: data.featuresCardSection.featuresCardDescription || '',
        items: data.featuresCardSection.featureCards?.map((c: any) => ({
          title: c.featureCardTitle,
          desc: c.featureCardDescription,
          iconClass: c.featureCardIconClass,
          icon: {
            url: c.featureCardIconImage?.node?.mediaItemUrl || '',
            alt: c.featureCardIconImage?.node?.altText || c.featureCardTitle
          }
        })) || []
      }
    });
  }

  // Map textImageStatsSection to textImage
  if (data.textImageStatsSection && data.textImageStatsSection.enableTextImageStatsSection) {
    sections.push({
      id: 'textImage',
      type: 'textImage',
      data: {
        title: data.textImageStatsSection.textImageStatsHeading,
        description: data.textImageStatsSection.textImageStatsDescription,
        image: {
          url: data.textImageStatsSection.textImageStatsMedia?.node?.mediaItemUrl || '',
          alt: ''
        },
        stats: data.textImageStatsSection.stats || []
      }
    });
  }

  // Map OEM ecosystem to partners
  if (oemItems?.nodes && oemItems.nodes.length > 0) {
    const partnersData = oemItems.nodes.map((n: any) => ({
      name: n.title ?? '',
      image: n.oemEcosystemAdditionalFields?.logoTransparent?.node?.mediaItemUrl ?? '',
    }));

    sections.push({
      id: 'partners',
      type: 'partners',
      data: {
        title: data.oemCompatibilitySection?.oemSectionHeading || 'Compatibility Ecosystem',
        description: data.oemCompatibilitySection?.oemSectionDescription || '',
        partners: partnersData.filter((p: { image?: string }) => p.image),
      },
    });
  }

  // Map featureTabsSection to fleetAgents
  if (data.featureTabsSection && data.featureTabsSection.enableFeatureTabsSection) {
    sections.push({
      id: 'fleetAgents',
      type: 'fleetAgents',
      data: {
        title: data.featureTabsSection.featureTabsSectionHeading || '',
        subheading: data.featureTabsSection.featureTabsSectionDescription || '',
        hideTabDescription: false,
        agents: data.featureTabsSection.tabs?.map((tab: any, idx: number) => ({
          id: `agent-${idx}`,
          label: tab.tabLabel,
          tabDescription: tab.tabIntro,
          description: tab.tabDescription,
          imageUrl: tab.tabImage?.node?.mediaItemUrl || ''
        })) || []
      }
    });
  }

  // Map singleMediaSection to stackFitData
  if (data.singleMediaSection) {
    sections.push({
      id: 'stackFit',
      type: 'stackFitData',
      data: {
        title: data.singleMediaSection.singleMediaSectionHeading,
        subtitle: data.singleMediaSection.singleMediaSectionDescription,
        media: {
          src: data.singleMediaSection.singleVideo?.node?.mediaItemUrl || '',
          alt: 'Stack visualization'
        },
        buttons: data.singleMediaSection.singleMediaCtaButtons?.map((btn: any) => ({
          label: btn.singleMediaButtonText,
          url: btn.singleMediaButtonUrl?.url || '#'
        })) || []
      }
    });
  }

  // Map staggeredGridSection to ultraSecureDesign2
  if (data.staggeredGridSection && data.staggeredGridSection.enableStaggeredGridSection) {
    const items = (data.staggeredGridSection.gridItems || []).filter((item: any) => item.gridCellType?.[0] === 'full');
    const finalCells: any[] = [];
    const sequence = [
      { itemIdx: 0, cellType: "content" },
      { cellType: "empty" },
      { itemIdx: 1, cellType: "content" },
      { cellType: "empty" },
      { cellType: "empty" },
      { itemIdx: 2, cellType: "content" },
      { cellType: "empty" },
      { itemIdx: 3, cellType: "content" },
    ];

    sequence.forEach((cfg) => {
      if (cfg.cellType === "empty") {
        finalCells.push({ type: "empty" });
      } else if (cfg.itemIdx !== undefined && items[cfg.itemIdx]) {
        const item = items[cfg.itemIdx];
        finalCells.push({
          type: "content",
          iconClass: item.gridIconClass,
          icon: item.gridItemIconImage?.node?.mediaItemUrl,
          title: item.gridItemTitle,
          description: item.gridItemDescription,
        });
      } else {
        finalCells.push({ type: "empty" });
      }
    });

    sections.push({
      id: 'ultraSecureDesign2',
      type: 'ultraSecureDesign2',
      data: {
        title: data.staggeredGridSection.gridSectionHeading?.replaceAll("sapn", "span"),
        subtitle: data.staggeredGridSection.gridSectionDescription,
        cells: finalCells
      }
    });
  }

  // Map engagementModelSection to engagementModel
  if (data.engagementModelSection) {
    sections.push({
      id: 'engagementModel',
      type: 'engagementModel',
      data: {
        title: data.engagementModelSection.engagementSectionHeading,
        subtitle: data.engagementModelSection.engagementSectionDescription,
        steps: data.engagementModelSection.modelItems?.map((item: any) => ({
          title: item.modelHeading,
          description: item.modelDescription
        })) || [],
        cta: data.engagementModelSection.modelCtaButton ? {
          label: data.engagementModelSection.modelCtaButton.modelButtonText,
          url: data.engagementModelSection.modelCtaButton.modelButtonUrl?.url || '#'
        } : undefined
      }
    });
  }

  // Map caseStudyCarouselSection to quantifiedImpact
  if (data.caseStudyCarouselSection) {
    const heading = data.caseStudyCarouselSection.csCarouselHeading || '';
    let title = heading;
    let titleHighlight = '';

    if (heading.includes('<span>')) {
      const parts = heading.split('<span>');
      title = parts[0].trim();
      titleHighlight = parts[1].replace('</span>', '').trim();
    }

    sections.push({
      id: 'quantifiedImpact',
      type: 'quantifiedImpact',
      data: {
        title: title,
        titleHighlight: titleHighlight,
        description: data.caseStudyCarouselSection.csCarouselDescription || '',
        csCarouselItems: data.caseStudyCarouselSection.csCarouselItems
      }
    });
  }

  // Map testimonialSection to testimonial
  if (data.testimonialSection) {
    const heading = data.testimonialSection.testimonialHeading || '';
    let title = heading.replace('<span>', '').replace('</span>', '');
    let titleHighlight = '';

    if (heading.includes('<span>')) {
      const match = heading.match(/<span>(.*?)<\/span>/);
      if (match) {
        titleHighlight = match[1];
      }
    }

    sections.push({
      id: 'testimonial',
      type: 'testimonial',
      data: {
        title: title,
        titleHighlight: titleHighlight,
        testimonials: data.testimonialSection.testimonialsDetails?.nodes?.map((node: any) => ({
          quote: node.testimonialsFields?.testifierDescription || '',
          authorName: node.title || '',
          authorTitle: `${node.testimonialsFields?.testifierDesignation || ""}${node.testimonialsFields?.testifierDesignation && node.testimonialsFields?.testifierCompanyName ? ", " : ""}${node.testimonialsFields?.testifierCompanyName || ""}`,
          image: {
            url: node.testimonialsFields?.testifierImage?.node?.mediaItemUrl || '',
            alt: node.title || ''
          }
        })) || []
      }
    });
  }

  // Map faqSection to faq
  if (data.faqSection) {
    sections.push({
      id: 'faq',
      type: 'faq',
      data: {
        title: data.faqSection.faqSectionHeading,
        items: data.faqSection.faqItems || []
      }
    });
  }

  // Map prefooterCtaBannerSection to contactStrip
  if (data.prefooterCtaBannerSection) {
    sections.push({
      id: 'contactStrip',
      type: 'contactStrip',
      data: {
        prefooterCtaBannerHeading: data.prefooterCtaBannerSection.prefooterCtaBannerHeading,
        prefooterCtaBannerDescription: data.prefooterCtaBannerSection.prefooterCtaBannerDescription,
        prefooterCtaBackgroundImage: data.prefooterCtaBannerSection.prefooterCtaBackgroundImage,
        prefooterBannerCtaButtons: data.prefooterCtaBannerSection.prefooterBannerCtaButtons
      }
    });
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    locale,
    pageTemplate: 'byOEM',
    seo: mapCmsSeo(data.seo, data.title, data.seoKeywords),
    sections,
    ...data
  };
}

export const getByCustomerOEMPage = cache(getByCustomerOEMPageUncached);