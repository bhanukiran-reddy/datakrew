import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/metadata';
import { getBlogOverviewPage } from '@/lib/graphql/queries/getBlogOverviewPage';
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import BlogListSection from "@/components/sections/reusable/BlogListSection/BlogListSection";
import FeaturedBlogSection from "@/components/sections/reusable/FeaturedBlogSection/FeaturedBlogSection";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import style from "./articlesBlog.module.css";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

interface BlogOverviewResponse {
    page: {
        innerPageHeroSection?: {
            innerpageHeroDescription?: string;
            innerpageHeroHeading?: string;
            innerpageHeroImage?: { node: { mediaItemUrl: string; altText: string } };
            innerpageHeroMobileImage?: { node: { mediaItemUrl: string; altText: string } };
            innerpageHeroCTAButtons?: any;
        };
        prefooterCtaBannerSection?: {
            prefooterCtaBannerHeading?: string;
            prefooterCtaBannerDescription?: string;
            prefooterCtaBackgroundImage?: { node: { mediaItemUrl: string; altText: string } };
            prefooterBannerCtaButtons?: any[];
        };
        seo?: any;
    };
    featuredBlogs: { nodes: any[] };
    regularBlogs: { nodes: any[] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const response = await getBlogOverviewPage().catch(() => null) as BlogOverviewResponse | null;

    return buildMetadata(response?.page?.seo || { title: 'Blog' }, locale, { path: 'articles-blogs' });
}

export default async function BlogPage({ params }: Props) {
    const { locale } = await params;
    const response = await getBlogOverviewPage().catch((err) => {
        console.error("Error fetching blog overview:", err);
        return null;
    }) as BlogOverviewResponse | null;

    if (!response || (!response.page && !response.featuredBlogs && !response.regularBlogs)) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-xl font-bold mb-4">Content currently unavailable</h2>
                <p className="text-gray-400">We're professionalizing our library. Please check back in a moment.</p>
            </div>
        );
    }

    const { page, featuredBlogs, regularBlogs } = response;
    const hero = page?.innerPageHeroSection;
    const prefooter = page?.prefooterCtaBannerSection;

    const transformBlog = (node: any) => ({
        id: node.slug,
        title: node.title,
        excerpt: node.excerpt ? node.excerpt.replace(/<[^>]*>/g, '').trim().slice(0, 150) : "",
        image: node.featuredImage?.node?.mediaItemUrl || "/blog/default.webp",
        date: node.date ? new Date(node.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "",
        rawDate: node.date, // Store for sorting
        slug: node.slug,
        category: "",
        linkUrl: `/articles-blogs/${node.slug}`
    });

    const fPosts = (featuredBlogs?.nodes?.map(transformBlog) || [])
        .sort((a: any, b: any) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

    const rPosts = (regularBlogs?.nodes?.map(transformBlog) || [])
        .sort((a: any, b: any) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
    const categoriesList: string[] = [];

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Resources", href: "/resources" },
        { label: "Articles & Blogs" },
    ];

    return (
        <>
            <InnerPageBanner
                title={hero?.innerpageHeroHeading || response?.page?.seo?.title || "Articles & <span>Blog</span>"}
                description={hero?.innerpageHeroDescription || ""}
                breadcrumbItems={breadcrumbItems}
                backgroundImage={{
                    url: hero?.innerpageHeroImage?.node?.mediaItemUrl || "/blog/blog-banner.webp",
                    alt: hero?.innerpageHeroImage?.node?.altText || "Blog Banner"
                }}
                mobileImage={{
                    url: hero?.innerpageHeroMobileImage?.node?.mediaItemUrl || "/blog/blog-mobile-banner.webp",
                    alt: hero?.innerpageHeroMobileImage?.node?.altText || "Blog Mobile Banner"
                }}
                className={style.blogBanner}
            />

            {fPosts.length > 0 && (
                <FeaturedBlogSection posts={fPosts} title={"Featured <span>blogs</span>"} />
            )}

            <BlogListSection
                posts={rPosts}
                isCategory={false}
            />

            <ContactStripSection
                title={prefooter?.prefooterCtaBannerHeading || ""}
                description={prefooter?.prefooterCtaBannerDescription || ""}
                ctas={prefooter?.prefooterBannerCtaButtons?.map((btn: any) => ({
                    text: btn.buttonText,
                    url: btn.buttonUrl?.url || "#"
                })) || []}
                backgroundImageUrl={prefooter?.prefooterCtaBackgroundImage?.node?.mediaItemUrl || "/prefooter-banner.webp"}
            />
        </>
    );
}
