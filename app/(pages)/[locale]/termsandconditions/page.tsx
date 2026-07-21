import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";
import { getSupportedLocalesSync } from "@/lib/config/locales";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import styles from "./termsandconditions.module.css";
import { getTermsAndConditionPage } from "@/lib/graphql/queries/getTermsAndConditionPage";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return getSupportedLocalesSync().map((locale: string) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await getTermsAndConditionPage(locale).catch(() => null);

  return buildMetadata(pageData?.seo || { title: "Terms & Conditions" }, locale, { path: 'termsandconditions' });
}

export const revalidate = 60;

export default async function TermsAndConditionsPage({ params }: Props) {
  const { locale } = await params;
  const pageData = await getTermsAndConditionPage(locale);

  if (!pageData) {
    notFound();
  }

  const stripHtml = (html: string | undefined | null) => {
    return (html || "").replace(/<[^>]*>?/gm, "").trim();
  };

  const breadcrumbItems = [
    { label: "Home", href: `/${locale}` },
    { label: stripHtml(pageData.innerPageHeroSection?.innerpageHeroHeading || "Terms & Conditions") },
  ];

  return (
    <>
      <InnerPageBanner
        title={pageData.innerPageHeroSection?.innerpageHeroHeading || "Terms & Conditions"}
        description=""
        breadcrumbItems={breadcrumbItems}
        backgroundColor="#111216"
        backgroundImage={pageData.innerPageHeroSection?.innerpageHeroImage?.node ? {
          url: pageData.innerPageHeroSection.innerpageHeroImage.node.mediaItemUrl,
          alt: pageData.innerPageHeroSection.innerpageHeroImage.node.altText || ""
        } : undefined}
        mobileImage={pageData.innerPageHeroSection?.innerpageHeroMobileImage?.node ? {
          url: pageData.innerPageHeroSection.innerpageHeroMobileImage.node.mediaItemUrl,
          alt: pageData.innerPageHeroSection.innerpageHeroMobileImage.node.altText || ""
        } : undefined}
      />
      <section className={styles.termsAndConditionsSection}>
        <div className="container">
          <div 
            className={styles.dynamicContent}
            dangerouslySetInnerHTML={{ __html: pageData.termsConditionSection?.pageContent || "" }}
          />
        </div>
      </section>
    </>
  );
}
