import { fetchGraphQL } from '../client';
import { attachSeoKeywords } from '../mapSeo';

export const resourcesOverviewQuery = `
query getResourcesOverviewPage {
  page(id: "resources", idType: URI) {
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
  recentBlogs: allBlog(
    first: 10
    where: {orderby: {field: DATE, order: DESC}, status: PUBLISH}
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
  recentNews: allNews(
    first: 10
    where: {orderby: {field: DATE, order: DESC}, status: PUBLISH}
  ) {
    nodes {
      title
      slug
      uri
      date
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      newsAdditionalFields {
        isFeaturedNews
        newsPublishedLink
      }
    }
  }
  recentWhitepapers: allWhitepapers(
    first: 10
    where: {orderby: {field: DATE, order: DESC}, status: PUBLISH}
  ) {
    nodes {
      title
      slug
      uri
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      whitepaperAdditionalFields {
        accessType
        briefDescription
        whitepaperFile {
          node {
            mediaItemUrl
          }
        }
      }
    }
  }
  recentPodcastsVideos: allPodcastsVideos(
    first: 10
    where: {orderby: {field: DATE, order: DESC}, status: PUBLISH}
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
  recentEvents: allEvents(
    first: 10
    where: {orderby: {field: DATE, order: DESC}, status: PUBLISH}
  ) {
    nodes {
      title
      slug
      uri
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      eventAdditionalDetails {
        eventEndDate
        eventLocation
        eventStartDate
        eventVenue
      }
    }
  }
  recentInfographics: allInfographics(
    first: 10
    where: {orderby: {field: DATE, order: DESC}, status: PUBLISH}
  ) {
    nodes {
      title
      slug
      uri
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      infographicsAdditionalFields {
        accessType
        briefDescription
        infographicsFile {
          node {
            mediaItemUrl
          }
        }
      }
    }
  }
  recentCaseStudies: allCaseStudies(
    first: 10
    where: {orderby: {field: DATE, order: DESC}, status: PUBLISH}
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
      industries {
        nodes {
          name
          slug
        }
      }
    }
  }
}
`;

export async function getResourcesOverviewPage() {
  return fetchGraphQL(resourcesOverviewQuery);
}
