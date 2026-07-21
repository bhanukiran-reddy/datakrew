import { cache } from 'react';
import { attachSeoKeywords, defaultSeo, mapCmsSeo } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';
import type { CMSPage, CMSSection, SEOFields } from '../../types/cms';
import { env } from '../../env';



const GET_TEAM_PAGE = /* GraphQL */ `
query getTeamPage {
  page(id: "team", idType: URI) {
      seo {
        title
        metaDesc
        canonical
      }
    seoKeywords {
      primaryKeywords
      secondaryKeywords
    }
    innerPageHeroSection {
      innerpageHeroHeading
      innerpageHeroDescription
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
    teamQuoteSection {
      quoteAuthor {
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
              teamQuote
            }
          }
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
    }
  }
  allTeam(where: {orderby: {field: MENU_ORDER, order: ASC}, status: PUBLISH}) {
    nodes {
      title
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      teamAdditionFields {
        teamDesignation
        teamBio
        socialLinks {
          linkedinUrl
        }
        teamBio
        teamDesignation
      }
      teamCategory {
        nodes {
          name
        }
      }
    }
  }
}`
  ;

export type GetTeamPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;


async function getTeamPageUncached(
  locale: string,
  options?: GetTeamPageOptions
): Promise<CMSPage | null> {
  const defaultLocale = getDefaultLocaleSync();
  const id = locale === defaultLocale ? 'team' : `${locale}/team`;

  const tags = options?.tags ?? [`page-${locale}-team`];
  const revalidate = options?.revalidate;

  const data = await fetchGraphQL<any>(
    GET_TEAM_PAGE,
    { id },
    { tags, revalidate }
  );

  const page = data?.page;
  if (!page) return null;

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
          { label: page.title || 'Our team' }
        ],
      }
    });
  }

  if (page.teamQuoteSection?.quoteAuthor?.nodes?.[0]) {
    const author = page.teamQuoteSection.quoteAuthor.nodes[0];
    sections.push({
      id: 'teamQuote',
      type: 'teamQuote',
      data: {
        name: (author.title || '').trim(),
        role: (author.teamAdditionFields?.teamDesignation || '').trim(),
        description: (author.teamAdditionFields?.teamQuote || '').trim(),
        image: author.featuredImage?.node?.mediaItemUrl || '',
        link: '#'
      }
    });
  }

  if (page.teamSection) {
    const teamHeading = page.teamSection.teamSectionHeading || '';
    const teamMembers = data.allTeam?.nodes?.map((node: any) => ({
      name: (node.title || '').trim(),
      role: (node.teamAdditionFields?.teamDesignation || '').trim(),
      description: (node.teamAdditionFields?.teamBio || '').trim(),
      image: node.featuredImage?.node?.mediaItemUrl || '',
      url: node.teamAdditionFields?.socialLinks?.linkedinUrl || '#',
      categories: node.teamCategory?.nodes?.map((cat: any) => (cat.name || '').trim()) || []
    })) || [];

    sections.push({
      id: 'teamSection',
      type: 'teamSection',
      data: {
        heading: teamHeading,
        teamMembers: teamMembers,
        cta: page.teamSection.teamCTAButton?.teamButtonLink ? {
          text: page.teamSection.teamCTAButton.teamButtonText,
          url: page.teamSection.teamCTAButton.teamButtonLink.url,
          target: page.teamSection.teamCTAButton.teamButtonLink.target
        } : undefined
      }
    });
  }

  return {
    id: page.id,
    title: page.title || 'Team',
    slug: page.slug || 'team',
    locale,
    pageTemplate: 'team',
    seo: mapCmsSeo(page.seo, page.title, page.seoKeywords),
    sections
  };
}

export const getTeamPage = cache(getTeamPageUncached);

