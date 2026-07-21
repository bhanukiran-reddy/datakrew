import React from "react";
import styles from "./InnerPageBanner.module.css";
import Breadcrumb from "@/components/ui/Breadcrumb/Breadcrumb";
import Image from "@/components/ui/Image/Image";
import JsonLd from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/env";
import {
  buildBreadcrumbJsonLdFromItems,
  stripHtmlForSchema,
  toAbsoluteSchemaUrl,
  type BreadcrumbSchemaItem,
} from "@/lib/seo/jsonld";
import {
  InnerPageBannerLcpProvider,
  InnerPageBannerHeroBackground,
  InnerPageBannerHeroMobile,
} from "./InnerPageBannerLcp";

interface InnerPageBannerProps {
  title: string;
  titleHighlight?: string;
  description?: string;
  backgroundColor?: string;
  breadcrumbItems?: { label: string; href?: string }[];
  /** Canonical URL for the current page (used in breadcrumb JSON-LD). */
  pageUrl?: string;
  backgroundImage?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  mobileImage?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  children?: React.ReactNode;
  className?: string;
  hideBreadcrumb?: boolean;
}

const InnerPageBanner = ({
  title,
  description,
  backgroundColor,
  breadcrumbItems,
  pageUrl,
  backgroundImage,
  mobileImage,
  children,
  className,
  hideBreadcrumb,
}: InnerPageBannerProps) => {
  const safeTitle = typeof title === "string" ? title : String(title ?? "");
  const baseUrl = getBaseUrl();

  const isHomeBreadcrumb = (item: { label: string; href?: string }) => {
    if (item.href === "/") return true;
    return stripHtmlForSchema(item.label).toLowerCase() === "home";
  };

  let breadcrumbJsonLd: string | null = null;
  if (!hideBreadcrumb && baseUrl && breadcrumbItems && breadcrumbItems.length > 0) {
    const schemaItems: BreadcrumbSchemaItem[] = [{ name: "Home", url: baseUrl }];
    breadcrumbItems.forEach((item, index) => {
      if (isHomeBreadcrumb(item)) return;
      const isLast = index === breadcrumbItems.length - 1;
      let url: string | undefined;
      if (item.href) {
        url = toAbsoluteSchemaUrl(item.href, baseUrl);
      } else if (isLast && pageUrl) {
        url = pageUrl;
      }
      schemaItems.push({ name: item.label, url });
    });
    breadcrumbJsonLd = buildBreadcrumbJsonLdFromItems(schemaItems);
  }

  return (
    <>
      {breadcrumbJsonLd ? <JsonLd data={breadcrumbJsonLd} /> : null}
    <section
      style={{ backgroundColor: backgroundColor || undefined }}
      className={`${styles.innerPageBanner} innerPageBanner ${className || ''}`}
    ><div className={`container ${styles.container}`}>
        {backgroundImage?.url && mobileImage?.url ? (
          <InnerPageBannerLcpProvider>
            <Breadcrumb
              items={breadcrumbItems || []}
              showHome={!hideBreadcrumb}
              className={`${styles.innerPageBannerBreadcrumb} ${hideBreadcrumb ? styles.hideBreadcrumb : ""}`}
            />
            <InnerPageBannerHeroBackground
              classNameWrap={styles.innerPageBannerBgWrap}
              classNameImg={styles.innerPageBannerBgImage}
              url={backgroundImage.url}
              alt={backgroundImage.alt}
              width={backgroundImage.width || 1920}
              height={backgroundImage.height || 676}
            />
            <div className={styles.innerPageBannerWrapper}>
              <div className={`${styles.innerPageBannerMainContent} innerPageBannerMainContent`}>
                <h1
                  className={`sectionTitle ${styles.innerPageBannerTitle}`}
                  dangerouslySetInnerHTML={{ __html: safeTitle }}
                />
                {description != null && description.trim() !== "" && (
                  <p
                    className={`sectionDescription innerPageBannerDescription ${styles.innerPageBannerDescription}`}
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}
                {children}
                <InnerPageBannerHeroMobile
                  classNameMobile={styles.mobileImageOnly}
                  url={mobileImage.url}
                  alt={mobileImage.alt}
                />
              </div>
            </div>
          </InnerPageBannerLcpProvider>
        ) : (
          <>
            <Breadcrumb
              items={breadcrumbItems || []}
              showHome={!hideBreadcrumb}
              className={`${styles.innerPageBannerBreadcrumb} ${hideBreadcrumb ? styles.hideBreadcrumb : ""}`}
            />
            {backgroundImage?.url && (
              <div className={styles.innerPageBannerBgWrap}>
                <div className={styles.innerPageBannerBgImage}>
                  <Image
                    src={backgroundImage.url}
                    alt={backgroundImage.alt}
                    width={backgroundImage.width || 1920}
                    height={backgroundImage.height || 676}
                    priority
                    fetchPriority="high"
                    sizes="100vw"
                  />
                </div>
              </div>
            )}
            <div className={styles.innerPageBannerWrapper}>
              <div className={`${styles.innerPageBannerMainContent} innerPageBannerMainContent`}>
                <h1
                  className={`sectionTitle ${styles.innerPageBannerTitle}`}
                  dangerouslySetInnerHTML={{ __html: safeTitle }}
                />
                {description != null && description.trim() !== "" && (
                  <p
                    className={`sectionDescription innerPageBannerDescription ${styles.innerPageBannerDescription}`}
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}
                {children}
                {mobileImage?.url && (
                  <div className={styles.mobileImageOnly}>
                    <Image
                      src={mobileImage.url}
                      alt={mobileImage.alt}
                      width={360}
                      height={333}
                      sizes="100dvw"
                      priority
                      fetchPriority="high"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
    </>
  );
};

export default InnerPageBanner;
