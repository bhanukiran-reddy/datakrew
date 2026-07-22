import { cache } from 'react';
import { fetchGraphQL } from '../client';
import { getSupportedLocalesSync } from '@/lib/config/locales';

type SlugNodes = { nodes?: Array<{ slug?: string | null }> };

async function fetchSlugs(query: string, rootKey: string): Promise<string[]> {
  try {
    const data = await fetchGraphQL<Record<string, SlugNodes>>(query);
    return (data?.[rootKey]?.nodes ?? [])
      .map((n) => n.slug?.trim() ?? '')
      .filter(Boolean);
  } catch (err) {
    console.error('[getStaticSlugs]', rootKey, err);
    return [];
  }
}

/** Build { locale, slug }[] for App Router generateStaticParams. Empty on CMS failure (dynamicParams still serves on demand). */
export function staticParamsFromSlugs(slugs: string[]) {
  const locales = getSupportedLocalesSync();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export const getBlogSlugs = cache(() =>
  fetchSlugs(
    `query { allBlog(first: 100, where: { status: PUBLISH }) { nodes { slug } } }`,
    'allBlog',
  ),
);

export const getNewsSlugs = cache(() =>
  fetchSlugs(
    `query { allNews(first: 100, where: { status: PUBLISH }) { nodes { slug } } }`,
    'allNews',
  ),
);

export const getCaseStudySlugs = cache(() =>
  fetchSlugs(
    `query { allCaseStudies(first: 100, where: { status: PUBLISH }) { nodes { slug } } }`,
    'allCaseStudies',
  ),
);

export const getCareerSlugs = cache(() =>
  fetchSlugs(
    `query { allCareers(first: 100, where: { status: PUBLISH }) { nodes { slug } } }`,
    'allCareers',
  ),
);

export const getPodcastSlugs = cache(() =>
  fetchSlugs(
    `query { allPodcastsVideos(first: 100, where: { status: PUBLISH }) { nodes { slug } } }`,
    'allPodcastsVideos',
  ),
);

export const getEventSlugs = cache(() =>
  fetchSlugs(
    `query { allEvents(first: 100, where: { status: PUBLISH }) { nodes { slug } } }`,
    'allEvents',
  ),
);
