import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import styles from "./podcastInnerPage.module.css";
import Link from "next/link";
import VideoPlayer from "@/components/ui/PodcastVideoPlayer/videoPlayer";
import PodcastCard, { PodcastCardProps } from "@/components/ui/PodcastCard/podcastCard";
import { getPodcastInnerPageData } from "@/lib/graphql/queries/getPodcastInnerPage";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";

interface PageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const data = await getPodcastInnerPageData(locale, slug).catch(() => null);
    const podcast = data?.podcastsandvideos;
    const heroTitle = podcast?.innerPageHeroSection?.innerpageHeroHeading;

    return buildMetadata(podcast?.seo, locale, {
        title: heroTitle || podcast?.title || "Videos & Podcasts",
        description: podcast?.excerpt || undefined,
        path: `resources/videos-podcasts/${slug}`,
    });
}

export default async function PodcastInnerPage({ params }: PageProps) {
    const { locale, slug } = await params;
    const data = await getPodcastInnerPageData(locale, slug);

    if (!data || !data.podcastsandvideos) {
        return <div>Podcast not found</div>;
    }

    const podcast = data.podcastsandvideos;
    const hero = podcast.innerPageHeroSection;
    const episodeFields = podcast.episodeAdditionalFields;
    const relatedPodcastsData = data.relatedPodcastVideos?.nodes || [];

    const bannerBreadcrumbs = [
        { label: "Resources", href: "/resources" },
        { label: "Videos & podcasts", href: "/resources/videos-podcasts" },
        { label: podcast.title },
    ];

    const mapRelatedPodcast = (node: any) => ({
        thumbnail: node.featuredImage?.node?.mediaItemUrl || node.episodeAdditionalFields?.episodePosterImage?.node?.mediaItemUrl || "/blog/blog.svg",
        episodeNumber: (node.episodeAdditionalFields?.episodeNumber !== null && node.episodeAdditionalFields?.episodeNumber !== undefined && node.episodeAdditionalFields?.episodeNumber !== "") ? String(node.episodeAdditionalFields.episodeNumber) : "",
        publishedDate: node.date ? new Date(node.date).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        }) : "",
        title: node.title,
        description: node.excerpt,
        duration: node.episodeAdditionalFields?.episodeDuration || "",
        linkUrl: `/resources/videos-podcasts/${node.slug}`,
        ctaText: "Watch now"
    });

    const relatedPodcasts = relatedPodcastsData.map(mapRelatedPodcast);

    const publishedDate = podcast.date ? new Date(podcast.date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }) : "";

    const episodeInfo = episodeFields?.episodeNumber
        ? `Episode ${episodeFields.episodeNumber} | ${publishedDate}`
        : "";

    return (
        <>
            <InnerPageBanner
                title={hero?.innerpageHeroHeading || podcast.title}
                description={hero?.innerpageHeroDescription || episodeInfo}
                breadcrumbItems={bannerBreadcrumbs}
                backgroundImage={{
                    url: hero?.innerpageHeroImage?.node?.mediaItemUrl || "/blog/blog-banner.webp",
                    alt: hero?.innerpageHeroImage?.node?.altText || podcast.title,
                    width: 1920,
                    height: 1080
                }}
                mobileImage={{
                    url: hero?.innerpageHeroMobileImage?.node?.mediaItemUrl || "/blog/blog-mobile-banner.webp",
                    alt: hero?.innerpageHeroMobileImage?.node?.altText || podcast.title,
                }}
                className={styles.podcastInnerBanner}
            >
                {hero?.innerpageHeroCTAButtons && hero.innerpageHeroCTAButtons.length > 0 && (
                    <div className={styles.bannerCtaWrapper}>
                        {hero.innerpageHeroCTAButtons.map((cta: any, index: number) => {
                            const isWatchNow = cta.buttonText?.toLowerCase() === "watch now" || cta.buttonText?.toLowerCase() === "watch video";
                            const href = isWatchNow ? "#video" : (cta.buttonUrl?.url || "#");
                            return (
                                <Link
                                    key={index}
                                    href={href}
                                    target={cta.buttonUrl?.target || "_self"}
                                    className="primaryCta"
                                >
                                    {cta.buttonText}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </InnerPageBanner>

            <div id="video">
                <VideoPlayer
                    src={episodeFields?.episodeUrl}
                    poster={episodeFields?.episodePosterImage?.node?.mediaItemUrl}
                    description={episodeFields?.episodeDescription}
                    transcript={episodeFields?.episodeTranscript}
                />
            </div>

            {relatedPodcasts.length > 0 && (
                <section className={styles.relatedPodcastsSection}>
                    <div className="container">
                        <div className={styles.relatedPodcastsHeader}>
                            <h2 className={`sectionTitle ${styles.heading}`}>
                                Recent <span>videos & podcasts</span>
                            </h2>
                            <Link href="/resources/videos-podcasts" className="tertiaryCta">
                                View all <i className="icon fa-kit fa-right-arrow" />
                            </Link>
                        </div>
                        <div className={styles.relatedPodcastsGrid}>
                            {relatedPodcasts.map((podcast: PodcastCardProps, index: number) => (
                                <PodcastCard key={index} {...podcast} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

