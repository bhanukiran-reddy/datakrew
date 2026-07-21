'use client';

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import Image from 'next/image';
import styles from './NavDropdown.module.css';

/* ── Types ──────────────────────────────────────────────────── */

/**
 * A single selectable item in the dropdown.
 *
 * Provide *either* `icon` (a ready-made ReactNode) **or** `iconUrl`
 * (a path to an image). If both are given, `icon` takes precedence.
 */
export type NavDropdownItem = {
    /** Unique key for this item (used as React key & for identification) */
    id: string | number;
    /** Display label shown in the trigger and option list */
    label: string;
    /** A ReactNode to display as the icon (SVG component, etc.) */
    icon?: ReactNode;
    /** Image URL used as icon when `icon` is not provided */
    iconUrl?: string;
};

export type NavDropdownProps = {
    /** The list of selectable items */
    items: NavDropdownItem[];
    /** Index of the currently active/selected item */
    activeIndex: number;
    /** Callback fired when the user selects an item by its original index */
    onSelect: (index: number) => void;
    /**
     * Optional render function for custom icon rendering.
     * Receives the item and whether it is the currently active selection.
     * If provided, this takes precedence over `item.icon` / `item.iconUrl`.
     */
    renderIcon?: (item: NavDropdownItem, isActive: boolean) => ReactNode;
    /** Extra className applied to the root element */
    className?: string;
    /** Accessible label for the dropdown trigger (defaults to `Select: {label}`) */
    ariaLabel?: string;
    /** Text to show when no item is active (activeIndex = -1) */
    placeholder?: string;
};

/* ── Chevron Icon ───────────────────────────────────────────── */

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            className={`${styles.navDropdownChevron} ${open ? styles.navDropdownChevronOpen : ''}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
        >
            <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/* ── Icon resolver (internal) ───────────────────────────────── */

function DefaultIcon({ item, isActive, renderIcon }: {
    item: NavDropdownItem;
    isActive: boolean;
    renderIcon?: NavDropdownProps['renderIcon'];
}) {
    // 1. Custom render function (highest priority)
    if (renderIcon) return <>{renderIcon(item, isActive)}</>;
    // 2. Pre-built ReactNode icon
    if (item.icon) return <>{item.icon}</>;
    // 3. Image URL fallback
    if (item.iconUrl) {
        return (
            <Image
                src={item.iconUrl}
                alt=""
                width={24}
                height={24}
                style={{ objectFit: 'contain' }}
            />
        );
    }
    // 4. No icon at all
    return null;
}

/* ── Component ──────────────────────────────────────────────── */

export default function NavDropdown({
    items,
    activeIndex,
    onSelect,
    renderIcon,
    className,
    ariaLabel,
    placeholder,
}: NavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    /* Close on outside click */
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    /* Close on Escape */
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const isActuallyActive = activeIndex >= 0;
    const activeItem = isActuallyActive ? items[activeIndex] : null;
    const displayLabel = isActuallyActive ? items[activeIndex].label : (placeholder || 'Jump to section');

    const handleSelect = useCallback(
        (originalIndex: number) => {
            onSelect(originalIndex);
            setIsOpen(false);
        },
        [onSelect],
    );

    const handleKeyDownOnOption = useCallback(
        (e: React.KeyboardEvent, originalIndex: number) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(originalIndex);
            }
        },
        [handleSelect],
    );

    const rootClasses = [
        styles.navDropdown,
        className,
        !isActuallyActive ? styles.navDropdownInactive : ''
    ].filter(Boolean).join(' ');

    const triggerLabel = ariaLabel ?? (isActuallyActive ? `Select: ${activeItem?.label}` : 'Select section');

    return (
        <div className={rootClasses} ref={dropdownRef}>
            {/* ── Trigger ──────────────────────────────────────────── */}
            <button
                type="button"
                className={styles.navDropdownTrigger}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label={triggerLabel}
            >
                <div className={styles.navDropdownActive}>
                    {activeItem && (renderIcon || activeItem.icon || activeItem.iconUrl) && (
                        <span className={styles.navDropdownIcon}>
                            <DefaultIcon item={activeItem} isActive={isActuallyActive} renderIcon={renderIcon} />
                        </span>
                    )}
                    <span className={styles.navDropdownLabel}>{displayLabel}</span>
                </div>
                <ChevronIcon open={isOpen} />
            </button>

            {/* ── Menu ─────────────────────────────────────────────── */}
            {isOpen && (
                <div className={styles.navDropdownMenu} role="listbox" aria-label="Options">
                    {items.map((item, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                className={`${styles.navDropdownOption} ${isActive ? styles.navDropdownOptionActive : ''}`}
                                onClick={() => handleSelect(index)}
                                onKeyDown={(e) => handleKeyDownOnOption(e, index)}
                            >
                                {(renderIcon || item.icon || item.iconUrl) && (
                                    <span className={styles.navDropdownIcon}>
                                        <DefaultIcon item={item} isActive={isActive} renderIcon={renderIcon} />
                                    </span>
                                )}
                                <span className={styles.navDropdownLabel}>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
