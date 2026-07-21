/**
 * Fetch redirect rules from the CMS.
 * Used by middleware to handle old → new URL redirections.
 */

import { fetchGraphQL } from '@/lib/graphql/client';
import type { GetRedirectsResponse } from '@/lib/graphql/types';
import type { Redirect } from '@/lib/types/cms';

const GET_REDIRECTS = /* GraphQL */ `
  query GetRedirects {
    redirects {
      from
      to
      statusCode
      locale
    }
  }
`;

/** In-memory cache for redirects. */
let cachedRedirects: Redirect[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

/**
 * Fetch redirects from CMS. Cached in-memory with a 1-minute TTL.
 * Falls back to an empty array if the GraphQL endpoint is not configured.
 */
export async function getRedirects(): Promise<Redirect[]> {
    const now = Date.now();

    if (cachedRedirects && now - cacheTimestamp < CACHE_TTL_MS) {
        return cachedRedirects;
    }

    try {
        const data = await fetchGraphQL<GetRedirectsResponse>(
            GET_REDIRECTS,
            undefined,
            { revalidate: false },
        );
        cachedRedirects = data.redirects;
        cacheTimestamp = now;
        return cachedRedirects;
    } catch {
        // If GraphQL is not yet configured or fails, don't block middleware
        return cachedRedirects ?? [];
    }
}

/**
 * Find a matching redirect for the given path.
 * The path should NOT include the locale prefix.
 */
export function findRedirect(
    redirects: Redirect[],
    path: string,
    locale?: string,
): Redirect | undefined {
    return redirects.find((r) => {
        const pathMatch = r.from === path;
        const localeMatch = !r.locale || r.locale === locale;
        return pathMatch && localeMatch;
    });
}
