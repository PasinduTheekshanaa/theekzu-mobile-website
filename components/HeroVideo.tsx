"use client";

import { useEffect, useState } from "react";

export function HeroVideo() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      } else {
        timer = setTimeout(() => setReady(true), 200);
      }
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, []);

  return <video
    className="absolute inset-0 h-full w-full object-cover transform-gpu brightness-100 contrast-120 saturate-115 dark:brightness-110 dark:contrast-110 dark:saturate-110 motion-reduce:hidden"
    src={ready ? "/theekzu-hero.mp4" : undefined}
    autoPlay muted loop playsInline preload="none"
    aria-label="Theekzu Mobile brand video"
  />;
}
