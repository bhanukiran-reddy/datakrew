import React from 'react';
import styles from './JobCard.module.css';
import Link from '@/components/ui/Link/Link';
import { useParams } from 'next/navigation';

export interface JobCardProps {
    id: string;
    title: string;
    location: string;
    experience: string;
    type: string;
    link?: string;
}

const JobCard: React.FC<JobCardProps> = ({ title, location, experience, type, link = "#" }) => {
    const { locale } = useParams() as { locale: string };

    return (
        <Link href={link} locale={locale} className={styles.jobCard}>
            {location && location !== "N/A" && (
                <span className={styles.locationBadge}>
                    {location}
                </span>
            )}
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.details}>
                {experience && experience !== "N/A" && (
                    <div className={styles.detailItem}>
                        <i className="fa-kit fa-experience"></i>
                        <p className={styles.detailItemText}>{experience}</p>
                    </div>
                )}
                {type && type !== "N/A" && (
                    <div className={styles.detailItem}>
                        <i className="fa-kit fa-full-time"></i>
                        <p className={styles.detailItemText}>{type}</p>
                    </div>
                )}
            </div>
            <span className={`${styles.applyLink} iconLink tertiaryCta`}>
                Apply now <i className="icon fa-kit fa-right-arrow" aria-hidden="true"></i>
            </span>
        </Link>
    );
};

export default JobCard;
