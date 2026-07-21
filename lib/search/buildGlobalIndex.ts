import { extractTextDeep } from './extractTextDeep';
import { fetchGraphQL } from '../graphql/client';
import type { SearchResult } from '@/lib/types/search';

/**
 * This script is intended to be used either at build time or 
 * via a background task to index ACF content that standard 
 * WP search might miss.
 */

const GET_ALL_SEARCHABLE_PAGES = /* GraphQL */ `
  query GetAllPages {
    pages(first: 100) {
      nodes {
        id
        title
        uri
        slug
      }
    }
  }
`;

export async function searchInPageContent(query: string) {
  try {
    const data = await fetchGraphQL<any>(GET_ALL_SEARCHABLE_PAGES, {});
    const pages = data?.pages?.nodes || [];
    const lowerQuery = query.toLowerCase();
    
    const matchedResults: SearchResult[] = [];

    for (const page of pages) {
      if (!page) continue;
      
      const allText = extractTextDeep(page).toLowerCase();
      if (allText.includes(lowerQuery)) {
        matchedResults.push({
          title: page.title || 'Untitled Page',
          slug: page.slug || '',
          uri: page.uri || `/${page.slug}`,
          type: 'Page',
          excerpt: 'Result found in page sections...'
        });
      }
    }

    return matchedResults;
  } catch (error) {
    console.error('Local search error:', error);
    return [];
  }
}
