import React from "react";
import Image from "next/image";
import styles from "./LifeAtDatakrew.module.css";

interface LifeAtDatakrewProps {
    title: string;
    subheading: string;
    images: Array<{ url: string; alt: string; type: "horizontal" | "square" }>;
}

export default function LifeAtDatakrew({ title, subheading, images }: LifeAtDatakrewProps) {
    if (!images || images.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className="sectionTitle" dangerouslySetInnerHTML={{ __html: title }} />
                    <p className="sectionDescription" dangerouslySetInnerHTML={{ __html: subheading }} />
                </div>

                <div className={styles.wrapper}>
                    {/* First Row */}
                    {images.length > 0 && (
                        <div className={styles.row}>
                            {images[0] && (
                                <div className={`${styles.item} ${styles.horizontal}`}>
                                    <Image src={images[0].url} alt={images[0].alt} width={878} height={300} />
                                </div>
                            )}
                            {images[1] && (
                                <div className={`${styles.item} ${styles.square}`}>
                                    <Image src={images[1].url} alt={images[1].alt} width={413} height={300} />
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Second Row */}
                    {images.length > 2 && (
                        <div className={styles.row}>
                            {images[2] && (
                                <div className={`${styles.item} ${styles.square}`}>
                                    <Image src={images[2].url} alt={images[2].alt} width={413} height={300} />
                                </div>
                            )}
                            {images[3] && (
                                <div className={`${styles.item} ${styles.horizontal}`}>
                                    <Image src={images[3].url} alt={images[3].alt} width={878} height={300} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
