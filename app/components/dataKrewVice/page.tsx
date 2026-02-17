import styles from "./dataKrewVice.module.css";
import Image from "next/image";
import Link from "next/link";

export default function DataKrewVice() {
    const dataKrewViceData = [
        {
            category: "Data Krew Vice",
            title: "Data Krew Vice is a company that provides data services to businesses.",
            date: "2026-02-16",
            author: "John Doe",
            image: "/dataKrewVice1.png",
            video: "/dataKrewVice1.mp4"
        },

        {
            category: "Data Krew Vice",
            description: "Data Krew Vice is a company that provides data services to businesses.",
            image: "/dataKrewVice2.png"
        },

    ]
    return (
        <section className={styles.dataKrewViceSection}>
            <div className="container">
                <div className={styles.dataKrewViceContainer}>
                    <div className={styles.dataKrewViceHeader}>
                        <h2 className="sectionTitle">Datakrew’s <span>voice</span></h2>
                        <p className="sectionDescription">What Datakrew is learning from real vehicles, real routes, and real operators around the world.</p>
                    </div>
                    <div className={styles.dataKrewViceContent}>
                        <div className={styles.dataKrewViceItem}>
                            <div className={styles.dataKrewViceItemContent}>
                                <div className={styles.dataKrewViceItemContentImage}>
                                    <Image src="/image-icon.svg" alt={dataKrewViceData[0].category} width={100} height={100} />
                                </div>
                                <div className={styles.dataKrewViceItemContentText}>
                                    <span>Featured video</span>
                                    <h3>OXRED GuardianAI</h3>
                                    <p>Discover how Datakrew is revolutionizing fleet management with AI-powered predictive analytics and real-time analytics</p>
                                    <Link className="tertiaryCta" href="/">Watch more <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.00685 12.3509L4 12.2491C4 11.8694 4.28215 11.5556 4.64823 11.506L4.75 11.4991L17.446 11.5L14.2248 8.28055C13.9585 8.0144 13.9341 7.59774 14.1518 7.30404L14.2244 7.21989C14.4905 6.95352 14.9072 6.92913 15.2009 7.14687L15.2851 7.21945L19.7851 11.7157C20.0514 11.9818 20.0758 12.3985 19.8581 12.6922L19.7855 12.7763L15.2855 17.2801C14.9927 17.5731 14.5179 17.5733 14.2248 17.2806C13.9585 17.0144 13.9341 16.5977 14.1518 16.304L14.2244 16.2199L17.442 13L4.75 12.9991C4.3703 12.9991 4.05651 12.717 4.00685 12.3509L4 12.2491L4.00685 12.3509Z" fill="#93D772" />
                                    </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className={styles.feedList}>
                            <Link href="/" className={styles.feedItem}>
                                <div className={styles.thumbnailContainer}>
                                    <Image src="/blog.svg" alt="Truck" width={100} height={100} />
                                </div>
                                <div className={styles.feedContent}>
                                    <div className={`${styles.tag} text-cyan`}>Podcast</div>
                                    <h3 className={styles.feedTitle}>Founder speech</h3>
                                    <div className={styles.feedDate}>Jan 28, 2026</div>
                                </div>
                                <div className={styles.arrowIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Link>

                            <Link href="/" className={styles.feedItem}>
                                <div className={styles.thumbnailContainer}>
                                    <Image src="/blog.svg" alt="Charging" width={100} height={100} />
                                </div>
                                <div className={styles.feedContent}>
                                    <div className={`${styles.tag} text-cyan`}>Blog</div>
                                    <h3 className={styles.feedTitle}>The future of fleet analytics</h3>
                                    <div className={styles.feedDate}>Jan 28, 2026</div>
                                </div>
                                <div className={styles.arrowIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Link>

                            <Link href="/" className={styles.feedItem}>
                                <div className={styles.thumbnailContainer}>
                                    <Image src="/blog.svg" alt="Road" width={100} height={100} />
                                </div>
                                <div className={styles.feedContent}>
                                    <div className={`${styles.tag} text-cyan`}>Blog</div>
                                    <h3 className={styles.feedTitle}>AI In fleet management: 2026 trends</h3>
                                    <div className={styles.feedDate}>Jan 28, 2026</div>
                                </div>
                                <div className={styles.arrowIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Link>

                            <Link href="/" className={styles.feedItem}>
                                <div className={styles.thumbnailContainer}>
                                    <Image src="/blog.svg" alt="Sunset Truck" width={100} height={100} />
                                </div>
                                <div className={styles.feedContent}>
                                    <div className={`${styles.tag} text-cyan`}>Video</div>
                                    <h3 className={styles.feedTitle}>Platform walkthrough</h3>
                                    <div className={styles.feedDate}>Jan 28, 2026</div>
                                </div>
                                <div className={styles.arrowIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Link>

                        </div>
                    </div>
                    <div className={styles.dataKrewViceFooter}>
                        <Link className="primaryCta" href="/">Exprore more <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.00685 12.3509L4 12.2491C4 11.8694 4.28215 11.5556 4.64823 11.506L4.75 11.4991L17.446 11.5L14.2248 8.28055C13.9585 8.0144 13.9341 7.59774 14.1518 7.30404L14.2244 7.21989C14.4905 6.95352 14.9072 6.92913 15.2009 7.14687L15.2851 7.21945L19.7851 11.7157C20.0514 11.9818 20.0758 12.3985 19.8581 12.6922L19.7855 12.7763L15.2855 17.2801C14.9927 17.5731 14.5179 17.5733 14.2248 17.2806C13.9585 17.0144 13.9341 16.5977 14.1518 16.304L14.2244 16.2199L17.442 13L4.75 12.9991C4.3703 12.9991 4.05651 12.717 4.00685 12.3509L4 12.2491L4.00685 12.3509Z" fill="#93D772" />
                        </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}