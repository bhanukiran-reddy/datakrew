import Link from "next/link";
import styles from "./battery.module.css";


export default function BatterySection() {
    return (
        <>
            <section className={styles.batteryContainer}>
                <div className="container">
                    <div className={styles.batteryContent}>
                    <h2 className="sectionTitle">Turn <span>battery risk into operational</span> certainty</h2>
                    <p className="sectionDescription">Partner with Datrakrew to transform raw telemetry data from every drive into
                        your most valuable asset.
                    </p>
                    <div className={styles.cta}>
                        <Link className='primaryCta' href="/">Book a demo
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.00685 12.3509L4 12.2491C4 11.8694 4.28215 11.5556 4.64823 11.506L4.75 11.4991L17.446 11.5L14.2248 8.28055C13.9585 8.0144 13.9341 7.59774 14.1518 7.30404L14.2244 7.21989C14.4905 6.95352 14.9072 6.92913 15.2009 7.14687L15.2851 7.21945L19.7851 11.7157C20.0514 11.9818 20.0758 12.3985 19.8581 12.6922L19.7855 12.7763L15.2855 17.2801C14.9927 17.5731 14.5179 17.5733 14.2248 17.2806C13.9585 17.0144 13.9341 16.5977 14.1518 16.304L14.2244 16.2199L17.442 13L4.75 12.9991C4.3703 12.9991 4.05651 12.717 4.00685 12.3509L4 12.2491L4.00685 12.3509Z" fill="#131313" />
                            </svg>
                        </Link>
                        <Link className="secondaryCta" href="/">Talk to our expert
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.00685 12.3509L4 12.2491C4 11.8694 4.28215 11.5556 4.64823 11.506L4.75 11.4991L17.446 11.5L14.2248 8.28055C13.9585 8.0144 13.9341 7.59774 14.1518 7.30404L14.2244 7.21989C14.4905 6.95352 14.9072 6.92913 15.2009 7.14687L15.2851 7.21945L19.7851 11.7157C20.0514 11.9818 20.0758 12.3985 19.8581 12.6922L19.7855 12.7763L15.2855 17.2801C14.9927 17.5731 14.5179 17.5733 14.2248 17.2806C13.9585 17.0144 13.9341 16.5977 14.1518 16.304L14.2244 16.2199L17.442 13L4.75 12.9991C4.3703 12.9991 4.05651 12.717 4.00685 12.3509L4 12.2491L4.00685 12.3509Z" fill="#93D772" />
                            </svg>
                        </Link>
                    </div>
                </div>
                </div>
            </section>
        </>
    );
}
