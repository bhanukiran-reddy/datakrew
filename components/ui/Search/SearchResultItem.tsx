import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SearchResultItem.module.css';

interface SearchResultItemProps {
  title: string;
  type: string;
  uri: string;
  image?: string;
  excerpt?: string;
  onClick?: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ 
  title, 
  type, 
  uri, 
  image, 
  excerpt,
  onClick 
}) => {
  return (
    <Link href={uri} className={styles.resultItem} onClick={onClick}>
      <div className={styles.thumbnailWrapper}>
        {image ? (
          <Image 
            src={image} 
            alt={title} 
            width={80} 
            height={80} 
            className={styles.thumbnail}
            unoptimized={image.endsWith('.svg')}
          />
        ) : (
          <div className={styles.placeholder}>
            <i className="fa-kit fa-file-lines"></i>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.typeTag}>{type}</span>
        <h4 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
        {excerpt && (
          <div 
            className={styles.excerpt} 
            dangerouslySetInnerHTML={{ __html: excerpt.length > 100 ? excerpt.substring(0, 100) + '...' : excerpt }} 
          />
        )}
      </div>
      <div className={styles.arrow}>
        <i className="fa-kit fa-right-arrow"></i>
      </div>
    </Link>
  );
};

export default SearchResultItem;
