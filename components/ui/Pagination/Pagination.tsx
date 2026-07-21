"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Pagination.module.css";

const PAGE_SIZE_OPTIONS = [6, 12];

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (size: number) => void;
}

export default function Pagination({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    onItemsPerPageChange
}: PaginationProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768.98);
        };

        handleResize();
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("resize", handleResize);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const startItem = (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (isMobile) {
            pages.push(currentPage);
            if (currentPage < totalPages) {
                if (totalPages - currentPage > 1) pages.push("...");
                pages.push(totalPages);
            }
            return Array.from(new Set(pages));
        }

        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        // Always show first two
        pages.push(1);
        pages.push(2);

        if (currentPage <= 2) {
            // Near start: 1 2 ... last
            if (totalPages > 2) {
                if (totalPages > 3) pages.push("...");
                pages.push(totalPages);
            }
        } else if (currentPage >= totalPages - 1) {
            // Near end: 1 2 ... last-1 last
            if (totalPages > 3) pages.push("...");
            if (totalPages - 1 > 2) pages.push(totalPages - 1);
            pages.push(totalPages);
        } else {
            // Middle: 1 2 ... current ... last
            pages.push("...");
            pages.push(currentPage);
            pages.push("...");
            pages.push(totalPages);
        }

        return Array.from(new Set(pages));
    };

    if (totalItems <= 6) return null;

    return (
        <div className={styles.pagination}>
            <div className={styles.paginationInner}>
                <div className={styles.paginationInfo}>
                    {startItem}-{endItem} of {totalItems} items
                </div>

                <div className={styles.navGroup}>
                    {/* First Page */}
                    <button
                        className={styles.iconBtn}
                        onClick={() => currentPage > 1 && onPageChange(1)}
                        disabled={currentPage === 1}
                        aria-label="First page"
                    >
                        <i className="icon fa-kit fa-right-nav" style={{ transform: 'rotate(180deg)' }}></i>
                        <i className="icon fa-kit fa-right-nav" style={{ transform: 'rotate(180deg)', marginLeft: '-8px' }}></i>
                    </button>

                    {/* Prev Page */}
                    <button
                        className={styles.iconBtn}
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <i className="icon fa-kit fa-right-nav" style={{ transform: 'rotate(180deg)' }}></i>
                    </button>

                    <div className={styles.pages}>
                        {getPageNumbers().map((page, idx) => {
                            if (page === "...") {
                                return (
                                    <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
                                        ...
                                    </span>
                                );
                            }
                            return (
                                <button
                                    key={page}
                                    className={`${styles.pageBtn} ${currentPage === page ? styles.active : ""}`}
                                    onClick={() => onPageChange(page as number)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Page */}
                    <button
                        className={styles.iconBtn}
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <i className="icon fa-kit fa-right-nav"></i>
                    </button>

                    {/* Last Page */}
                    <button
                        className={styles.iconBtn}
                        onClick={() => currentPage < totalPages && onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        aria-label="Last page"
                    >
                        <i className="icon fa-kit fa-right-nav"></i>
                        <i className="icon fa-kit fa-right-nav" style={{ marginLeft: '-8px' }}></i>
                    </button>
                </div>


                <div className={styles.pageSizeWrapper}>
                    <span className={styles.pageSizeLabel}>Items per Page</span>
                    <div className={styles.customSelectWrapper} ref={dropdownRef}>
                        <button
                            className={styles.dropdownTrigger}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            aria-haspopup="listbox"
                            aria-expanded={isDropdownOpen}
                        >
                            {itemsPerPage < 10 ? `0${itemsPerPage}` : itemsPerPage}
                            <i className={`fa-kit fa-right-nav ${styles.arrow} ${isDropdownOpen ? styles.arrowOpen : ""}`}></i>
                        </button>

                        {isDropdownOpen && (
                            <div className={styles.dropdownPanel} role="listbox">
                                {PAGE_SIZE_OPTIONS.map((option) => (
                                    <div
                                        key={option}
                                        className={`${styles.dropdownOption} ${itemsPerPage === option ? styles.optionActive : ""}`}
                                        onClick={() => {
                                            onItemsPerPageChange(option);
                                            setIsDropdownOpen(false);
                                        }}
                                        role="option"
                                        aria-selected={itemsPerPage === option}
                                    >
                                        {option < 10 ? `0${option}` : option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
