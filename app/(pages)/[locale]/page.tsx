import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';
import { getSiteConfigFallback } from '@/lib/config/site';
import type { CMSPage, CMSSection } from '@/lib/types/cms';
import { getHomePage } from '@/lib/graphql/queries/getHomePage';
import PartnersSection from '@/components/sections/reusable/PartnersSection/PartnersSection';
import {
  LogisticsSectionDynamic,
  DeepTechSectionDynamic,
  OutcomesSectionDynamic,
  QuantifiedImpactSectionDynamic,
  StatsSectionsDynamic,
  ContactStripSectionDynamic,
} from './homeHeavySections';
import TestimonialSection from '@/components/sections/reusable/TestimonialSection/TestimonialSection';
import DataKrewVoiceSection from '@/components/sections/Pages/Home/DataKrewVoiceSection/DataKrewVoiceSection';
import InnerPageBanner from '@/components/sections/reusable/InnerPageBanner/InnerPageBanner';
import homeStyles from './home.module.css';
import videoPlayerStyles from '@/components/ui/VideoPlayer/videoPlayer.module.css';
import Link from '@/components/ui/Link/Link';
import RouteWebPageSchema from '@/components/seo/RouteWebPageSchema';

const VideoPlayerLazy = dynamic(
  () => import('@/components/ui/VideoPlayer/VideoPlayer'),
  {
    ssr: true,
    loading: () => (
      <div
        className={`${videoPlayerStyles.videoPlayer} ${homeStyles.homeVideoPlayer}`}
        aria-hidden
      >
        <div className="container">
          <div className={videoPlayerStyles.videoPlayerContainer}>
            <div className={videoPlayerStyles.aspectRatioWrapper} />
          </div>
        </div>
      </div>
    ),
  },
);


type Props = { params: Promise<{ locale: string }> };
export const revalidate = 3600;

/** Get one section's data from CMS page by type (used when applying props below). */
function getSectionData(page: CMSPage, type: string): Record<string, unknown> | undefined {
  const section = page.sections?.find((s: CMSSection) => s.type === type);
  return section?.data as Record<string, unknown> | undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getHomePage(locale);
  if (!page) {
    const fallback = getSiteConfigFallback();
    return {
      title: fallback.name || undefined,
      description: fallback.defaultDescription || undefined,
    };
  }
  return buildMetadata(page.seo, locale, {
    title: page.title || 'Home',
    path: '',
  });
}

/** Home page: mock when USE_MOCK_PAGE_DATA=true; else dynamic CMS only (no fallback). */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  /* ─── DOING: run the query (hits CMS, returns CMSPage with sections) ─── */
  const page = await getHomePage(locale);
  const webPageSchema = <RouteWebPageSchema locale={locale} path="" />;

  /* ─── APPLY: take each section’s data from the query result ─── */
  const appHeroData = (page ? (getSectionData(page, 'appHero') ?? {}) : {}) as {
    title?: string;
    subtitle?: string;
    heroCtaHeading?: string;
    ctaButtons?: any[];
    image?: string;
    imageAlt?: string;
    mobileImage?: string;
    mobileImageAlt?: string;
  };
  const videoPlayerData = (page ? (getSectionData(page, 'videoPlayer') ?? {}) : {}) as {
    videoUrl?: string;
    thumbnailSrc?: string;
    thumbnailAlt?: string;
    title?: string;
    description?: string;
  };
  const partnersData = page ? (getSectionData(page, 'partners') ?? {}) : {};
  const statsData = page ? (getSectionData(page, 'stats') ?? {}) : {};
  const logisticsData = page ? (getSectionData(page, 'logistics') ?? {}) : {};
  const deeptechData = page ? (getSectionData(page, 'deeptech') ?? {}) : {};
  const outcomesData = page ? (getSectionData(page, 'outcomes') ?? {}) : {};
  const testimonialData = page ? (getSectionData(page, 'testimonial') ?? {}) : {};
  const dataKrewVoiceData = (page ? (getSectionData(page, 'dataKrewVoice') ?? {}) : {}) as {
    title?: string;
    description?: string;
    ctaText?: string;
    ctaHref?: string;
    ctaTarget?: string;
    featuredPost?: Array<{
      __typename?: string;
      id?: string;
      title?: string;
      uri?: string;
      external?: boolean;
      date?: string;
      episodeDescription?: string;
      featuredImage?: { node?: { mediaItemUrl?: string; altText?: string } };
    }>;
    sidebarPosts?: Array<{
      __typename?: string;
      id?: string;
      title?: string;
      uri?: string;
      external?: boolean;
      date?: string;
      featuredImage?: { node?: { mediaItemUrl?: string; altText?: string } };
    }>;
  };
  const contactStripData = page ? (getSectionData(page, 'contactStrip') ?? {}) : {};
  const caseStudyCarouselData = page ? (getSectionData(page, 'caseStudyCarousel') ?? {}) : {};

  /* ─── APPLY: pass that data into the section components as props ─── */
  return (
    <div>
      {webPageSchema}
      <InnerPageBanner 
        className={homeStyles.heroBanner}
        hideBreadcrumb={true}
        title={appHeroData.title as string}
        description={appHeroData.subtitle as string}
        backgroundImage={{
           url: appHeroData.image as string,
           alt: appHeroData.imageAlt || appHeroData.title || 'Hero Image',
        }}
        mobileImage={appHeroData.mobileImage ? {
           url: appHeroData.mobileImage as string,
           alt: appHeroData.mobileImageAlt || appHeroData.title || 'Mobile Hero',
        } : undefined}
      >
        <div className={homeStyles.heroCtaWrapper}>
          {appHeroData.heroCtaHeading && <p className={homeStyles.heroCtaHeading}>{appHeroData.heroCtaHeading}</p>}
          <div className={homeStyles.heroCtaButtons}>
          {(appHeroData.ctaButtons as any[])?.map((cta, i) => (
            <Link 
              key={i} 
              href={cta.url || '#'} 
              className="secondaryCta"
            >
              {cta.text}
              <i className={`icon fa-kit fa-right-arrow`} />
            </Link>
          ))}
          </div>
        </div>
      </InnerPageBanner>
      
    
       {/* make a viveo component */}
      {videoPlayerData.videoUrl && (
        <VideoPlayerLazy 
          className={homeStyles.homeVideoPlayer} 
          autoPlay={true} 
          src={videoPlayerData.videoUrl}
          poster={videoPlayerData.thumbnailSrc}
          posterAlt={videoPlayerData.thumbnailAlt || videoPlayerData.title || 'Video Thumbnail'}
        />
      )}
      <PartnersSection {...partnersData} />
      <StatsSectionsDynamic {...statsData} />
      <DeepTechSectionDynamic {...deeptechData} />
      <LogisticsSectionDynamic {...logisticsData} />
      <OutcomesSectionDynamic {...outcomesData} />
      <QuantifiedImpactSectionDynamic {...caseStudyCarouselData} />
      {/* <TestimonialSection {...testimonialData} /> */}
      <DataKrewVoiceSection {...dataKrewVoiceData} />
      <ContactStripSectionDynamic {...contactStripData} />
    </div>
  );
}
