import { fetchGraphQL } from '../client';
import type { SearchResult } from '@/lib/types/search';

export const GLOBAL_SEARCH_QUERY = /* GraphQL */ `
query GlobalSearch($search: String!) {
  contentNodes(where: {search: $search, status: PUBLISH}, first: 20) {
    nodes {
      __typename
      ... on Page {
        title
        slug
        uri
      }
      ... on Post {
        title
        slug
        uri
        excerpt
        featuredImage {
          node {
             mediaItemUrl
          }
        }
      }
      ... on Blog {
        title
        slug
        uri
        excerpt
        featuredImage {
          node {
            mediaItemUrl
          }
        }
      }
      ... on Podcastsandvideos {
        title
        slug
        uri
        excerpt
        featuredImage {
          node {
            mediaItemUrl
          }
        }
      }
      ... on News {
        title
        slug
        uri
        excerpt
        featuredImage {
          node {
            mediaItemUrl
          }
        }
      }
      ... on Whitepapers {
        title
        slug
        uri
        featuredImage {
          node {
            mediaItemUrl
          }
        }
      }
      ... on CaseStudies {
        title
        slug
        uri
        excerpt
        featuredImage {
          node {
            mediaItemUrl
          }
        }
      }
      ... on OemEcosystem {
        title
        slug
        uri
        oemEcosystemAdditionalFields {
          logoTransparent {
            node {
              mediaItemUrl
            }
          }
        }
      }
      ... on Infrastructure {
        title
        slug
        uri
        featuredImage {
          node {
            mediaItemUrl
          }
        }
      }
      ... on Careers {
        title
        slug
        uri
      }
    }
  }
}
`;

/**
 * Legacy utility, now handled by the /api/search route for better client/server separation.
 * Kept here for type completeness but the API route is the preferred way.
 */
export async function getGlobalSearchResults(search: string): Promise<SearchResult[]> {
  if (!search || search.length < 2) return [];

  try {
    const data = await fetchGraphQL<any>(GLOBAL_SEARCH_QUERY, { search });
    
    if (!data?.contentNodes?.nodes) return [];

    return data.contentNodes.nodes.map((node: any) => {
      let type = 'Page';
      let uri = node.uri;

      switch (node.__typename) {
        case 'Blog': 
          type = 'Blog'; 
          if (!uri.startsWith('/blog')) uri = `/blog/${node.slug}`;
          break;
        case 'Careers':
          type = 'Careers';
          uri = '/careers';
          break;
        case 'Podcastsandvideos': 
          type = 'Podcast'; 
          if (!uri.startsWith('/resources/podcasts')) uri = `/resources/podcasts/${node.slug}`;
          break;
        case 'News': 
          type = 'News'; 
          if (!uri.startsWith('/resources/news')) uri = `/resources/news/${node.slug}`;
          break;
        case 'Whitepapers': 
          type = 'Whitepaper'; 
          uri = '/resources/whitepapers';
          break;
        case 'CaseStudies': 
          type = 'Case Study'; 
          if (!uri.startsWith('/resources/case-studies')) uri = `/resources/case-studies/${node.slug}`;
          break;
        case 'OemEcosystem': 
          type = 'Partner'; 
          uri = '/partners-reseller';
          break;
        case 'Infrastructure':
          type = 'Tech Stack';
          {
            const slug = node.slug || '';
            if (['itus-max', 'itus-autoscan'].includes(slug)) {
              uri = `/tech-stack/hardware/${slug}`;
            } else if (['oxred-autocert', 'oxred-lens', 'oxred-myfleet'].includes(slug)) {
              uri = `/tech-stack/software/${slug}`;
            } else if (['ask-ox', 'guardian-ai'].includes(slug)) {
              uri = `/tech-stack/ai-solution/${slug}`;
            } else {
              uri = `/tech-stack/${slug}`;
            }
          }
          break;
        default: type = node.__typename;
      }

      if (uri && !uri.startsWith('/')) uri = '/' + uri;

      let image = node.featuredImage?.node?.mediaItemUrl;
      if (node.__typename === 'OemEcosystem' && node.oemEcosystemAdditionalFields?.logoTransparent?.node?.mediaItemUrl) {
        image = node.oemEcosystemAdditionalFields.logoTransparent.node.mediaItemUrl;
      }

      return {
        title: node.title || '',
        slug: node.slug || '',
        uri: uri || '#',
        excerpt: node.excerpt ? node.excerpt.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : undefined,
        type: type,
        image: image
      };
    });
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
