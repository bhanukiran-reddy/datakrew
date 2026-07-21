import { cache } from 'react';
import { withSeoKeywordsOnField } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';

const GET_PODCASTS_AND_VIDEOS_OVERVIEW_PAGE = /* GraphQL */ `
query getPodcastsandVideosOverviewPage($afterCursor: String) {
  page(id: "videos-podcasts", idType: URI) {
    innerPageHeroSection {
      innerpageHeroCTAButtons {
        buttonText
        buttonUrl {
          target
          url
        }
      }
      innerpageHeroDescription
      innerpageHeroHeading
      innerpageHeroImage {
        node {
          mediaItemUrl
          altText
        }
      }
      innerpageHeroMobileImage {
        node {
          altText
          mediaItemUrl
        }
      }
    }
    prefooterCtaBannerSection {
      prefooterBannerCtaButtons {
        buttonText
        buttonUrl {
          target
          url
        }
      }
      prefooterCtaBackgroundImage {
        node {
          mediaItemUrl
          altText
        }
      }
      prefooterCtaBannerDescription
      prefooterCtaBannerHeading
    }
    seo {
      title
      metaDesc
      canonical
    }
    seoKeywords {
      primaryKeywords
      secondaryKeywords
    }
  }
  featuredPodcastsVideos: allPodcastsVideos(
    where: {isFeaturedEpisode: true, orderby: {field: DATE, order: DESC}, status: PUBLISH}
  ) {
    nodes {
      title
      slug
      uri
      date
      excerpt
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      episodeAdditionalFields{
        episodeNumber
        episodeDuration
        episodePosterImage {
          node {
            altText
            mediaItemUrl
          }
        }
      }
    }
  }
  regularPodcastsVideos: allPodcastsVideos(
    after: $afterCursor
    where: {isFeaturedEpisode: false, orderby: {field: DATE, order: DESC}, status: PUBLISH}
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      title
      slug
      uri
      date
      excerpt
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      episodeAdditionalFields{
        episodeNumber
        episodeDuration
        episodePosterImage {
          node {
            altText
            mediaItemUrl
          }
        }
      }
    }
  }
}
`;

export type GetPodcastsandVideosOverviewPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getPodcastsandVideosOverviewPageUncached(afterCursor?: string, options?: GetPodcastsandVideosOverviewPageOptions) {
  const tags = options?.tags ?? ['videos-podcasts-overview-page'];
  const revalidate = options?.revalidate ?? 60;

  const data = await fetchGraphQL<any>(
    GET_PODCASTS_AND_VIDEOS_OVERVIEW_PAGE,
    { afterCursor },
    { tags, revalidate }
  );

  return data ? withSeoKeywordsOnField(data, 'page') : data;
}

export const getPodcastsandVideosOverviewPage = cache(getPodcastsandVideosOverviewPageUncached);
