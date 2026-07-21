/**
 * Fetch available locales from the CMS.
 * Can be used to dynamically build generateStaticParams for locale routes.
 */

import { fetchGraphQL } from '@/lib/graphql/client';
import type { GetLocalesResponse } from '@/lib/graphql/types';

const GET_LOCALES = /* GraphQL */ `
  query GetLocales {
    locales {
      code
      name
      isDefault
    }
  }
`;

/** Fetch all available locales from the CMS. */
export async function getLocales() {
  const data = await fetchGraphQL<GetLocalesResponse>(
    GET_LOCALES,
    undefined,
    { revalidate: 60, tags: ['locales'] },
  );
  return data.locales;
}
