import type { ReactNode } from 'react';
import styles from './PageWrapper.module.css';

interface PageWrapperProps {
  children: ReactNode;
}

/**
 * Renders <main> directly — no extra wrapper div.
 * The margin-top offsets the fixed header; min-height pins the footer.
 */
export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main id="main-content" className={styles.main} suppressHydrationWarning>
      {children}
    </main>
  );
}
