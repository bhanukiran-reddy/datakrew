"use client";

import React from "react";
import Link from '@/components/ui/Link/Link';
import styles from "./TableSection.module.css";
import Image from "next/image";

interface ColumnValue {
    columnText: string;
}

interface TableColumn {
    columnHeading: string;
    columnValues: ColumnValue[];
}

interface TableSectionProps {
    ctSectionHeading?: string;
    ctSectionDescription?: string;
    tableColumnItems?: TableColumn[];
    ctCtaButtons?: Array<{
        ctButtonText: string;
        ctButtonUrl: {
            url: string;
            target?: string;
        };
    }>;
}

export default function TableSection({
    ctSectionHeading,
    ctSectionDescription,
    tableColumnItems,
    ctCtaButtons
}: TableSectionProps) {
    const [showSwipeIndicator, setShowSwipeIndicator] = React.useState(false);
    const [hasBeenShown, setHasBeenShown] = React.useState(false);
    const sectionRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasBeenShown && window.innerWidth < 768) {
                    setShowSwipeIndicator(true);
                    setHasBeenShown(true);
                    setTimeout(() => {
                        setShowSwipeIndicator(false);
                    }, 4000);
                }
            },
            { threshold: 0.2 } // Trigger when 20% of section is visible
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [hasBeenShown]);

    if (!ctSectionHeading && (!tableColumnItems || tableColumnItems.length === 0)) return null;

    // We assume 3 columns mapping to the user's structure:
    // 0: Capability, 1: Legacy, 2: Datakrew
    const col0 = tableColumnItems?.[0];
    const col1 = tableColumnItems?.[1];
    const col2 = tableColumnItems?.[2];

    const rowCount = col0?.columnValues?.length || 0;

    return (
        <section ref={sectionRef} className={styles.tableSection}>
            <div className="container">
                {(ctSectionHeading || ctSectionDescription) && (
                    <div className={styles.header}>
                        {ctSectionHeading && (
                            <h2 className="sectionTitle" dangerouslySetInnerHTML={{ __html: ctSectionHeading }} />
                        )}
                        {ctSectionDescription && (
                            <p className="sectionDescription" dangerouslySetInnerHTML={{ __html: ctSectionDescription }} />
                        )}
                    </div>
                )}

                <div className={styles.tableContainer}>
                    {showSwipeIndicator && (
                        <div className={styles.swipeIndicator}>
                            <Image width={100} height={100} src="/Swipe-left.gif" alt="Swipe to scroll" />
                        </div>
                    )}
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr className={styles.spacer}>
                                <td className={styles.stickyCol}></td>
                                <td className={`${styles.legacy} ${styles.legacyTop}`}></td>
                                <td className={styles.gap}></td>
                                <td className={`${styles.highlight} ${styles.topBorder}`}></td>
                                <td className={styles.gap}></td>
                            </tr>
                            <tr className={styles.head}>
                                <th className={`${styles.th} ${styles.firstCol} ${styles.stickyCol}`}>{col0?.columnHeading || "Capability"}</th>
                                <th className={`${styles.th} ${styles.legacy}`}>{col1?.columnHeading || "Legacy telematics"}</th>
                                <th className={styles.gap}></th>
                                <th className={`${styles.th} ${styles.highlight} ${styles.green}`}>{col2?.columnHeading || "Datakrew"}</th>
                                <th className={`${styles.gap} ${styles.lastCol}`}></th>
                            </tr>
                        </thead>

                        <tbody className={styles.tbody}>
                            {Array.from({ length: rowCount }).map((_, rowIdx) => (
                                <tr key={rowIdx}>
                                    <td className={`${styles.td} ${styles.stickyCol}`} dangerouslySetInnerHTML={{ __html: col0?.columnValues[rowIdx]?.columnText || '' }} />
                                    <td className={`${styles.td} ${styles.legacy}`}>
                                        <div className={styles.legacyContent}><span className={styles.cross}><i className="fa-kit fa-cross"></i></span>
                                            <span className={styles.legacyContentText} dangerouslySetInnerHTML={{ __html: col1?.columnValues[rowIdx]?.columnText || '' }} /></div>
                                    </td>
                                    <td className={styles.gap}></td>

                                    <td className={`${styles.td} ${styles.highlight}`}>
                                        <div className={styles.legacyContent}><span className={styles.check}><i className="fa-kit fa-tick"></i></span>
                                            <span className={styles.legacyContentText} dangerouslySetInnerHTML={{ __html: col2?.columnValues[rowIdx]?.columnText || '' }} /></div>
                                    </td>
                                    <td className={styles.gap}></td>
                                </tr>
                            ))}

                            <tr className={styles.spacer}>
                                <td className={`${styles.firstCell} ${styles.stickyCol}`}></td>
                                <td className={`${styles.legacy} ${styles.legacyBottom}`}></td>
                                <td className={`${styles.firstCell}`}></td>
                                <td className={`${styles.highlight} ${styles.bottomBorder}`}></td>
                                <td className={`${styles.firstCell}`}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {ctCtaButtons && ctCtaButtons.length > 0 && (
                    <div className={styles.ctaGroup}>
                        {ctCtaButtons.map((btn, idx) => (
                            <Link
                                key={idx}
                                href={btn.ctButtonUrl?.url || "#"}
                                target={btn.ctButtonUrl?.target}
                                className={idx === 0 ? "primaryCta" : "secondaryCta"}
                            >
                                {btn.ctButtonText}
                                <i className="icon fa-kit fa-right-arrow"></i>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}