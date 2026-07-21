import type { CMSPage, SEOFields } from '@/lib/types/cms';
import { SCHEMA_HOME_PRIMARY_IMAGE_URL } from './schemaConstants';

export type WebPageSeoData = {
  path: string;
  name: string;
  description?: string;
  primaryImageUrl?: string;
};

function pickSeoTitle(
  seo: SEOFields | { title?: string | null; metaDesc?: string | null; description?: string | null } | null | undefined,
  fallback: string,
): string {
  return seo?.title?.trim() || fallback;
}

function pickSeoDescription(
  seo: SEOFields | { metaDesc?: string | null; description?: string | null } | null | undefined,
): string | undefined {
  if (!seo) return undefined;
  const fromDescription = 'description' in seo ? seo.description?.trim() : undefined;
  const fromMetaDesc = 'metaDesc' in seo ? seo.metaDesc?.trim() : undefined;
  return fromDescription || fromMetaDesc || undefined;
}

function heroFromInnerPageHero(section: Record<string, unknown> | null | undefined): string | undefined {
  if (!section) return undefined;
  const image = section.innerpageHeroImage as { node?: { mediaItemUrl?: string } } | undefined;
  const mobile = section.innerpageHeroMobileImage as { node?: { mediaItemUrl?: string } } | undefined;
  return image?.node?.mediaItemUrl || mobile?.node?.mediaItemUrl;
}

function heroFromCmsPage(page: CMSPage | null): string | undefined {
  if (!page?.sections?.length) return undefined;
  const hero = page.sections.find((section) => section.type === 'hero')?.data as
    | Record<string, unknown>
    | undefined;
  const innerBanner = page.sections.find((section) => section.type === 'innerPageBanner')?.data as
    | Record<string, unknown>
    | undefined;
  const backgroundImage = (hero?.backgroundImage || innerBanner?.backgroundImage) as
    | { url?: string }
    | undefined;
  if (backgroundImage?.url) return backgroundImage.url;
  const image = hero?.image as string | undefined;
  return image;
}

function heroFromHomePage(page: CMSPage | null): string | undefined {
  const appHero = page?.sections?.find((section) => section.type === 'appHero')?.data as
    | { image?: string }
    | undefined;
  return appHero?.image || SCHEMA_HOME_PRIMARY_IMAGE_URL;
}

function heroFromBlogEntity(blog: Record<string, unknown> | null | undefined): string | undefined {
  if (!blog) return undefined;
  return (
    heroFromInnerPageHero(blog.innerPageHeroSection as Record<string, unknown> | undefined) ||
    (blog.featuredImage as { node?: { mediaItemUrl?: string } } | undefined)?.node?.mediaItemUrl
  );
}

function heroFromEventEntity(event: Record<string, unknown> | null | undefined): string | undefined {
  if (!event) return undefined;
  const hero = event.eventHeroSection as
    | { eventHeroImage?: { node?: { mediaItemUrl?: string } } }
    | undefined;
  const details = event.eventAdditionalDetails as
    | { eventLogo?: { node?: { mediaItemUrl?: string } } }
    | undefined;
  return hero?.eventHeroImage?.node?.mediaItemUrl || details?.eventLogo?.node?.mediaItemUrl;
}

export function buildWebPageSeo(
  path: string,
  name: string,
  description?: string,
  primaryImageUrl?: string,
): WebPageSeoData | null {
  const trimmedName = name?.trim();
  if (!trimmedName) return null;
  return {
    path,
    name: trimmedName,
    description: description?.trim() || undefined,
    primaryImageUrl,
  };
}

export function webPageSeoFromCmsPage(
  page: CMSPage | null,
  path: string,
  fallbackTitle: string,
): WebPageSeoData | null {
  if (!page) return buildWebPageSeo(path, fallbackTitle);
  return buildWebPageSeo(
    path,
    pickSeoTitle(page.seo, page.title || fallbackTitle),
    pickSeoDescription(page.seo),
    heroFromCmsPage(page),
  );
}

type WpPageLike = {
  seo?: SEOFields | { title?: string | null; metaDesc?: string | null; description?: string | null } | null;
  title?: string | null;
  innerPageHeroSection?: Record<string, unknown> | null;
};

export function webPageSeoFromWpPage(
  page: WpPageLike | null | undefined,
  path: string,
  fallbackTitle: string,
): WebPageSeoData | null {
  if (!page) return buildWebPageSeo(path, fallbackTitle);
  const heroSection = page.innerPageHeroSection;
  const title =
    pickSeoTitle(page.seo, '') ||
    page.title?.trim() ||
    (heroSection?.innerpageHeroHeading as string | undefined) ||
    fallbackTitle;
  return buildWebPageSeo(
    path,
    title,
    pickSeoDescription(page.seo),
    heroFromInnerPageHero(heroSection),
  );
}

export function webPageSeoFromEntity(
  entity: Record<string, unknown> | null | undefined,
  path: string,
  fallbackTitle: string,
  primaryImageUrl?: string,
): WebPageSeoData | null {
  if (!entity) return buildWebPageSeo(path, fallbackTitle);
  return buildWebPageSeo(
    path,
    pickSeoTitle(entity.seo as SEOFields | undefined, (entity.title as string) || fallbackTitle),
    pickSeoDescription(entity.seo as SEOFields | undefined),
    primaryImageUrl,
  );
}

export function webPageSeoFromHomePage(page: CMSPage | null): WebPageSeoData | null {
  if (!page?.seo?.title?.trim()) return null;
  return buildWebPageSeo(
    '',
    page.seo.title,
    pickSeoDescription(page.seo),
    heroFromHomePage(page),
  );
}

export { heroFromBlogEntity, heroFromEventEntity, heroFromInnerPageHero };
