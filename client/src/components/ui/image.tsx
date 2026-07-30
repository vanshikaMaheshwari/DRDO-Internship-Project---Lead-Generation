import { forwardRef, type ImgHTMLAttributes, useEffect, useState } from 'react';
import './image.css';

const FALLBACK_IMAGE_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWEyZSIvPjwvc3ZnPg==';

export type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

/**
 * Plain <img> wrapper (the Wix image transform/CDN pipeline is gone).
 * Kept as a component so existing pages that `import { Image } from
 * '@/components/ui/image'` don't need to change, and so we still get a
 * graceful fallback if a scraped/derived image URL 404s.
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(({ src, ...props }, ref) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src as string | undefined);

  useEffect(() => {
    setImgSrc(src as string | undefined);
  }, [src]);

  if (!imgSrc) {
    return <div data-empty-image ref={ref as any} {...(props as any)} />;
  }

  return (
    <img
      ref={ref}
      src={imgSrc}
      onError={() => setImgSrc(FALLBACK_IMAGE_URL)}
      {...props}
    />
  );
});
Image.displayName = 'Image';
