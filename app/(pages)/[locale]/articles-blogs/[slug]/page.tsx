import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBlogInnerPage } from '@/lib/graphql/queries/getBlogInnerPage';
import { buildMetadata, buildArticleJsonLd, stripHtmlForSchema } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { getSiteConfigFallback } from '@/lib/config/site';
import { getBaseUrl, env } from '@/lib/env';
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import blogStyles from "./blog.module.css";
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import BlogCard from '@/components/ui/BlogCard/BlogCard';
import Link from "@/components/ui/Link/Link";
import BlogLayoutClient from "./BlogLayoutClient";
import { processHtmlForToc } from "@/lib/utils/toc";
import { sanitizeHTML } from "@/lib/utils/sanitize";
import { localizedPath } from "@/lib/utils/slugUtils";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const { getBlogSlugs, staticParamsFromSlugs } = await import(
    '@/lib/graphql/queries/getStaticSlugs'
  );
  return staticParamsFromSlugs(await getBlogSlugs());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const response = await getBlogInnerPage(locale, slug).catch(() => null);

  if (!response || !response.blog) {
    const fallback = getSiteConfigFallback();
    return {
      title: fallback.name || undefined,
      description: fallback.defaultDescription || undefined,
    };
  }

  const { blog } = response;
  return buildMetadata(blog.seo, locale, {
    title: blog.title || 'Articles & Blogs',
    path: `articles-blogs/${slug}`,
  });
}

export default async function LocaleBlogPage({ params }: Props) {
  const { locale, slug } = await params;

  const response = await getBlogInnerPage(locale, slug).catch((err) => {
    console.error("GraphQL Error in Blog Inner:", err);
    return null;
  });

  if (!response || !response.blog) {
    notFound();
  }

  const { blog, allBlog } = response;

  const displayTitle = blog.title || "";
  // console.log(displayTitle)
  const heroHeading = blog.innerPageHeroSection?.innerpageHeroHeading || displayTitle;

  const heroDescription = blog.innerPageHeroSection?.innerpageHeroDescription;

  const displayDate = blog.date ? new Date(blog.date).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  }) : null;

  const readTime = "8 mins";

  const breadcrumbItems = [
    { label: 'Resources', href: `/resources` },
    { label: 'Articles & blogs', href: `/articles-blogs` },
    { label: blog.title ? (blog.title.replace(/<[^>]*>/g, '')) : "Blog Post" },
  ];
  const rawContent = blog.blogAdditionalFields?.blogContent || "";
  const { processedHtml, tocItems } = processHtmlForToc(rawContent);

  // Resolve relative WordPress media paths to absolute URLs using the API endpoint
  const backendUrl = getBaseUrl() ? env.graphqlEndpoint.replace('/graphql', '') : "https://staging-api.datakrew.com";
  const absoluteHtml = sanitizeHTML(
    processedHtml.replace(/src="\/wp-content/g, `src="${backendUrl}/wp-content`)
  );

  const heroImage = blog.innerPageHeroSection?.innerpageHeroImage?.node || blog.featuredImage?.node;
  const mobileHeroImage = blog.innerPageHeroSection?.innerpageHeroMobileImage?.node;

  const baseUrl = getBaseUrl() || "";
  const shareUrl = blog.uri ? `${baseUrl}${blog.uri}` : null;
  const pageUrl = shareUrl || (baseUrl ? `${baseUrl}/articles-blogs/${slug}` : '');
  const articleJsonLd = pageUrl
    ? buildArticleJsonLd({
        type: 'Article',
        headline: stripHtmlForSchema(heroHeading),
        url: pageUrl,
        datePublished: blog.date,
        dateModified: (blog as { modified?: string }).modified || blog.date,
        description:
          (blog.seo as { metaDesc?: string } | undefined)?.metaDesc ||
          heroDescription ||
          blog.excerpt,
        image: heroImage?.mediaItemUrl,
      })
    : null;

  const prefooter = blog.prefooterCtaBannerSection || {};

  return (
    <>
      {articleJsonLd ? <JsonLd data={articleJsonLd} /> : null}
      <InnerPageBanner
        title={heroHeading}
        description={heroDescription || ""}
        breadcrumbItems={breadcrumbItems}
        pageUrl={pageUrl || undefined}
        backgroundColor="#111216"
        backgroundImage={{
          url: heroImage?.mediaItemUrl || "/blog/blog-banner.webp",
          alt: heroImage?.altText || heroHeading,
          width: 1920,
          height: 676
        }}
        mobileImage={{
          url: mobileHeroImage?.mediaItemUrl || "/blog/blog-mobile-banner.webp",
          alt: mobileHeroImage?.altText || "Background",
        }}
      >
        <div className={blogStyles.blogMetadata}>
          {displayDate && (
            <div className={blogStyles.metadataItem}>
              <i className="fa-kit fa-date" />
              <p>{displayDate}</p>
            </div>
          )}
          {displayDate && <div className={blogStyles.verticalLine}></div>}
          <div className={blogStyles.metadataItem}>
            <i className="fa-kit fa-clock" />
            <p>{readTime}</p>
          </div>
        </div>
      </InnerPageBanner>

      <BlogLayoutClient
        tocItems={tocItems}
      >
        {absoluteHtml && (
          <div
            className={blogStyles.newsArticleBody}
            dangerouslySetInnerHTML={{ __html: absoluteHtml }}
          />
        )}
      </BlogLayoutClient>

      {allBlog?.nodes && allBlog.nodes.length > 0 && (
        <section className={blogStyles.featuredBlogSection}>
          <div className="container">
            <div className={blogStyles.blogCardHeader} >
              <h2 className="sectionTitle">
                More <span>blogs</span>
              </h2>
              <Link href={localizedPath(locale, '/articles-blogs')} className="tertiaryCta">
                View all <i className="icon fa-kit fa-right-arrow"></i>
              </Link>
            </div>
            <div className={blogStyles.blogCardWrapper}>
              {allBlog.nodes.map((post: any) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  date={post.date ? new Date(post.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : ""}
                  image={post.featuredImage?.node?.mediaItemUrl || "/blog/default.webp"}
                  slug={post.slug}
                  linkUrl={localizedPath(locale, `/articles-blogs/${post.slug}`)}
                  category=""
                  excerpt=""
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {prefooter.prefooterCtaBannerHeading ? (
        <ContactStripSection
          title={prefooter.prefooterCtaBannerHeading}
          titleHighlight={prefooter.prefooterCtaBannerHeading.match(/<span>(.*?)<\/span>/)?.[1] || ""}
          description={prefooter.prefooterCtaBannerDescription || ""}
          ctas={prefooter.prefooterBannerCtaButtons?.map((btn: any) => ({
            text: btn.buttonText || "",
            url: btn.buttonUrl?.url || "#"
          })) || []}
          backgroundImageUrl={prefooter.prefooterCtaBackgroundImage?.node?.mediaItemUrl || "/prefooter-banner.webp"}
        />
      ) : (
        <ContactStripSection
          title="Turn data into decisions"
          titleHighlight="data into decisions"
          description="Partner with Datakrew to transform your operations. Fleet Management, EV Battery Intelligence, AI-Enabled Solutions, all through one intelligent deployment.<br/><br/>Smarter. Safer. Sustainable."
          ctas={[
            { text: "Book a demo", url: "/demo" },
            { text: "Talk to our expert", url: "/contact" }
          ]}
          backgroundImageUrl="/prefooter-banner.webp"
        />
      )}
    </>
  );
}
