import 'server-only';
/**
 * GraphQL data layer using Apollo Client (RSC).
 * Request deduplication, normalized cache per request, Next.js revalidate/tags.
 */

import { parse } from 'graphql';
import { getClient } from '@/lib/graphql/apollo-client';
import { siteConfig } from '@/lib/config/site';

export class GraphQLError extends Error {
  constructor(
    public errors: Array<{ message: string; locations?: unknown; path?: unknown }>,
  ) {
    super(errors.map((e) => e.message).join(', '));
    this.name = 'GraphQLError';
  }
}

export interface FetchGraphQLOptions {
  /** Next.js ISR revalidation in seconds. Defaults to siteConfig.defaultRevalidate. */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation via revalidateTag(). */
  tags?: string[];
}

/**
 * Execute a GraphQL query via Apollo Client.
 * Deduplicated per request; supports Next.js cache (revalidate, tags).
 */
export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: FetchGraphQLOptions,
): Promise<T> {
  const next = {
    revalidate: options?.revalidate ?? siteConfig.defaultRevalidate,
    tags: options?.tags,
  };
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const document = parse(query);
  try {
    const result = await getClient().query({
      query: document,
      variables: variables ?? {},
      // Use cache-first to prevent unnecessary refetches within the same request
      fetchPolicy: 'cache-first',
      // Don't retry on errors
      errorPolicy: 'none',
      context: {
        fetchOptions: {
          next,
          headers,
        },
      },
    });

    if (result.error) {
      const err = result.error as { graphQLErrors?: Array<{ message: string; locations?: unknown; path?: unknown }>; message?: string };
      const errors = err.graphQLErrors?.length
        ? err.graphQLErrors
        : [{ message: err.message || 'GraphQL request failed' }];
      throw new GraphQLError(errors);
    }

    return result.data as T;
  } catch (error) {
    // Handle Apollo Client network errors (404, etc.)
    if (error && typeof error === 'object' && 'networkError' in error) {
      const networkError = (error as { networkError?: { statusCode?: number; response?: { status?: number }; message?: string } }).networkError;
      if (networkError) {
        const statusCode = networkError.statusCode || networkError.response?.status;
        if (statusCode === 404 || (statusCode && statusCode >= 400)) {
          throw new GraphQLError([
            {
              message: `GraphQL endpoint returned ${statusCode}: ${networkError.message || 'Request failed'}`,
            },
          ]);
        }
      }
    }
    // Re-throw GraphQL errors
    if (error instanceof GraphQLError) {
      throw error;
    }
    // Re-throw other errors
    throw error;
  }
}
