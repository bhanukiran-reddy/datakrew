'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const tabsdata = [
    {
        tabTitle: 'ITUS Max',
        tabTitleIcon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.9184 14.8986H26.0775V12.6628H28.6826C29.3026 12.6628 29.7972 12.1616 29.7972 11.5482C29.7972 10.9349 29.296 10.4336 28.6826 10.4336H26.0775V10.0643C26.0775 7.80214 24.244 5.96867 21.9819 5.96867H21.6125V3.36356C21.6125 2.74361 21.1113 2.24897 20.4979 2.24897C19.8846 2.24897 19.3833 2.75021 19.3833 3.36356V5.96867H17.1476V1.11459C17.1476 0.494641 16.6463 0 16.033 0C15.4196 0 14.9184 0.501237 14.9184 1.11459V5.95548H12.6826V3.35037C12.6826 2.73042 12.1814 2.23578 11.568 2.23578C10.9547 2.23578 10.4534 2.73702 10.4534 3.35037V5.95548H10.0841C7.82193 5.95548 5.98846 7.78895 5.98846 10.0511V10.4204H3.38335C2.7634 10.4204 2.26876 10.9217 2.26876 11.535C2.26876 12.1484 2.76999 12.6496 3.38335 12.6496H5.98846V14.8854H1.11459C0.494641 14.8854 0 15.3866 0 16C0 16.6134 0.501237 17.1146 1.11459 17.1146H5.95548V19.3504H3.35037C2.73042 19.3504 2.23578 19.8516 2.23578 20.465C2.23578 21.0783 2.73702 21.5796 3.35037 21.5796H5.95548V21.9489C5.95548 24.211 7.78895 26.0445 10.0511 26.0445H10.4204V28.6496C10.4204 29.2696 10.9217 29.7642 11.535 29.7642C12.1484 29.7642 12.6496 29.263 12.6496 28.6496V26.0445H14.8854V30.8854C14.8854 31.5054 15.3866 32 16 32C16.6134 32 17.1146 31.4988 17.1146 30.8854V26.0445H19.3504V28.6496C19.3504 29.2696 19.8516 29.7642 20.465 29.7642C21.0783 29.7642 21.5796 29.263 21.5796 28.6496V26.0445H21.9489C24.211 26.0445 26.0445 24.211 26.0445 21.9489V21.5796H28.6496C29.2696 21.5796 29.7642 21.0783 29.7642 20.465C29.7642 19.8516 29.263 19.3504 28.6496 19.3504H26.0445V17.1146H30.8854C31.5054 17.1146 32 16.6134 32 16C32 15.3866 31.4988 14.8854 30.8854 14.8854L30.9184 14.8986ZM18.6843 17.972L17.4971 18.4007C16.1781 18.8755 15.1426 19.911 14.6678 21.23L14.2391 22.4171C14.1995 22.5227 14.0478 22.5227 14.0082 22.4171L13.5796 21.23C13.1047 19.911 12.0692 18.8755 10.7502 18.4007L9.56307 17.972C9.45754 17.9324 9.45754 17.7807 9.56307 17.7411L10.7502 17.3124C12.0692 16.8376 13.1047 15.8021 13.5796 14.4831L14.0082 13.296C14.0478 13.1904 14.1995 13.1904 14.2391 13.296L14.6678 14.4831C15.1426 15.8021 16.1781 16.8376 17.4971 17.3124L18.6843 17.7411C18.7898 17.7807 18.7898 17.9324 18.6843 17.972ZM21.8368 12.8079L21.2366 13.0256C20.5705 13.263 20.0429 13.7906 19.8054 14.4567L19.5878 15.0569C19.568 15.1096 19.4889 15.1096 19.4691 15.0569L19.2514 14.4567C19.0074 13.7906 18.4864 13.263 17.8203 13.0256L17.2201 12.8079C17.1674 12.7881 17.1674 12.709 17.2201 12.6892L17.8203 12.4716C18.4864 12.2341 19.014 11.7065 19.2514 11.0404L19.4691 10.4402C19.4889 10.3875 19.568 10.3875 19.5878 10.4402L19.8054 11.0404C20.0495 11.7065 20.5705 12.2341 21.2366 12.4716L21.8368 12.6892C21.8895 12.709 21.8895 12.7881 21.8368 12.8079Z" fill="url(#paint0_linear_3538_11097)" />
                <defs>
                    <linearGradient id="paint0_linear_3538_11097" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#93D772" />
                        <stop offset="1" stopColor="#3AB1C5" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        tabCardTitle: 'A US‑patented vehicle scanner capturing 120+ parameters every 10 seconds.',
        tabCardLIst: ['Post-quantum cryptography (NIST/ISO-aligned)', 'OEM-agnostic architecture across mixed fleets', 'IP67 rugged enclosure', 'Global 4G LTE connectivity (2G fallback)'],
        tabImage: '/ItusImage.png',
        tabLink: '#',
        tabCtaText: 'View our infrastructure'
    },
    {
        tabTitle: 'OXRED MyFleet',
        tabTitleIcon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.9184 14.8986H26.0775V12.6628H28.6826C29.3026 12.6628 29.7972 12.1616 29.7972 11.5482C29.7972 10.9349 29.296 10.4336 28.6826 10.4336H26.0775V10.0643C26.0775 7.80214 24.244 5.96867 21.9819 5.96867H21.6125V3.36356C21.6125 2.74361 21.1113 2.24897 20.4979 2.24897C19.8846 2.24897 19.3833 2.75021 19.3833 3.36356V5.96867H17.1476V1.11459C17.1476 0.494641 16.6463 0 16.033 0C15.4196 0 14.9184 0.501237 14.9184 1.11459V5.95548H12.6826V3.35037C12.6826 2.73042 12.1814 2.23578 11.568 2.23578C10.9547 2.23578 10.4534 2.73702 10.4534 3.35037V5.95548H10.0841C7.82193 5.95548 5.98846 7.78895 5.98846 10.0511V10.4204H3.38335C2.7634 10.4204 2.26876 10.9217 2.26876 11.535C2.26876 12.1484 2.76999 12.6496 3.38335 12.6496H5.98846V14.8854H1.11459C0.494641 14.8854 0 15.3866 0 16C0 16.6134 0.501237 17.1146 1.11459 17.1146H5.95548V19.3504H3.35037C2.73042 19.3504 2.23578 19.8516 2.23578 20.465C2.23578 21.0783 2.73702 21.5796 3.35037 21.5796H5.95548V21.9489C5.95548 24.211 7.78895 26.0445 10.0511 26.0445H10.4204V28.6496C10.4204 29.2696 10.9217 29.7642 11.535 29.7642C12.1484 29.7642 12.6496 29.263 12.6496 28.6496V26.0445H14.8854V30.8854C14.8854 31.5054 15.3866 32 16 32C16.6134 32 17.1146 31.4988 17.1146 30.8854V26.0445H19.3504V28.6496C19.3504 29.2696 19.8516 29.7642 20.465 29.7642C21.0783 29.7642 21.5796 29.263 21.5796 28.6496V26.0445H21.9489C24.211 26.0445 26.0445 24.211 26.0445 21.9489V21.5796H28.6496C29.2696 21.5796 29.7642 21.0783 29.7642 20.465C29.7642 19.8516 29.263 19.3504 28.6496 19.3504H26.0445V17.1146H30.8854C31.5054 17.1146 32 16.6134 32 16C32 15.3866 31.4988 14.8854 30.8854 14.8854L30.9184 14.8986ZM18.6843 17.972L17.4971 18.4007C16.1781 18.8755 15.1426 19.911 14.6678 21.23L14.2391 22.4171C14.1995 22.5227 14.0478 22.5227 14.0082 22.4171L13.5796 21.23C13.1047 19.911 12.0692 18.8755 10.7502 18.4007L9.56307 17.972C9.45754 17.9324 9.45754 17.7807 9.56307 17.7411L10.7502 17.3124C12.0692 16.8376 13.1047 15.8021 13.5796 14.4831L14.0082 13.296C14.0478 13.1904 14.1995 13.1904 14.2391 13.296L14.6678 14.4831C15.1426 15.8021 16.1781 16.8376 17.4971 17.3124L18.6843 17.7411C18.7898 17.7807 18.7898 17.9324 18.6843 17.972ZM21.8368 12.8079L21.2366 13.0256C20.5705 13.263 20.0429 13.7906 19.8054 14.4567L19.5878 15.0569C19.568 15.1096 19.4889 15.1096 19.4691 15.0569L19.2514 14.4567C19.0074 13.7906 18.4864 13.263 17.8203 13.0256L17.2201 12.8079C17.1674 12.7881 17.1674 12.709 17.2201 12.6892L17.8203 12.4716C18.4864 12.2341 19.014 11.7065 19.2514 11.0404L19.4691 10.4402C19.4889 10.3875 19.568 10.3875 19.5878 10.4402L19.8054 11.0404C20.0495 11.7065 20.5705 12.2341 21.2366 12.4716L21.8368 12.6892C21.8895 12.709 21.8895 12.7881 21.8368 12.8079Z" fill="url(#paint0_linear_3538_11098)" />
                <defs>
                    <linearGradient id="paint0_linear_3538_11098" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#93D772" />
                        <stop offset="1" stopColor="#3AB1C5" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        tabCardTitle: 'Comprehensive fleet management platform with real-time analytics and insights.',
        tabCardLIst: ['Real-time vehicle tracking', 'Predictive maintenance alerts', 'Driver behavior analytics', 'Fuel efficiency optimization'],
        tabImage: '/ItusImage.png',
        tabLink: '#',
        tabCtaText: 'View our infrastructure'
    },
    {
        tabTitle: 'OXRED GuardianAI',
        tabTitleIcon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.9184 14.8986H26.0775V12.6628H28.6826C29.3026 12.6628 29.7972 12.1616 29.7972 11.5482C29.7972 10.9349 29.296 10.4336 28.6826 10.4336H26.0775V10.0643C26.0775 7.80214 24.244 5.96867 21.9819 5.96867H21.6125V3.36356C21.6125 2.74361 21.1113 2.24897 20.4979 2.24897C19.8846 2.24897 19.3833 2.75021 19.3833 3.36356V5.96867H17.1476V1.11459C17.1476 0.494641 16.6463 0 16.033 0C15.4196 0 14.9184 0.501237 14.9184 1.11459V5.95548H12.6826V3.35037C12.6826 2.73042 12.1814 2.23578 11.568 2.23578C10.9547 2.23578 10.4534 2.73702 10.4534 3.35037V5.95548H10.0841C7.82193 5.95548 5.98846 7.78895 5.98846 10.0511V10.4204H3.38335C2.7634 10.4204 2.26876 10.9217 2.26876 11.535C2.26876 12.1484 2.76999 12.6496 3.38335 12.6496H5.98846V14.8854H1.11459C0.494641 14.8854 0 15.3866 0 16C0 16.6134 0.501237 17.1146 1.11459 17.1146H5.95548V19.3504H3.35037C2.73042 19.3504 2.23578 19.8516 2.23578 20.465C2.23578 21.0783 2.73702 21.5796 3.35037 21.5796H5.95548V21.9489C5.95548 24.211 7.78895 26.0445 10.0511 26.0445H10.4204V28.6496C10.4204 29.2696 10.9217 29.7642 11.535 29.7642C12.1484 29.7642 12.6496 29.263 12.6496 28.6496V26.0445H14.8854V30.8854C14.8854 31.5054 15.3866 32 16 32C16.6134 32 17.1146 31.4988 17.1146 30.8854V26.0445H19.3504V28.6496C19.3504 29.2696 19.8516 29.7642 20.465 29.7642C21.0783 29.7642 21.5796 29.263 21.5796 28.6496V26.0445H21.9489C24.211 26.0445 26.0445 24.211 26.0445 21.9489V21.5796H28.6496C29.2696 21.5796 29.7642 21.0783 29.7642 20.465C29.7642 19.8516 29.263 19.3504 28.6496 19.3504H26.0445V17.1146H30.8854C31.5054 17.1146 32 16.6134 32 16C32 15.3866 31.4988 14.8854 30.8854 14.8854L30.9184 14.8986ZM18.6843 17.972L17.4971 18.4007C16.1781 18.8755 15.1426 19.911 14.6678 21.23L14.2391 22.4171C14.1995 22.5227 14.0478 22.5227 14.0082 22.4171L13.5796 21.23C13.1047 19.911 12.0692 18.8755 10.7502 18.4007L9.56307 17.972C9.45754 17.9324 9.45754 17.7807 9.56307 17.7411L10.7502 17.3124C12.0692 16.8376 13.1047 15.8021 13.5796 14.4831L14.0082 13.296C14.0478 13.1904 14.1995 13.1904 14.2391 13.296L14.6678 14.4831C15.1426 15.8021 16.1781 16.8376 17.4971 17.3124L18.6843 17.7411C18.7898 17.7807 18.7898 17.9324 18.6843 17.972ZM21.8368 12.8079L21.2366 13.0256C20.5705 13.263 20.0429 13.7906 19.8054 14.4567L19.5878 15.0569C19.568 15.1096 19.4889 15.1096 19.4691 15.0569L19.2514 14.4567C19.0074 13.7906 18.4864 13.263 17.8203 13.0256L17.2201 12.8079C17.1674 12.7881 17.1674 12.709 17.2201 12.6892L17.8203 12.4716C18.4864 12.2341 19.014 11.7065 19.2514 11.0404L19.4691 10.4402C19.4889 10.3875 19.568 10.3875 19.5878 10.4402L19.8054 11.0404C20.0495 11.7065 20.5705 12.2341 21.2366 12.4716L21.8368 12.6892C21.8895 12.709 21.8895 12.7881 21.8368 12.8079Z" fill="url(#paint0_linear_3538_11099)" />
                <defs>
                    <linearGradient id="paint0_linear_3538_11099" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#93D772" />
                        <stop offset="1" stopColor="#3AB1C5" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        tabCardTitle: 'AI-powered security and monitoring system for fleet protection.',
        tabCardLIst: ['Anomaly detection', 'Threat intelligence', 'Automated incident response', '24/7 monitoring dashboard'],
        tabImage: '/ItusImage.png',
        tabLink: '#',
        tabCtaText: 'View our infrastructure'
    },
];

const AUTO_ADVANCE_DELAY = 5000; // 5 seconds

export default function DeepTech() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressAnimationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const sectionRef = useRef<HTMLElement>(null);

    const handleTabClick = useCallback((index: number) => {
        setActiveIndex(index);
        setProgress(0);
        resetAutoAdvance();
    }, []);

    const resetAutoAdvance = useCallback(() => {
        // Clear existing timers
        if (intervalRef.current) {
            clearTimeout(intervalRef.current);
        }
        if (progressAnimationRef.current) {
            cancelAnimationFrame(progressAnimationRef.current);
        }

        if (!isVisible) return;

        setProgress(0);
        startTimeRef.current = performance.now();

        // Use requestAnimationFrame for smoother, more efficient progress updates
        const animateProgress = () => {
            if (!isVisible) return;

            const elapsed = performance.now() - startTimeRef.current;
            const newProgress = Math.min((elapsed / AUTO_ADVANCE_DELAY) * 100, 100);

            setProgress(newProgress);

            if (newProgress < 100) {
                progressAnimationRef.current = requestAnimationFrame(animateProgress);
            }
        };

        progressAnimationRef.current = requestAnimationFrame(animateProgress);

        // Auto advance to next tab
        intervalRef.current = setTimeout(() => {
            if (isVisible) {
                setActiveIndex((prev) => (prev + 1) % tabsdata.length);
                setProgress(0);
            }
        }, AUTO_ADVANCE_DELAY);
    }, [isVisible]);

    // Intersection Observer to pause when not visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                setIsVisible(entries[0].isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            resetAutoAdvance();
        }

        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
            if (progressAnimationRef.current) {
                cancelAnimationFrame(progressAnimationRef.current);
            }
        };
    }, [activeIndex, isVisible, resetAutoAdvance]);

    const activeTab = useMemo(() => tabsdata[activeIndex], [activeIndex]);

    return (
        <section ref={sectionRef} className={styles.section}>
            <div className={styles.header}>
                <h2 className="sectionTitle"><span>Deep tech</span> in our DNA</h2>
                <p className="sectionDescription">Patented IP, university-rooted research, and post-quantum cryptographic security.</p>
            </div>

            <div className={styles.tabsContainer}>
                {tabsdata.map((tab, index) => (
                    <button
                        key={index}
                        className={`${styles.tab} ${index === activeIndex ? styles.tabActive : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        <div className={styles.tabIcon}>{tab.tabTitleIcon}</div>
                        <span className={styles.tabTitle}>{tab.tabTitle}</span>
                        {index === activeIndex && (
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className={styles.contentContainer}>
                <div className={styles.imageContainer}>
                    {activeTab.tabImage && (
                        <Image
                            src={activeTab.tabImage}
                            alt={activeTab.tabTitle}
                            fill
                            className={styles.backgroundImage}
                            priority={activeIndex === 0}
                        />
                    )}
                </div>

                <div className={styles.cardContainer}>
                    <div className={styles.glassCard}>
                        <h2 className={styles.cardTitle}>{activeTab.tabCardTitle}</h2>
                        <ul className={styles.cardList}>
                            {activeTab.tabCardLIst.map((item, idx) => (
                                <li key={idx} className={styles.cardListItem}>
                                    <Image src="check-icon.svg" alt="check" width={20} height={20} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles.ctaContainer}>
                    <Link href={activeTab.tabLink} className="cta">
                        {activeTab.tabCtaText && <span>{activeTab.tabCtaText}</span>}
                        <Image className={styles.ctaIcon} src="arrow-right.svg" alt="arrow-right" width={20} height={20} />
                    </Link></div>
            </div>
        </section>
    );
}
