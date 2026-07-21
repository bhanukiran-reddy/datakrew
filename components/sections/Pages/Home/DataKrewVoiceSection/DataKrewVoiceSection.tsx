import Link from '@/components/ui/Link/Link';
import Image from '@/components/ui/Image/Image';
import { isAbsoluteUrl } from '@/lib/utils/slugUtils';
import { sanitizeHTML } from '@/lib/utils/sanitize';
import styles from './DataKrewVoiceSection.module.css';

type PostNode = {
  __typename?: string;
  id?: string;
  title?: string;
  uri?: string;
  external?: boolean;
  date?: string;
  episodeDescription?: string;
  featuredImage?: {
    node?: {
      mediaItemUrl?: string;
      altText?: string;
    };
  };
};

type DataKrewVoiceSectionProps = {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaTarget?: string;
  featuredPost?: PostNode[];
  sidebarPosts?: PostNode[];
};

const SECTION_HEADING_ID = 'datakrew-voice-heading';

function formatDate(isoDate: string | undefined): string {
  if (!isoDate) return '';
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

function toDateTimeAttr(isoDate: string | undefined): string | undefined {
  if (!isoDate) return undefined;
  const d = new Date(isoDate);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function postTag(typename: string | undefined): string {
  if (typename === 'Podcastsandvideos' || typename === 'Videos') return 'Video';
  if (typename === 'Podcasts') return 'Podcast';
  if (typename === 'Blog') return 'Blog';
  if (typename === 'News') return 'News';
  return typename ?? 'Post';
}

function isVideoPost(typename: string | undefined): boolean {
  return typename === 'Podcastsandvideos' || typename === 'Videos' || typename === 'Podcasts';
}

function featuredLabel(typename: string | undefined): string {
  if (typename === 'Blog') return 'Featured blog';
  if (typename === 'News') return 'Featured news';
  if (isVideoPost(typename)) return 'Featured video';
  return 'Featured';
}

function featuredCtaText(typename: string | undefined): string {
  if (typename === 'Blog') return 'Read more';
  if (typename === 'News') return 'Read more';
  if (isVideoPost(typename)) return 'Watch more';
  return 'Learn more';
}

function postKey(post: PostNode, index: number): string {
  return post.id ?? post.uri ?? post.title ?? `post-${index}`;
}

export default function DataKrewVoiceSection(props: DataKrewVoiceSectionProps) {
  const {
    title,
    description,
    ctaText,
    ctaHref,
    ctaTarget,
    featuredPost = [],
    sidebarPosts = [],
  } = props;
  const featured = featuredPost[0];
  const sidebar = sidebarPosts ?? [];

  if (!title && !description && !featured && sidebar.length === 0) return null;

  const featuredTitleId = featured ? `datakrew-voice-featured-${postKey(featured, 0)}` : undefined;
  const footerHref = ctaHref?.trim() || '/resources';
  const footerLabel = ctaText?.trim() || 'Explore more';
  const footerExternal = ctaTarget === '_blank' || (footerHref ? isAbsoluteUrl(footerHref) : false);

  const featuredCardContent = featured ? (
  <>
    <figure className={styles.dataKrewVoiceItemContentImage}>
      {isVideoPost(featured.__typename) && (
        <i className={`fa-kit fa-play ${styles.playIcon}`} aria-hidden="true"></i>
      )}
      {featured.featuredImage?.node?.mediaItemUrl ? (
        <Image
          src={featured.featuredImage.node.mediaItemUrl}
          alt={featured.featuredImage.node.altText ?? featured.title ?? 'Featured'}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
        />
      ) : null}
    </figure>
    <header className={styles.dataKrewVoiceItemContentText}>
      <p className={styles.featuredLabel}>{featuredLabel(featured.__typename)}</p>
      {featured.title && <h3 id={featuredTitleId}>{featured.title}</h3>}
      {featured.episodeDescription && (
        <div
          className={styles.featuredDescription}
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(featured.episodeDescription) }}
        />
      )}
      {featured.uri && (
        <p className="tertiaryCta">
          {featuredCtaText(featured.__typename)}{' '}
          <i className={`${styles.arrowIconGreen} fa-kit fa-right-arrow`} aria-hidden="true"></i>
        </p>
      )}
    </header>
  </>
  ) : null;

  return (
    <section className={styles.dataKrewVoiceSection} aria-labelledby={title ? SECTION_HEADING_ID : undefined}>
      <div className="container">
        <div className={styles.dataKrewVoiceContainer}>
          <header className={styles.dataKrewVoiceHeader}>
            {title && (
              <h2
                id={SECTION_HEADING_ID}
                className="sectionTitle"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {description && (
              <div className="sectionDescription" dangerouslySetInnerHTML={{ __html: description }} />
            )}
          </header>

          {(featured || sidebar.length > 0) && (
            <div className={styles.dataKrewVoiceContent}>
              {featured && featuredCardContent && (
                <article className={styles.dataKrewVoiceItem}>
                  {featured.uri ? (
                    <Link
                      href={featured.uri}
                      className={styles.dataKrewVoiceItemLink}
                      external={featured.external}
                      aria-labelledby={featured.title ? featuredTitleId : undefined}
                    >
                      {featuredCardContent}
                    </Link>
                  ) : (
                    featuredCardContent
                  )}
                </article>
              )}

              {sidebar.length > 0 && (
                <ul className={styles.feedList}>
                  {sidebar.map((post, index) => {
                    const imageUrl = post.featuredImage?.node?.mediaItemUrl;
                    const postUri = post.uri ?? '#';
                    const postExternal = post.external ?? isAbsoluteUrl(postUri);
                    const titleId = `datakrew-voice-post-${postKey(post, index)}`;
                    return (
                      <li key={postKey(post, index)} className={styles.feedListItem}>
                        <article>
                          <Link
                            href={postUri}
                            className={styles.feedItem}
                            external={postExternal}
                            aria-labelledby={post.title ? titleId : undefined}
                          >
                            <figure className={styles.thumbnailContainer}>
                              {isVideoPost(post.__typename) && (
                                <i className={`fa-kit fa-play ${styles.playIconSide}`} aria-hidden="true"></i>
                              )}
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={post.featuredImage?.node?.altText ?? post.title ?? ''}
                                  fill
                                  sizes="132px"
                                  style={{ objectFit: 'cover' }}
                                />
                              ) : null}
                            </figure>
                            <div className={styles.feedContent}>
                              <p className={styles.tag}>{postTag(post.__typename)}</p>
                              {post.title && (
                                <h4 id={titleId} className={styles.feedTitle}>
                                  {post.title}
                                </h4>
                              )}
                              {post.date && (
                                <time className={styles.feedDate} dateTime={toDateTimeAttr(post.date)}>
                                  {formatDate(post.date)}
                                </time>
                              )}
                            </div>
                            <span className={styles.arrowIcon} aria-hidden="true">
                              <i className={`${styles.arrowIconInner} fa-kit fa-arrow-two`}></i>
                            </span>
                          </Link>
                        </article>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          <footer className={styles.dataKrewVoiceFooter}>
            <Link className="primaryCta" href={footerHref} external={footerExternal}>
              {footerLabel}
              <i className={`${styles.arrowIconSecondary} fa-kit fa-right-arrow`} aria-hidden="true"></i>
            </Link>
          </footer>
        </div>
      </div>
    </section>
  );
}
