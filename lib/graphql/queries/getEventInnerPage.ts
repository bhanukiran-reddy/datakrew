import { fetchGraphQL } from "../client";
import { attachSeoKeywords, defaultSeo, mapCmsSeo } from '../mapSeo';


export const getEventInnerPage = async (uri: string) => {
  const query = `
    query getEventInnerPage($uri: ID!) {
      events(id: $uri, idType: URI) {
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
          eventGallery {
            nodes {
              mediaItemUrl
              altText
            }
          }
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
        singleMediaSection {
          singleMediaSectionHeading
          singleMediaSectionDescription
          singleMedia {
            node {
              mediaItemUrl
              altText
            }
          }
          singleMobileMedia {
            node {
              mediaItemUrl
              altText
            }
          }
          singleMediaCtaButtons {
            singleMediaButtonText
            singleMediaButtonUrl {
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
    }
  `;

  const response = await fetchGraphQL<any>(query, { uri });
  return response?.events ? attachSeoKeywords(response.events) : undefined;

};
