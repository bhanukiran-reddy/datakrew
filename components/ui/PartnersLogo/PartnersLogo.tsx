import React from "react";
import Image from "next/image";
import styles from "./PartnersLogo.module.css";

type Partner = {
    name?: string;
    image?: string;
    imageAlt?: string;
};

type PartnersLogoProps = {
    partners: Partner[];
    className?: string;
};

export default function PartnersLogo({ partners, className }: PartnersLogoProps) {
    const validPartners = partners?.filter((p) => p?.image) ?? [];
    if (validPartners.length === 0) return null;

    const renderRow = (baseItems: Partner[], directionClass: string) => {
        // Multiply items to guarantee the row is wider than huge ultra-wide monitors
        // Decreased base from 40 to 12 to massively reduce DOM node bloat (improves page speed).
        const repeats = Math.max(1, Math.ceil(10 / (baseItems.length || 1)));
        const extendedItems = Array(repeats).fill(baseItems).flat();

        // Calculate scroll duration based on total items so speed remains perfectly constant 
        // 1 item = exactly 3 seconds of scrolling
        const duration = extendedItems.length * 3;

        return (
            <div
                className={`${styles.partnersRow} ${directionClass}`}
                style={{ "--scroll-duration": `${duration}s` } as React.CSSProperties}
            >
                {/* Render two identical sets so that scrolling exactly -50% creates a mathematically perfect infinite loop */}
                {[0, 1].map((segmentIndex) => (
                    <div key={`set-${segmentIndex}`} className={styles.partnersCardSet}>
                        {extendedItems.map((partner, partnerIndex) => (
                            <div
                                key={`set-${segmentIndex}-p-${partnerIndex}`}
                                className={styles.partnersCardItem}
                            >
                                <div className={styles.partnersCardItemImage}>
                                    <Image
                                        src={partner.image!}
                                        alt={partner.imageAlt?.trim() || partner.name || 'Partner Logo'}
                                        width={360}
                                        height={160}
                                        decoding="async"
                                        className={styles.partnerImage}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    const half = Math.ceil(validPartners.length / 2);
    const firstHalf = validPartners.slice(0, half);
    const secondHalf = validPartners.slice(half);

    return (
        <div className={`${styles.partnersContent} ${className || ''}`}>
            {firstHalf.length > 0 && renderRow(firstHalf, styles.rowRTL)}
            {secondHalf.length > 0 && renderRow(secondHalf, styles.rowLTR)}
        </div>
    );
}
