import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Link from "@/components/ui/Link/Link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";
import styles from "../[slug]/thank-you/thankyou.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return buildMetadata(null, locale, {
        title: "Thank You - Careers",
        description: "Thank you for submitting your application to Datakrew.",
        path: 'careers/thank-you',
    });
}

export default async function GeneralThankYouPage({ params }: Props) {
    const { locale } = await params;

    const breadcrumbItems = [
        { label: "Careers", href: `/careers` },
        { label: "Thank You" }
    ];

    return (
        <InnerPageBanner
            title="<span>Thank you</span> for submitting the application."
            description="Our HR team will reach out to you shortly if your profile is shortlisted."
            breadcrumbItems={breadcrumbItems}
            className={styles.thankYouBanner}
        >
            <div className={styles.innerPageBannerCtaGroup}>
                <Link
                    href={`/`}
                    className="primaryCta"
                >
                    Go back to home page
                    <i className="icon fa-kit fa-right-arrow"></i>
                </Link>
            </div>
        </InnerPageBanner>
    );
}
