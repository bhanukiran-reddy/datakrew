import { cache } from 'react';
import { attachSeoKeywords, defaultSeo } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';
import type { SEOFields } from '../../types/cms';

const GET_BOOK_A_DEMO_PAGE = /* GraphQL */ `
  query getBookaDemoPage($id: ID!) {
    page(id: $id, idType: URI) {
    seo {
      title
      metaDesc
      canonical
    }
    seoKeywords {
      primaryKeywords
      secondaryKeywords
    }
      uri
      title
      titleDescriptionSection {
        sectionTitle
        sectionDescription
      }
      intelligenceStackSection {
        stackSectionHeader
        stackSectionDescription
        stackDetails {
          nodes {
            ... on Infrastructure {
              id
              title
              uri
              infrastructureCategory {
                nodes {
                  name
                }
              }
              productFeatures {
                featuredCardImage {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
                featureDescription
                featuresList {
                  featureText
                }
                featureCtaText
                featureCtaUrl
              }
            }
          }
        }
        stackCtaButton {
          stackButtonText
          stackButtonUrl {
            url
          }
        }
      }
      bookADemoStepsSection {
        bookDemoSectionHeading
        bookDemoSteps {
          bookDemoStepOne {
            stepOneNumber
            stepOneHeading
            stepOneQuestion
            stepOneCtaButtonText
            stepOneAnswerOptions {
              stepOneOptionIconClass
              stepOneOptionText
            }
          }
          bookDemoStepTwo {
            stepTwoNumber
            stepTwoHeading
            stepTwoCtaButtons {
              stepTwobuttonLeftText
              stepTwobuttonRightText
            }
            stepTwoFleetPersona {
              fleetPersonaQuestion
              personaAnswerOptions {
                fleetOptionText
                fleetOptionIcon {
                  node {
                    mediaItemUrl
                  }
                }
              }
            }
            stepTwoOemsPersona {
              oemPersonaQuestion
              oemAnswerOptions {
                oemOptionText
                oemOptionIcon {
                  node {
                    mediaItemUrl
                  }
                }
              }
            }
            stepTwoOthersPersona {
              personaOthersQuestion
              othersPersonaAnswerOptions {
                othersOptionText
                othersOptionIcon {
                  node {
                    mediaItemUrl
                  }
                }
              }
            }
          }
          bookDemoStepThree {
            stepThreeNumber
            stepThreeHeading
            stepThreeFormHeading
            stepThreeFormBlock
            stepThreeCtaButtons {
              stepThreeButtonLeftText
              stepThreeButtonRightText
            }
          }
        }
      }
    }
  }
`;

export interface BookaDemoTitleDescriptionSection {
  sectionTitle?: string | null;
  sectionDescription?: string | null;
}

export interface BookaDemoIntelligenceStackSection {
  stackSectionHeader?: string | null;
  stackSectionDescription?: string | null;
  stackDetails?: {
    nodes?: Array<{
      id?: string | null;
      title?: string | null;
      uri?: string | null;
      infrastructureCategory?: {
        nodes?: Array<{ name?: string | null }>;
      } | null;
      productFeatures?: {
        featuredCardImage?: {
          node?: {
            mediaItemUrl?: string | null;
            altText?: string | null;
          } | null;
        } | null;
        featureDescription?: string | null;
        featuresList?: Array<{ featureText?: string | null }> | null;
        featureCtaText?: string | null;
        featureCtaUrl?: string | null;
      } | null;
    }>;
  } | null;
  stackCtaButton?: {
    stackButtonText?: string | null;
    stackButtonUrl?: { url?: string | null } | null;
  } | null;
}

export interface BookDemoStepOneOption {
  stepOneOptionIconClass?: string | null;
  stepOneOptionText?: string | null;
  stepOneOptionIcon?: {
    node?: {
      mediaItemUrl?: string | null;
    } | null;
  } | null;
}

export interface BookDemoStepOne {
  stepOneNumber?: string | null;
  stepOneHeading?: string | null;
  stepOneQuestion?: string | null;
  stepOneCtaButtonText?: string | null;
  stepOneAnswerOptions?: BookDemoStepOneOption[] | null;
}

export interface BookDemoStepTwo {
  stepTwoNumber?: string | null;
  stepTwoHeading?: string | null;
  stepTwoCtaButtons?: {
    stepTwobuttonLeftText?: string | null;
    stepTwobuttonRightText?: string | null;
  } | null;
  stepTwoFleetPersona?: Array<{
    fleetPersonaQuestion?: string | null;
    personaAnswerOptions?: Array<{
      fleetOptionText?: string | null;
      fleetOptionIcon?: {
        node?: {
          mediaItemUrl?: string | null;
        } | null;
      } | null;
    }> | null;
  }> | null;
  stepTwoOemsPersona?: Array<{
    oemPersonaQuestion?: string | null;
    oemAnswerOptions?: Array<{
      oemOptionText?: string | null;
      oemOptionIcon?: {
        node?: {
          mediaItemUrl?: string | null;
        } | null;
      } | null;
    }> | null;
  }> | null;
  stepTwoOthersPersona?: {
    personaOthersQuestion?: string | null;
    othersPersonaAnswerOptions?: Array<{
      othersOptionText?: string | null;
      othersOptionIcon?: {
        node?: {
          mediaItemUrl?: string | null;
        } | null;
      } | null;
    }> | null;
  } | null;
}

export interface BookDemoStepThree {
  stepThreeNumber?: string | null;
  stepThreeHeading?: string | null;
  stepThreeFormHeading?: string | null;
  stepThreeFormBlock?: string | null;
  stepThreeCtaButtons?: {
    stepThreeButtonLeftText?: string | null;
    stepThreeButtonRightText?: string | null;
  } | null;
}

export interface BookADemoStepsSection {
  bookDemoSectionHeading?: string | null;
  bookDemoSteps?: {
    bookDemoStepOne?: BookDemoStepOne | null;
    bookDemoStepTwo?: BookDemoStepTwo | null;
    bookDemoStepThree?: BookDemoStepThree | null;
  } | null;
}

export interface BookaDemoPageData {
  uri?: string | null;
  title?: string | null;
  seo?: SEOFields | null;
  titleDescriptionSection?: BookaDemoTitleDescriptionSection | null;
  intelligenceStackSection?: BookaDemoIntelligenceStackSection | null;
  bookADemoStepsSection?: BookADemoStepsSection | null;
}

interface GetBookaDemoPageResponse {
  page: BookaDemoPageData | null;
}

export type GetBookaDemoPageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getBookaDemoPageUncached(
  locale: string,
  options?: GetBookaDemoPageOptions
): Promise<BookaDemoPageData | null> {
  const defaultLocale = getDefaultLocaleSync();
  const id = locale === defaultLocale ? 'book-a-demo' : `${locale}/book-a-demo`;

  const tags = options?.tags ?? [`page-${locale}-book-a-demo`];
  const revalidate = options?.revalidate;

  const data = await fetchGraphQL<GetBookaDemoPageResponse>(
    GET_BOOK_A_DEMO_PAGE,
    { id },
    { tags, revalidate }
  );

  return data?.page ? attachSeoKeywords(data.page) : null;
}

export const getBookaDemoPage = cache(getBookaDemoPageUncached);

export function getBookaDemoPageSeo(page: BookaDemoPageData | null): SEOFields {
  if (!page) return defaultSeo('Book a Demo');
  if (page.seo) return page.seo;
  return defaultSeo(page.title ?? 'Book a Demo');
}
