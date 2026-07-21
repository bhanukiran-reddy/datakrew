'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './StickyNavSection.module.css';
import NavDropdown from '@/components/ui/NavDropdown/NavDropdown';

export interface NavItem {
    label: string;
    id: string;
}

export interface StickyNavSectionProps {
    items: NavItem[];
    offset?: number; // Offset for scroll
    className?: string;
}

export default function StickyNavSection({ items, offset = 100, className }: StickyNavSectionProps) {
    const [activeId, setActiveId] = useState<string>('');
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const navRef = useRef<HTMLElement>(null);

    const updateHeaderHeight = useCallback(() => {
        const siteHeader = document.querySelector('header');
        if (siteHeader) {
            setHeaderHeight(siteHeader.getBoundingClientRect().height);
        }
    }, []);

    useEffect(() => {
        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);
        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, [updateHeaderHeight]);

    // Calculate dynamic offset based on actual element heights
    const getCalculatedOffset = useCallback(() => {
        if (typeof window === 'undefined') return offset;

        // 1. Get the height of the main site header (which is sticky/fixed at the top)
        const siteHeader = document.querySelector('header');
        const currentHeaderHeight = siteHeader ? siteHeader.getBoundingClientRect().height : 0;

        // 2. Get the height of this StickyNav component
        const stickyNavHeight = navRef.current ? navRef.current.getBoundingClientRect().height : 0;

        const visualBuffer = -3;

        return currentHeaderHeight + stickyNavHeight + visualBuffer;
    }, [offset]);

    // Smooth scroll to section
    const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement> | null, id: string) => {
        if (e) e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const currentOffset = getCalculatedOffset();
            const top = element.getBoundingClientRect().top + window.scrollY - currentOffset;
            window.scrollTo({
                top,
                behavior: 'smooth',
            });
        }
    }, [getCalculatedOffset]);

    // Scroll listener to highlight active section (Latest entered section logic)
    useEffect(() => {
        const handleScroll = () => {
            if (items.length === 0) return;

            const currentOffset = getCalculatedOffset();
            const scrollPos = window.scrollY + currentOffset + 10;
            let foundId = items[0].id; // Default to first item if above all

            for (let i = 0; i < items.length; i++) {
                const element = document.getElementById(items[i].id);
                if (element) {
                    const start = element.offsetTop;
                    // If we've passed the top of this section, it's the current 'latest'
                    if (scrollPos >= start) {
                        foundId = items[i].id;
                    } else {
                        // Since items are usually in order, we can stop once we hit a section that hasn't started yet
                        break;
                    }
                }
            }

            if (foundId !== activeId) {
                setActiveId(foundId);
            }
        };

        let rafId: number;
        const throttledScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(handleScroll);
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        handleScroll(); // Trigger initial check

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            cancelAnimationFrame(rafId);
        };
    }, [items, activeId, getCalculatedOffset]);

    if (!items || items.length === 0) return null;

    const activeIndex = items.findIndex((item) => item.id === activeId);

    const handleDropdownSelect = (index: number) => {
        const item = items[index];
        if (item) {
            scrollToSection(null, item.id);
        }
    };

    return (
        <nav
            className={`${styles.stickyNavSection} ${className || ''}`}
            ref={navRef}
            style={{ top: headerHeight > 0 ? `${headerHeight}px` : undefined }}
        >
            <div className="container">
                {/* Desktop View */}
                <ul className={styles.stickyNavList} role="list">
                    {items.map((item) => (
                        <li key={item.id} className={styles.stickyNavItem} role="listitem">
                            <a
                                href={`#${item.id}`}
                                className={`${styles.stickyNavLink} ${activeId === item.id ? styles.active : ''}`}
                                onClick={(e) => scrollToSection(e, item.id)}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Mobile View */}
                <div className={styles.mobileDropdownWrapper}>
                    <NavDropdown
                        items={items}
                        activeIndex={activeIndex}
                        onSelect={handleDropdownSelect}
                        className={styles.overrideDropdown}
                    />
                </div>
            </div>
        </nav>
    );
}
