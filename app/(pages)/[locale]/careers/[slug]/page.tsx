import React from "react";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import styles from "./careerInner.module.css";
import bannerStyles from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css";
import Image from "@/components/ui/Image/Image";
import Link from "@/components/ui/Link/Link";
import EmailLink from "@/components/ui/EmailLink/EmailLink";
import { getCareersInnerPage } from "@/lib/graphql/queries/getCareersInnerPage";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getSiteConfigFallback } from "@/lib/config/site";
import JobApplicationForm from "./JobApplicationForm";
import { localizedPath } from "@/lib/utils/slugUtils";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const { getCareerSlugs, staticParamsFromSlugs } = await import(
    '@/lib/graphql/queries/getStaticSlugs'
  );
  return staticParamsFromSlugs(await getCareerSlugs());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const response = await getCareersInnerPage(locale, slug).catch(() => null);

    if (!response || !response.careers) {
        const fallback = getSiteConfigFallback();
        return {
            title: fallback.name || undefined,
            description: fallback.defaultDescription || undefined,
        };
    }

    const { careers } = response;
    return buildMetadata(careers.seo, locale, {
        title: careers.title || 'Careers',
        path: `careers/${slug}`,
    });
}

export default async function CareerDetailPage({ params }: Props) {
    const { locale, slug } = await params;

    const response = await getCareersInnerPage(locale, slug).catch((err) => {
        console.error("GraphQL Error in Career Inner:", err);
        return null;
    });

    if (!response || !response.careers) {
        notFound();
    }

    const { careers } = response;
    const { careersAdditionalFields } = careers;

    const breadcrumbItems = [
        { label: "Careers", href: localizedPath(locale, '/careers') },
        { label: careers.title || "Job Detail" }
    ];

    // Process HTML to add check icons to list items if they don't have them
    const processContent = (html: string) => {
        if (!html) return "";
        // Using FontAwesome icon instead of img to allow gradient styling
        return html.replace(/<li>/g, `<li><i class="fa-kit fa-tick"></i><span>`).replace(/<\/li>/g, `</span></li>`);
    };

    const descriptionHtml = processContent(careersAdditionalFields.jobDescription);
    const requirementsHtml = processContent(careersAdditionalFields.jobRequirements);
    const responsibilitiesHtml = processContent(careersAdditionalFields.jobResponsibilities);

    const fullContentHtml = `
        ${descriptionHtml}
        ${requirementsHtml}
        ${responsibilitiesHtml}
    `;

    const heroImage = careers.featuredImage?.node;

    return (
        <>
            <InnerPageBanner
                title={careers.title}
                description={""}
                breadcrumbItems={breadcrumbItems}
                className={styles.careerBanner}
                backgroundColor="#111216"
            >

                <div className={styles.jobMeta}>
                    {[
                        careersAdditionalFields.jobLocation && careersAdditionalFields.jobLocation !== "N/A" && (
                            <div key="location" className={styles.metaItem}>
                                <i className="fa-kit fa-global"></i>
                                <span>{careersAdditionalFields.jobLocation}</span>
                            </div>
                        ),
                        careersAdditionalFields.jobExperience && careersAdditionalFields.jobExperience !== "N/A" && (
                            <div key="experience" className={styles.metaItem}>
                                <i className="fa-kit fa-experience"></i>
                                <span>{careersAdditionalFields.jobExperience}</span>
                            </div>
                        ),
                        careersAdditionalFields.jobType && careersAdditionalFields.jobType.length > 0 && (
                            <div key="type" className={styles.metaItem}>
                                <i className="fa-kit fa-full-time"></i>
                                <span>{careersAdditionalFields.jobType.join(", ")}</span>
                            </div>
                        )
                    ].filter(Boolean).reduce((acc: any[], curr, idx, arr) => {
                        acc.push(curr);
                        if (idx < arr.length - 1) {
                            acc.push(<div key={`divider-${idx}`} className={styles.metaDivider}></div>);
                        }
                        return acc;
                    }, [])}
                </div>

                <div className={bannerStyles.innerPageBannerCtaGroup}>
                    <Link
                        href="#apply"
                        locale={locale}
                        className={'primaryCta'}
                    >
                        Apply now
                    </Link>
                </div>
            </InnerPageBanner>

            <section className={styles.careerSection}>
                <div className="container">
                    <div
                        className={styles.dynamicContent}
                        dangerouslySetInnerHTML={{ __html: fullContentHtml }}
                    />
                </div>
            </section>

            <section id="apply" className={styles.applyNowSection}>
                <div className="container">
                    {/* <div className="sectionTitle"><span>Apply</span> for this job</div>
                    <JobApplicationForm jobTitle={careers.title} /> */}
                    <div className={styles.applyNowContent}>
                        <h2 className="sectionTitle">How to Apply:</h2>
                        <p className="sectionDescription">
                            Interested candidates should submit their resume and a cover letter detailing their relevant experience and explaining why they are a good fit for this position to <EmailLink email="hr@datakrew.com">hr@datakrew.com</EmailLink> with the subject line <strong>"{careers.title}_Application_Your Full Name"</strong>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
