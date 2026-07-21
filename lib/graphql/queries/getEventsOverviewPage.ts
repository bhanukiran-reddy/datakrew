import { cache } from 'react';
import { attachSeoKeywords } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';

const GET_EVENTS_OVERVIEW_PAGE = /* GraphQL */ `
query getEventsOverviewPage {
  page(id: "events", idType: URI) {
    upcomingEventHeroSection {
      upcomingHeroCTAButtons {
        upcomingButtonText
        upcomingButtonUrl {
          url
          target
        }
      }
      upcomingHeroDescription
      upcomingHeroHeading
      upcomingHeroImage {
        node {
          altText
          mediaItemUrl
        }
      }
      upcomingHeroMobileImage {
        node {
          altText
          mediaItemUrl
        }
      }
    }
    ongoingEventHeroSection{
      ongoingHeroHeading
      ongoingHeroDescription
      ongoingHeroImage{
        node{
          altText
          mediaItemUrl
        }
      }
      ongoingHeroMobileImage{
         node{
          altText
          mediaItemUrl
        }
      }
    }
    pastEventHeroSection {
      pastHeroDescription
      pastHeroHeading
      pastHeroImage {
        node {
          altText
          mediaItemUrl
        }
      }
      pastHeroMobileImage {
        node {
          mediaItemUrl
          altText
        }
      }
      pastHeroCTAButtons {
        pastButtonText
        pastButtonUrl {
          target
          url
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
  allEvents: allEvents(
    first: 100
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
}
`;

export type GetEventsOverviewPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getEventsOverviewPageUncached(options?: GetEventsOverviewPageOptions) {
  const tags = options?.tags ?? ['events-overview-page'];
  const revalidate = options?.revalidate ?? 60;

  const data = await fetchGraphQL<any>(
    GET_EVENTS_OVERVIEW_PAGE,
    {},
    { tags, revalidate }
  );

  const allEvents = [...(data?.allEvents?.nodes || [])];
  const now = new Date();

  // Sort all events by eventStartDate descending (most recent first)
  allEvents.sort((a: any, b: any) => {
    const dateA = a.eventAdditionalDetails?.eventStartDate ? new Date(a.eventAdditionalDetails.eventStartDate).getTime() : 0;
    const dateB = b.eventAdditionalDetails?.eventStartDate ? new Date(b.eventAdditionalDetails.eventStartDate).getTime() : 0;
    return dateB - dateA;
  });
  
  // Filtering logic based on dates
  const upcomingEventsNodes = allEvents.filter((e: any) => {
    if (!e.eventAdditionalDetails?.eventStartDate) return false;
    const start = new Date(e.eventAdditionalDetails.eventStartDate);
    return start > now;
  });

  const ongoingEventsNodes = allEvents.filter((e: any) => {
    if (!e.eventAdditionalDetails?.eventStartDate) return false;
    const start = new Date(e.eventAdditionalDetails.eventStartDate);
    const end = e.eventAdditionalDetails.eventEndDate 
      ? new Date(e.eventAdditionalDetails.eventEndDate) 
      : start;
    return start <= now && end >= now;
  });

  const pastEventsNodes = allEvents.filter((e: any) => {
    if (!e.eventAdditionalDetails?.eventStartDate) return true; // If no date, maybe it's old?
    const start = new Date(e.eventAdditionalDetails.eventStartDate);
    const end = e.eventAdditionalDetails.eventEndDate 
      ? new Date(e.eventAdditionalDetails.eventEndDate) 
      : start;
    return end < now;
  });


  return {
    page: data?.page,
    upcomingEvents: { nodes: upcomingEventsNodes },
    ongoingEvents: { nodes: ongoingEventsNodes },
    pastEvents: { nodes: pastEventsNodes },
  };
}

export const getEventsOverviewPage = cache(getEventsOverviewPageUncached);
