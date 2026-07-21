"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./StatsSection.module.css";
import Image from "next/image";
import Link from "next/link";

interface StatItem {
    value: string;
    label: string;
    cellType?: string;
    image?: string;
    imageAlt?: string;
}

interface StatsSectionsProps {
    stats?: StatItem[];
    title?: string;
    ctaText?: string;
    ctaHref?: string;
    imageTruck?: string;
    imageBus?: string;
    imageCar?: string;
    className?: string;
}

function getStatFrom(stats: StatItem[] | undefined, index: number) {
    const item = stats?.[index];
    return {
        value: item?.value ?? '',
        label: item?.label ?? '',
        cellType: item?.cellType,
        image: item?.image
    };
}

const isHtmlEmpty = (str?: string): boolean => {
    if (!str) return true;
    const stripped = str.replace(/<[^>]*>?/gm, '');
    const clean = stripped.replace(/&nbsp;/g, '').trim();
    return clean.length === 0;
};

function stripHtml(str?: string): string {
    if (!str) return '';
    return str.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, '').trim();
}

function resolveStatImageAlt(stat: StatItem | undefined, fallback: string): string {
    const cmsAlt = stat?.imageAlt?.trim();
    if (cmsAlt) return cmsAlt;
    const label = stripHtml(stat?.label);
    if (label) return label;
    return fallback;
}

export default function StatsSections({ stats = [], title, ctaText, ctaHref, imageTruck, imageBus, imageCar, className }: StatsSectionsProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const textStats = stats.filter(s => (s.cellType === 'stat') || !isHtmlEmpty(s.value) || !isHtmlEmpty(s.label));
    const imageStats = stats.filter(s => s.cellType === 'image' || (!!s.image));

    const stat1 = getStatFrom(textStats, 0);
    const stat3 = getStatFrom(textStats, 1);
    const stat5 = getStatFrom(textStats, 2);
    const stat7 = getStatFrom(textStats, 3);
    const stat8 = getStatFrom(textStats, 4);
    const statCountries = getStatFrom(textStats, 5);
    
    const imageOne = imageStats[0]?.image;
    const imageTwo = imageStats[1]?.image;
    const hasCta = Boolean(ctaText?.trim());
    // Home (CTA): 3rd image in middle slot; other pages: 3rd/4th/5th across row 2
    const imageRow2First = hasCta ? undefined : imageStats[2];
    const imageMiddle = hasCta ? imageStats[2] : imageStats[3];
    const imageRow2Last = hasCta ? imageStats[3] : imageStats[4];

    // Generate sequential delays for "one by one" animation effect
    const delays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => i * 150);

    useEffect(() => {
        if (!sectionRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Blocks 0-4 (stat1, stat2, stat3, stat4, stat5) fall from top
    // Blocks 5-8 (stat6, stat7, statCar, stat8) rise from bottom
    const blockClass = (index: number) => {
        if (!isVisible) return styles.brickHidden;
        const direction = index <= 4 ? styles.brickFallDown : styles.brickRiseUp;
        return `${direction}`;
    };

    const blockStyle = (index: number): React.CSSProperties => ({
        animationDelay: isVisible ? `${delays[index]}ms` : undefined,
    });

    return (
        <section ref={sectionRef} className={`${styles.statitstics} ${className || ''}`}>
            <div className="container">
                <div className={styles.statsContainer}>
                    {title != null && title !== '' && (
                        <div className={styles.statsHeader}>
                            <h2 className="sectionTitle" dangerouslySetInnerHTML={{ __html: title }}></h2>
                        </div>
                    )}
                    <div className={styles.statsGrid}>
                        {/* Block 0 — stat1 (falls from top) */}
                        <div
                            className={`${styles.stat} ${styles.statOne} ${blockClass(0)}`}
                            style={blockStyle(0)}
                            data-empty={isHtmlEmpty(stat1.value) && isHtmlEmpty(stat1.label) ? 'true' : undefined}
                        >
                            <div className={styles.statCard}>
                                <span className={styles.statValue} dangerouslySetInnerHTML={{ __html: stat1.value ?? '' }} />
                                <p className={styles.statLabel} dangerouslySetInnerHTML={{ __html: stat1.label ?? '' }} />
                            </div>
                        </div>

                        {/* Block 1 — stat2 truck (falls from top) */}
                        <div
                            className={`${styles.statTwo} ${blockClass(1)}`}
                            style={blockStyle(1)}
                            data-empty={!imageOne ? 'true' : undefined}
                        >
                            {imageOne ? (
                                <Image
                                    src={imageOne}
                                    alt={resolveStatImageAlt(imageStats[0], 'Logistics delivery truck')}
                                    width={400}
                                    height={350}
                                    className={styles.statImage}
                                />
                            ) : (
                                <div style={{ width: 400, height: 350 }} />
                            )}
                        </div>

                        {/* Block 2 — stat3 (falls from top) */}
                        <div
                            className={`${styles.stat} ${styles.statThree} ${blockClass(2)}`}
                            style={blockStyle(2)}
                            data-empty={isHtmlEmpty(stat3.value) && isHtmlEmpty(stat3.label) ? 'true' : undefined}
                        >
                            <div className={styles.statCard}>
                                <span className={styles.statValue} dangerouslySetInnerHTML={{ __html: stat3.value ?? '' }} />
                                <p className={styles.statLabel} dangerouslySetInnerHTML={{ __html: stat3.label ?? '' }} />
                            </div>
                        </div>

                        {/* Block 3 — stat4 countries + bus (falls from top) */}
                        <div
                            className={`${styles.statFour} ${blockClass(3)} use-case-hide-stat-four`}
                            style={blockStyle(3)}
                            data-empty={isHtmlEmpty(statCountries.value) && isHtmlEmpty(statCountries.label) ? 'true' : undefined}
                        >
                            <div className={styles.statChild}>
                                <div className={`${styles.statCard}`}>
                                    <span className={styles.statValue} dangerouslySetInnerHTML={{ __html: statCountries.value ?? '' }} />
                                    <p className={styles.statLabel} dangerouslySetInnerHTML={{ __html: statCountries.label ?? '' }} />
                                </div>
                            </div>
                            <div className={styles.statBus}>
                                {imageTwo ? (
                                    <Image
                                        src={imageTwo}
                                        alt={resolveStatImageAlt(imageStats[1], 'Public transit bus')}
                                        width={249}
                                        height={198}
                                        className={styles.statImage}
                                    />
                                ) : (
                                    <div style={{ width: 249, height: 198 }} />
                                )}
                            </div>
                        </div>

                        {/* Block 4 — stat5 (falls from top) */}
                        <div
                            className={`${styles.stat} ${styles.statFive} ${blockClass(4)}`}
                            style={blockStyle(4)}
                            data-empty={isHtmlEmpty(stat5.value) && isHtmlEmpty(stat5.label) ? 'true' : undefined}
                        >
                            <div className={styles.statCard}>
                                <span className={styles.statValue} dangerouslySetInnerHTML={{ __html: stat5.value ?? '' }} />
                                <p className={styles.statLabel} dangerouslySetInnerHTML={{ __html: stat5.label ?? '' }} />
                            </div>
                        </div>

                        {/* Block 5 — stat6 CTA or 3rd image (no-CTA pages) */}
                        <div
                            className={`${styles.statSix} ${blockClass(5)}`}
                            style={blockStyle(5)}
                            data-empty={hasCta ? undefined : !imageRow2First?.image ? 'true' : undefined}
                        >
                            {hasCta ? (
                                <Link className="primaryCta" href={ctaHref || "#"}>
                                    {ctaText?.trim()}
                                    <i className="icon fa-kit fa-right-arrow"></i>
                                </Link>
                            ) : imageRow2First?.image ? (
                                <Image
                                    src={imageRow2First.image}
                                    alt={resolveStatImageAlt(imageRow2First, 'Fleet maintenance image')}
                                    width={400}
                                    height={350}
                                    className={styles.statImageFill}
                                />
                            ) : null}
                        </div>

                        {/* Block 6 — stat7 (rises from bottom) */}
                        <div
                            className={`${styles.stat} ${styles.statSeven} ${blockClass(6)}`}
                            style={blockStyle(6)}
                            data-empty={isHtmlEmpty(stat7.value) && isHtmlEmpty(stat7.label) ? 'true' : undefined}
                        >
                            <div className={styles.statCard}>
                                <span className={styles.statValue} dangerouslySetInnerHTML={{ __html: stat7.value ?? '' }} />
                                <p className={styles.statLabel} dangerouslySetInnerHTML={{ __html: stat7.label ?? '' }} />
                            </div>
                        </div>

                        {/* Block 7 — middle image (3rd when CTA, 4th otherwise) */}
                        <div
                            className={`${styles.statEight} ${blockClass(7)}`}
                            style={blockStyle(7)}
                            data-empty={!imageMiddle?.image ? 'true' : undefined}
                        >
                            {imageMiddle?.image ? (
                                <Image
                                    src={imageMiddle.image}
                                    alt={resolveStatImageAlt(
                                        imageMiddle,
                                        hasCta ? 'Fleet maintenance image' : 'Smart car connectivity'
                                    )}
                                    width={254}
                                    height={229}
                                    className={styles.statImage}
                                />
                            ) : (
                                <div style={{ width: 254, height: 229 }} />
                            )}
                        </div>

                        {/* Block 8 — stat8 (rises from bottom) */}
                        <div
                            className={`${styles.stat} ${styles.statNine} ${blockClass(8)}`}
                            style={blockStyle(8)}
                            data-empty={isHtmlEmpty(stat8.value) && isHtmlEmpty(stat8.label) ? 'true' : undefined}
                        >
                            <div className={styles.statCard}>
                                <span className={styles.statValue} dangerouslySetInnerHTML={{ __html: stat8.value ?? '' }} />
                                <p className={styles.statLabel} dangerouslySetInnerHTML={{ __html: stat8.label ?? '' }} />
                            </div>
                        </div>
                        <div 
                            className={`${styles.statTen} ${blockClass(9)}`} 
                            style={blockStyle(9)}
                            data-empty={!imageRow2Last?.image ? "true" : undefined}
                        >
                            {imageRow2Last?.image && (
                                <Image
                                    src={imageRow2Last.image}
                                    alt={resolveStatImageAlt(
                                        imageRow2Last,
                                        hasCta ? 'Smart car connectivity' : 'Transport and logistics'
                                    )}
                                    width={400}
                                    height={350}
                                    className={styles.statImageFill}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
