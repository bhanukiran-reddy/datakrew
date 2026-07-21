"use client";

import styles from "./Header.module.css";

export interface MobileMenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function MobileMenuToggle({ isOpen, onClick }: MobileMenuToggleProps) {
  return (
    <button
      className={styles.mobileToggle}
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <div className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  );
}
