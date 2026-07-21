'use client';

import { useState, useEffect } from 'react';
import { LazyMotion, m } from 'framer-motion';
import { loadDomAnimation } from '@/lib/motion/loadDomAnimation';
import PodcastCard from '@/components/ui/PodcastCard/podcastCard';
import styles from './FeaturedPodcastsSection.module.css';

interface FeaturedPodcastsSectionProps {
    podcasts: any[];
    title?: string;
}

export default function FeaturedPodcastsSection({ podcasts, title }: FeaturedPodcastsSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(2);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setItemsPerView(1);
            } else {
                setItemsPerView(2);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Change step based on itemsPerView
    const step = itemsPerView;
    const totalSlidesNum = Math.ceil(podcasts.length / step);
    const maxIndex = (totalSlidesNum - 1) * step;
    const currentSlideNum = Math.floor(activeIndex / step) + 1;

    const handleNext = () => {
        if (activeIndex < maxIndex) {
            setActiveIndex(prev => Math.min(prev + step, maxIndex));
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(prev => Math.max(prev - step, 0));
        }
    };

    if (!podcasts || podcasts.length === 0) return null;

    return (
        <LazyMotion features={loadDomAnimation} strict>
        <section className={styles.featuredPodcastsSection}>
            <div className="container">
                <div className={styles.headerRow}>
                    {title && (
                        <h2 className="sectionTitle" dangerouslySetInnerHTML={{ __html: title }} />
                    )}
                </div>

                <div className={styles.sliderContainer}>
                    <div className={styles.sliderTrackWrapper}>
                        <m.div
                            className={styles.sliderTrack}
                            initial={false}
                            animate={{
                                x: `calc(-${activeIndex / itemsPerView} * (100% + 30px))`,
                            }}
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                        >
                            {podcasts.map((podcast, index) => (
                                <div
                                    key={index}
                                    className={styles.slide}
                                    style={{ flex: `0 0 calc((100% - (${itemsPerView} - 1) * 30px) / ${itemsPerView})` }}
                                >
                                    <div className={styles.cardWrapper}>
                                        <PodcastCard {...podcast} />
                                    </div>
                                </div>
                            ))}
                        </m.div>
                    </div>
                </div>

                {totalSlidesNum > 1 && (
                    <div className={styles.navigationRow}>
                        <div className={styles.indicators}>
                            <div className={styles.paginationInfo}>
                                <span className={styles.currentSlide}>
                                    {currentSlideNum.toString().padStart(2, '0')}
                                </span>
                                <span className={styles.separator}>/</span>
                                <span className={styles.totalSlides}>
                                    {totalSlidesNum.toString().padStart(2, '0')}
                                </span>
                            </div>

                            <div className={styles.dotsRow}>
                                {Array.from({ length: totalSlidesNum }).map((_, i) => (
                                    <button
                                        key={i}
                                        className={`${styles.dot} ${i === Math.floor(activeIndex / step) ? styles.dotActive : ''}`}
                                        onClick={() => {
                                            setActiveIndex(i * step);
                                        }}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={styles.btnGroup}>
                            <button
                                className={`${styles.navBtn} ${activeIndex === 0 ? styles.navBtnDisabled : ''}`}
                                onClick={handlePrev}
                                disabled={activeIndex === 0}
                                aria-label="Previous slide"
                            >
                                <i className="icon fa-kit fa-right-nav" style={{ transform: 'rotate(180deg)' }} />
                            </button>
                            <button
                                className={`${styles.navBtn} ${activeIndex === maxIndex ? styles.navBtnDisabled : ''}`}
                                onClick={handleNext}
                                disabled={activeIndex === maxIndex}
                                aria-label="Next slide"
                            >
                                <i className="icon fa-kit fa-right-nav" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
        </LazyMotion>
    );
}
