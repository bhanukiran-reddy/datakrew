"use client";
import { useState } from 'react';
import NextImage from 'next/image';
import type { ImageProps as NextImageProps } from 'next/image';
import type { CMSImage } from '@/lib/types/cms';

/**
 * Default sizes policy: full width on mobile, constrained on larger breakpoints.
 * Override with the sizes prop when the image is in a known layout (e.g. sidebar).
 */
const DEFAULT_SIZES = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px';

/** Props: either pass a CMS image object or standard next/image props. */
type CMSImageProps = {
  image: CMSImage;
  /** Override alt from CMS. */
  alt?: string;
  fill?: boolean;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  /** Responsive sizes (default: full width on mobile, ~1200px max on desktop). */
  sizes?: string;
  className?: string;
};

type StandardProps = Omit<NextImageProps, 'alt'> & {
  image?: never;
  alt: string;
};

type ImageComponentProps = CMSImageProps | StandardProps;

/**
 * Image component — wraps next/image with CMS image support.
 * Features a "Slow Reveal" effect (Fade-in + Smooth Blur removal).
 * Reveal effect is disabled for priority (LCP) images to ensure immediate visibility.
 */
export default function Image(props: ImageComponentProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const quality = 100;

  // Disable reveal effect for priority images (LCP optimization)
  const isPriority = props.priority === true;

  // CSS for the reveal effect
  const revealStyle: React.CSSProperties = isPriority ? {
    opacity: 1,
    filter: 'none',
  } : {
    opacity: isLoaded ? 1 : 0,
    filter: isLoaded ? 'blur(0px)' : 'blur(10px)',
    transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), filter 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'opacity, filter',
  };

  if ('image' in props && props.image) {
    if (!props.image.url) return null;
    const { image, alt, fill, priority, fetchPriority, sizes, className } = props;
    
    return (
      <div 
        style={{ 
          position: fill ? 'absolute' : 'relative',
          width: fill ? '100%' : '100%', 
          height: fill ? '100%' : 'auto',
          overflow: 'hidden' 
        }}
        className={className}
      >
        <NextImage
          src={image.url}
          alt={alt ?? image.alt}
          width={fill ? undefined : (image.width || 800)}
          height={fill ? undefined : (image.height || 600)}
          fill={fill}
          priority={priority}
          fetchPriority={fetchPriority}
          sizes={sizes ?? DEFAULT_SIZES}
          quality={quality}
          onLoad={() => setIsLoaded(true)}
          style={{ ...revealStyle, objectFit: fill ? 'cover' : undefined }}
        />
      </div>
    );
  }

  // Standard next/image passthrough
  const { image: _omit, ...rest } = props as StandardProps & { image?: never };
  void _omit;
  
  return (
    <div style={{ position: rest.fill ? 'absolute' : 'relative', overflow: 'hidden' }} className={rest.className}>
      <NextImage 
        {...rest}
        quality={rest.quality ?? quality} 
        onLoad={(e) => {
          setIsLoaded(true);
          if (rest.onLoad) rest.onLoad(e);
        }}
        style={{ ...rest.style, ...revealStyle }}
      />
    </div>
  );
}

