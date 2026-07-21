import { getInfographicOverviewPage } from "@/lib/graphql/queries/getInfographicOverviewPage";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import InfographicClient from "./InfographicClient";
import styles from './Whitepaper.module.css';
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";

interface InfographicPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: InfographicPageProps): Promise<Metadata> {
    const { locale } = await params;
    const data = await getInfographicOverviewPage().catch(() => null);
    const page = data?.page;
    const heroTitle = page?.innerPageHeroSection?.innerpageHeroHeading;

    return buildMetadata(page?.seo, locale, {
        title: heroTitle || "Infographics",
        path: 'resources/infographics',
    });
}

export default async function InfographicPage({ params }: InfographicPageProps) {
    const { locale } = await params;
    const data = await getInfographicOverviewPage(100);

    if (!data) return null;

    const { page, allInfographics } = data;
    const hero = page?.innerPageHeroSection;
    const prefooter = page?.prefooterCtaBannerSection;

    const bannerBreadcrumbs = [
        { label: "Home", href: `/` },
        { label: "Resources", href: `/resources` },
        { label: "Infographics" }
    ];

    return (
        <>
            <InnerPageBanner
                title={hero?.innerpageHeroHeading}
                description={hero?.innerpageHeroDescription}
                breadcrumbItems={bannerBreadcrumbs}
                backgroundImage={{
                    url: hero?.innerpageHeroImage?.node?.mediaItemUrl || "/blog/blog-banner.webp",
                    alt: hero?.innerpageHeroImage?.node?.altText || "Infographic Background",
                    width: 1920,
                    height: 1080
                }}
                mobileImage={{
                    url: hero?.innerpageHeroMobileImage?.node?.mediaItemUrl || "/blog/blog-mobile-banner.webp",
                    alt: hero?.innerpageHeroMobileImage?.node?.altText || "Infographic Background",
                }}
                className={styles.whitepaperBanner}
            />

            <InfographicClient initialInfographics={allInfographics?.nodes || []} />

            <ContactStripSection
                {...prefooter}
                title={prefooter?.prefooterCtaBannerHeading || "Turn data into decisions"}
                description={prefooter?.prefooterCtaBannerDescription || "Partner with Datakrew to transform your operations. Fleet Management, EV Battery Intelligence, AI-Enabled Solutions, all through one intelligent deployment.<br/><br/>Smarter. Safer. Sustainable."}
                backgroundImageUrl={prefooter?.prefooterCtaBackgroundImage?.node?.mediaItemUrl || "/prefooter-banner.webp"}
            />
        </>
    );
}