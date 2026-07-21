import Skeleton from '@/components/ui/Skeleton/Skeleton';
import styles from './loading.module.css';

/** Loading UI for the locale routes. */
export default function Loading() {
  return (
    <div className={styles.container}>
      <Skeleton variant="heading" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="image" />
    </div>
  );
}
