import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Link from "@/components/ui/Link/Link";
import { getCareersInnerPage } from "@/lib/graphql/queries/getCareersInnerPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";
import styles from './thankyou.module.css';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const response = await getCareersInnerPage(locale, slug).catch(() => null);

    if (!response || !response.careers) {
        return buildMetadata(null, locale, { title: "Thank You", path: `careers/${slug}/thank-you` });
    }

    return buildMetadata(null, locale, {
        title: `Thank You - ${response.careers.title}`,
        description: "Thank you for submitting your application to Datakrew.",
        path: `careers/${slug}/thank-you`,
    });
}

export default async function ThankYouPage({ params }: Props) {
    const { locale, slug } = await params;

    const response = await getCareersInnerPage(locale, slug).catch((err) => {
        console.error("GraphQL Error in Thank You Page:", err);
        return null;
    });

    if (!response || !response.careers) {
        notFound();
    }

    const { careers } = response;

    const breadcrumbItems = [
        { label: "Careers", href: `/careers` },
        { label: careers.title || "Job Detail", href: `/careers/${slug}` },
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
