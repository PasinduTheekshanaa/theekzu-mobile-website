"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src" | "unoptimized"> & { src: string };

// Prefer Next's small responsive images, but retain the original public image
// when an optimizer request cannot reach Supabase Storage.
export function ResilientProductImage({ src, onError, ...props }: Props) {
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);

  return (
    <Image
      {...props}
      src={src}
      unoptimized={fallbackSrc === src}
      onError={(event) => {
        if (src.startsWith("http") && fallbackSrc !== src) {
          setFallbackSrc(src);
        } else {
          onError?.(event);
        }
      }}
    />
  );
}
