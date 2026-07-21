import { fetchGraphQL } from '../client';
import { attachSeoKeywords } from '../mapSeo';

export const blogOverviewQuery = `
query getBlogOverviewPage($afterCursor: String) {
  page(id: "blog", idType: URI) {
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
  featuredBlogs: allBlog(
    first: 100
    where: {isFeaturedBlog: true, orderby: {field: DATE, order: DESC}, status: PUBLISH}
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
      blogAdditionalFields {
        isFeaturedBlog
      }
    }
  }
  regularBlogs: allBlog(
    first: 100
    after: $afterCursor
    where: {isFeaturedBlog: false, orderby: {field: DATE, order: DESC}, status: PUBLISH}
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
      blogAdditionalFields {
        isFeaturedBlog
      }
    }
  }
}
`;

export async function getBlogOverviewPage(afterCursor?: string) {
  return fetchGraphQL(blogOverviewQuery, { afterCursor });
}
