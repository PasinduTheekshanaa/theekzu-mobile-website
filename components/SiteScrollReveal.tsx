"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const selector = [
  "section",
  "article",
  ".container-custom > :not(.grid)",
  ".container-custom > .grid > *",
  ".product-card",
  ".glass-card",
  ".glass-panel",
  "h2",
  "h3",
].join(", ");

export function SiteScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("main[data-site-content]");
    if (!main || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    const seen = new Set<HTMLElement>();
    const pending = new Set<HTMLElement>();
    const reveal = (element: HTMLElement) => {
      element.classList.remove("site-reveal-pending");
      element.classList.add("site-reveal-visible");
      pending.delete(element);
      observer?.unobserve(element);
    };
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            reveal(entry.target as HTMLElement);
          }
        }, { rootMargin: "0px 0px 80px 0px", threshold: 0.02 })
      : null;

    let frame = 0;
    const scan = () => {
      frame = 0;
      const footer = document.querySelector<HTMLElement>("footer");
      const candidates = [...main.querySelectorAll<HTMLElement>(selector), ...(footer ? [footer] : [])];
      for (const element of candidates) {
        if (seen.has(element)) continue;
        seen.add(element);
        if (
          !observer ||
          element.closest("[data-scroll-reveal], [role='dialog'], [aria-modal='true']") ||
          (element.matches("section, .container-custom > :not(.grid)") && element.querySelector(".glass-card, .product-card, [data-scroll-reveal]")) ||
          (element.matches("h2, h3") && element.closest(".site-reveal, .glass-card, .glass-panel, .product-card")) ||
          (element.matches(".container-custom > .grid > *") && element.querySelector(".product-card")) ||
          element.matches("[hidden], [aria-hidden='true']") ||
          ["fixed", "sticky"].includes(window.getComputedStyle(element).position) ||
          element.getBoundingClientRect().height === 0
        ) continue;

        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight + 80) continue;
        element.classList.add("site-reveal", "site-reveal-pending");
        pending.add(element);
        observer.observe(element);
      }
    };
    const revealPassed = () => {
      for (const element of pending) {
        if (element.getBoundingClientRect().bottom <= 0) reveal(element);
      }
    };
    const scheduleScan = () => {
      if (!frame) frame = window.requestAnimationFrame(() => {
        scan();
        revealPassed();
      });
    };

    scan();
    const mutations = new MutationObserver(scheduleScan);
    mutations.observe(main, { childList: true, subtree: true });
    window.addEventListener("scroll", scheduleScan, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      mutations.disconnect();
      window.removeEventListener("scroll", scheduleScan);
      observer?.disconnect();
      seen.forEach((element) => element.classList.remove("site-reveal-pending"));
    };
  }, [pathname]);

  return null;
}
