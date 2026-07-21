import { NextResponse } from 'next/server';
import { fetchGraphQL } from '@/lib/graphql/client';
import { GLOBAL_SEARCH_QUERY } from '@/lib/graphql/queries/globalSearch';
import type { SearchResult } from '@/lib/types/search';
import { searchInPageContent } from '@/lib/search/buildGlobalIndex';

const URI_FIXES: Record<string, string> = {
  '/contact-us': '/contact',
  '/contact-us/': '/contact',
  '/about': '/about-us',
  '/about/': '/about-us',
  '/partner': '/partners-reseller',
  '/partners': '/partners-reseller',
  '/partners-reseller-program': '/partners-reseller',
  '/resources-2': '/resources',
  '/news': '/resources/news',
  '/whitepapers': '/resources/whitepapers',
  '/whitepaper': '/resources/whitepapers',
  '/case-studies': '/resources/case-studies',
  '/resources/whitepaper': '/resources/whitepapers',
  '/resources/whitepaper/': '/resources/whitepapers',
  '/teams-and-condition': '/termsandconditions',
  '/teams-and-conditions': '/termsandconditions',
  '/terms-and-conditions': '/termsandconditions',
  '/terms-and-condition': '/termsandconditions',
  '/team-members': '/team',
  '/career': '/careers',
  '/careers': '/careers',
  '/investor-relations': '/investors',
  '/oem-compatibility': '/resources/oem-compatibility',
  '/asset-compatibility': '/resources/asset-compatibility',
  '/events': '/resources/events',
  '/infographics': '/resources/infographics',
  '/infographic': '/resources/infographics',
  '/solutions/industry': '/industry',
  '/solutions/customer': '/customer',
  '/solutions/need': '/use-case',
  '/solutions/use-case': '/use-case',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!search || search.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    const data = await fetchGraphQL<any>(GLOBAL_SEARCH_QUERY, { search });
    // console.log('Search Data:', JSON.stringify(data, null, 2));
    
    if (!data?.contentNodes?.nodes) {
      return NextResponse.json([]);
    }

    // Map raw WP nodes to our unified SearchResult format
    const results: SearchResult[] = data.contentNodes.nodes.map((node: any) => {
      let type = 'Page';
      let uri = node.uri;

      // 1. Strip default locale prefix if present (e.g., /en/blog -> /blog)
      const defaultLocale = 'en'; 
      if (uri && (uri.startsWith(`/${defaultLocale}/`) || uri === `/${defaultLocale}`)) {
        uri = uri.replace(`/${defaultLocale}`, '') || '/';
      }

      // 2. Remove trailing slash for consistency
      if (uri && uri.length > 1 && uri.endsWith('/')) {
        uri = uri.slice(0, -1);
      }

      // 3. Apply manual overrides (e.g., /contact-us -> /contact)
      if (uri && URI_FIXES[uri]) {
        uri = URI_FIXES[uri];
      }

      // 2. Map WP Typenames to user-friendly types and ensure URIs are correct
      switch (node.__typename) {
        case 'Post':
          type = 'Post';
          if (!uri.startsWith('/blog')) uri = `/blog/${node.slug}`;
          break;
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
          // Since there are no individual whitepaper pages, point to the overview
          uri = '/resources/whitepapers';
          break;
        case 'CaseStudies':
        case 'CaseStudy':
          type = 'Case Study';
          if (!uri.startsWith('/resources/case-studies')) uri = `/resources/case-studies/${node.slug}`;
          break;
        case 'OemEcosystem':
          type = 'Partner';
          // If the app doesn't have individual partner pages, point to the partners page
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
        case 'Page':
          type = 'Page';
          // Fix Solution sub-paths
          if (uri.includes('/industry/')) {
            uri = '/industry/' + node.slug;
          } else if (uri.includes('/customer/')) {
            uri = '/customer/' + node.slug;
          } else if (uri.includes('/need/') || uri.includes('/use-case/')) {
            uri = '/use-case/' + node.slug;
          }
          break;
        default:
          type = node.__typename;
      }

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
    
    // If no results found in standard search, try a deep search in page content
    if (results.length === 0) {
      const localResults = await searchInPageContent(search);
      results.push(...localResults);
    }

    const total = results.length;
    const paginatedResults = results.slice((page - 1) * limit, page * limit);
    
    return NextResponse.json({ results: paginatedResults, total });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: 'Search failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
