/**
 * Fetch global site settings from the CMS.
 */

import { fetchGraphQL } from '@/lib/graphql/client';
import type { GetSiteSettingsResponse } from '@/lib/graphql/types';

const GET_SITE_SETTINGS = /* GraphQL */ `
  query GetSiteSettings {
    siteSettings {
      siteName
      logo {
        url
        alt
        width
        height
      }
      favicon {
        url
        alt
        width
        height
      }
      defaultSeo {
        title
        description
        ogImage {
          url
          alt
          width
          height
        }
      }
    }
  }
`;

/** Fetch site-wide settings (name, logo, default SEO, etc.). */
export async function getSiteSettings() {
    const data = await fetchGraphQL<GetSiteSettingsResponse>(
        GET_SITE_SETTINGS,
        undefined,
        { revalidate: 60, tags: ['site-settings'] },
    );
    return data.siteSettings;
}
