import { cache } from "react";
import { attachSeoKeywords } from '../mapSeo';
import { fetchGraphQL } from "@/lib/graphql/client";
import { getDefaultLocaleSync } from "@/lib/config/locales";

export const GET_CAREERS_OVERVIEW_PAGE = /* GraphQL */ `
query getCareersOverviewPage($id: ID!) {
  page(id: $id, idType: URI) {
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
    featureTabsSection {
      enableFeatureTabsSection
      featureTabsSectionDescription
      featureTabsSectionHeading
      tabs {
        tabLabel
        tabIntro
        tabDescription
        tabImage {
          node {
            altText
            mediaItemUrl
          }
        }
      }
    }
    krewCommunitySection {
      krewCommunityHeading
      krewCommunityDescription
      krewCommunityGallery {
        nodes {
          mediaItemUrl
          altText
        }
      }
    }
    testimonialSection {
      testimonialHeading
      testimonialsDetails {
        nodes {
          ... on Testimonials {
            id
            title
            testimonialsFields {
              testifierCompanyName
              testifierDescription
              testifierDesignation
            }
          }
        }
      }
    }
    careerResumeSection{
      careerResumeHeading
      careerResumeDescription
      careerResumeBgImage{
        node{
          mediaItemUrl
          altText
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
  allCareers(where: {status: PUBLISH, orderby: {field: DATE, order: DESC}}) {
    nodes {
      title
      uri
      careersAdditionalFields {
        jobExperience
        jobLocation
        jobType
      }
    }
  }
}
`;

export const getCareersOverviewPage = cache(async (locale: string) => {
  const defaultLocale = getDefaultLocaleSync();
  const id = locale === defaultLocale ? "/careers/" : `/${locale}/careers/`;

  try {
    const data = await fetchGraphQL<any>(GET_CAREERS_OVERVIEW_PAGE, {
      id: id
    });
    return data;
  } catch (error) {
    console.error("[getCareersOverviewPage] Error fetching careers page:", error);
    return null;
  }
});
