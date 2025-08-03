// Image optimization utilities
interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  lazy?: boolean;
}

export class ImageOptimizer {
  private static canvas: HTMLCanvasElement | null = null;
  private static ctx: CanvasRenderingContext2D | null = null;

  private static getCanvas(): HTMLCanvasElement {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
    return this.canvas;
  }

  static async optimizeImage(
    src: string,
    options: ImageOptimizationOptions = {}
  ): Promise<string> {
    const {
      quality = 0.8,
      format = 'webp',
      width,
      height
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = this.getCanvas();
        const ctx = this.ctx!;

        // Calculate dimensions
        const targetWidth = width || img.naturalWidth;
        const targetHeight = height || img.naturalHeight;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw and compress
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        const optimizedDataUrl = canvas.toDataURL(
          `image/${format}`,
          quality
        );
        
        resolve(optimizedDataUrl);
      };

      img.onerror = reject;
      img.src = src;
    });
  }

  static createResponsiveImageSrcSet(
    baseSrc: string,
    sizes: number[] = [320, 480, 768, 1024, 1200]
  ): string {
    return sizes
      .map(size => `${baseSrc}?w=${size} ${size}w`)
      .join(', ');
  }

  static createImageSizes(breakpoints: Record<string, string>): string {
    return Object.entries(breakpoints)
      .map(([mediaQuery, size]) => `${mediaQuery} ${size}`)
      .join(', ');
  }
}

// React component for optimized images
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  optimization?: ImageOptimizationOptions;
  fallback?: string;
  responsive?: boolean;
  sizes?: number[];
  breakpoints?: Record<string, string>;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  optimization = {},
  fallback,
  responsive = true,
  sizes = [320, 480, 768, 1024, 1200],
  breakpoints = {
    '(max-width: 768px)': '100vw',
    '(max-width: 1024px)': '50vw',
    '(max-width: 1200px)': '33vw',
  },
  loading = 'lazy',
  ...props
}) => {
  const [optimizedSrc, setOptimizedSrc] = React.useState<string>(src);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    if (optimization.quality || optimization.format || optimization.width || optimization.height) {
      ImageOptimizer.optimizeImage(src, optimization)
        .then((optimized) => {
          if (mounted) {
            setOptimizedSrc(optimized);
          }
        })
        .catch((err) => {
          console.warn('Image optimization failed:', err);
          if (mounted) {
            setOptimizedSrc(src); // Fall back to original
          }
        });
    }

    return () => {
      mounted = false;
    };
  }, [src, optimization]);

  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setError(true);
    setIsLoading(false);
    if (fallback) {
      setOptimizedSrc(fallback);
    }
  };

  const imgProps = {
    ...props,
    src: optimizedSrc,
    alt,
    loading,
    onLoad: handleLoad,
    onError: handleError,
  };

  if (responsive) {
    imgProps.srcSet = ImageOptimizer.createResponsiveImageSrcSet(optimizedSrc, sizes);
    imgProps.sizes = ImageOptimizer.createImageSizes(breakpoints);
  }

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        {...imgProps}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${props.className || ''}`}
      />
      {error && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// Lazy loading intersection observer hook
export function useLazyLoading(threshold = 0.1) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isIntersecting] as const;
}

// Image preloading utility
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Batch image preloading
export async function preloadImages(srcs: string[]): Promise<void> {
  try {
    await Promise.all(srcs.map(preloadImage));
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
}