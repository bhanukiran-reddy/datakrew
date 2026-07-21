import { cache } from "react";
import { withSeoKeywordsOnFields } from '../mapSeo';
import { fetchGraphQL } from "@/lib/graphql/client";
import { getDefaultLocaleSync } from "@/lib/config/locales";

export const GET_BLOG_INNER_PAGE = /* GraphQL */ `
  query getBlogInnerPage($id: ID!, $currentPostId: ID!) {
    blog(id: $id, idType: URI) {
      id
      title
      slug
      uri
      date
      blogId
      featuredImage {
        node {
          mediaItemUrl
          altText
        }
      }
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
      blogAdditionalFields {
        blogContent
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
    seoKeywords {
      primaryKeywords
      secondaryKeywords
    }
    }
    allBlog(
      where: {notIn: [$currentPostId], orderby: {field: DATE, order: DESC}, status: PUBLISH}
      first: 3
    ) {
      nodes {
        id
        featuredImage {
          node {
            altText
            mediaItemUrl
          }
        }
        date
        title
        slug
        uri
        blogId
      }
    }
  }
`;

export const getBlogInnerPage = cache(async (locale: string, slug: string) => {
  const defaultLocale = getDefaultLocaleSync();
  // WordPress 'blog' CPT URIs are stored without the leading slash
  const uri = locale === defaultLocale ? `articles-blogs/${slug}/` : `${locale}/articles-blogs/${slug}/`;
  
  // First, get the current post ID to exclude it from the related blog list
  const initialResponse = await fetchGraphQL<any>(`
    query getPostId($uri: ID!) {
      blog(id: $uri, idType: URI) {
        id
        blogId
      }
    }
  `, { uri });

  const currentPostId = initialResponse?.blog?.id || "0";
  
  const response = await fetchGraphQL<any>(GET_BLOG_INNER_PAGE, { 
    id: uri,
    currentPostId: currentPostId
  });

  return response
    ? withSeoKeywordsOnFields(response, ['news', 'blog', 'podcast', 'career'])
    : response;
});
