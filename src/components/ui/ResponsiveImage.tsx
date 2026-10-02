import React from "react";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  priority?: boolean;
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
  const finalLoading = priority ? "eager" : loading ?? "lazy";

  return (
    // fetchPriority is supported in modern browsers; React accepts camelCase
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes}
      loading={finalLoading}
      decoding={decoding}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      {...(rest as any)}
    />
  );
}

export default ResponsiveImage;
