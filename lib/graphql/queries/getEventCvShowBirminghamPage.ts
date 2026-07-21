import { cache } from 'react';
import { attachSeoKeywords, defaultSeo, mapCmsSeo } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { env } from '../../env';

const GET_EVENT_CV_SHOW_BIRMINGHAM_PAGE = /* GraphQL */ `
query getEventCvShowBirminghamPage($id: ID!) {
  events(id: $id, idType: URI) {
    id
    title
    slug
    uri
    eventAdditionalDetails {
      eventLogo {
        node {
          mediaItemUrl
        }
      }
      eventStartDate
      eventEndDate
      eventLocation
      eventVenue
      eventVenueLink
    }
    eventHeroSection {
      eventHeroHeading
      eventHeroDescription
      eventHeroImage {
        node {
          mediaItemUrl
        }
      }
      eventHeroMobileImage {
        node {
          mediaItemUrl
        }
      }
      bannerEventDate
      bannerEventVenue
      eventHeroCTAButtons {
        eventButtonText
        eventButtonUrl {
          url
          target
        }
      }
    }
    performanceMetricsSection {
      metricsHeading
      metricsDescription
      metricsItems {
        metricValue
        metricTitle
        metricDescription
      }
    }
    staggeredGridSection {
      enableStaggeredGridSection
      gridSectionHeading
      gridSectionDescription
      gridIconPosition
      gridItems {
        gridCellType
        gridIconClass
        gridItemIconImage {
          node {
            mediaItemUrl
          }
        }
        gridItemDescription
        gridItemTitle
        gridLayoutStyle
      }
    }
    comparisionTableSection {
      ctSectionHeading
      ctSectionDescription
      tableColumnItems {
        columnHeading
        columnValues {
          columnText
        }
      }
      ctCtaButtons {
        ctButtonText
        ctButtonUrl {
          target
          url
        }
      }
    }
    eventsSpeakersSection {
      eventSpeakersHeading
      eventSpeakersDescription
      eventSpeakers {
        nodes {
          ... on Team {
            id
            title
            featuredImage {
              node {
                altText
                mediaItemUrl
              }
            }
            teamAdditionFields {
              teamDesignation
              socialLinks {
                linkedinUrl
              }
            }
          }
        }
      }
      eventSpeakersBgImage {
        node {
          mediaItemUrl
        }
      }
      eventSpeakersBgMobileImage {
        node {
          mediaItemUrl
        }
      }
    }
    twoColumnFormSection {
      twoColumnFormHeading
      twoColumnFormDescription
      twoColumnDescriptionFeatures {
        featureHeading
        featureDescription
      }
      formHeading
    }
    prefooterCtaBannerSection {
      prefooterBannerCtaButtons {
        buttonStyle
        buttonText
        buttonUrl {
          target
          url
        }
      }
      prefooterCtaBackgroundImage {
        node {
          mediaItemUrl
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
}
`;

export type GetEventCvShowBirminghamPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getEventCvShowBirminghamPageUncached(
  locale: string,
  options?: GetEventCvShowBirminghamPageOptions
) {
  // Using explicit URI ID instead of slug/locale mapping for now since the query targets one specific event uri
  const id = 'events/cv-show-birmingham/';

  const tags = options?.tags ?? [`event-${locale}-cv-show-birmingham`];
  const revalidate = options?.revalidate;

  const data = await fetchGraphQL<any>(
    GET_EVENT_CV_SHOW_BIRMINGHAM_PAGE,
    { id },
    { tags, revalidate }
  );

  return data?.events ? attachSeoKeywords(data.events) : null;
}

export const getEventCvShowBirminghamPage = cache(getEventCvShowBirminghamPageUncached);
