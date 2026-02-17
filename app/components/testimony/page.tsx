'use client';

import { useState} from 'react';
import styles from "./testimony.module.css";
import Image from "next/image";

// Testimony data - can have any number of items
const testimonyData = [
    {
        id: 1,
        name: "Alistair Cromwell",
        role: "Fleet operator, XYZ Company",
        image: "/testimony.svg", // Replace with actual image paths
    },
    {
        id: 2,
        name: "Sarah Johnson",
        role: "Operations Manager, ABC Logistics",
        image: "/testimony.svg",
    },
    {
        id: 3,
        name: "Michael Chen",
        role: "CEO, Tech Solutions Inc",
        image: "/testimony.svg",
    },
    {
        id: 4,
        name: "Emily Rodriguez",
        role: "Director, Global Transport",
        image: "/testimony.svg",
    },
    {
        id: 5,
        name: "David Thompson",
        role: "VP Operations, Fleet Corp",
        image: "/testimony.svg",
    },
    {
        id: 6,
        name: "Lisa Anderson",
        role: "Head of Logistics, Supply Chain Co",
        image: "/testimony.svg",
    },
    {
        id: 7,
        name: "James Wilson",
        role: "Founder, Transport Innovations",
        image: "/testimony.svg",
    },
    {
        id: 8,
        name: "Maria Garcia",
        role: "CTO, Smart Fleet Systems",
        image: "/testimony.svg",
    },
];

export default function Testimony() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Get visible items (5 items: 2 left, 1 center, 2 right)
    const getVisibleItems = () => {
        const items = [];
        const totalItems = testimonyData.length;

        // Calculate indices for 5 visible items
        for (let i = -2; i <= 2; i++) {
            let index = activeIndex + i;
            // Handle wrapping
            if (index < 0) {
                index = totalItems + index;
            } else if (index >= totalItems) {
                index = index - totalItems;
            }
            items.push({
                data: testimonyData[index],
                position: i, // -2, -1, 0, 1, 2
                actualIndex: index,
            });
        }
        return items;
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % testimonyData.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + testimonyData.length) % testimonyData.length);
    };

    const visibleItems = getVisibleItems();
    const activeTestimony = testimonyData[activeIndex];

    return (
        <section className={styles.testimonyContainer}>
            <div className={styles.testimonyHeader}>
                <h2 className="sectionTitle">Our <span>customers</span> speak</h2>
                <p className="sectionDescription">Compatible across Chinese OEMs and global OEM ecosystems.</p>
            </div>
            <div className={styles.testimonyContent}>
                <div className={styles.testimonyInfo}>
                    <h3 className={styles.testimonyName}>{activeTestimony.name}</h3>
                    <p className={styles.testimonyRole}>{activeTestimony.role}</p>
                </div>
                <div className={styles.testimonyCarouselContainer}>
                    <button 
                        className={styles.navButton} 
                        onClick={handlePrev}
                        aria-label="Previous testimony"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    
                    <div className={styles.carouselWrapper}>
                        {visibleItems.map((item, idx) => {
                            const isActive = item.position === 0;
                            return (
                                <div
                                    key={`${item.actualIndex}-${idx}`}
                                    className={`${styles.testimonyCard} ${isActive ? styles.active : ''} ${styles[`position${item.position}`]}`}
                                >
                                    <div className={styles.cardImageWrapper}>
                                        <Image
                                            src={item.data.image}
                                            alt={item.data.name}
                                            fill
                                            className={styles.cardImage}
                                            sizes="(max-width: 768px) 150px, 200px"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button 
                        className={styles.navButton} 
                        onClick={handleNext}
                        aria-label="Next testimony"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
