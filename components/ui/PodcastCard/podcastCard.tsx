"use client";

import styles from "./podcastCard.module.css";
import Link from "next/link";

export interface PodcastCardProps {
    thumbnail: string;
    episodeNumber: string;
    publishedDate: string;
    title: string;
    description: string;
    linkUrl?: string;
    target?: string;
    featured?: boolean;
    duration?: string;
    ctaText?: string;
}


export default function PodcastCard({
    thumbnail,
    episodeNumber,
    publishedDate,
    title,
    description,
    linkUrl,
    target,
    duration,
    ctaText,
}: PodcastCardProps) {
    return (
        <div className={styles.podcastCard}>
            <div className={styles.podcastCardImage}>
                <Link href={linkUrl || "#"} target={target} className={styles.imageLink}>
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt={title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#1a1a2e' }} />
                    )}
                    <div className={styles.podcastCardImageOverlay}>
                        <i className="icon fa-kit fa-play"></i>
                    </div>
                </Link>
                {
                    duration && (
                        <span className={styles.podcastDuration}> <i className="icon fa-kit fa-clock"></i> {duration}</span>
                    )
                }
            </div>
            <div className={styles.podcastCardContent}>
                <div className={styles.podcastCardContentTop}>
                    {(episodeNumber || publishedDate) && (
                        <span className={styles.podcastDate}>
                            {episodeNumber ? `Episode ${episodeNumber} | ` : ""}
                            {publishedDate}
                        </span>
                    )}
                    <h2 className={styles.podcastCardTitle}>{title}</h2>
                    {description && (
                        <div className={styles.podcastCardDescription}>
                            <div dangerouslySetInnerHTML={{ __html: description }} />
                        </div>
                    )}
                </div>
                {ctaText && (
                    <div className={styles.podcastCardFooter}>
                        <Link
                            href={linkUrl || "#"}
                            className={`${styles.podcastCardLink} iconLink tertiaryCta`}
                            target={target}
                        >
                            {ctaText} <i className="icon fa-kit fa-right-arrow"></i>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
