import { cache } from 'react';
import { withSeoKeywordsOnField } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';

const GET_CASE_STUDIES_OVERVIEW_PAGE = /* GraphQL */ `
query getCaseStudiesOverviewPage($afterCursor: String) {
  page(id: "case-studies", idType: URI) {
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
    caseStudyCarouselSection {
      csCarouselHeading
      csCarouselDescription
      csCarouselItems {
        nodes {
          ... on CaseStudies {
            title
            uri
            featuredImage {
              node {
                mediaItemUrl
                altText
              }
            }
            caseStudyCardFields {
              csClientName
              csClientTitle
              csCtaText
              csDescription
              csClientPhoto {
                node {
                  mediaItemUrl
                  altText
                }
              }
              csKeyMetrics {
                csMetricLabel
                csMetricValue
              }
            }
          }
        }
      }
    }
    performanceMetricsSection{
      metricsHeading
      metricsDescription
      metricsItems{
        metricValue
        metricImage{
          node{
            mediaItemUrl
            altText
          }
        }
        metricTitle
        metricDescription
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
  regularCaseStudies: allCaseStudies(
    first: 3
    after: $afterCursor
    where: {isFeaturedCaseStudy: false, orderby: {field: DATE, order: DESC}, status: PUBLISH}
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
      industries {
        nodes {
          name
        }
      }
      region {
        nodes {
          name
        }
      }
    }
  }
}
`;

export type GetCaseStudiesOverviewPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getCaseStudiesOverviewPageUncached(afterCursor?: string, options?: GetCaseStudiesOverviewPageOptions) {
  const tags = options?.tags ?? ['case-studies-overview-page'];
  const revalidate = options?.revalidate ?? 60;

  const data = await fetchGraphQL<any>(
    GET_CASE_STUDIES_OVERVIEW_PAGE,
    { afterCursor },
    { tags, revalidate }
  );

  return data ? withSeoKeywordsOnField(data, 'page') : data;
}

export const getCaseStudiesOverviewPage = cache(getCaseStudiesOverviewPageUncached);
