import type { Metadata } from 'next';
import { stripHtml } from "@/lib/utils/sanitize";
import { buildMetadata } from '@/lib/utils/metadata';
import { getNewsOverviewPage } from '@/lib/graphql/queries/getNewsOverviewPage';
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import BlogListSection from "@/components/sections/reusable/BlogListSection/BlogListSection";
import FeaturedBlogSection from "@/components/sections/reusable/FeaturedBlogSection/FeaturedBlogSection";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import styles from "./news.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const { page } = await getNewsOverviewPage(100);

    return buildMetadata(page?.seo || { title: 'News - Datakrew' }, locale, { path: 'resources/news' });
}

export default async function NewsPage({ params }: Props) {
    const { locale } = await params;
    const { page, allNews } = await getNewsOverviewPage(100);

    if (!page) return null;

    const { innerPageHeroSection, prefooterCtaBannerSection } = page;
    const newsNodes = allNews?.nodes || [];

    // Filter featured news
    const featuredNews = newsNodes.filter(node => node.newsAdditionalFields.isFeaturedNews);

    // Map data for components
    const mappedFeatured = featuredNews.map(node => ({
        id: node.slug,
        title: node.title,
        image: node.featuredImage?.node?.mediaItemUrl || '/blog/blog.svg',
        date: new Date(node.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        rawDate: node.date,
        slug: node.slug,
        linkUrl: node.newsAdditionalFields.newsPublishedLink || `/resources/news/${node.slug}`,
        target: node.newsAdditionalFields.newsPublishedLink ? '_blank' : undefined,
        category: stripHtml((node as any).newsCategories?.nodes?.[0]?.name || (node as any).categories?.nodes?.[0]?.name || ''),
        excerpt: stripHtml(node.excerpt || ''),
    }));

    const mappedAll = newsNodes.map(node => ({
        id: node.slug,
        title: node.title,
        image: node.featuredImage?.node?.mediaItemUrl || '/blog/blog.svg',
        date: new Date(node.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        rawDate: node.date,
        slug: node.slug,
        linkUrl: node.newsAdditionalFields.newsPublishedLink || `/resources/news/${node.slug}`,
        target: node.newsAdditionalFields.newsPublishedLink ? '_blank' : undefined,
        category: stripHtml((node as any).newsCategories?.nodes?.[0]?.name || (node as any).categories?.nodes?.[0]?.name || ''),
        excerpt: stripHtml(node.excerpt || ''),
    }));

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Resources", href: "/" },
        { label: "News" },
    ];

    return (
        <>
            <InnerPageBanner
                title={innerPageHeroSection.innerpageHeroHeading}
                description={innerPageHeroSection.innerpageHeroDescription}
                breadcrumbItems={breadcrumbItems}
                backgroundImage={innerPageHeroSection.innerpageHeroImage?.node ? {
                    url: innerPageHeroSection.innerpageHeroImage.node.mediaItemUrl,
                    alt: innerPageHeroSection.innerpageHeroImage.node.altText
                } : undefined}
                mobileImage={innerPageHeroSection.innerpageHeroMobileImage?.node ? {
                    url: innerPageHeroSection.innerpageHeroMobileImage.node.mediaItemUrl,
                    alt: innerPageHeroSection.innerpageHeroMobileImage.node.altText
                } : undefined}
                className={styles.newsBanner}
            />
            {mappedFeatured.length > 2 && <FeaturedBlogSection posts={mappedFeatured} title="In the <span>spotlight</span>" />}
            <BlogListSection posts={mappedAll} isCategory={false} />
            <ContactStripSection
                {...prefooterCtaBannerSection}
            />
        </>
    );
}
