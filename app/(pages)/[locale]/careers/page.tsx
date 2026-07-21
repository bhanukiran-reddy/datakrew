import React from "react";
import type { Metadata } from "next";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Link from "@/components/ui/Link/Link";
import EmailLink from "@/components/ui/EmailLink/EmailLink";
import styles from "./careers.module.css";
import bannerStyles from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css";
import FleetAgentsSection from "@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection";
import LifeAtDatakrew from "./LifeAtDatakrew";
import TestimonialSection from '@/components/sections/reusable/TestimonialSection/TestimonialSection';
import JobListingSection from '@/components/sections/reusable/JobListingSection/JobListingSection';
import OpenApplicationSection from '@/components/sections/reusable/OpenApplicationSection/OpenApplicationSection';
import { getCareersOverviewPage } from "@/lib/graphql/queries/getCareersOverviewPage";
import { buildMetadata } from "@/lib/seo";
import { localizedPath, stripDefaultLocalePrefix } from "@/lib/utils/slugUtils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const data = await getCareersOverviewPage(locale);
    const page = data?.page;

    if (!page) {
        return {
            title: "Careers | Datakrew",
        };
    }

    const heroTitle = page.innerPageHeroSection?.innerpageHeroHeading;
    return buildMetadata(page.seo, locale, {
        title: heroTitle || page.title || 'Careers',
        path: 'careers',
    });
}

export default async function CareersPage({ params }: Props) {
    const { locale } = await params;
    const data = await getCareersOverviewPage(locale);

    if (!data || !data.page) {
        return null; // Or a 404/error state if preferred, but following "no fallback"
    }

    const { page, allCareers } = data;
    const {
        innerPageHeroSection,
        featureTabsSection,
        krewCommunitySection,
        testimonialSection,
        careerResumeSection
    } = page;

    // Map Hero Section
    const bannerData = {
        title: innerPageHeroSection?.innerpageHeroHeading || page.title,
        description: innerPageHeroSection?.innerpageHeroDescription || "",
        backgroundImage: innerPageHeroSection?.innerpageHeroImage?.node ? {
            url: innerPageHeroSection.innerpageHeroImage.node.mediaItemUrl,
            alt: innerPageHeroSection.innerpageHeroImage.node.altText || "Careers Banner",
            width: 1920,
            height: 600
        } : undefined,
        mobileImage: innerPageHeroSection?.innerpageHeroMobileImage?.node ? {
            url: innerPageHeroSection.innerpageHeroMobileImage.node.mediaItemUrl,
            alt: innerPageHeroSection.innerpageHeroMobileImage.node.altText || "Careers Mobile Banner",
            width: 360,
            height: 333
        } : undefined,
    };

    const ctaButtons = (innerPageHeroSection?.innerpageHeroCTAButtons || []).map((btn: any) => ({
        label: btn.buttonText,
        url: btn.buttonUrl?.url || "#jobs"
    }));

    // Map Feature Tabs (Why join Datakrew)
    const fleetAgentsData = featureTabsSection?.enableFeatureTabsSection ? {
        title: featureTabsSection.featureTabsSectionHeading,
        subheading: featureTabsSection.featureTabsSectionDescription,
        headerAlign: "left" as const,
        agents: (featureTabsSection.tabs || []).map((tab: any, index: number) => ({
            id: `tab-${index}`,
            label: tab.tabLabel,
            tabDescription: tab.tabIntro,
            description: tab.tabDescription,
            imageUrl: tab.tabImage?.node?.mediaItemUrl
        }))
    } : null;

    // Map Krew Community (Life at Datakrew)
    const galleryNodes = krewCommunitySection?.krewCommunityGallery?.nodes || [];
    const lifeAtDatakrewData = galleryNodes.length > 0 ? {
        title: krewCommunitySection?.krewCommunityHeading || "Life at <span>Datakrew</span>",
        subheading: krewCommunitySection?.krewCommunityDescription || "",
        images: galleryNodes.slice(0, 4).map((node: any, index: number) => ({
            url: node.mediaItemUrl,
            alt: node.altText || `Life at Datakrew ${index + 1}`,
            type: (index === 0 || index === 3) ? "horizontal" as const : "square" as const
        }))
    } : null;

    // Map Testimonials
    const testimonialNodes = testimonialSection?.testimonialsDetails?.nodes || [];
    const testimonialData = testimonialNodes.length > 0 ? {
        title: testimonialSection?.testimonialHeading || "What our <span>employees say</span>",
        testimonials: testimonialNodes.map((n: any) => ({
            quote: n.testimonialsFields?.testifierDescription || "",
            authorName: n.title || "",
            authorTitle: `${n.testimonialsFields?.testifierDesignation || ""}${n.testimonialsFields?.testifierDesignation && n.testimonialsFields?.testifierCompanyName ? ", " : ""}${n.testimonialsFields?.testifierCompanyName || ""}`,
            image: {
                url: "/blog/blog.svg",
                alt: n.title || "Testifier"
            }
        }))
    } : null;

    // Map Job Listings
    const jobListingData = {
        title: "Current <span>opportunities</span>",
        jobs: (allCareers?.nodes || []).map((job: any, index: number) => ({
            id: job.id || job.uri || `job-${index}`,
            title: job.title,
            location: job.careersAdditionalFields?.jobLocation || "Global",
            experience: job.careersAdditionalFields?.jobExperience || "N/A",
            type: job.careersAdditionalFields?.jobType?.[0] || "Full time",
            link: localizedPath(locale, stripDefaultLocalePrefix(job.uri || '/careers'))
        }))
    };

    // Map Open Application
    const openApplicationData = careerResumeSection?.careerResumeHeading ? {
        title: careerResumeSection.careerResumeHeading,
        subheading: careerResumeSection.careerResumeDescription,
        backgroundImage: careerResumeSection.careerResumeBgImage?.node?.mediaItemUrl || "/prefooter-banner.webp"
    } : null;

    return (
        <>
            <InnerPageBanner
                title={bannerData.title}
                description={bannerData.description}
                breadcrumbItems={[{ label: page.title || "Careers" }]}
                backgroundImage={bannerData.backgroundImage}
                mobileImage={bannerData.mobileImage}
                className={styles.itusmaxBanner}
                backgroundColor="#111216"
            >
                {ctaButtons.length > 0 && (
                    <div className={bannerStyles.innerPageBannerCtaGroup}>
                        {ctaButtons.map((btn: any, index: number) => (
                            <Link
                                key={index}
                                href={btn.url}
                                locale={locale}
                                className={'primaryCta'}
                            >
                                {btn.label}
                            </Link>
                        ))}
                    </div>
                )}
            </InnerPageBanner>

            {fleetAgentsData && <FleetAgentsSection {...fleetAgentsData} />}

            {lifeAtDatakrewData && <LifeAtDatakrew {...lifeAtDatakrewData} />}

            {testimonialData && <TestimonialSection {...testimonialData} />}

            {jobListingData.jobs.length > 0 && (
                <JobListingSection {...jobListingData} />
            )}

            {/* {openApplicationData && (
                <OpenApplicationSection {...openApplicationData} />
            )} */}

            <section className={styles.applyjobSection}>
                <div className="container">
                    <h2 className="sectionTitle">Excited to Join The Krew?</h2>
                    <p className="sectionDescription">
                        Send your resume to <EmailLink email="hr@datakrew.com">hr@datakrew.com</EmailLink> <br />
                        Subject line: <i>“Role Title eg: Full Stack Developer_Application_Your Full Name”</i></p>
                    <EmailLink email="hr@datakrew.com" className={`${styles.applyCTA} primaryCta`}>Apply now</EmailLink>
                </div>
            </section>
        </>
    );
}
