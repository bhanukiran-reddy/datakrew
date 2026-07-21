import { stickyNavItems } from "./index";
import { getResourcesOverviewPage } from "@/lib/graphql/queries/getResourcesOverviewPage";
import { buildMetadata } from "@/lib/utils/metadata";
import { Metadata } from "next";
import ResourcesClient from "./ResourcesClient";
import { defaultLocale } from "@/lib/config/locales";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

interface ResourcesResponse {
    page: {
        innerPageHeroSection?: {
            innerpageHeroCTAButtons?: any;
            innerpageHeroDescription?: string;
            innerpageHeroHeading?: string;
            innerpageHeroImage?: { node: { mediaItemUrl: string; altText: string } };
            innerpageHeroMobileImage?: { node: { mediaItemUrl: string; altText: string } };
        };
        prefooterCtaBannerSection?: {
            prefooterBannerCtaButtons?: any[];
            prefooterCtaBackgroundImage?: { node: { mediaItemUrl: string; altText: string } };
            prefooterCtaBannerDescription?: string;
            prefooterCtaBannerHeading?: string;
        };
        seo?: any;
    };
    recentBlogs: { nodes: any[] };
    recentNews: { nodes: any[] };
    recentWhitepapers: { nodes: any[] };
    recentPodcastsVideos: { nodes: any[] };
    recentEvents: { nodes: any[] };
    recentInfographics: { nodes: any[] };
    recentCaseStudies: { nodes: any[] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const response = await getResourcesOverviewPage().catch(() => null) as ResourcesResponse | null;
    return buildMetadata(response?.page?.seo || { title: 'Resources' }, locale, { path: 'resources' });
}

export default async function ResourcesPage({ params }: Props) {
    const { locale } = await params;
    const response = await getResourcesOverviewPage().catch((err) => {
        console.error("Error fetching resources overview:", err);
        return null;
    }) as ResourcesResponse | null;

    if (!response) return null;

    const {
        page,
        recentBlogs,
        recentNews,
        recentWhitepapers,
        recentPodcastsVideos,
        recentEvents,
        recentInfographics,
        recentCaseStudies
    } = response;

    const hero = page?.innerPageHeroSection;
    const prefooter = page?.prefooterCtaBannerSection;

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    const formatEventDateBadge = (start: string, end: string) => {
        if (!start) return "";
        const startDate = new Date(start);
        const startDay = startDate.getDate();
        const month = startDate.toLocaleDateString('en-US', { month: 'long' });

        if (!end || start === end) {
            return `${startDay} <br/> ${month}`;
        }

        const endDate = new Date(end);
        const endDay = endDate.getDate();
        return `${startDay}-${endDay} <br/> ${month}`;
    };

    const getLocalizedPath = (path: string) => {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return locale === defaultLocale ? cleanPath : `/${locale}${cleanPath}`;
    };

    const sections = [
        {
            id: "articles-blogs",
            title: "Articles & blogs",
            viewAllUrl: getLocalizedPath("/articles-blogs"),
            viewAllText: "Explore more insights",
            posts: recentBlogs?.nodes?.map(node => ({
                id: node.slug,
                image: node.featuredImage?.node?.mediaItemUrl || "/blog/default.webp",
                title: node.title,
                excerpt: node.excerpt ? node.excerpt.replace(/<[^>]*>/g, '').trim().slice(0, 150) + "..." : "",
                date: formatDate(node.date),
                rawDate: node.date,
                slug: node.slug,
                linkUrl: getLocalizedPath(`/articles-blogs/${node.slug}`)
            })) || []
        },
        {
            id: "case-studies",
            title: "Case studies",
            viewAllUrl: getLocalizedPath("/resources/case-studies"),
            viewAllText: "Explore success stories",
            posts: recentCaseStudies?.nodes?.map(node => ({
                id: node.slug,
                category: node.industries?.nodes?.[0]?.name || "",
                image: node.featuredImage?.node?.mediaItemUrl || "/blog/default.webp",
                title: node.title,
                excerpt: node.excerpt ? node.excerpt.replace(/<[^>]*>/g, '').trim().slice(0, 150) + "..." : "",
                slug: node.slug,
                linkText: "View case study",
                linkUrl: getLocalizedPath(`/resources/case-studies/${node.slug}`)
            })) || []
        },
        {
            id: "events",
            title: "Events",
            viewAllUrl: getLocalizedPath("/resources/events"),
            posts: recentEvents?.nodes?.map(node => {
                const details = node.eventAdditionalDetails || {};

                // Determine status based on dates since boolean flags might not be available in selection
                const now = new Date();
                const startDate = details.eventStartDate ? new Date(details.eventStartDate) : null;
                const endDate = details.eventEndDate ? new Date(details.eventEndDate) : startDate;

                // Set endDate to end of day to include today in "Ongoing"
                if (endDate) endDate.setHours(23, 59, 59, 999);

                let status = "Upcoming";
                if (startDate && now >= startDate && now <= (endDate || startDate)) {
                    status = "Ongoing";
                } else if (endDate && now > endDate) {
                    status = "Past Event";
                }

                return {
                    id: node.slug,
                    category: status,
                    image: node.featuredImage?.node?.mediaItemUrl || "/blog/default.webp",
                    title: node.title,
                    excerpt: details.eventLocation || "",
                    slug: node.slug,
                    linkText: "Learn more",
                    linkUrl: getLocalizedPath(`/resources/events/${node.slug}`),
                    locationIcon: "fa-kit fa-location",
                    dateBadge: formatEventDateBadge(details.eventStartDate, details.eventEndDate),
                    rawDate: details.eventStartDate
                };
            }) || []
        },
        {
            id: "infographics",
            title: "Infographics",
            viewAllUrl: getLocalizedPath("/resources/infographics"),
            viewAllText: "Access full library",
            posts: recentInfographics?.nodes?.map(node => ({
                id: node.slug,
                image: node.featuredImage?.node?.mediaItemUrl || "/blog/default.webp",
                title: node.title,
                slug: node.slug,
                linkText: "Download now",
                linkUrl: getLocalizedPath(`/resources/infographics/${node.slug}`),
                category: node.infographicsAdditionalFields?.accessType || "gated",
                hideCategory: true,
                fileUrl: node.infographicsAdditionalFields?.infographicsFile?.node?.mediaItemUrl || "",
            })) || []
        },
        {
            id: "news",
            title: "News",
            viewAllUrl: getLocalizedPath("/resources/news"),
            viewAllText: "Access latest updates",
            posts: recentNews?.nodes?.map(node => ({
                id: node.slug,
                image: node.featuredImage?.node?.mediaItemUrl || "/blog/default.webp",
                title: node.title,
                date: formatDate(node.date),
                rawDate: node.date,
                slug: node.slug,
                linkUrl: node.newsAdditionalFields?.newsPublishedLink || getLocalizedPath(`/resources/news/${node.slug}`),
                target: node.newsAdditionalFields?.newsPublishedLink ? '_blank' : undefined,
            })) || []
        },
        {
            id: "videos-podcasts",
            title: "Videos & podcasts",
            viewAllUrl: getLocalizedPath("/resources/videos-podcasts"),
            viewAllText: "Watch more",
            posts: recentPodcastsVideos?.nodes?.map(node => {
                const thumb = node.featuredImage?.node?.mediaItemUrl
                    || node.episodeAdditionalFields?.episodePosterImage?.node?.mediaItemUrl
                    || null;
                return {
                    id: node.slug,
                    thumbnail: thumb,
                    episodeNumber: (node.episodeAdditionalFields?.episodeNumber !== null && node.episodeAdditionalFields?.episodeNumber !== undefined && node.episodeAdditionalFields?.episodeNumber !== "") ? String(node.episodeAdditionalFields.episodeNumber) : "",
                    duration: node.episodeAdditionalFields?.episodeDuration || "",
                    title: node.title,
                    description: node.excerpt ? node.excerpt.replace(/<[^>]*>/g, '').trim() : "",
                    publishedDate: formatDate(node.date),
                    rawDate: node.date,
                    linkUrl: getLocalizedPath(`/resources/videos-podcasts/${node.slug}`),
                    ctaText: "Watch now"
                };
            }) || []
        },
        {
            id: "whitepapers",
            title: "Whitepapers",
            viewAllUrl: getLocalizedPath("/resources/whitepapers"),
            viewAllText: "Access full library",
            posts: recentWhitepapers?.nodes?.map(node => ({
                id: node.slug,
                image: node.featuredImage?.node?.mediaItemUrl || "/whitepaperblog.png",
                title: node.title,
                slug: node.slug,
                linkText: "Download now",
                linkUrl: getLocalizedPath(`/resources/whitepapers/${node.slug}`),
                category: node.whitepaperAdditionalFields?.accessType || "gated",
                hideCategory: true,
                fileUrl: node.whitepaperAdditionalFields?.whitepaperFile?.node?.mediaItemUrl || "",
            })) || []
        }
    ];

    return (
        <ResourcesClient
            locale={locale}
            hero={hero}
            prefooter={prefooter}
            sections={sections}
            stickyNavItems={stickyNavItems}
        />
    );
}
