import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";
import { getSupportedLocalesSync } from "@/lib/config/locales";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Link from "@/components/ui/Link/Link";
import styles from "./investors.module.css";
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import UltraSecureDesignSection from "@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection";

import { getInvestorsPage } from "@/lib/graphql/queries/getInvestorsPage";
import OneDevice from "@/components/sections/reusable/OneDevice/OneDevice";
import FleetAgentsSection from "@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection";
import OemLogo from "@/components/ui/OemLogo/OemLogo";
import BlogCard from "@/components/ui/BlogCard/BlogCard";
import blogStyles from "@/components/ui/BlogCard/BlogCard.module.css";
type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
    return getSupportedLocalesSync().map((locale: string) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const page = await getInvestorsPage(locale).catch(() => null);

    return buildMetadata(page?.seo || { title: "Investors" }, locale, { path: 'investors' });
}

export const revalidate = 60;

export default async function InvestorsPage({ params }: Props) {
    const { locale } = await params;

    const page = await getInvestorsPage(locale).catch(() => null);

    const bannerData = page?.innerPageHeroSection || {};
    const textImageStatsData = page?.textImageStatsSection || {};
    const investorsSectionData = page?.investorsSection || {};
    const featureTabsSectionData = page?.featureTabsSection || {};

    const staggeredGridSection = page?.staggeredGridSection || {};
    const contactStripData = page?.prefooterCtaBannerSection || {};

    const bannerBreadcrumbs = [
        { label: "Home", href: `/${locale}` },
        { label: "Investors" },
    ];

    const contentItems = (staggeredGridSection?.gridItems || []).filter(
        (item: any) => item.gridItemTitle,
    );

    const sequence = [
        { itemIdx: 0, cellType: "content" },
        { cellType: "empty" },
        { itemIdx: 1, cellType: "content" },
        { cellType: "empty" },
        { cellType: "empty" },
        { itemIdx: 2, cellType: "content" },
        { cellType: "empty" },
        { itemIdx: 3, cellType: "content" },
    ];

    const gridCells = sequence.map((cfg: any) => {
        if (cfg.cellType === "empty") return { type: "empty" as const };
        const item = contentItems[cfg.itemIdx];
        if (!item) return { type: "empty" as const };
        return {
            type: "content" as const,
            title: item.gridItemTitle,
            description: item.gridItemDescription,
            icon: item.gridItemIconImage?.node?.mediaItemUrl,
        };
    });

    const featureAgents =
        featureTabsSectionData?.tabs?.map((tab: any, index: number) => ({
            id: `tab-${index}`,
            label: tab.tabLabel || "",
            tabDescription: tab.tabIntro || "",
            description: tab.tabDescription || "",
            imageUrl: tab.tabImage?.node?.mediaItemUrl || "",
        })) || [];

    const investorLogos =
        investorsSectionData?.investorItems?.nodes?.map((item: any) => ({
            url: item.featuredImage?.node?.mediaItemUrl || "",
            title: item.featuredImage?.node?.altText || item.title || "Investor Logo",
        })) || [];

    return (
        <>
            <InnerPageBanner
                title={bannerData.innerpageHeroHeading}
                description={bannerData.innerpageHeroDescription}
                breadcrumbItems={bannerBreadcrumbs}
                backgroundImage={
                    bannerData.innerpageHeroImage?.node?.mediaItemUrl
                        ? {
                            url: bannerData.innerpageHeroImage.node.mediaItemUrl,
                            alt: "Banner Background",
                            width: 1920,
                            height: 1080,
                        }
                        : undefined
                }
                mobileImage={
                    bannerData.innerpageHeroMobileImage?.node?.mediaItemUrl
                        ? {
                            url: bannerData.innerpageHeroMobileImage.node.mediaItemUrl,
                            alt: "Mobile Banner Background",
                            width: 768,
                            height: 1024,
                        }
                        : undefined
                }
                className={styles.itusmaxBanner}
                backgroundColor="#111216"
            >
                <div className={styles.bannerCtaWrapper}>
                    {bannerData.innerpageHeroCTAButtons?.map((btn: any, idx: number) => (
                        <Link
                            key={idx}
                            href={btn.buttonUrl?.url || "#"}
                            locale={locale}
                            target={btn.buttonUrl?.target}
                            className={idx === 0 ? "primaryCta" : "secondaryCta"}
                        >
                            {btn.buttonText}
                            <i className="icon fa-kit fa-right-arrow"></i>
                        </Link>
                    ))}
                </div>
            </InnerPageBanner>

            <OneDevice
                title={textImageStatsData.textImageStatsHeading}
                description={textImageStatsData.textImageStatsDescription}
                image={
                    textImageStatsData.textImageStatsMedia?.node?.mediaItemUrl
                        ? {
                            url: textImageStatsData.textImageStatsMedia.node.mediaItemUrl,
                            alt: "Deep Tech in our DNA",
                        }
                        : undefined
                }
                stats={textImageStatsData.stats}
                statsWidth={textImageStatsData.statsWidth}
                statsClassName={styles.stats}
                statsItemClassName={styles.statsItem}
            />
            {/* <Stats stats={textImageStatsData.stats} /> */}
            <OemLogo
                title={investorsSectionData.investorSectionHeading}
                description={investorsSectionData.investorSectionDescription}
                logos={investorLogos}
            />

            <FleetAgentsSection
                title={featureTabsSectionData.featureTabsSectionHeading}
                subheading={featureTabsSectionData.featureTabsSectionDescription}
                agents={featureAgents}
                headerAlign="left"
            />

            <UltraSecureDesignSection
                title={staggeredGridSection.gridSectionHeading}
                subtitle={staggeredGridSection.gridSectionDescription}
                cells={gridCells}
                columns={4}
                id="invest-in-certainty"
                className={styles.investorGrid}
                cta={
                    staggeredGridSection.gridCTAButton?.gridButtonText
                        ? {
                            text: staggeredGridSection.gridCTAButton.gridButtonText,
                            url:
                                staggeredGridSection.gridCTAButton.gridButtonUrl?.url || "#",
                            target:
                                staggeredGridSection.gridCTAButton.gridButtonUrl?.target,
                        }
                        : contactStripData.prefooterBannerCtaButtons?.[0]
                            ? {
                                text: contactStripData.prefooterBannerCtaButtons[0]
                                    .buttonText,
                                url:
                                    contactStripData.prefooterBannerCtaButtons[0].buttonUrl
                                        ?.url || "#",
                                target:
                                    contactStripData.prefooterBannerCtaButtons[0].buttonUrl
                                        ?.target,
                            }
                            : undefined
                }
            />
            <section className={`${blogStyles.section} ${styles.investorSection}`}>
                <div className="container">
                    <div className={blogStyles.blogCardHeader}>
                        <div>
                            <h2
                                className={`${blogStyles.blogCardHeading} sectionTitle`}
                                dangerouslySetInnerHTML={{
                                    __html:
                                        page?.mediaMentionsSection?.mmSectionHeading || "",
                                }}
                            />
                            {page?.mediaMentionsSection?.mmSectionDescription && (
                                <p
                                    className={`${blogStyles.blogCardSectionDescription} sectionDescription`}
                                    dangerouslySetInnerHTML={{
                                        __html: page?.mediaMentionsSection.mmSectionDescription,
                                    }}
                                />
                            )}
                        </div>
                        <div className={blogStyles.blogCardCta}>
                            {page?.mediaMentionsSection?.mmSectionCTAButton?.mmButtonUrl && (
                                <Link
                                    className="tertiaryCta"
                                    href={page.mediaMentionsSection.mmSectionCTAButton.mmButtonUrl}
                                    target="_blank"
                                >
                                    {page.mediaMentionsSection.mmSectionCTAButton.mmButtonText || "View all"}{" "}
                                    <i className="icon fa-kit fa-right-arrow"></i>
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className={blogStyles.blogCardWrapper}>
                        {page?.mediaMentionsSection?.mediaItems?.length > 0 ? (
                            page.mediaMentionsSection.mediaItems.map(
                                (item: any, idx: number) => {
                                    return (
                                        <BlogCard
                                            key={idx}
                                            category=""
                                            hideCategory={true}
                                            image={item.mmItemImage?.node?.mediaItemUrl || ""}
                                            title={item.mmItemTitle || ""}
                                            excerpt=""
                                            date={item.mmItemDate || ""}
                                            linkUrl={item.mmCtaButton?.mmButtonURL || ""}
                                            linkText={item.mmCtaButton?.mmButtonText || ""}
                                        />
                                    );
                                },
                            )
                        ) : (
                            <p>No media data available</p>
                        )}
                    </div>
                </div>
            </section>

            <ContactStripSection
                prefooterCtaBannerHeading={contactStripData.prefooterCtaBannerHeading}
                prefooterCtaBannerDescription={
                    contactStripData.prefooterCtaBannerDescription
                }
                prefooterCtaBackgroundImage={
                    contactStripData.prefooterCtaBackgroundImage
                }
                prefooterBannerCtaButtons={contactStripData.prefooterBannerCtaButtons}
                id="contactStrip"
            />
        </>
    );
}
