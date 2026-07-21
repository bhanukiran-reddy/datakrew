import { cache } from "react"
import { withSeoKeywordsOnFields } from '../mapSeo';
import { fetchGraphQL } from "../client"
import { getDefaultLocaleSync } from "../../config/locales"

const GET_NEWS_INNER_PAGE = /*Graph Ql*/ `
query getNewsInnerPage($id: ID!, $currentPostId: ID!) {
  news(id: $id, idType: URI) {
    title
    slug
    uri
    date
    newsId
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
    newsAdditionalFields {
      newsContent
    }
    prefooterCtaBannerSection {
      prefooterCtaBannerHeading
      prefooterCtaBannerDescription
      prefooterCtaBackgroundImage {
        node {
          mediaItemUrl
          altText
        }
      }
      prefooterBannerCtaButtons {
        buttonStyle
        buttonText
        buttonUrl {
          target
          url
        }
      }
    }
    seo {
      title
      metaDesc
      canonical
    }
  }
  allNews(
    where: {notIn: [$currentPostId], orderby: {field: DATE, order: DESC}, status: PUBLISH}
    first: 3
  ) {
    nodes {
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      newsId
      date
      title
      uri
      newsAdditionalFields {
        newsPublishedLink
      }
    }
  }
}
`

export const getNewsInnerPage = cache(async (locale: string, slug: string) => {
  const defaultLocale = getDefaultLocaleSync();
  const uri = locale === defaultLocale ? `/news/${slug}/` : `/${locale}/news/${slug}/`;
  
  // First, get the current post ID to exclude it from the "More News" list
  const initialResponse = await fetchGraphQL<any>(`
    query getPostId($uri: ID!) {
      news(id: $uri, idType: URI) {
        id
        newsId
      }
    }
  `, { uri });

  const currentPostId = initialResponse?.news?.id || "0";
  
  const response = await fetchGraphQL<any>(GET_NEWS_INNER_PAGE, { 
    id: uri,
    currentPostId: currentPostId
  });

  return response
    ? withSeoKeywordsOnFields(response, ['news', 'blog', 'podcast', 'career'])
    : response;
});
