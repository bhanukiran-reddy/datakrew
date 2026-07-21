/**
 * Fetch the navigation menus from the CMS.
 */

import { fetchGraphQL } from '@/lib/graphql/client';
import type { GetNavigationResponse } from '@/lib/graphql/types';

const GET_NAVIGATION = /* GraphQL */ `
  query GetNavigation($locale: String!) {
    navigation(locale: $locale) {
      header {
        id
        label
        href
        children {
          id
          label
          href
        }
      }
      footer {
        id
        label
        href
        children {
          id
          label
          href
        }
      }
    }
  }
`;

/** Fetch header and footer navigation for a given locale. */
export async function getNavigation(locale: string) {
    const data = await fetchGraphQL<GetNavigationResponse>(
        GET_NAVIGATION,
        { locale },
        { revalidate: 60, tags: [`navigation-${locale}`] },
    );
    return data.navigation;
}
