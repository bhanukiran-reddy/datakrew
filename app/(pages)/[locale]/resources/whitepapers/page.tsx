import { getWhitepapersOverviewPage } from "@/lib/graphql/queries/getWhitepapersOverviewPage";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import WhitepaperClient from "./WhitepaperClient";
import styles from './Whitepaper.module.css';
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";

interface WhitepaperPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WhitepaperPageProps): Promise<Metadata> {
    const { locale } = await params;
    const data = await getWhitepapersOverviewPage().catch(() => null);
    const page = data?.page;
    const heroTitle = page?.innerPageHeroSection?.innerpageHeroHeading;

    return buildMetadata(page?.seo, locale, {
        title: heroTitle || "Whitepapers",
        path: 'resources/whitepapers',
    });
}

export default async function WhitepaperPage({ params }: WhitepaperPageProps) {
    const { locale } = await params;
    const data = await getWhitepapersOverviewPage(100); // Fetch more for initial load or use pagination if needed

    if (!data) return null;

    const { page, allWhitepapers } = data;
    const hero = page?.innerPageHeroSection;
    const prefooter = page?.prefooterCtaBannerSection;

    const bannerBreadcrumbs = [
        { label: "Home", href: `/` },
        { label: "Resources", href: `/resources` },
        { label: "Whitepapers" }
    ];

    return (
        <>
            <InnerPageBanner
                title={hero?.innerpageHeroHeading || "<span>Whitepapers</span> and reports"}
                description={hero?.innerpageHeroDescription || "Deep dives that turn vehicle data into action across range, maintenance, and lifecycle performance."}
                breadcrumbItems={bannerBreadcrumbs}
                backgroundImage={{
                    url: hero?.innerpageHeroImage?.node?.mediaItemUrl || "/blog/blog-banner.webp",
                    alt: hero?.innerpageHeroImage?.node?.altText || "Whitepaper Background",
                    width: 1920,
                    height: 1080
                }}
                mobileImage={{
                    url: hero?.innerpageHeroMobileImage?.node?.mediaItemUrl || "/blog/blog-mobile-banner.webp",
                    alt: hero?.innerpageHeroMobileImage?.node?.altText || "Whitepaper Background",
                }}
                className={styles.whitepaperBanner}
            />

            <WhitepaperClient initialWhitepapers={allWhitepapers?.nodes || []} />

            <ContactStripSection
                {...prefooter}
                title={prefooter?.prefooterCtaBannerHeading || "Turn data into decisions"}
                description={prefooter?.prefooterCtaBannerDescription || "Partner with Datakrew to transform your operations. Fleet Management, EV Battery Intelligence, AI-Enabled Solutions, all through one intelligent deployment.<br/><br/>Smarter. Safer. Sustainable."}
                backgroundImageUrl={prefooter?.prefooterCtaBackgroundImage?.node?.mediaItemUrl || "/prefooter-banner.webp"}
            />
        </>
    );
}