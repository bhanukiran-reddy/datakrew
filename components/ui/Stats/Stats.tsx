import styles from "./Stats.module.css";
import NumberTicker from "@/components/sections/reusable/NumberTicker/NumberTicker";

interface StatItem {
    statsValue?: string;
    statsDescription?: string;
}

interface StatsProps {
    stats?: StatItem[];
    className?: string;
    itemClassName?: string;
}

const Stats = ({ stats, className, itemClassName }: StatsProps) => {
    return (
        <div className={`${styles.statsWrapper} ${className || ''}`}>
            {stats?.map((s, idx) => (
                <div key={idx} className={`${styles.statsItem} ${itemClassName || ''}`}>
                    <h3 className={styles.statsValue}>
                        {s.statsValue ? (
                            <NumberTicker value={s.statsValue} />
                        ) : (
                            "-"
                        )}
                    </h3>
                    <p className={styles.description}>
                        <span>{s.statsDescription}</span>
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Stats;
