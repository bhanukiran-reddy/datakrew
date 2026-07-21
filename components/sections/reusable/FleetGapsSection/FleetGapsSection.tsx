"use client";

import ImageComponent from "@/components/ui/Image/Image";
import dynamic from "next/dynamic";
import styles from "./FleetGapsSection.module.css";

const WebGLOrganicFlow = dynamic(
    () => import("@/components/sections/reusable/WebGLOrganicFlow/WebGLOrganicFlow"),
    { ssr: false }
);

interface FleetGapsItem {
    title: string;
    desc: string;
    iconClass?: string;
    icon?: {
        url: string;
        alt?: string;
        width?: number;
        height?: number;
    };
}

interface FleetGapsSectionProps {
    id?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    items?: FleetGapsItem[];
    className?: string;
    isByOEM?: boolean;
}

export default function FleetGapsSection({
    id,
    title,
    titleHighlight,
    subtitle,
    items = [],
    className,
    isByOEM
}: FleetGapsSectionProps) {
    if (!title && !titleHighlight && items.length === 0) return null;

    return (
        <section id={id} className={`${styles.section} ${className || ''}`}>
            <div className={styles.webglBackground}>
                <WebGLOrganicFlow />
            </div>
            <div className="container">
                <div className={styles.cardsWrapper}>
                    <div className={styles.header}>
                        <h2 className={`${styles.fleettitle} sectionTitle`}>
                            {title} <span>{titleHighlight}</span>
                        </h2>
                        {subtitle && (
                            <p
                                className={`sectionDescription ${styles.fleetSubtitle} ${isByOEM ? styles.byoemSubtitle : ""
                                    }`}
                                dangerouslySetInnerHTML={{ __html: subtitle }}
                            />


                        )}
                    </div>

                    <div className={styles.grid}>
                        {items.map((item, i) => (
                            <div key={i} className={styles.card}>
                                {item.iconClass?.trim() ? (
                                    <div className={styles.iconWrapper}>
                                        <i className={`${item.iconClass} ${styles.icon}`}></i>
                                    </div>
                                ) : item.icon?.url ? (
                                    <div className={styles.iconWrapper}>
                                        <ImageComponent
                                            image={{
                                                url: item.icon.url,
                                                alt: item.icon.alt || item.title,
                                                width: item.icon.width || 25,
                                                height: item.icon.height || 25
                                            }}
                                            className={styles.icon}
                                        />
                                    </div>
                                ) : null}
                                <div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
