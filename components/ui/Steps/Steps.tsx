import styles from "./Steps.module.css";

interface Step {
    number?: string;
    title?: string;
    description?: string;
}

interface StepsProps {
    steps: Step[];
    inView?: boolean;
    onLastStepAnimationEnd?: () => void;
    className?: string;
    /**
     * Custom mapping of step index to delay class.
     * Default: { 0: "delay1", 1: "delay3", 2: "delay5" }
     */
    stepDelayMap?: Record<number, string>;
}

const DEFAULT_STEP_DELAY_MAP: Record<number, string> = {
    0: "delay1",
    1: "delay3",
    2: "delay5",
    3: "delay7",
};

export const Steps = ({
    steps,
    inView = true,
    onLastStepAnimationEnd,
    className,
    stepDelayMap = DEFAULT_STEP_DELAY_MAP,
}: StepsProps) => {
    return (
        <div className={`${styles.steps} ${inView ? styles.inView : ""} ${className || ""} ${steps.length === 4 ? styles.count4 : ""}`}>
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                const delayClass = stepDelayMap[index] || "delay1";

                return (
                    <div
                        className={`${styles.step} ${styles.revealItem} ${styles[delayClass] || ""}`}
                        key={index}
                        onAnimationEnd={isLast ? onLastStepAnimationEnd : undefined}
                    >
                        {step.number && (
                            <div className={styles.number}>
                                <h2>{step.number}</h2>
                            </div>
                        )}
                        {step.title && <h3 className={styles.stepTitle}>{step.title}</h3>}
                        {step.description && (
                            <p className={styles.description} dangerouslySetInnerHTML={{ __html: step.description }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Steps;
