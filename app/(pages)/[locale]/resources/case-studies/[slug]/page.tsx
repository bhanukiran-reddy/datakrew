import React from "react";
import type { Metadata } from "next";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import styles from "./caseStudyInner.module.css";
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import Image from "next/image";
import VehicleInsightSection from '@/components/sections/reusable/VehicleInsightSection/VehicleInsightSection';
import ImpactSection from '@/components/sections/reusable/ImpactSection/ImpactSection';
import { getCaseStudyInnerPage } from "@/lib/graphql/queries/getCaseStudyInnerPage";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/utils/metadata";
import { getBaseUrl } from "@/lib/env";

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const caseStudy = await getCaseStudyInnerPage(locale, slug).catch(() => null);

    const heroTitle = caseStudy?.innerPageHeroSection?.innerpageHeroHeading;
    return buildMetadata(caseStudy?.seo, locale, {
        title: heroTitle || caseStudy?.title || "Case Study",
        path: `resources/case-studies/${slug}`,
    });
}

export default async function CaseStudyInnerPage({ params }: Props) {
    const { locale, slug } = await params;
    const caseStudyData = await getCaseStudyInnerPage(locale, slug);

    if (!caseStudyData) {
        return notFound();
    }

    const {
        title,
        innerPageHeroSection,
        prefooterCtaBannerSection,
        caseStudyCardFields,
        caseStudySections,
        industries,
        region
    } = caseStudyData;

    const hero = innerPageHeroSection || {};
    const sections = caseStudySections || {};
    const prefooter = prefooterCtaBannerSection || {};

    const bannerBreadcrumbs = [
        { label: "Resources", href: "/resources" },
        { label: "Case Studies", href: "/resources/case-studies" },
        { label: title || "Case Study" }
    ];

    const ctaButtons = hero.innerpageHeroCTAButtons || [];
    const prefooterCtas = prefooter.prefooterBannerCtaButtons?.map((btn: any) => ({
        text: btn.buttonText,
        url: btn.buttonUrl?.url || btn.buttonUrl?.url || "#"
    })) || [];

    // Extracting testimonial blocks if exists
    const testimonialNodes = sections.testimonialSection?.testimonialDetails?.nodes;
    const testimonial = testimonialNodes && testimonialNodes.length > 0 ? testimonialNodes[0] : null;

    const pageUrl = getBaseUrl()
        ? `${getBaseUrl()}/resources/case-studies/${slug}`
        : "";

    return (
        <>
            <InnerPageBanner
                title={hero.innerpageHeroHeading || title}
                description={hero.innerpageHeroDescription}
                breadcrumbItems={bannerBreadcrumbs}
                pageUrl={pageUrl || undefined}
                backgroundImage={{
                    url: hero.innerpageHeroImage?.node?.mediaItemUrl || "/blog/blog-banner.webp",
                    alt: hero.innerpageHeroImage?.node?.altText || "Case Study Hero",
                    width: 1920,
                    height: 1080
                }}
                mobileImage={{
                    url: hero.innerpageHeroMobileImage?.node?.mediaItemUrl || "/blog/blog-mobile-banner.webp",
                    alt: hero.innerpageHeroMobileImage?.node?.altText || "Case Study Hero Background",
                }}
                className={styles.caseStudiesInnerPageBanner}
            >
                <div className={styles.meta}>
                    <p className={styles.category}>{industries?.nodes?.[0]?.name || "Case Study"}</p>
                    <div className={styles.divider}></div>
                    <p className={styles.region}>{region?.nodes?.[0]?.name || "Global"}</p>
                </div>
            </InnerPageBanner>

            {sections.opportunitySection && (
                <section className={styles.opportunitySection}>
                    <div className="container">
                        <div className={styles.contentContainer}>
                            <h2 className="sectionTitle" dangerouslySetInnerHTML={{ __html: sections.opportunitySection.osHeading }} />
                            <p className={`${styles.sectionDescription} `} dangerouslySetInnerHTML={{ __html: sections.opportunitySection.osDescription }} />
                        </div>
                    </div>
                </section>
            )}

            {sections.challengeSection && (
                <VehicleInsightSection
                    title={sections.challengeSection.csHeading}
                    description={sections.challengeSection.csDescription}
                    image={{
                        url: sections.challengeSection.csImage?.node?.mediaItemUrl || "/images/dashboard-laptop.webp",
                        alt: sections.challengeSection.csImage?.node?.altText || "Dashboard Insight",
                    }}
                    hideBgGradient={true}
                    className={styles.challengeSection}
                />
            )}

            {sections.solutionSection && (
                <section className={styles.solutionSection}>
                    <div className="container">
                        <div>
                            <h2 className="sectionTitle" dangerouslySetInnerHTML={{ __html: sections.solutionSection.ssHeading }} />
                            <p className={`${styles.sectionDescription} `} dangerouslySetInnerHTML={{ __html: sections.solutionSection.ssDescription }} />
                        </div>
                        {testimonial && testimonial.testimonialsFields && (
                            <div className={styles.textimonialContainer}>
                                <div className={styles.testimonialQuoteBlock}>
                                    <p className={`sectionDescription ${styles.testimonialQuoteText}`}>
                                        <span className={styles.testimonialQuoteMark} aria-hidden="true">
                                            <Image
                                                src="/icons/quotes.svg"
                                                alt="quotes"
                                                width={39}
                                                height={28}
                                                loading="lazy"
                                            />
                                        </span>
                                        {testimonial.testimonialsFields.testifierDescription}
                                    </p>
                                    <div className={styles.testifierDetails}>
                                        <strong style={{ color: 'white', display: 'block', fontSize: '18px', paddingTop: '10px' }}>
                                            {testimonial.title}
                                        </strong>
                                        <p style={{ color: '#aaa', fontSize: '14px' }}>
                                            {testimonial.testimonialsFields.testifierDesignation}, {testimonial.testimonialsFields.testifierCompanyName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {sections.impactSection && (
                <ImpactSection
                    title={sections.impactSection.isHeading || "The <span>Impact</span>"}
                    description={sections.impactSection.isDescription || ""}
                    items={sections.impactSection.impactPoints?.map((p: any) => ({
                        text: p.impactPointsText,
                    })) || []}
                    stats={caseStudyCardFields?.csKeyMetrics?.map((metric: any) => ({
                        value: metric.csMetricValue,
                        label: metric.csMetricLabel
                    })) || []}
                    image={{
                        url: sections.impactSection.isImage?.node?.mediaItemUrl || "/images/dashboard-laptop.webp",
                        alt: sections.impactSection.isImage?.node?.altText || "Impact"
                    }}
                    className={styles.impactSection}
                />
            )}

            <ContactStripSection
                title={prefooter.prefooterCtaBannerHeading || "Turn data into decisions"}
                description={prefooter.prefooterCtaBannerDescription || ""}
                ctas={prefooterCtas}
                backgroundImageUrl={prefooter.prefooterCtaBackgroundImage?.node?.mediaItemUrl || "/prefooter-banner.webp"}
            />
        </>
    );
}
