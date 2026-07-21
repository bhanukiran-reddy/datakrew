'use client';

/**
 * Global error boundary.
 * Catches errors that occur in the root layout itself.
 * Must be a Client Component.
 */

import styles from './global-error.module.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log to monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error monitoring (Sentry, etc.)
    console.error('[GlobalError]', error.digest);
  }

  return (
    <html>
      <body>
        <div className={styles.container}>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.description}>
            An unexpected error occurred. Please try again.
          </p>
          <button className="primaryCta" onClick={reset} type="button">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
