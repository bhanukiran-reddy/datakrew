import type { Metadata } from 'next';
import { buildMetadata } from "@/lib/utils/metadata";
import { getSupportedLocalesSync } from "@/lib/config/locales";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import OemLogo from "@/components/ui/OemLogo/OemLogo";
import Stats from "@/components/ui/Stats/Stats";
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import { getOEMCompatibilityPage } from "@/lib/graphql/queries/getOEMCompatibilityPage";
import styles from "./OemCompatibility.module.css";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
    return getSupportedLocalesSync().map((locale: string) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const data = await getOEMCompatibilityPage(locale).catch(() => null);

    return buildMetadata(data?.page?.seo || { title: "OEM Compatibility" }, locale, { path: 'resources/oem-compatibility' });
}

export const revalidate = 60;

export default async function OemCompatibility({ params }: Props) {
    const { locale } = await params;
    const data = await getOEMCompatibilityPage(locale).catch(() => null);

    if (!data || !data.page) return null;

    const { page, oemItems } = data;

    const bannerData = page.innerPageStatsBanner || {};
    const oemSection = page.oemCompatibilitySection || {};
    const prefooter = page.prefooterCtaBannerSection || {};

    const bannerBreadcrumbs = [
        { label: "Home", href: `/${locale}` },
        { label: "Resources" },
        { label: "OEM Compatibility" }
    ];

    const stats = bannerData.bannerStats?.map((s: any) => ({
        statsValue: s.bannerStatsValue,
        statsDescription: s.bannerStatsDescription
    })) || [];

    const logoItems = oemItems.map((item: any) => ({
        url: item.featuredImage?.node?.mediaItemUrl || "",
        title: item.title || ""
    }));

    return (
        <>
            <InnerPageBanner
                title={bannerData.innerpageStatsHeroHeading}
                description={bannerData.innerpageStatsHeroDescription}
                breadcrumbItems={bannerBreadcrumbs}
                backgroundImage={bannerData.innerpageStatsHeroImage?.node?.mediaItemUrl ? {
                    url: bannerData.innerpageStatsHeroImage.node.mediaItemUrl,
                    alt: "Banner Background",
                    width: 1920,
                    height: 1080
                } : undefined}
                mobileImage={bannerData.innerpageStatsHeroMobileImage?.node?.mediaItemUrl ? {
                    url: bannerData.innerpageStatsHeroMobileImage.node.mediaItemUrl,
                    alt: "Mobile Banner Background",
                    width: 768,
                    height: 1024
                } : undefined}
                className={styles.oemBanner}
                backgroundColor="#111216"
            >
                <div className={styles.bannerStats}>
                    {stats.length > 0 && <Stats stats={stats} />}
                </div>
            </InnerPageBanner>
            <section className={styles.statsWrapper}>
                <div className='container'>
                    {stats.length > 0 && <Stats stats={stats} />}
                </div>
            </section>
            <OemLogo
                title={oemSection.oemSectionHeading}
                description={oemSection.oemSectionDescription}
                logos={logoItems}
            />
            <ContactStripSection
                prefooterCtaBannerHeading={prefooter.prefooterCtaBannerHeading}
                prefooterCtaBannerDescription={prefooter.prefooterCtaBannerDescription}
                prefooterCtaBackgroundImage={prefooter.prefooterCtaBackgroundImage}
                prefooterBannerCtaButtons={prefooter.prefooterBannerCtaButtons}
            />
        </>
    );
}