/**
 * robots.txt for SEO and crawler control.
 */
import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const base = (getBaseUrl() || 'https://www.datakrew.com').replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/auth/'], // Safe defaults
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    // llms.txt: LLM-friendly site index for AI search engines (https://llmstxt.org)
    // Served as a static file from /public/llms.txt → accessible at /llms.txt
  };
}
