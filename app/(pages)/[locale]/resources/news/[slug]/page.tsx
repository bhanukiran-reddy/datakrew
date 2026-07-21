import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getNewsInnerPage } from '@/lib/graphql/queries/getNewsInnerPage';
import { getRedirects, findRedirect } from '@/lib/graphql/queries/getRedirects';
import { buildMetadata } from '@/lib/utils/metadata';
import { buildArticleJsonLd } from '@/lib/seo';
import { getBaseUrl } from '@/lib/env';
import JsonLd from '@/components/seo/JsonLd';
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import newsStyles from "./news.module.css";
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import BlogCard from '@/components/ui/BlogCard/BlogCard';
import Link from "@/components/ui/Link/Link";
import Image from "next/image";
import BlogLayoutClient from "./NewsLayoutClient";
import { sanitizeHTML } from "@/lib/utils/sanitize";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await getNewsInnerPage(locale, slug).catch(() => null);

  if (!data || !data.news) {
    return {
      title: 'News - Datakrew',
    };
  }

  return buildMetadata(data.news.seo || { title: data.news.title }, locale, {
    path: `resources/news/${slug}`,
  });
}

const isAbsoluteUrl = (url: string) => /^(?:[a-z+]+:)?\/\//i.test(url);

export default async function LocaleNewsInnerPage({ params }: Props) {
  const { locale, slug } = await params;

  const data = await getNewsInnerPage(locale, slug).catch(() => null);

  if (!data || !data.news) notFound();

  const { news, allNews } = data;
  const hero = news.innerPageHeroSection;
  const content = news.newsAdditionalFields.newsContent;
  const prefooter = news.prefooterCtaBannerSection || {};

  const displayTitle = hero?.innerpageHeroHeading || news.title || '';
  const displayDate = new Date(news.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Estimate read time (approx 200 words per minute)
  const wordCount = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
  const readTime = `${Math.ceil(wordCount / 200)} mins`;

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

  const breadcrumbItems = [
    { label: 'Resources', href: `/resources` },
    { label: 'News', href: `/resources/news` },
    { label: stripHtml(displayTitle) },
  ];

  const baseUrl = getBaseUrl() || '';
  const pageUrl = baseUrl ? `${baseUrl}/resources/news/${slug}` : '';
  const articleJsonLd = pageUrl
    ? buildArticleJsonLd({
        type: 'NewsArticle',
        headline: stripHtml(displayTitle),
        url: pageUrl,
        datePublished: news.date,
        dateModified: (news as { modified?: string }).modified || news.date,
        description:
          (news.seo as { metaDesc?: string } | undefined)?.metaDesc ||
          news.excerpt ||
          hero?.innerpageHeroDescription,
        image: hero?.innerpageHeroImage?.node?.mediaItemUrl || news.featuredImage?.node?.mediaItemUrl,
      })
    : null;

  const formatTitle = (title: string) => {
    if (title.includes(':')) {
      const parts = title.split(':');
      return `${parts[0]}: <span>${parts.slice(1).join(':')}</span>`;
    }
    return title;
  };

  return (
    <>
      {articleJsonLd ? <JsonLd data={articleJsonLd} /> : null}
      <InnerPageBanner
        title={formatTitle(displayTitle)}
        description={hero?.innerpageHeroDescription}
        breadcrumbItems={breadcrumbItems}
        pageUrl={pageUrl || undefined}
        backgroundColor="#111216"
        backgroundImage={{
          url: hero?.innerpageHeroImage?.node?.mediaItemUrl || "/blog/blog-banner.webp",
          alt: hero?.innerpageHeroImage?.node?.altText || displayTitle,
          width: 1920,
          height: 676
        }}
        mobileImage={{
          url: hero?.innerpageHeroMobileImage?.node?.mediaItemUrl || "/blog/blog-mobile-banner.webp",
          alt: hero?.innerpageHeroMobileImage?.node?.altText || "Background",
        }}
        className={newsStyles.newsBanner}
      >
        <div className={newsStyles.heroContent}>
          <div className={newsStyles.blogMetadata}>
            <div className={newsStyles.metadataItem}>
              <i className="fa fa-kit fa-date" />
              <p>{displayDate}</p>
            </div>
            <div className={newsStyles.verticalLine}></div>
            <div className={newsStyles.metadataItem}>
              <i className="fa-kit fa-clock"/>
              <p>{readTime}</p>
            </div>
          </div>

          {hero?.innerpageHeroCTAButtons && hero.innerpageHeroCTAButtons.length > 0 && (
            <div className={newsStyles.heroCtas}>
              {hero.innerpageHeroCTAButtons.map((btn: any, idx: number) => (
                <Link
                  key={idx}
                  href={btn.buttonUrl?.url || '#'}
                  target={btn.buttonUrl?.target}
                  className={idx === 0 ? 'primaryCta' : 'secondaryCta'}
                >
                  {btn.buttonText}
                </Link>
              ))}
            </div>
          )}
        </div>
      </InnerPageBanner>

      <BlogLayoutClient
        category="News"
        authorName="Datakrew"
        authorDesignation="Team"
        authorImage="/images/logo-icon.png"
        tocItems={[]} // Can be dynamically generated from headers if needed
      >
        <div
          className={newsStyles.newsMainContent}
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(content ?? '') }}
        />
      </BlogLayoutClient>

      <section className={newsStyles.newsSection}>
        <div className="container">
          <div className={newsStyles.blogCardHeader} >
            <h2 className="sectionTitle">
              Recent <span>news</span>
            </h2>
            <Link href="/resources/news" className="tertiaryCta">
              View all <i className="icon fa-kit fa-right-arrow"></i>
            </Link>
          </div>
          <div className={newsStyles.blogCardWrapper}>
            {allNews?.nodes?.map((post: any) => {
              const externalLink = post.newsAdditionalFields?.newsPublishedLink;
              const isExternal = externalLink && isAbsoluteUrl(externalLink);
              const linkUrl = isExternal ? externalLink : `/resources/news/${post.uri.split('/').filter(Boolean).pop()}/`;

              return (
                <BlogCard
                  key={post.newsId}
                  category="News"
                  title={post.title}
                  image={post.featuredImage?.node?.mediaItemUrl || '/blog/blog.svg'}
                  date={new Date(post.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  slug={post.uri.split('/').filter(Boolean).pop() || ''}
                  excerpt=""
                  hideCategory={true}
                  linkUrl={linkUrl}
                  target={isExternal ? "_blank" : undefined}
                />
              );
            })}
          </div>
        </div>
      </section>

      <ContactStripSection
        prefooterCtaBannerHeading={prefooter.prefooterCtaBannerHeading}
        prefooterCtaBannerDescription={prefooter.prefooterCtaBannerDescription}
        prefooterBannerCtaButtons={prefooter.prefooterBannerCtaButtons?.map((btn: any) => ({
          buttonText: btn.buttonText,
          buttonUrl: {
            url: btn.buttonUrl?.url,
            target: btn.buttonUrl?.target
          }
        }))}
        prefooterCtaBackgroundImage={prefooter.prefooterCtaBackgroundImage}
      />
    </>
  );
}
