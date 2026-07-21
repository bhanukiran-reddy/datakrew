/**
 * Apollo Client for Next.js App Router (RSC).
 * Provides request deduplication, normalized cache per request, and Next.js fetch options (revalidate, tags).
 * Use getClient().query() or the fetchGraphQL wrapper in client.ts.
 */

import { HttpLink, from } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';
import { env } from '@/lib/env';

function makeClient() {
  const uri = env.graphqlEndpoint;
  if (!uri) {
    throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT is not set. Check your .env file.');
  }

  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            page: {
              keyArgs: ['slug', 'locale'],
            },
          },
        },
      },
    }),
    link: from([
      new RetryLink({
        delay: {
          initial: 500,
          max: 3000,
          jitter: true,
        },
        attempts: {
          max: 2,
          retryIf: (error: any) => {
            // Only retry on network failures or 502/503/504 gateway errors.
            // Avoid retrying on 4xx or general GraphQL errors to save time.
            const status = error?.statusCode || error?.response?.status;
            if (status === 502 || status === 503 || status === 504) return true;
            if (error?.message?.includes('fetch failed')) return true;
            return false;
          },
        },
      }),
      new HttpLink({
        uri,
        fetch: async (input, init) => {
          const response = await fetch(input, init);
          const text = await response.text();
          if (!text.trim()) {
            throw new Error(`GraphQL endpoint returned empty response (${response.status})`);
          }
          return new Response(text, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          });
        },
        // @apollo/client-integration-nextjs automatically uses Next.js fetch
        // Per-query fetchOptions (revalidate, tags, headers) are set via context.fetchOptions in query()
        // Don't set cache: 'no-store' here as it conflicts with revalidate options
      }),
    ]),
  });
}

export const { getClient } = registerApolloClient(makeClient);
