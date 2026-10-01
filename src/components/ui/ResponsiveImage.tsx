```tsx name=src/components/ui/ResponsiveImage.tsx
import React from "react";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  priority?: boolean; // إذا true => fetchpriority=high and loading=eager
}

export function ResponsiveImage({
  src,
  alt,
  srcSet,
  sizes,
  priority = false,
  loading,
  decoding = "async",
  className,
  ...rest
}: ResponsiveImageProps) {
  // if priority explicitly set, mark eager and fetchpriority
  const finalLoading = priority ? "eager" : loading ?? "lazy";
  return (
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes}
      loading={finalLoading}
      decoding={decoding}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      {...rest}
    />
  );
}

export default ResponsiveImage;
