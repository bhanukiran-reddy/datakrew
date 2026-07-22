import { cache } from 'react';
import type { CMSPage } from '@/lib/types/cms';
import { getAboutUsPage } from '@/lib/graphql/queries/getAboutUsPage';
import { getAssetCompatibilityPage } from '@/lib/graphql/queries/getAssetCompatibilityPage';
import { getBlogInnerPage } from '@/lib/graphql/queries/getBlogInnerPage';
import { getBlogOverviewPage } from '@/lib/graphql/queries/getBlogOverviewPage';
import { getBookaDemoPage } from '@/lib/graphql/queries/getBookADemoPage';
import { getByCustomerByFleetPage } from '@/lib/graphql/queries/getByCustomerByFleetPage';
import { getByCustomerOEMPage } from '@/lib/graphql/queries/getByCustomerOEMPage';
import { getByNeedSinglePage } from '@/lib/graphql/queries/getByNeedSinglePage';
import { getTeamPage } from '@/lib/graphql/queries/getByTeamPage';
import { getCareersInnerPage } from '@/lib/graphql/queries/getCareersInnerPage';
import { getCareersOverviewPage } from '@/lib/graphql/queries/getCareersOverviewPage';
import { getCaseStudiesOverviewPage } from '@/lib/graphql/queries/getCaseStudiesOverviewPage';
import { getCaseStudyInnerPage } from '@/lib/graphql/queries/getCaseStudyInnerPage';
import { getContactPage } from '@/lib/graphql/queries/getContactPage';
import { getEventCvShowBirminghamPage } from '@/lib/graphql/queries/getEventCvShowBirminghamPage';
import { getEventInnerPage } from '@/lib/graphql/queries/getEventInnerPage';
import { getEventsOverviewPage } from '@/lib/graphql/queries/getEventsOverviewPage';
import { getHomePage } from '@/lib/graphql/queries/getHomePage';
import { getIndustryConstructionMiningPage } from '@/lib/graphql/queries/getIndustryConstructionMiningPage';
import { getIndustryCourierandLastMileDeliveryPage } from '@/lib/graphql/queries/getIndustryCourierLastMileDeliveryPage';
import { getIndustryLogisticsPage } from '@/lib/graphql/queries/getIndustryLogisticsPage';
import { getIndustryPublicTransportPage } from '@/lib/graphql/queries/getIndustryPublicTransportPage';
import { getIndustryRentalLeasingandSharedMobilityPage } from '@/lib/graphql/queries/getIndustryRentalLeasingSharedMobilityPage';
import { getIndustryTransportationDeliveryPage } from '@/lib/graphql/queries/getIndustryTransportationDeliveryPage';
import { getInfrastructureAskOXPage } from '@/lib/graphql/queries/getInfrastructureAskOXPage';
import { getInfrastructureITUSAutoscanPage } from '@/lib/graphql/queries/getItusAutoscanPage';
import { getInfrastructureItusMaxPage } from '@/lib/graphql/queries/getItusMaxPage';
import { getInfrastructureOXREDAutoCertPage } from '@/lib/graphql/queries/getOxredAutocertPage';
import { getInfrastructureOXREDGuardianAIPage } from '@/lib/graphql/queries/getOxredGuardianAiPage';
import { getInfrastructureOXREDMyFleetPage } from '@/lib/graphql/queries/getOxredMyFleetPage';
import { getInfrastructureOXRedLensPage } from '@/lib/graphql/queries/getOxredLensPage';
import { getInfographicOverviewPage } from '@/lib/graphql/queries/getInfographicOverviewPage';
import { getIntelligenceInfrastructurePage } from '@/lib/graphql/queries/getIntelligenceInfrastructurePage';
import { getInvestorsPage } from '@/lib/graphql/queries/getInvestorsPage';
import { getNewsInnerPage } from '@/lib/graphql/queries/getNewsInnerPage';
import { getNewsOverviewPage } from '@/lib/graphql/queries/getNewsOverviewPage';
import { getOEMCompatibilityPage } from '@/lib/graphql/queries/getOEMCompatibilityPage';
import { getPodcastInnerPageData } from '@/lib/graphql/queries/getPodcastInnerPage';
import { getPodcastsandVideosOverviewPage } from '@/lib/graphql/queries/getPodcastsAndVideosOverviewPage';
import { getResourcesOverviewPage } from '@/lib/graphql/queries/getResourcesOverviewPage';
import { getTermsAndConditionPage } from '@/lib/graphql/queries/getTermsAndConditionPage';
import { getPrivacyPolicyPage } from '@/lib/graphql/queries/getPrivacyPolicyPage';
import { getWhitepapersOverviewPage } from '@/lib/graphql/queries/getWhitepapersOverviewPage';
import {
  buildWebPageSeo,
  heroFromBlogEntity,
  heroFromEventEntity,
  heroFromInnerPageHero,
  type WebPageSeoData,
  webPageSeoFromCmsPage,
  webPageSeoFromEntity,
  webPageSeoFromHomePage,
  webPageSeoFromWpPage,
} from './webPageSeoHelpers';

type InfraRoute = {
  fetch: (locale: string) => Promise<CMSPage | null>;
  fallback: string;
};

const INFRASTRUCTURE_ROUTES: Record<string, InfraRoute> = {
  'tech-stack/hardware/itus-max': {
    fetch: (locale) => getInfrastructureItusMaxPage(locale, '/infrastructure/itus-max').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'ITUSMax',
  },
  'tech-stack/hardware/itus-autoscan': {
    fetch: (locale) =>
      getInfrastructureITUSAutoscanPage(locale, '/infrastructure/itus-autoscan').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'ITUS Autoscan',
  },
  'tech-stack/software/oxred-lens': {
    fetch: (locale) => getInfrastructureOXRedLensPage(locale, '/infrastructure/oxred-lens').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'OxRed Lens',
  },
  'tech-stack/software/oxred-autocert': {
    fetch: (locale) =>
      getInfrastructureOXREDAutoCertPage(locale, '/infrastructure/oxred-autocert').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'OxRed',
  },
  'tech-stack/software/oxred-myfleet': {
    fetch: (locale) =>
      getInfrastructureOXREDMyFleetPage(locale, '/infrastructure/oxred-myfleet').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'OxRed',
  },
  'tech-stack/ai-solution/ask-ox': {
    fetch: (locale) => getInfrastructureAskOXPage(locale, '/infrastructure/ask-ox').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'Ask OX',
  },
  'tech-stack/ai-solution/guardian-ai': {
    fetch: (locale) => getInfrastructureOXREDGuardianAIPage(locale, '/guardian-ai').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'GuardianAI',
  },
};

type IndustryRoute = {
  fetch: (locale: string) => Promise<Record<string, unknown> | null | undefined>;
  fallback: string;
};

const INDUSTRY_ROUTES: Record<string, IndustryRoute> = {
  'industry/logistics-delivery': {
    fetch: (locale) => getIndustryLogisticsPage(locale, '').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'Logistics & Delivery',
  },
  'industry/construction-mining': {
    fetch: (locale) => getIndustryConstructionMiningPage(locale, '').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'Construction & Mining',
  },
  'industry/courier-last-mile-delivery': {
    fetch: (locale) => getIndustryCourierandLastMileDeliveryPage(locale, '').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'Courier & Last Mile Delivery',
  },
  'industry/rental-leasing-shared-mobility': {
    fetch: (locale) => getIndustryRentalLeasingandSharedMobilityPage(locale, '').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'Rental, Leasing & Shared Mobility',
  },
  'industry/transportation-delivery': {
    fetch: (locale) => getIndustryTransportationDeliveryPage(locale, 'transportation-delivery').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'Transportation and Delivery',
  },
  'industry/public-transport-schools': {
    fetch: (locale) => getIndustryPublicTransportPage(locale, 'public-transport-schools').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
    fallback: 'Public Transport & Schools',
  },
};

async function resolveStaticRoute(locale: string, path: string): Promise<WebPageSeoData | null> {
  switch (path) {
    case '':
      return webPageSeoFromHomePage(await getHomePage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }));
    case 'about-us':
      return webPageSeoFromCmsPage(await getAboutUsPage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }), path, 'About Us');
    case 'contact':
      return webPageSeoFromWpPage(await getContactPage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }), path, 'Contact Us');
    case 'investors':
      return webPageSeoFromWpPage(await getInvestorsPage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }), path, 'Investors');
    case 'team':
      return webPageSeoFromCmsPage(await getTeamPage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }), path, 'Team');
    case 'termsandconditions':
      return webPageSeoFromWpPage(
        await getTermsAndConditionPage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath] termsandconditions', err);
          return null;
        }),
        path,
        'Terms & Conditions',
      );
    case 'privacy-policy':
      return webPageSeoFromWpPage(
        await getPrivacyPolicyPage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath] privacy-policy', err);
          return null;
        }),
        path,
        'Privacy Policy',
      );
    case 'partners-reseller':
      return buildWebPageSeo(path, 'Partners & Resellers');
    case 'search':
      return buildWebPageSeo(
        path,
        'Search',
        'Search Datakrew for articles, case studies, news, and resources.',
      );
    case 'book-a-demo':
      return webPageSeoFromWpPage(await getBookaDemoPage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }), path, 'Book a Demo');
    case 'tech-stack':
      return webPageSeoFromCmsPage(
        await getIntelligenceInfrastructurePage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
        path,
        'Tech Stack',
      );
    case 'articles-blogs': {
      const data = await getBlogOverviewPage().catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromWpPage((data as { page?: Record<string, unknown> } | null)?.page, path, 'Blog');
    }
    case 'careers': {
      const data = await getCareersOverviewPage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromWpPage(data?.page, path, 'Careers');
    }
    case 'careers/thank-you':
      return buildWebPageSeo(
        path,
        'Thank You - Careers',
        'Thank you for submitting your application to Datakrew.',
      );
    case 'resources': {
      const data = await getResourcesOverviewPage().catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromWpPage((data as { page?: Record<string, unknown> } | null)?.page, path, 'Resources');
    }
    case 'resources/news': {
      const data = await getNewsOverviewPage().catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromWpPage(data?.page, path, 'News');
    }
    case 'resources/events': {
      const data = await getEventsOverviewPage().catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromWpPage(data?.page, path, 'Events');
    }
    case 'resources/case-studies': {
      const data = await getCaseStudiesOverviewPage().catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromWpPage(data?.page, path, 'Case Studies');
    }
    case 'resources/videos-podcasts': {
      const data = await getPodcastsandVideosOverviewPage().catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromWpPage(data?.page, path, 'Videos & Podcasts');
    }
    case 'resources/whitepapers': {
      const data = await getWhitepapersOverviewPage().catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromWpPage(data?.page, path, 'Whitepapers');
    }
    case 'resources/infographics': {
      const data = await getInfographicOverviewPage().catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromWpPage(data?.page, path, 'Infographics');
    }
    case 'resources/oem-compatibility': {
      const data = await getOEMCompatibilityPage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromWpPage(data?.page, path, 'OEM Compatibility');
    }
    case 'resources/asset-compatibility': {
      const data = await getAssetCompatibilityPage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromWpPage(data?.page, path, 'Asset Compatibility');
    }
    case 'resources/events/cv-show-birmingham': {
      const event = await getEventCvShowBirminghamPage(locale).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
      return webPageSeoFromEntity(
        event,
        path,
        (event?.eventHeroSection?.eventHeroHeading as string | undefined) || event?.title || 'CV Show Birmingham',
        heroFromEventEntity(event),
      );
    }
    case 'customer/oem':
      return webPageSeoFromCmsPage(
        (await getByCustomerOEMPage(locale, 'customer/oem/').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        })) as CMSPage | null,
        path,
        'By OEM',
      );
    case 'customer/fleet-management':
      return webPageSeoFromCmsPage(
        await getByCustomerByFleetPage(locale, '/tech-stack/byfleet').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        }),
        path,
        'Byfleet',
      );
    default:
      return null;
  }
}

async function resolveDynamicRoute(
  locale: string,
  path: string,
  segments: string[],
): Promise<WebPageSeoData | null> {
  const [s0, s1, s2, s3] = segments;

  if (s0 === 'articles-blogs' && s1) {
    const data = await getBlogInnerPage(locale, s1).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
    const blog = data?.blog as Record<string, unknown> | undefined;
    return webPageSeoFromEntity(blog, path, (blog?.title as string) || 'Blog', heroFromBlogEntity(blog));
  }

  if (s0 === 'use-case' && s1) {
    const data = await getByNeedSinglePage(s1, 'SLUG').catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
    return webPageSeoFromEntity(
      data,
      path,
      data?.title || 'Use Case',
      heroFromInnerPageHero(data?.innerPageHeroSection),
    );
  }

  if (s0 === 'careers' && s1 === 'thank-you') {
    return null;
  }

  if (s0 === 'careers' && s2 === 'thank-you' && s1) {
    const response = await getCareersInnerPage(locale, s1).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
    const title = response?.careers?.title
      ? `Thank You - ${response.careers.title}`
      : 'Thank You';
    return buildWebPageSeo(
      path,
      title,
      'Thank you for submitting your application to Datakrew.',
    );
  }

  if (s0 === 'careers' && s1) {
    const response = await getCareersInnerPage(locale, s1).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
    const careers = response?.careers as Record<string, unknown> | undefined;
    return webPageSeoFromEntity(
      careers,
      path,
      (careers?.title as string) || 'Careers',
      (careers?.featuredImage as { node?: { mediaItemUrl?: string } } | undefined)?.node?.mediaItemUrl,
    );
  }

  if (s0 === 'resources' && s1 === 'news' && s2) {
    const data = await getNewsInnerPage(locale, s2).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
    const news = data?.news as Record<string, unknown> | undefined;
    return webPageSeoFromEntity(
      news,
      path,
      (news?.title as string) || 'News',
      heroFromInnerPageHero(news?.innerPageHeroSection as Record<string, unknown> | undefined),
    );
  }

  if (s0 === 'resources' && s1 === 'events' && s2 && s2 !== 'cv-show-birmingham') {
    const event = await getEventInnerPage(`events/${s2}/`).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
    return webPageSeoFromEntity(
      event,
      path,
      event?.title || 'Event',
      heroFromEventEntity(event),
    );
  }

  if (s0 === 'resources' && s1 === 'case-studies' && s2) {
    const caseStudy = await getCaseStudyInnerPage(locale, s2).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
    return webPageSeoFromEntity(
      caseStudy,
      path,
      caseStudy?.title || 'Case Study',
      heroFromInnerPageHero(caseStudy?.innerPageHeroSection),
    );
  }

  if (s0 === 'resources' && s1 === 'videos-podcasts' && s2) {
    const data = await getPodcastInnerPageData(locale, s2).catch((err) => {
          console.error('[getWebPageSeoForPath]', err);
          return null;
        });
    const podcast = data?.podcastsandvideos as Record<string, unknown> | undefined;
    return webPageSeoFromEntity(
      podcast,
      path,
      (podcast?.innerPageHeroSection as { innerpageHeroHeading?: string } | undefined)?.innerpageHeroHeading ||
        (podcast?.title as string) ||
        'Videos & Podcasts',
      heroFromInnerPageHero(podcast?.innerPageHeroSection as Record<string, unknown> | undefined),
    );
  }

  if (INFRASTRUCTURE_ROUTES[path]) {
    const route = INFRASTRUCTURE_ROUTES[path];
    return webPageSeoFromCmsPage(await route.fetch(locale), path, route.fallback);
  }

  if (INDUSTRY_ROUTES[path]) {
    const route = INDUSTRY_ROUTES[path];
    const entity = await route.fetch(locale);
    return webPageSeoFromEntity(
      entity,
      path,
      (entity?.title as string) || route.fallback,
      heroFromInnerPageHero(entity?.innerPageHeroSection as Record<string, unknown> | undefined),
    );
  }

  return null;
}

/**
 * Resolve CMS SEO fields for WebPage JSON-LD from the public URL path.
 * Uses the same cached GraphQL getters as page components (React cache dedupes).
 */
export const getWebPageSeoForPath = cache(async (locale: string, publicPath: string): Promise<WebPageSeoData | null> => {
  const path = (publicPath ?? '').replace(/^\/+|\/+$/g, '');
  const segments = path.split('/').filter(Boolean);

  if (!segments.length) {
    return resolveStaticRoute(locale, '');
  }

  const staticMatch = await resolveStaticRoute(locale, path);
  if (staticMatch) return staticMatch;

  return resolveDynamicRoute(locale, path, segments);
});
