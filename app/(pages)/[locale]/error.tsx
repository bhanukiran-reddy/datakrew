'use client';

import styles from './error.module.css';

/** Error boundary for locale routes. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('[LocaleError]', error.message, error.digest ?? '', error.stack ?? '');

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Something went wrong.</h2>
      <p className={styles.description}>
        An unexpected error occurred. Please try again.
      </p>
      <button className={styles.button} onClick={reset} type="button">
        Try again
      </button>
    </div>
  );
}
