import { cache } from 'react';
import { attachSeoKeywords, defaultSeo, mapCmsSeo } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';

const GET_CASE_STUDIES_INNER_PAGE = /* GraphQL */ `
query getCaseStudyInnerPage($uri: ID!) {
  caseStudies(id: $uri, idType: URI) {
    title
    slug
    uri
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
    caseStudyCardFields {
      csKeyMetrics {
        csMetricLabel
        csMetricValue
      }
    }
    caseStudySections {
      opportunitySection {
        osDescription
        osHeading
      }
      challengeSection {
        csHeading
        csDescription
        csImage {
          node {
            altText
            mediaItemUrl
          }
        }
      }
      solutionSection {
        ssDescription
        ssHeading
      }
      impactSection {
        isHeading
        isDescription
        impactPoints {
          impactPointsText
        }
        isImage {
          node {
            altText
            mediaItemUrl
          }
        }
      }
      testimonialSection {
        testimonialDetails {
          nodes {
            ... on Testimonials {
              id
              title
              testimonialsFields {
                testifierCompanyName
                testifierDescription
                testifierDesignation
                testifierImage {
                  node {
                    altText
                    mediaItemUrl
                  }
                }
              }
            }
          }
        }
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

export type GetCaseStudyInnerPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getCaseStudyInnerPageUncached(locale: string = 'en', slug: string, options?: GetCaseStudyInnerPageOptions) {
  const defaultLocale = getDefaultLocaleSync();
  const uriCandidates =
    locale === defaultLocale
      ? [`resources/case-studies/${slug}/`, `case-studies/${slug}/`]
      : [`${locale}/resources/case-studies/${slug}/`, `${locale}/case-studies/${slug}/`];

  const tags = options?.tags ?? [`case-study-${slug}`];
  const revalidate = options?.revalidate ?? 60;

  for (const path of uriCandidates) {
    const uri = path.startsWith('/') ? path : `/${path}`;
    const data = await fetchGraphQL<any>(
      GET_CASE_STUDIES_INNER_PAGE,
      { uri },
      { tags, revalidate }
    );
    if (data?.caseStudies) {
      return attachSeoKeywords(data.caseStudies);
    }
  }

  return null;
}

export const getCaseStudyInnerPage = cache(getCaseStudyInnerPageUncached);
