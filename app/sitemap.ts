/**
 * Hardcoded sitemap for SEO based on analyzed codebase pages.
 */
import type { MetadataRoute } from 'next';
import { getSupportedLocalesSync } from '@/lib/config/locales';
import { getBaseUrl } from '@/lib/env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (getBaseUrl() || 'https://www.datakrew.com').replace(/\/$/, '');
  const locales = getSupportedLocalesSync();

  // Optimized static path list analyzed from the app folder structure
  const paths = [
    '',
    '/about-us',
    '/book-a-demo',
    '/contact',
    '/investors',
    '/team',
    '/careers',
    '/termsandconditions',
    '/privacy-policy',
    '/customer/fleet-management',
    '/customer/oem',
    '/industry/construction-mining',
    '/industry/courier-last-mile-delivery',
    '/industry/logistics-delivery',
    '/industry/public-transport-schools',
    '/industry/rental-leasing-shared-mobility',
    '/industry/transportation-delivery',
    '/tech-stack',
    '/tech-stack/ai-solution/ask-ox',
    '/tech-stack/ai-solution/guardian-ai',
    '/tech-stack/hardware/itus-autoscan',
    '/tech-stack/hardware/itus-max',
    '/tech-stack/software/oxred-autocert',
    '/tech-stack/software/oxred-lens',
    '/tech-stack/software/oxred-myfleet',
    '/resources',
    '/resources/asset-compatibility',
    '/resources/oem-compatibility',
    '/resources/events',
    '/resources/case-studies',
    '/resources/videos-podcasts',
    '/resources/whitepapers',
    '/resources/infographics',
    '/resources/news',
    '/articles-blogs',
    '/use-case',


  ];

  const entries: MetadataRoute.Sitemap = [];

  // Construct URLs — only include locale prefix if it's NOT the default locale
  // This ensures paths are clean (e.g. /about-us, not /en/about-us) as per the middleware logic
  paths.forEach((path) => {
    locales.forEach((locale) => {
      const isDefault = locale === 'en';
      const url = `${base}${isDefault ? '' : `/${locale}`}${path === '' ? '' : path}`;
      
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: path === '' ? 1 : 0.8,
      });
    });
  });

  return entries;
}
