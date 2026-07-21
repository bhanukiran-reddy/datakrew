import { cache } from 'react';
import { attachSeoKeywords, defaultSeo, mapCmsSeo } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';
import type { CMSPage, CMSSection, SEOFields } from '../../types/cms';
import { env } from '../../env';

const GET_ABOUT_US_PAGE = /* GraphQL */ `
query getAboutusPage($id: ID!) {
  page(id: $id, idType: URI) {
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
    textImageStatsSection {
      textImageStatsHeading
      textImageStatsDescription
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
    companyJourneyModule {
      journeySectionHeading
      journeySectionDescription
      journeyItems {
        itemYear
        milestoneTitle
        milestoneDescription
        milestoneImage {
          node {
            mediaItemUrl
          }
        }
      }
    }
    staggeredGridSection {
      gridSectionHeading
      gridSectionDescription
      gridItems {
        gridCellType
        gridItemTitle
        gridItemDescription
        gridItemIconImage {
          node {
            mediaItemUrl
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
        buttonText
        buttonUrl {
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
    featuresCardSection {
      featuresCardHeading
      featuresCardDescription
      featureCards {
        featureCardDescription
        featureCardTitle
        featureCardIconImage {
          node {
            mediaItemUrl
            altText
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
    teamSection {
      teamSectionHeading
      teamCTAButton {
        teamButtonText
        teamButtonLink {
          target
          url
        }
      }
      teamMembers {
        nodes {
          ... on Team {
            id
            featuredImage {
              node {
                altText
                mediaItemUrl
              }
            }
            title
            teamAdditionFields {
              teamDesignation
              teamBio
              socialLinks {
                linkedinUrl
              }
            }
          }
        }
      }
    }
    investorsSection {
      investorSectionHeading
      investorItems {
        nodes {
          ... on Investor {
            title
            featuredImage {
              node {
                mediaItemUrl
                altText
              }
            }
          }
        }
      }
    }
    partnersSection {
      partnersSectionHeading
      partnersItems {
        nodes {
          ... on Partner {
            title
            featuredImage {
              node {
                mediaItemUrl
                altText
              }
            }
          }
        }
      }
    }
  }

}
`;

function buildSectionsFromResponse(
  page: any,
  oemItems?: any
): CMSSection[] {
  const sections: CMSSection[] = [];

  if (page.innerPageHeroSection) {
    sections.push({
      id: 'banner',
      type: 'innerPageBanner',
      data: {
        title: page.innerPageHeroSection.innerpageHeroHeading || '',
        description: page.innerPageHeroSection.innerpageHeroDescription || '',
        backgroundImage: {
          url: page.innerPageHeroSection.innerpageHeroImage?.node?.mediaItemUrl || '',
          width: page.innerPageHeroSection.innerpageHeroImage?.node?.mediaDetails?.width || 1920,
          height: page.innerPageHeroSection.innerpageHeroImage?.node?.mediaDetails?.height || 1080,
          alt: page.innerPageHeroSection.innerpageHeroHeading || ''
        },
        mobileImage: page.innerPageHeroSection.innerpageHeroMobileImage?.node?.mediaItemUrl ? {
          url: page.innerPageHeroSection.innerpageHeroMobileImage.node.mediaItemUrl,
          width: page.innerPageHeroSection.innerpageHeroMobileImage.node.mediaDetails?.width || 768,
          height: page.innerPageHeroSection.innerpageHeroMobileImage.node.mediaDetails?.height || 1024,
          alt: page.innerPageHeroSection.innerpageHeroHeading || ''
        } : undefined,
        breadcrumbItems: [
          { label: 'Home', href: '/' },
          { label: page.title || 'About Us' }
        ],
        ctaButtons: page.innerPageHeroSection.innerpageHeroCTAButtons?.map((btn: any) => ({
          label: btn.buttonText,
          url: btn.buttonUrl?.url || '#'
        })) || []
      }
    });
  }

  if (page.textImageStatsSection) {
    sections.push({
      id: 'text-image-stats',
      type: 'textImage',
      data: {
        sectionHeading: page.textImageStatsSection.textImageStatsHeading || '',
        sectionDescription: page.textImageStatsSection.textImageStatsDescription || '',
        image: {
          url: page.textImageStatsSection.textImageStatsMedia?.node?.mediaItemUrl || '',
          alt: ''
        },
        stats: page.textImageStatsSection.stats || []
      }
    });
  }

  if (page.companyJourneyModule) {
    sections.push({
      id: 'company-journey',
      type: 'journey',
      data: {
        title: page.companyJourneyModule.journeySectionHeading || '',
        description: page.companyJourneyModule.journeySectionDescription || '',
        items: page.companyJourneyModule.journeyItems?.map((item: any) => ({
          year: item.itemYear,
          title: item.milestoneTitle,
          description: item.milestoneDescription,
          image: item.milestoneImage?.node?.mediaItemUrl || ''
        })) || []
      }
    });
  }

  if (page.staggeredGridSection) {
    let cells = page.staggeredGridSection.gridItems?.map((i: any) => ({
      type: i.gridCellType?.includes('empty') ? 'empty' : 'content',
      title: i.gridItemTitle,
      description: i.gridItemDescription,
      icon: i.gridItemIconImage?.node?.mediaItemUrl
    })) || [];

    // Manually implement staggered layout if we have exactly 3 items for "What drives Datakrew"
    if (cells.length === 3 && page.staggeredGridSection.gridSectionHeading?.includes('What drives Datakrew')) {
      cells = [
        cells[0], // Our Vision
        { type: 'empty' },
        cells[1], // Our Goal
        { type: 'empty' },
        cells[2], // Our Mission
        { type: 'empty' }
      ];
    }

    sections.push({
      id: 'ultra-secure-design',
      type: 'ultraSecureDesign',
      data: {
        title: page.staggeredGridSection.gridSectionHeading || '',
        subtitle: page.staggeredGridSection.gridSectionDescription || '',
        cells: cells
      }
    });
  }

  if (page.ctaBannerSection) {
    const btn = page.ctaBannerSection.bannerCtaButtons?.[0];
    sections.push({
      id: 'bg-title-description',
      type: 'bgTitleDescription',
      data: {
        title: page.ctaBannerSection.ctaBannerHeading || '',
        description: page.ctaBannerSection.ctaBannerDescription || '',
        backgroundImage: page.ctaBannerSection.ctaBannerBackgroundImage?.node?.mediaItemUrl ? {
          url: page.ctaBannerSection.ctaBannerBackgroundImage.node.mediaItemUrl,
          alt: page.ctaBannerSection.ctaBannerBackgroundImage.node.altText || '',
          width: 1920,
          height: 1080
        } : undefined,
        button: btn ? {
          label: btn.buttonText,
          url: btn.buttonUrl?.url || '#'
        } : undefined
      }
    });
  }

  if (page.featureTabsSection) {
    sections.push({
      id: 'fleet-agents',
      type: 'fleetAgents',
      data: {
        title: page.featureTabsSection.featureTabsSectionHeading || '',
        subheading: page.featureTabsSection.featureTabsSectionDescription || '',
        agents: page.featureTabsSection.tabs?.map((tab: any, idx: number) => ({
          id: `tab-${idx}`,
          label: tab.tabLabel || '',
          tabDescription: tab.tabIntro || '',
          description: tab.tabDescription || '',
          imageUrl: tab.tabImage?.node?.mediaItemUrl || ''
        })) || []
      }
    });
  }

  if (page.featuresCardSection) {
    const fullTitle = page.featuresCardSection.featuresCardHeading || "";
    let title = fullTitle;
    let titleHighlight = "";

    if (fullTitle.includes("<span>")) {
      const match = fullTitle.match(/^(.*?)<span>(.*?)<\/span>(.*)$/i);
      if (match) {
        title = (match[1] + match[3]).trim();
        titleHighlight = match[2];
      }
    }

    sections.push({
      id: "fleet-gaps",
      type: "fleetGaps",
      data: {
        title: title,
        titleHighlight: titleHighlight,
        subtitle: page.featuresCardSection.featuresCardDescription || "",
        items:
          page.featuresCardSection.featureCards?.map((card: any) => ({
            title: card.featureCardTitle || "",
            desc: card.featureCardDescription || "",
            icon: {
              url: card.featureCardIconImage?.node?.mediaItemUrl || "",
              alt: card.featureCardIconImage?.node?.altText || "",
            },
          })) || [],
      },
    });
  }

  if (page.prefooterCtaBannerSection) {
    sections.push({
      id: "contact-strip",
      type: "contactStrip",
      data: {
        title: page.prefooterCtaBannerSection.prefooterCtaBannerHeading || "",
        description: page.prefooterCtaBannerSection.prefooterCtaBannerDescription || "",
        backgroundImageUrl: page.prefooterCtaBannerSection.prefooterCtaBackgroundImage?.node?.mediaItemUrl || "",
        ctas: page.prefooterCtaBannerSection.prefooterBannerCtaButtons?.map((btn: any) => ({
          text: btn.buttonText,
          url: btn.buttonUrl?.url || "#"
        })) || []
      },
    });
  }

  if (page.singleMediaSection) {
    sections.push({
      id: "stack-fit",
      type: "stackFit",
      data: {
        title: page.singleMediaSection.singleMediaSectionHeading || "",
        subtitle: page.singleMediaSection.singleMediaSectionDescription || "",
        media: {
          src: page.singleMediaSection.singleMedia?.node?.mediaItemUrl || "",
          alt: "Stack visualization"
        },
        buttons: page.singleMediaSection.singleMediaCtaButtons?.map((btn: any) => ({
          label: btn.singleMediaButtonText,
          url: btn.singleMediaButtonUrl?.url || "#"
        })) || []
      },
    });
  }

  if (page.teamSection) {
    sections.push({
      id: 'team',
      type: 'team',
      data: {
        title: page.teamSection.teamSectionHeading || '',
        button: page.teamSection.teamCTAButton ? {
          label: page.teamSection.teamCTAButton.teamButtonText || 'View all',
          url: (page.teamSection.teamCTAButton.teamButtonLink?.url && page.teamSection.teamCTAButton.teamButtonLink.url !== '#')
            ? page.teamSection.teamCTAButton.teamButtonLink.url
            : '/team'
        } : undefined,
        members: page.teamSection.teamMembers?.nodes?.map((node: any) => ({
          name: node.title || '',
          role: node.teamAdditionFields?.teamDesignation || '',
          description: node.teamAdditionFields?.teamBio || '',
          image: node.featuredImage?.node?.mediaItemUrl || '',
          url: node.teamAdditionFields?.socialLinks?.linkedinUrl || '#',
          socialLinks: {
            linkedin: node.teamAdditionFields?.socialLinks?.linkedinUrl || '#'
          }
        })) || []
      }
    });
  }

  if (page.investorsSection) {
    sections.push({
      id: 'investors',
      type: 'investors',
      data: {
        title: page.investorsSection.investorSectionHeading || '',
        logos: page.investorsSection.investorItems?.nodes?.map((node: any) => ({
          title: node.title || '',
          url: node.featuredImage?.node?.mediaItemUrl || ''
        })) || []
      }
    });
  }

  // Partners Section -> PartnersSection
  // Prioritize oemItems if present
  const oemNodes = oemItems?.nodes;
  if (oemNodes && oemNodes.length > 0) {
    const oemPartners = oemNodes.map((n: any) => ({
      title: n.title ?? '',
      url: n.oemEcosystemAdditionalFields?.logoTransparent?.node?.mediaItemUrl ?? '',
    }));
    sections.push({
      id: 'partners',
      type: 'partners',
      data: {
        title: 'Compatibility Ecosystem',
        description: '',
        logos: oemPartners.filter((p: any) => p.url),
      },
    });
  } else if (page.partnersSection) {
    sections.push({
      id: 'partners',
      type: 'partners',
      data: {
        title: page.partnersSection.partnersSectionHeading || '',
        logos: page.partnersSection.partnersItems?.nodes?.map((node: any) => ({
          title: node.title || '',
          url: node.featuredImage?.node?.mediaItemUrl || ''
        })) || []
      }
    });
  }

  return sections;
}

export type GetAboutUsPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getAboutUsPageUncached(
  locale: string,
  options?: GetAboutUsPageOptions
): Promise<CMSPage | null> {
  const defaultLocale = getDefaultLocaleSync();
  const id = locale === defaultLocale ? 'about-us' : `${locale}/about-us`;

  const tags = options?.tags ?? [`page-${locale}-about-us`];
  const revalidate = options?.revalidate;

  const data = await fetchGraphQL<any>(
    GET_ABOUT_US_PAGE,
    { id },
    { tags, revalidate }
  );

  const page = data?.page;
  if (!page) return null;

  const sections = buildSectionsFromResponse(page, data?.oemItems);

  return {
    id: page.id,
    title: page.title || 'About Us',
    slug: page.slug || 'about-us',
    locale,
    pageTemplate: 'about_us',
    seo: mapCmsSeo(page.seo, page.title || 'About Us', page.seoKeywords),
    sections
  };
}

export const getAboutUsPage = cache(getAboutUsPageUncached);
