import { getPodcastsandVideosOverviewPage } from "@/lib/graphql/queries/getPodcastsandVideosOverviewPage";
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import FeaturedPodcastsSection from "@/components/sections/reusable/FeaturedPodcastsSection/FeaturedPodcastsSection";
import PodcastsSection from "@/components/sections/reusable/PodcastsSection/PodcastsSection";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";
import styles from "./podcasts.module.css"

interface PageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const data = await getPodcastsandVideosOverviewPage().catch(() => null);
    const page = data?.page;
    const heroTitle = page?.innerPageHeroSection?.innerpageHeroHeading;
    return buildMetadata(page?.seo, locale, {
        title: heroTitle || "Videos & Podcasts",
        path: 'resources/videos-podcasts',
    });
}

export default async function PodcastsPage({ params }: PageProps) {
    const { locale } = await params;
    const data = await getPodcastsandVideosOverviewPage();

    if (!data) return null;

    const { page, featuredPodcastsVideos, regularPodcastsVideos } = data;
    const hero = page?.innerPageHeroSection;
    const prefooter = page?.prefooterCtaBannerSection;

    const mapPodcast = (node: any) => ({
        thumbnail: node.featuredImage?.node?.mediaItemUrl || node.episodeAdditionalFields?.episodePosterImage?.node?.mediaItemUrl || "/blog/blog.svg",
        publishedDate: node.date ? new Date(node.date).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        }) : "",
        episodeNumber: (node.episodeAdditionalFields?.episodeNumber !== null && node.episodeAdditionalFields?.episodeNumber !== undefined && node.episodeAdditionalFields?.episodeNumber !== "") ? String(node.episodeAdditionalFields.episodeNumber) : "",
        duration: node.episodeAdditionalFields?.episodeDuration || "",
        title: node.title,
        description: node.excerpt,
        linkUrl: `/resources/videos-podcasts/${node.slug}`,
        ctaText: "Watch now",
        target: "_self"
    });

    const featuredPodcasts = featuredPodcastsVideos?.nodes?.map(mapPodcast) || [];
    const regularPodcasts = regularPodcastsVideos?.nodes?.map(mapPodcast) || [];

    return (
        <>
            <InnerPageBanner
                title={hero?.innerpageHeroHeading}
                description={hero?.innerpageHeroDescription}
                backgroundImage={{
                    url: hero?.innerpageHeroImage?.node?.mediaItemUrl || "",
                    alt: hero?.innerpageHeroImage?.node?.altText || "About Us Hero"
                }}
                mobileImage={{
                    url: hero?.innerpageHeroMobileImage?.node?.mediaItemUrl || "",
                    alt: hero?.innerpageHeroMobileImage?.node?.altText || "About Us Hero Mobile"
                }}
                breadcrumbItems={[
                    { label: "Home", href: "/" },
                    { label: "Resources", href: "/resources" },
                    { label: "Video & Podcasts", href: "/resources/videos-podcasts" }
                ]}
                className={styles.podcastBanner}
            />
            <FeaturedPodcastsSection podcasts={featuredPodcasts} title="In the <span>spotlight" />
            <PodcastsSection podcasts={regularPodcasts} />
            <ContactStripSection
                {...prefooter}
                title={!prefooter ? "Ready to Transform Your Fleet?" : undefined}
                description={!prefooter ? "Join hundreds of forward-thinking companies using Datakrew to optimize their operations." : undefined}
                ctas={!prefooter ? [{ text: "Book a Demo", url: "/book-a-demo" }] : undefined}
            />
        </>
    );
}
