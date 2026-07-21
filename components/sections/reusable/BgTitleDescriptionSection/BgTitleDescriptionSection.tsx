import React from 'react';
import styles from './BgTitleDescriptionSection.module.css';
import Image from '@/components/ui/Image/Image';
import Link from '@/components/ui/Link/Link';

interface CTAButtonProps {
    label: string;
    url: string;
    variant?: 'primary' | 'secondary' | 'ghost';
}

interface BgTitleDescriptionSectionProps {
    title?: string;
    titleHighlight?: string;
    description?: string;
    backgroundImage?: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
    button?: CTAButtonProps;
    className?: string;
    id?: string;
    contentAlign?: "left" | "center"
    titleWidth?: "max-content" | "50%"

}

const BgTitleDescriptionSection = ({
    title,
    titleHighlight,
    description,
    backgroundImage,
    button,
    className,
    id,
    contentAlign = 'left', //  default keeps old UI
    titleWidth = '50%',
}: BgTitleDescriptionSectionProps) => {
    if (!title || !description) return null;

    const titleHtml =
        !title ? '' : titleHighlight
            ? (title.toLowerCase().includes(titleHighlight.toLowerCase())
                ? title.replace(new RegExp(`(${titleHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), `<span class="${styles.bgTitleDescriptionHighlight}">$1</span>`)
                : `${title} <span class="${styles.bgTitleDescriptionHighlight}">${titleHighlight}</span>`)
            : title;

    return (
        <section id={id} className={`${styles.bgTitleDescriptionSection} ${className || ''}`}>
            {backgroundImage?.url && (
                <div className={styles.bgTitleDescriptionBgWrap}>
                    <Image
                        image={backgroundImage}
                        alt={backgroundImage.alt ?? ''}
                        fill
                        priority
                        sizes="100vw"
                        className={styles.bgTitleDescriptionBgImage}
                    />
                    <div className={styles.bgTitleDescriptionOverlay}></div>
                </div>
            )}
            <div className={`container ${styles.bgTitleDescriptionContainer}`}>
                <div
                    className={`${styles.bgTitleDescriptionContent} ${contentAlign === 'center' ? styles.centerContent : ''
                        }`}
                >
                    <h2 className={`sectionTitle ${styles.bgTitleDescriptionTitle} ${titleWidth === 'max-content' ? styles.bgTitleDescriptionTitleWidth : ''}`} dangerouslySetInnerHTML={{ __html: titleHtml }} />
                    <p
                        className={`sectionDescription ${styles.bgTitleDescriptionDescription}`}
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                    {button && (
                        <Link
                            href={button.url}
                            className="primaryCta"
                        >
                            {button.label}
                            <i className={`${styles.bgTitleDescriptionIcon} fa-kit fa-right-arrow`}></i>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BgTitleDescriptionSection;
