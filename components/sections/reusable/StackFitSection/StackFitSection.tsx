"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./StackFitSection.module.css";

type Props = {
    title?: string;
    subtitle?: string;
    media?: {
        src?: string;
        alt?: string;
    };
    buttons?: Array<{ label: string; url: string }>;
    id?: string;
    textAlign?: 'left' | 'center';
    className?: string;
};

export default function StackFitSection({
    title,
    subtitle,
    media,
    buttons,
    id,
    textAlign = 'left',
    className,
}: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                // Autoplay might be blocked by browser policy even if muted
                // console.log("Autoplay prevented:", error);
            });
        }
    }, [media?.src]);

    if (!title && !subtitle && !media) return null;

    const isVideo = media?.src && /\.(mp4|webm|ogg)(\?|$)/i.test(media.src);

    return (
        <section id={id} className={`${styles.section} ${className || ""}`}>
            <div className="container">
                {title && (
                    <h2
                        className={`${styles.stackFitTitle} sectionTitle ${textAlign === 'center' ? styles.textCenter : ''}`}
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                )}

                {subtitle && <p className={`${styles.stackFitSubtitle} sectionDescription ${textAlign === 'center' ? styles.textCenter : ''}`}>{subtitle}</p>}

                {media?.src && (
                    <div className={styles.stackFitMediaWrapper}>
                        {isVideo ? (
                            <video
                                ref={videoRef}
                                className={styles.mediaVideo}
                                autoPlay={true}
                                loop={true}
                                muted={true}
                                playsInline={true}
                                webkit-playsinline="true"
                                preload="auto"
                            >
                                <source src={media.src} />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <Image
                                src={media.src}
                                alt={media.alt || "Stack visualization"}
                                className={styles.mediaImage}
                                width={1200}
                                height={600}
                                sizes="(max-width: 768px) 100vw, 1200px"
                                priority={false}
                            />
                        )}
                    </div>
                )}

                {buttons && buttons.length > 0 && (
                    <div className={styles.ctaGroup}>
                        {buttons.map((btn, index) => (
                            <Link
                                key={index}
                                href={btn.url}
                                className={index === 0 ? "primaryCta" : "secondaryCta"}
                            >
                                {btn.label}
                                <i className="icon fa-kit fa-right-arrow" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
