import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

// A guaranteed valid placeholder image
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";

function getValidImageUrl(url: string | undefined | null): string {
  // Return placeholder for empty/invalid input
  if (!url || typeof url !== "string" || url.trim() === "") {
    return PLACEHOLDER_IMAGE;
  }

  const cleanUrl = url.trim();

  // Already absolute URL (http/https) - validate it
  if (cleanUrl.startsWith("https://") || cleanUrl.startsWith("http://")) {
    try {
      new URL(cleanUrl);
      return cleanUrl;
    } catch {
      return PLACEHOLDER_IMAGE;
    }
  }

  // Data URL - use as-is
  if (cleanUrl.startsWith("data:")) {
    return cleanUrl;
  }

  // Relative path - prepend base URL if available
  if (cleanUrl.startsWith("/")) {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
    if (baseUrl && baseUrl.trim() !== "") {
      const combined = `${baseUrl}${cleanUrl}`;
      try {
        new URL(combined);
        return combined;
      } catch {
        return PLACEHOLDER_IMAGE;
      }
    }
    // If no base URL, return the relative path (Next.js will handle it)
    return cleanUrl;
  }

  // Invalid format - use placeholder
  return PLACEHOLDER_IMAGE;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc,
  width = 300,
  height = 300,
  fill = false,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(() => getValidImageUrl(src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const validSrc = getValidImageUrl(src);
    setImgSrc(validSrc);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Try fallback first, then placeholder
      const fallback = getValidImageUrl(fallbackSrc);
      setImgSrc(fallback !== PLACEHOLDER_IMAGE ? fallback : PLACEHOLDER_IMAGE);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt || "Image"}
      className={className}
      onError={handleError}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      unoptimized
    />
  );
}
