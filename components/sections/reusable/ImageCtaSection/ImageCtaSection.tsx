"use client";

import ImageComponent from "@/components/ui/Image/Image";
import Link from "next/link";
import styles from "./ImageCtaSection.module.css";

interface ImageCtaSectionProps {
    id?: string;
    image?: {
        url: string;
        alt?: string;
        width?: number;
        height?: number;
    };
    primaryCta?: {
        text?: string;
        link?: string;
        target?: string;
        show?: boolean;
    };
    secondaryCta?: {
        text?: string;
        link?: string;
        target?: string;
        show?: boolean;
    };
    className?: string;
}

export default function ImageCtaSection({
    id,
    image,
    primaryCta = { text: "Book a demo", link: "/demo", show: true },
    secondaryCta = { text: "Download solution overview", link: "/overview", show: true },
    className
}: ImageCtaSectionProps) {
    const imageUrl = image?.url || "";

    return (
        <section id={id} className={`${styles.imageCtaSection} ${className || ''}`}>
            <div className={`container ${styles.imageCtaContainer}`}>
                {/* Top Image Section */}
                {/* <div className={styles.imageCtaWrapper}>
                    {imageUrl ? (
                        <ImageComponent
                            image={{
                                url: imageUrl,
                                alt: image?.alt || "How OXRED MyFleet works",
                                width: image?.width || 1200,
                                height: image?.height || 600
                            }}
                            className={styles.imageCtaMainImage}
                        />
                    ) : (
                        <div className={styles.imageCtaEmptyState}>
                            <p>No image URL provided</p>
                        </div>
                    )}
                </div> */}

                {/* Bottom CTA Section */}
                <div className={styles.imageCtaButtonsContainer}>
                    {primaryCta?.show !== false && (
                        <Link href={primaryCta.link || "#"} target={primaryCta.target || "_self"} className="primaryCta">
                            {primaryCta.text || "Book a demo"}
                            <i className="icon fa-kit fa-right-arrow"></i>
                        </Link>
                    )}
                    {secondaryCta?.show !== false && (
                        <Link href={secondaryCta.link || "#"} target={secondaryCta.target || "_blank"} className="secondaryCta">
                            {secondaryCta.text || "Download solution overview"}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
