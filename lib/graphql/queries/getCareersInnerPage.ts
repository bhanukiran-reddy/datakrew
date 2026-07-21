import { cache } from "react";
import { withSeoKeywordsOnFields } from '../mapSeo';
import { fetchGraphQL } from "@/lib/graphql/client";
import { getDefaultLocaleSync } from "@/lib/config/locales";

export const GET_CAREERS_INNER_PAGE = /* GraphQL */ `
  query getCarrersInnerPage($uri: ID!) {
    careers(id: $uri, idType: URI) {
      title
      slug
      uri
      careersAdditionalFields {
        jobLocation
        jobExperience
        jobType
        jobDescription
        jobRequirements
        jobResponsibilities
      }
      featuredImage {
        node {
          mediaItemUrl
          altText
        }
      }
      seo {
        title
        metaDesc
        canonical
      }
    }
  }
`;


export const getCareersInnerPage = cache(async (locale: string, slug: string) => {
  const defaultLocale = getDefaultLocaleSync();
  // WordPress 'careers' CPT URIs might vary. 
  // Based on the sample provided: /careers/machine-learning-engineer/
  const uri = locale === defaultLocale ? `/careers/${slug}/` : `/${locale}/careers/${slug}/`;
  
  const response = await fetchGraphQL<any>(GET_CAREERS_INNER_PAGE, { 
    uri: uri
  });

  return response
    ? withSeoKeywordsOnFields(response, ['news', 'blog', 'podcast', 'career'])
    : response;
});
