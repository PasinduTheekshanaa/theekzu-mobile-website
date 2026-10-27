"use client";

import { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ResilientProductImage } from "@/components/ResilientProductImage";

const imageSize = { width: 420, height: 420, sizes: "(max-width: 480px) calc(100vw - 64px), 420px" };

export function ProductGalleryImage({ src, alt, colorImages }: { src: string; alt: string; colorImages: string[] }) {
  const [displayed, setDisplayed] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const requests = useRef(new Map<string, Promise<void>>());

  const prepare = useCallback((url: string) => {
    const existing = requests.current.get(url);
    if (existing) return existing;
    const image = new window.Image();
    image.decoding = "async";
    try {
      const { props } = getImageProps({ src: url, alt: "", ...imageSize });
      image.sizes = props.sizes || "";
      image.srcset = props.srcSet || "";
      image.src = props.src;
    } catch {
      image.src = url;
    }
    const request = image.decode().catch(async (error) => {
      if (url.startsWith("http") && image.src !== url) {
        image.srcset = "";
        image.src = url;
        await image.decode();
        return;
      }
      throw error;
    }).catch((error) => {
      requests.current.delete(url);
      throw error;
    });
    requests.current.set(url, request);
    return request;
  }, []);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    if (src !== displayed) {
      void prepare(src).then(() => {
        if (!cancelled) setDisplayed(src);
      }).catch(() => {
        if (!cancelled) setFailed(true);
      });
    }
    return () => { cancelled = true; };
  }, [src, displayed, prepare]);

  useEffect(() => {
    if (!loaded) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection?.saveData || connection?.effectiveType?.includes("2g")) return;
    let cancelled = false;
    // Warm only this product's color photos, one at a time after the main
    // image loads, without competing with the initial page image.
    void (async () => {
      for (const url of colorImages) {
        if (cancelled) return;
        try { await prepare(url); } catch { /* A selected image can retry. */ }
      }
    })();
    return () => { cancelled = true; };
  }, [loaded, colorImages, prepare]);

  return <>
    <ResilientProductImage src={displayed} alt={alt} {...imageSize} priority
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className="max-h-full max-w-full object-contain" />
    {failed && <span role="status" className="absolute bottom-2 left-4 right-4 text-center text-xs bg-canvas text-ink">Selected photo could not load. Please try again.</span>}
  </>;
}
