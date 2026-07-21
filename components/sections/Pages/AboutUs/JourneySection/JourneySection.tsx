"use client";

import { useState } from "react";
import styles from "./JourneySection.module.css";
import Image from "next/image";

interface JourneyItem {
    year: string;
    title: string;
    description: string;
    image: string;
}

interface JourneySectionProps {
    title?: string;
    description?: string;
    items?: JourneyItem[];
    className?: string;
}

export default function JourneyTimeline({ title, description, items = [], className }: JourneySectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Use items if provided, otherwise empty array (or can fallback to static if needed)
    const timelineData = items;

    return (
        <section className={`${styles.timelineSection} ${className || ""}`}>
            <div className="container">
                {title && (
                    <h2
                        className={`sectionTitle ${styles.heading}`}
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                )}
                {description && (
                    <p className={`sectionDescription ${styles.Sectiondescription}`}>
                        {description}
                    </p>
                )}

                <div className={styles.timelineWrapper}>
                    {timelineData.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.navItem} ${activeIndex === index ? styles.active : ""
                                }`}
                            onClick={() => setActiveIndex(index)}
                        >
                            {/* LEFT COLUMN */}
                            <div className={styles.leftColumn}>
                                <h3 className={styles.year}>{item.year}</h3>

                                <div className={`${styles.timelineCenter} ${index === timelineData.length - 1 ? styles.lastItem : ''}`}>
                                    {activeIndex === index && (
                                        <div className={styles.dot}></div>
                                    )}

                                    {index < timelineData.length - 1 && (
                                        <div className={styles.line}></div>
                                    )}

                                    {activeIndex === index && index < timelineData.length - 1 && (
                                        <div className={styles.bottomDot}></div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className={styles.content}>
                                <h4 className={styles.title}>{item.title}</h4>

                                <div className={styles.contentWrapper}>
                                    <div className={styles.expandedInner}>
                                        <p
                                            className={`${styles.description}`}
                                            dangerouslySetInnerHTML={{ __html: item.description }}
                                        />

                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={735}
                                                height={343}
                                                className={styles.image}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
