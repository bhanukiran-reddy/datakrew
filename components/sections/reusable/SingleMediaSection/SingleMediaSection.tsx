"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./SingleMediaSection.module.css";

export interface SingleMediaButton {
    label: string;
    url: string;
    target?: string;
}

export interface SingleMediaSectionProps {
    id?: string;
    title: string;
    description: string;
    centerImage?: string;
    mobileImage?: string;
    buttons?: SingleMediaButton[];
    className?: string;
}

const SingleMediaSection: React.FC<SingleMediaSectionProps> = ({
    id,
    title,
    description,
    centerImage,
    mobileImage,
    buttons,
    className,
}) => {
    if (!title && !description && !centerImage) return null;

    const isVideo = (url: string) => /\.(mp4|webm|ogg)(\?|$)/i.test(url);

    return (
        <section className={`${styles.singleMediaSection} ${className || ""}`} id={id}>
            <div className="container">
                {title && (
                    <h2
                        className="sectionTitle"
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                )}

                {description && (
                    <p
                        className="sectionDescription"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                )}

                {centerImage && (
                    <div className={styles.singleMediaWrapper}>
                        {isVideo(centerImage) ? (
                            <video
                                src={centerImage}
                                className={`${styles.singleMediaImage} ${mobileImage ? styles.desktopOnly : ''}`}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                style={{ width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover' }}
                            >
                                <source
                                    src={centerImage}
                                    type={`video/${centerImage.split('.').pop()?.split('?')[0]}`}
                                />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <Image
                                src={centerImage}
                                alt={title?.replace(/<[^>]*>/g, '') || "Media content"}
                                width={1200}
                                height={675}
                                className={`${styles.singleMediaImage} ${mobileImage ? styles.desktopOnly : ''}`}
                                priority={false}
                            />
                        )}

                        {/* Mobile-specific image */}
                        {mobileImage && (
                            isVideo(mobileImage) ? (
                                <video
                                    src={mobileImage}
                                    className={`${styles.singleMediaImage} ${styles.mobileOnly}`}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="auto"
                                    style={{ width: '100%', height: 'auto', aspectRatio: '9/16', objectFit: 'cover' }}
                                >
                                    <source
                                        src={mobileImage}
                                        type={`video/${mobileImage.split('.').pop()?.split('?')[0]}`}
                                    />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <Image
                                    src={mobileImage}
                                    alt={title?.replace(/<[^>]*>/g, '') || "Media content (mobile)"}
                                    width={600}
                                    height={800}
                                    className={`${styles.singleMediaImage} ${styles.mobileOnly}`}
                                    priority={false}
                                />
                            )
                        )}
                    </div>
                )}

                {buttons && buttons.length > 0 && (
                    <div className={styles.singleMediaCta}>
                        {buttons.map((btn, index) => (
                            <Link
                                key={index}
                                href={btn.url || "#"}
                                target={btn.target}
                                className={index === 0 ? "primaryCta" : "secondaryCta"}
                            >
                                <span dangerouslySetInnerHTML={{ __html: btn.label || "" }} />
                                <i className="icon fa-kit fa-right-arrow"></i>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default SingleMediaSection;
