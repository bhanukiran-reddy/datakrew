"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchInline.module.css';

interface SearchInlineProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
}

const SearchInline: React.FC<SearchInlineProps> = ({ isOpen, onClose, locale }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchBar}>
        <i className={`fa-kit fa-magnifier ${styles.searchIcon}`}></i>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for blogs, podcasts, news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchInline;
