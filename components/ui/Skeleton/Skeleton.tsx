import styles from './Skeleton.module.css';

interface SkeletonProps {
  variant?: 'text' | 'heading' | 'image' | 'circle';
  width?: string;
  height?: string;
  className?: string;
}

/** Loading skeleton placeholder with shimmer animation. */
export default function Skeleton({
  variant = 'text',
  width,
  height,
  className,
}: SkeletonProps) {
  const classes = [styles.skeleton, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={{ width, height }}
      aria-hidden="true"
      role="presentation"
    />
  );
}
