import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";
import { getSupportedLocalesSync } from "@/lib/config/locales";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import styles from "./privacyPolicy.module.css";
import { getPrivacyPolicyPage } from "@/lib/graphql/queries/getPrivacyPolicyPage";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return getSupportedLocalesSync().map((locale: string) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await getPrivacyPolicyPage(locale).catch(() => null);

  return buildMetadata(
    pageData?.seo || { title: "Privacy Policy" },
    locale,
    { path: "privacy-policy" }
  );
}

export const revalidate = 60;

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  const pageData = await getPrivacyPolicyPage(locale);

  if (!pageData) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Privacy Policy" },
  ];

  return (
    <>
      <InnerPageBanner
        title={
          pageData.innerPageHeroSection?.innerpageHeroHeading ||
          "Privacy Policy"
        }
        description={
          pageData.innerPageHeroSection?.innerpageHeroDescription || ""
        }
        breadcrumbItems={breadcrumbItems}
        backgroundColor="#111216"
        backgroundImage={
          pageData.innerPageHeroSection?.innerpageHeroImage?.node
            ? {
                url: pageData.innerPageHeroSection.innerpageHeroImage.node
                  .mediaItemUrl,
                alt:
                  pageData.innerPageHeroSection.innerpageHeroImage.node
                    .altText || "",
              }
            : undefined
        }
        mobileImage={
          pageData.innerPageHeroSection?.innerpageHeroMobileImage?.node
            ? {
                url: pageData.innerPageHeroSection.innerpageHeroMobileImage
                  .node.mediaItemUrl,
                alt:
                  pageData.innerPageHeroSection.innerpageHeroMobileImage.node
                    .altText || "",
              }
            : undefined
        }
      />
      <section className={styles.privacySection}>
        <div className="container">
          <div
            className={styles.dynamicContent}
            dangerouslySetInnerHTML={{
              __html: pageData.termsConditionSection?.pageContent || "",
            }}
          />
        </div>
      </section>
    </>
  );
}
