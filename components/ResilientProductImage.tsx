"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src" | "unoptimized"> & { src: string };

// Supabase photos use the storage CDN directly: avoid a slow optimizer
// request followed by a second download when the optimizer times out.
export function ResilientProductImage({ src, onError, ...props }: Props) {
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);

  return (
    <Image
      {...props}
      src={src}
      unoptimized={src.startsWith("http") || fallbackSrc === src}
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
