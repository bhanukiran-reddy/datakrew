"use client";

import { useState, useEffect } from "react";
import EventCtaButtons from "./EventCtaButtons";
import styles from "./page.module.css";

interface CtaButton {
    label?: string;
    text?: string;
    url: string;
    target?: string;
    pdfUrl?: string;
}

interface HeaderCtasProps {
    buttons: CtaButton[];
}

export default function HeaderCtas({ buttons }: HeaderCtasProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const trigger = document.getElementById("banner-ctas");
        if (!trigger) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Show header CTAs when banner buttons are NOT intersecting
                setIsVisible(!entry.isIntersecting);
            },
            {
                threshold: 0,
                rootMargin: "-100px 0px 0px 0px"
            }
        );

        observer.observe(trigger);
        return () => observer.disconnect();
    }, []);

    const combinedButtons = [
        { label: "Contact us", url: "/contact" },
        ...buttons.slice(0, 1)
    ];

    return (
        <div className={`${styles.headerCtas} ${isVisible ? styles.visible : ""}`}>
            <EventCtaButtons 
                buttons={combinedButtons} 
                wrapperClassName={styles.headerCtaWrapper} 
                isBanner={false} 
            />
        </div>
    );
}
