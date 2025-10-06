import { useEffect, useRef, useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

/**
 * ProductImage component with lazy loading using Intersection Observer
 * Images load when they enter the viewport with a fade-in transition
 */
export const ProductImage = ({ 
  src, 
  alt, 
  className = '',
  onLoad 
}: ProductImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Create intersection observer to detect when image enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <img
      ref={imgRef}
      src={shouldLoad ? src : undefined}
      alt={alt}
      className={`
        transition-opacity duration-300
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
};
