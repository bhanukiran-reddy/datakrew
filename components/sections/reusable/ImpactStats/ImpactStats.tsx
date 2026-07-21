import NumberTicker from "../NumberTicker/NumberTicker";
import styles from "./ImpactStats.module.css";

export type ImpactStat = {
  value: string;
  label: string;
};

interface ImpactStatsProps {
  stats: ImpactStat[];
  className?: string;
}

export default function ImpactStats({ stats, className }: ImpactStatsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className={`${styles.impactStatsRow} ${className || ""}`}>
      {stats.map((stat, i) => (
        <div key={i} className={styles.impactStatCard}>
          <div className={styles.impactStatValue}>
            <NumberTicker value={stat.value} />
          </div>
          <span className={styles.impactStatLabel}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
