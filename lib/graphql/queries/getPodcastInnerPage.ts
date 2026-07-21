import { cache } from "react";
import { withSeoKeywordsOnFields } from '../mapSeo';
import { fetchGraphQL } from "@/lib/graphql/client";
import { getDefaultLocaleSync } from "@/lib/config/locales";

export const GET_PODCAST_INNER_PAGE = /* GraphQL */ `
  query getPodcastandVideosInnerPage($uri: ID!, $currentPostId: ID!) {
    podcastsandvideos(id: $uri, idType: URI) {
      title
      slug
      uri
      date
      podcastsandvideosId
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
      episodeAdditionalFields {
        episodeNumber
        episodeDescription
        episodePosterImage {
          node {
            altText
            mediaItemUrl
          }
        }
        episodeUrl
        episodeDuration
        episodeTranscript
      }
      excerpt
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
    relatedPodcastVideos: allPodcastsVideos(
      first: 3
      where: {notIn: [$currentPostId], status: PUBLISH, orderby: {field: DATE, order: DESC}}
    ) {
      nodes {
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            altText
            mediaItemUrl
          }
        }
        episodeAdditionalFields {
          episodeNumber
          episodeDuration
        }
      }
    }
  }
`;

export const getPodcastInnerPageData = cache(async (locale: string, slug: string) => {
  const defaultLocale = getDefaultLocaleSync();
  // WordPress 'podcastsandvideos' CPT URIs might vary. Based on blog pattern:
  // Usually it might be /resources/podcasts/slug
  // Let's try to match the URI format expected by WP
  const uri = locale === defaultLocale ? `resources/podcasts-videos/${slug}/` : `${locale}/resources/podcasts-videos/${slug}/`;
  
  // First, get the current post ID
  const initialResponse = await fetchGraphQL<any>(`
    query getPostId($uri: ID!) {
      podcastsandvideos(id: $uri, idType: URI) {
        id
        podcastsandvideosId
      }
    }
  `, { uri });

  const currentPostId = initialResponse?.podcastsandvideos?.id || "0";
  
  const response = await fetchGraphQL<any>(GET_PODCAST_INNER_PAGE, { 
    uri: uri,
    currentPostId: currentPostId
  });

  return response
    ? withSeoKeywordsOnFields(response, ['news', 'blog', 'podcast', 'career'])
    : response;
});
