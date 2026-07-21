import Image from "next/image";
import Link from "next/link";
import styles from "./FeaturedBlogCard.module.css";

export interface FeaturedBlogCardProps {
    category: string;
    image: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    linkUrl?: string; // Correctly added this from a previous fix elsewhere
}

export default function FeaturedBlogCard({
    category,
    image,
    title,
    excerpt,
    date,
    slug,
    linkUrl,
}: FeaturedBlogCardProps) {
    return (
        <div className={styles.featuredBlogCard}>
            <div className={styles.featuredBlogCardImageWrap}>
                {category && <span className={styles.categoryLabel} dangerouslySetInnerHTML={{ __html: category }} />}
                <Image
                    src={image}
                    alt={title}
                    width={600}
                    height={400}
                    className={styles.featuredBlogCardImage}
                />
            </div>
            <div className={styles.featuredBlogCardContent}>
                <span className={styles.featuredBlogCardDate}>{date}</span>
                <h3 className={styles.featuredBlogCardTitle}>{title}</h3>
                <p className={styles.featuredBlogCardDescription}>{excerpt}</p>
                <div className={styles.featuredBlogCardFooter}>

                    <Link
                        href={linkUrl || `/blog/${slug}`}
                        className={`${styles.featuredBlogCardLink} tertiaryCta`}
                        target={undefined}
                    >
                        Read more <i className="icon fa-kit fa-right-arrow" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
