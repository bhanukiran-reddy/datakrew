/**
 * Home page — static query per page (no pageBuilder).
 * Fetches the home page via page(id: $id, idType: URI) and maps flat ACF
 * sections to the shared CMSPage/sections shape so templates and section
 * resolver work unchanged.
 */

import { cache } from 'react';
import { isAbsoluteUrl } from '@/lib/utils/slugUtils';
import { attachSeoKeywords, defaultSeo, mapCmsSeo } from '../mapSeo';
import { fetchGraphQL, type FetchGraphQLOptions } from '../client';
import { getDefaultLocaleSync } from '../../config/locales';
import type { CMSPage, CMSSection, SEOFields } from '../../types/cms';
import { env } from '../../env';

/* ------------------------------------------------------------------ */
/*  Query — static shape matching current CMS (flat ACF on Page)       */
/* ------------------------------------------------------------------ */

const GET_HOME_PAGE = /* GraphQL */ `
  query getHomePage($id: ID!) {
    page(id: $id, idType: URI) {
      heroSection {
        heroImage {
          node {
            altText
            mediaItemUrl
          }
        }
        heroMobileImage {
          node {
            altText
            mediaItemUrl
          }
        }
        heroHeading
        heroDescription
        heroCtaHeading
        heroCTAButtons {
          buttonIconClass
          buttonUrl {
            target
            url
          }
          buttonText
        }
      }
      videoSection {
        videoHeading
        videoDescription
        videoThumbnail {
          node {
            mediaItemUrl
            altText
          }
        }
        videoUrl
      }
      oemCompatibilitySection {
        oemSectionHeading
        oemSectionDescription
      }
      statsSection {
        statsHeading
        statsImage {
          node {
            mediaItemUrl
            altText
          }
        }
        statsCTAButton {
          buttonStyle
          buttonUrl {
            target
            url
          }
          buttonText
        }
        metricsDetails {
          metricCellType
          metricNumber
          metricSuffix
          metricLabel
          metricImage {
            node {
              mediaItemUrl
              altText
            }
          }
        }
      }
      deepTechProductsSection {
        deepTechProHeading
        deepTechProDescription
        deepTechProItems {
          nodes {
            ... on Infrastructure {
              id
              title
              productFeatures {
                featureIconClass
                featureHeroImage {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
                featureDescription
                featuresList {
                  featureText
                }
                featureCtaText
                featureCtaUrl
              }
            }
          }
        }
        deepTechProCTADetails {
          deepTechProCTALink {
            target
            url
          }
          deepTechProCTAText
        }
      }
      industrySection {
        industrySectionHeading
        industrySectionDescription
        industryItems {
          industryItemTitle {
            nodes {
              ... on Industry {
                id
                title
              }
            }
          }
          industryItemDescription
          industryItemFeatures {
            industryItemFeatureContent
          }
          industryItemCtaButtons {
            buttonText
            buttonStyle
            buttonUrl {
              target
              url
            }
          }
          industryCaseStudyDetails {
            caseStudyCtaText
            caseStudyTitle
            caseStudyUrl {
              target
              url
            }
          }
        }
      }
      performanceMetricsSection {
        metricsHeading
        metricsDescription
        metricsItems {
          metricValue
          metricTitle
          metricDescription
        }
      }
      testimonialSection {
        testimonialHeading
        testimonialsDetails {
          nodes {
            ... on Testimonials {
              id
              title
              testimonialsFields {
                testifierCompanyName
                testifierDescription
                testifierDesignation
                testifierImage {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
              }
            }
          }
        }
      }
      latestResourcesSection {
        latestResourcesHeading
        latestResourcesDescription
        ctaResources {
          ctaResourcesText
          ctaResourcesUrl {
            target
            url
          }
        }
        latestResourcesFeaturedPost {
          nodes {
            __typename
            ... on Podcastsandvideos {
              uri
              title
              date
              featuredImage {
                node {
                  mediaItemUrl
                  altText
                }
              }
              episodeAdditionalFields {
                episodeDescription
              }
            }
            ... on Blog {
              id
              title
              uri
              date
              featuredImage {
                node {
                  mediaItemUrl
                  altText
                }
              }
            }
          }
        }
        latestResourcesSidebarPosts {
          nodes {
            __typename
            ... on Blog {
              id
              title
              uri
              date
              featuredImage {
                node {
                  mediaItemUrl
                  altText
                }
              }
            }
            ... on Podcastsandvideos {
              id
              title
              uri
              date
              featuredImage {
                node {
                  mediaItemUrl
                  altText
                }
              }
              episodeAdditionalFields {
                episodeUrl
              }
            }
            ... on News {
              id
              title
              uri
              date
              newsAdditionalFields {
                newsPublishedLink
              }
              featuredImage {
                node {
                  mediaItemUrl
                  altText
                }
              }
            }
          }
        }
      }
      caseStudyCarouselSection {
        csCarouselHeading
        csCarouselItems {
          nodes {
            ... on CaseStudies {
              id
              title
              uri
              featuredImage {
                node {
                  mediaItemUrl
                  altText
                }
              }
              caseStudyCardFields {
                csClientName
                csClientTitle
                csCtaText
                csDescription
                csClientPhoto {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
                csKeyMetrics {
                  csMetricLabel
                  csMetricValue
                }
              }
            }
          }
        }
      }
      prefooterCtaBannerSection {
        prefooterCtaBannerHeading
        prefooterCtaBannerDescription
        prefooterCtaBackgroundImage {
          node {
            mediaItemUrl
            altText
          }
        }
        prefooterBannerCtaButtons {
          buttonStyle
          buttonText
          buttonUrl {
            target
            url
          }
        }
      }
      seo {
        title
        metaDesc
        canonical
      }
      seoKeywords {
        primaryKeywords
        secondaryKeywords
      }
    }
    oemItems: allOemEcosystem(where: {status: PUBLISH, orderby: {field: TITLE, order: ASC}}, first: 100) {
      nodes {
        id
        title
        oemEcosystemAdditionalFields {
          logoTransparent {
            node {
              mediaItemUrl
              altText
            }
          }
        }
      }
    }
  }
`;

/* ------------------------------------------------------------------ */
/*  Raw response types (match CMS schema)                               */
/* ------------------------------------------------------------------ */

interface HomePageResponse {
  page: {
    id: string;
    title?: string | null;
    language?: { code?: string | null } | null;
    heroSection?: Record<string, unknown> | null;
    videoSection?: {
      videoHeading?: string | null;
      videoDescription?: string | null;
      videoUrl?: string | null;
      videoThumbnail?: { node?: { mediaItemUrl?: string; altText?: string } | null } | null;
    } | null;
    oemCompatibilitySection?: Record<string, unknown> | null;
    statsSection?: Record<string, unknown> | null;
    deepTechProductsSection?: any | null;
    industrySection?: Record<string, unknown> | null;
    performanceMetricsSection?: Record<string, unknown> | null;
    testimonialSection?: Record<string, unknown> | null;
    latestResourcesSection?: Record<string, unknown> | null;
    caseStudyCarouselSection?: Record<string, unknown> | null;
    prefooterCtaBannerSection?: Record<string, unknown> | null;
    seo?: {
      title?: string | null;
      metaDesc?: string | null;
      canonical?: string | null;
    } | null;
    seoKeywords?: {
      primaryKeywords?: string | null;
      secondaryKeywords?: string | null;
    } | null;
  } | null;
  oemItems?: {
    nodes?: Array<{
      id: string;
      title: string;
      oemEcosystemAdditionalFields?: {
        logoTransparent?: {
          node?: {
            mediaItemUrl?: string;
            altText?: string;
          };
        };
      };
    }>;
  };
}

/* ------------------------------------------------------------------ */
/*  Map API shape → CMSPage (sections in display order)                */
/* ------------------------------------------------------------------ */

function mapLatestResourcePost(node: Record<string, unknown>) {
  const typename = typeof node.__typename === 'string' ? node.__typename : undefined;
  let uri = typeof node.uri === 'string'
    ? node.uri.replace('/resources/podcasts-videos/', '/resources/videos-podcasts/')
    : undefined;

  if (typename === 'News') {
    const newsFields = node.newsAdditionalFields as { newsPublishedLink?: string | null } | undefined;
    const publishedLink = newsFields?.newsPublishedLink?.trim();
    if (publishedLink) {
      uri = publishedLink;
    }
  }

  const featuredImage = node.featuredImage as {
    node?: { mediaItemUrl?: string; altText?: string };
  } | undefined;
  const episodeFields = node.episodeAdditionalFields as {
    episodeDescription?: string | null;
    episodeUrl?: string | null;
  } | undefined;

  return {
    __typename: typename,
    id: typeof node.id === 'string' ? node.id : undefined,
    title: typeof node.title === 'string' ? node.title : undefined,
    uri,
    external: uri ? isAbsoluteUrl(uri) : undefined,
    date: typeof node.date === 'string' ? node.date : undefined,
    episodeDescription: episodeFields?.episodeDescription ?? undefined,
    featuredImage: featuredImage?.node
      ? {
          node: {
            mediaItemUrl: featuredImage.node.mediaItemUrl,
            altText: featuredImage.node.altText,
          },
        }
      : undefined,
  };
}

function buildSectionsFromHomeResponse(
  page: NonNullable<HomePageResponse['page']>,
  oemItems?: HomePageResponse['oemItems']
): CMSSection[] {
  const sections: CMSSection[] = [];

  // Hero → appHero
  const hero = page.heroSection as {
    heroHeading?: string;
    heroDescription?: string;
    heroCtaHeading?: string;
    heroImage?: { node?: { mediaItemUrl?: string; altText?: string } };
    heroMobileImage?: { node?: { mediaItemUrl?: string; altText?: string } };
    heroCTAButtons?: Array<{
      buttonIconClass?: string;
      buttonUrl?: { target?: string; url?: string } | null;
      buttonText?: string;
    }>;
  } | undefined;
  if (hero && (hero.heroHeading || hero.heroDescription || hero.heroCtaHeading || (hero.heroCTAButtons?.length ?? 0) > 0)) {
    const ctaButtons = (hero.heroCTAButtons ?? [])
      .filter((b) => b?.buttonText)
      .map((b) => ({
        text: b.buttonText,
        icon: b.buttonIconClass ?? '',
        url: b.buttonUrl?.url ?? undefined,
      }));
    sections.push({
      id: 'home-hero',
      type: 'appHero',
      data: {
        title: hero.heroHeading ?? '',
        subtitle: hero.heroDescription ?? '',
        heroCtaHeading: hero.heroCtaHeading ?? '',
        ctaButtons,
        image: hero.heroImage?.node?.mediaItemUrl,
        imageAlt: hero.heroImage?.node?.altText,
        mobileImage: hero.heroMobileImage?.node?.mediaItemUrl,
        mobileImageAlt: hero.heroMobileImage?.node?.altText,
      },
    });
  }

  // Video → videoPlayer
  const video = page.videoSection;
  if (video) {
    const videoUrl = video.videoUrl;
    const thumbnailSrc = video.videoThumbnail?.node?.mediaItemUrl;
    if (videoUrl || thumbnailSrc) {
      sections.push({
        id: 'home-video',
        type: 'videoPlayer',
        data: {
          title: video.videoHeading ?? undefined,
          description: video.videoDescription ?? undefined,
          videoUrl: videoUrl || undefined,
          thumbnailSrc: thumbnailSrc ?? undefined,
          thumbnailAlt: video.videoThumbnail?.node?.altText ?? undefined,
          showWaveBackground: false,
        },
      });
    }
  }

  // OEM Compatibility (Partners) → partners
  const oemSection = page.oemCompatibilitySection as {
    oemSectionHeading?: string;
    oemSectionDescription?: string;
  } | undefined;

  if (oemSection) {
    const partnerNodes = oemItems?.nodes ?? [];
    const partners = partnerNodes.map((n: any) => ({
      name: n.title ?? '',
      image: n.oemEcosystemAdditionalFields?.logoTransparent?.node?.mediaItemUrl ?? '',
      imageAlt: n.oemEcosystemAdditionalFields?.logoTransparent?.node?.altText ?? undefined,
    })).filter((p: any) => p.image);

    sections.push({
      id: 'home-partners',
      type: 'partners',
      data: {
        title: oemSection.oemSectionHeading ?? '',
        description: oemSection.oemSectionDescription ?? '',
        partners,
      },
    });
  }

  // Stats → stats (component expects imageTruck, imageBus, imageCar, ctaText, ctaHref)
  const stats = page.statsSection as {
    statsHeading?: string;
    statsImage?: { node?: { mediaItemUrl?: string; altText?: string } };
    statsCTAButton?: { buttonText?: string; buttonUrl?: { target?: string; url?: string }; buttonStyle?: string };
    metricsDetails?: Array<{
      metricCellType?: string;
      metricNumber?: string;
      metricLabel?: string;
      metricSuffix?: string;
      metricImage?: { node?: { mediaItemUrl?: string; altText?: string } };
    }>;
  } | undefined;
  if (stats?.metricsDetails?.length) {
    const statsData = (stats.metricsDetails ?? []).map((m) => ({
      value: `${m.metricNumber ?? ''}${m.metricSuffix ?? ''}`,
      label: m.metricLabel ?? '',
      cellType: Array.isArray(m.metricCellType) ? m.metricCellType[0] : m.metricCellType,
      image: m.metricImage?.node?.mediaItemUrl,
      imageAlt: m.metricImage?.node?.altText,
    }));
    const cta = stats.statsCTAButton;
    const statsImageUrl = stats.statsImage?.node?.mediaItemUrl;
    sections.push({
      id: 'home-stats',
      type: 'stats',
      data: {
        title: stats.statsHeading ?? undefined,
        stats: statsData,
        imageTruck: statsImageUrl ?? undefined,
        imageBus: statsImageUrl ?? undefined,
        imageCar: statsImageUrl ?? undefined,
        ctaText: cta?.buttonText ? cta.buttonText.trim() : undefined,
        ctaHref: cta?.buttonUrl?.url ?? undefined,
      },
    });
  }

  // Deep tech → deeptech
  const deepTech = page.deepTechProductsSection;
  if (deepTech?.deepTechProItems?.nodes?.length) {
    const tabs = (deepTech.deepTechProItems.nodes ?? []).map((node: any) => {
      const productFeatures = node.productFeatures || {};
      const features = (productFeatures.featuresList ?? [])
        .map((f: any) => f.featureText)
        .filter(Boolean) as string[];

      return {
        tabTitle: node.title ?? '',
        tabIcon: productFeatures.featureIconClass || undefined,
        tabCardTitle: node.title ?? '',
        tabCardDescription: productFeatures.featureDescription ?? undefined,
        tabCardLIst: features,
        tabCardCtaText: productFeatures.featureCtaText ? productFeatures.featureCtaText.trim() : undefined,
        tabCardCtaLink: productFeatures.featureCtaUrl,
        tabImage: productFeatures.featureHeroImage?.node?.mediaItemUrl ?? undefined,
        tabImageAlt: productFeatures.featureHeroImage?.node?.altText ?? undefined,
        tabLink: deepTech.deepTechProCTADetails?.deepTechProCTALink?.url,
        tabCtaText: deepTech.deepTechProCTADetails?.deepTechProCTAText,
      };
    });
    sections.push({
      id: 'home-deeptech',
      type: 'deeptech',
      data: {
        title: deepTech.deepTechProHeading ?? undefined,
        description: deepTech.deepTechProDescription ?? undefined,
        tabs,
      },
    });
  }

  // Industry section → logistics (heading, description + dynamic slides from industryItems)
  const industry = page.industrySection as {
    industrySectionHeading?: string;
    industrySectionDescription?: string;
    industryItems?: Array<{
      industryItemTitle?: { nodes?: Array<{ id?: string; title?: string }> };
      industryItemDescription?: string;
      industryItemFeatures?: Array<{ industryItemFeatureContent?: string }>;
      industryItemCtaButtons?: Array<{ buttonText?: string; buttonUrl?: { url?: string } }>;
      industryCaseStudyDetails?: {
        caseStudyTitle?: string | null;
        caseStudyCtaText?: string | null;
        caseStudyUrl?: { url?: string } | null;
      };
    }>;
  } | undefined;

  const industryItems = industry?.industryItems ?? [];
  const logisticsSlides = industryItems.map((item, index) => {
    const title = item.industryItemTitle?.nodes?.[0]?.title ?? '';
    const buttons = item.industryItemCtaButtons ?? [];
    const primaryBtn = buttons[0];
    const secondaryBtn = buttons[1];
    const caseStudy = item.industryCaseStudyDetails;
    const desc = item.industryItemDescription ?? '';
    const tags = (item.industryItemFeatures ?? [])
      .map((f) => f.industryItemFeatureContent)
      .filter(Boolean) as string[];

    return {
      id: index + 1,
      title,
      desc,
      tags,
      ctaPrimary: primaryBtn?.buttonText
        ? { text: primaryBtn.buttonText, url: primaryBtn.buttonUrl?.url ?? '#' }
        : undefined,
      ctaSecondary: secondaryBtn?.buttonText
        ? { text: secondaryBtn.buttonText, url: secondaryBtn.buttonUrl?.url ?? '#' }
        : undefined,
      ...(caseStudy?.caseStudyTitle && caseStudy?.caseStudyCtaText && {
        caseStudyTitle: caseStudy.caseStudyTitle,
        caseStudyCtaText: caseStudy.caseStudyCtaText,
        caseStudyUrl: caseStudy.caseStudyUrl?.url,
      }),
    };
  });
  if (
    industry &&
    (industry.industrySectionHeading ||
      industry.industrySectionDescription ||
      logisticsSlides.length > 0)
  ) {
    sections.push({
      id: 'home-logistics',
      type: 'logistics',
      data: {
        title: industry.industrySectionHeading ?? undefined,
        description: industry.industrySectionDescription ?? undefined,
        slides: logisticsSlides.length > 0 ? logisticsSlides : undefined,
      },
    });
  }

  // Performance metrics → outcomes (display order: after DeepTech, before Testimonial)
  const perf = page.performanceMetricsSection as {
    metricsHeading?: string;
    metricsDescription?: string;
    metricsItems?: Array<{ metricValue?: string; metricTitle?: string; metricDescription?: string }>;
  } | undefined;
  if (perf?.metricsItems?.length) {
    const outcomes = (perf.metricsItems ?? []).map((m) => ({
      percentage: m.metricValue,
      title: m.metricTitle,
      description: m.metricDescription,
    }));
    sections.push({
      id: 'home-outcomes',
      type: 'outcomes',
      data: {
        title: perf.metricsHeading ?? undefined,
        description: perf.metricsDescription ?? undefined,
        outcomes,
      },
    });
  }

  // Testimonials → testimonial
  const testimonial = page.testimonialSection as {
    testimonialHeading?: string;
    testimonialsDetails?: {
      nodes?: Array<{
        id?: string;
        title?: string;
        testimonialsFields?: {
          testifierCompanyName?: string;
          testifierDescription?: string;
          testifierDesignation?: string;
          testifierImage?: { node?: { mediaItemUrl?: string; altText?: string } };
        };
      }>;
    };
  } | undefined;
  if (testimonial?.testimonialsDetails?.nodes?.length) {
    const testimonials = (testimonial.testimonialsDetails.nodes ?? []).map((n) => {
      const f = n?.testimonialsFields;
      return {
        quote: f?.testifierDescription ?? '',
        authorName: n?.title ?? f?.testifierCompanyName ?? '',
        authorTitle: `${f?.testifierDesignation || ""}${f?.testifierDesignation && f?.testifierCompanyName ? ", " : ""}${f?.testifierCompanyName || ""}`,
        image: {
          url: f?.testifierImage?.node?.mediaItemUrl ?? '',
          alt: f?.testifierImage?.node?.altText || n?.title || 'Testimonial photo',
        },
      };
    });
    sections.push({
      id: 'home-testimonial',
      type: 'testimonial',
      data: {
        title: testimonial.testimonialHeading ?? undefined,
        testimonials,
      },
    });
  }

  // Latest resources → dataKrewVoice (display order: after Testimonial, before ContactStrip)
  const latestResources = page.latestResourcesSection as {
    latestResourcesHeading?: string;
    latestResourcesDescription?: string;
    ctaResources?: {
      ctaResourcesText?: string | null;
      ctaResourcesUrl?: { target?: string | null; url?: string | null } | null;
    } | null;
    latestResourcesFeaturedPost?: { nodes?: Array<Record<string, unknown>> };
    latestResourcesSidebarPosts?: { nodes?: Array<Record<string, unknown>> };
  } | undefined;
  if (
    latestResources &&
    (latestResources.latestResourcesHeading ||
      latestResources.latestResourcesDescription ||
      (latestResources.latestResourcesFeaturedPost?.nodes?.length ?? 0) > 0 ||
      (latestResources.latestResourcesSidebarPosts?.nodes?.length ?? 0) > 0)
  ) {
    sections.push({
      id: 'home-dataKrewVoice',
      type: 'dataKrewVoice',
      data: {
        title: latestResources.latestResourcesHeading ?? undefined,
        description: latestResources.latestResourcesDescription ?? undefined,
        ctaText: latestResources.ctaResources?.ctaResourcesText ?? undefined,
        ctaHref: latestResources.ctaResources?.ctaResourcesUrl?.url ?? undefined,
        ctaTarget: latestResources.ctaResources?.ctaResourcesUrl?.target ?? undefined,
        featuredPost: (latestResources.latestResourcesFeaturedPost?.nodes ?? []).map(mapLatestResourcePost),
        sidebarPosts: (latestResources.latestResourcesSidebarPosts?.nodes ?? []).map(mapLatestResourcePost),
      },
    });
  }

  // Case Study Carousel → caseStudyCarousel
  const caseStudyCarousel = page.caseStudyCarouselSection as {
    csCarouselHeading?: string;
    csCarouselDescription?: string;
    csCarouselItems?: {
      nodes?: Array<{
        id?: string;
        title?: string;
        featuredImage?: { node?: { mediaItemUrl?: string; altText?: string } };
        caseStudyCardFields?: {
          csClientName?: string;
          csClientTitle?: string;
          csCtaText?: string;
          csDescription?: string;
          csClientPhoto?: { node?: { mediaItemUrl?: string; altText?: string } };
          csKeyMetrics?: Array<{ csMetricLabel?: string; csMetricValue?: string }>;
        };
      }>;
    };
  } | undefined;
  if (caseStudyCarousel && (caseStudyCarousel.csCarouselHeading || (caseStudyCarousel.csCarouselItems?.nodes?.length ?? 0) > 0)) {
    sections.push({
      id: 'home-case-study-carousel',
      type: 'caseStudyCarousel',
      data: {
        csCarouselHeading: caseStudyCarousel.csCarouselHeading ?? undefined,
        csCarouselDescription: caseStudyCarousel.csCarouselDescription ?? undefined,
        csCarouselItems: caseStudyCarousel.csCarouselItems ?? undefined,
      },
    });
  }

  // Prefooter CTA banner → contactStrip (matches CMS prefooterCtaBannerSection)
  const prefooterCta = page.prefooterCtaBannerSection as {
    prefooterCtaBannerHeading?: string;
    prefooterCtaBannerDescription?: string;
    prefooterCtaBackgroundImage?: { node?: { mediaItemUrl?: string; altText?: string } };
    prefooterBannerCtaButtons?: Array<{ buttonText?: string; buttonUrl?: { url?: string; target?: string } }>;
  } | undefined;
  if (
    prefooterCta &&
    (prefooterCta.prefooterCtaBannerHeading ||
      prefooterCta.prefooterCtaBannerDescription ||
      (prefooterCta.prefooterBannerCtaButtons?.length ?? 0) > 0)
  ) {
    const ctas = (prefooterCta.prefooterBannerCtaButtons ?? [])
      .filter((b) => b?.buttonText)
      .map((b) => ({
        text: b.buttonText ?? '',
        url: b.buttonUrl?.url ?? '#',
      }));
    const backgroundImageUrl = prefooterCta.prefooterCtaBackgroundImage?.node?.mediaItemUrl;
    sections.push({
      id: 'home-prefooter-cta',
      type: 'contactStrip',
      data: {
        title: prefooterCta.prefooterCtaBannerHeading ?? '',
        description: prefooterCta.prefooterCtaBannerDescription ?? '',
        ctas,
        ...(backgroundImageUrl != null && backgroundImageUrl !== '' ? { backgroundImageUrl } : {}),
      },
    });
  }

  return sections;
}

export type GetHomePageOptions = Pick<FetchGraphQLOptions, 'revalidate' | 'tags'>;

async function getHomePageUncached(
  locale: string,
  options?: GetHomePageOptions,
): Promise<CMSPage | null> {
  const defaultLocale = getDefaultLocaleSync();
  // CMS URI for home: often "home" or "/" in WPGraphQL
  const id = locale === defaultLocale ? 'home' : `/home/`;

  const tags = options?.tags ?? [`page-${locale}-home`];
  const revalidate = options?.revalidate;

  try {
    const data = await fetchGraphQL<HomePageResponse>(GET_HOME_PAGE, { id }, { tags, revalidate });
    const page = data?.page;
    if (!page) return null;

    const localeCode = page.language?.code ?? locale;
    const sections = buildSectionsFromHomeResponse(page, data?.oemItems);

    const cmsPage: CMSPage = {
      id: page.id,
      title: page.title ?? 'Home',
      slug: 'home',
      locale: localeCode,
      pageTemplate: 'home',
      seo: mapCmsSeo(page.seo, page.title ?? 'Home', page.seoKeywords),
      sections,
    };
    return cmsPage;
  } catch (error) {
    // console.error(`[getHomePage] Failed to fetch home page data for locale ${locale}:`, error);
    return null;
  }
}

/**
 * Fetch the home page using the static getHomePage query.
 * Returns the same CMSPage shape as getPageBySlug so templates and section resolver work as-is.
 * Cached per request (React cache).
 */
export const getHomePage = cache(getHomePageUncached);
