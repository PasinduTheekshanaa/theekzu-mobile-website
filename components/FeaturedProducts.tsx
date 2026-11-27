"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";

import { ScrollReveal } from "@/components/ScrollReveal";

export const FeaturedProducts: React.FC = () => {
  const { products, isLoading, catalogError } = useProducts();
  const track = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ start: 0, visible: 4, previous: false, next: false });
  const featuredIphones = React.useMemo(() => {
    const models = ["iphone-14-pro-max", "iphone-15-pro-max", "iphone-16-pro-max", "iphone-17-pro-max", "iphone-14-pro", "iphone-15-pro", "iphone-16-pro", "iphone-17-pro"];
    return models.flatMap(slug => {
      const product = products.find(p => p.category === "iphones" && p.slug === slug);
      return product ? [product] : [];
    });
  }, [products]);

  const updatePosition = React.useCallback(() => {
    const element = track.current;
    const card = element?.firstElementChild as HTMLElement | null;
    if (!element || !card) return;
    const step = card.offsetWidth + parseFloat(getComputedStyle(element).columnGap || "0");
    setPosition({
      start: Math.round(element.scrollLeft / step),
      visible: Math.max(1, Math.round(element.clientWidth / step)),
      previous: element.scrollLeft > 2,
      next: element.scrollLeft + element.clientWidth < element.scrollWidth - 2,
    });
  }, []);

  React.useEffect(() => {
    updatePosition();
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(updatePosition);
    observer.observe(element);
    return () => observer.disconnect();
  }, [featuredIphones.length, updatePosition]);

  const scrollProducts = (direction: number) => {
    const element = track.current;
    const card = element?.firstElementChild as HTMLElement | null;
    if (!element || !card) return;
    const step = card.offsetWidth + parseFloat(getComputedStyle(element).columnGap || "0");
    element.scrollBy({ left: direction * step * position.visible, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section id="featured-iphones" className="container-custom transition-colors duration-300 pb-2 sm:pb-4">
      {(isLoading || catalogError || products.length === 0) && <p role="status" className="py-6 text-center">{isLoading ? "Loading products…" : catalogError ? "Products are temporarily unavailable. Please try again shortly." : "No products are currently available."}</p>}
      <ScrollReveal direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-4">
          <div>
            <h2 
              className="font-black text-ink dark:text-ink mt-1 leading-[1.1]"
              style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}
            >
              Featured iPhones
            </h2>
            <p className="max-w-full text-ink dark:text-ink text-sm sm:text-base leading-[1.6] mt-1.5">
              Discover our latest flagship and most popular certified Apple smartphones.
            </p>
          </div>

          <div className="pt-1 md:pt-0">
            <Link
              href="/iphones"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-ink dark:text-ink hover:text-ink dark:hover:text-ink transition-colors min-h-[44px] items-center"
            >
              <span>View All iPhones</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up">
        <div ref={track} id="featured-iphone-carousel" className="featured-product-track" role="region" aria-label="Featured iPhones carousel" tabIndex={0} onScroll={updatePosition}
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault(); scrollProducts(event.key === "ArrowRight" ? 1 : -1);
            }
          }}>
          {featuredIphones.map(product => (
            <div key={product.id} className="min-w-0 snap-start [&>.product-card]:h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {featuredIphones.length > 0 && <div className="mt-1 flex items-center justify-between gap-4">
          <p className="text-xs text-neutral-500" aria-live="polite" aria-atomic="true">{position.start + 1}–{Math.min(featuredIphones.length, position.start + position.visible)} of {featuredIphones.length} iPhones</p>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous featured iPhones" aria-controls="featured-iphone-carousel" disabled={!position.previous} onClick={() => scrollProducts(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white transition-colors hover:bg-neutral-100 disabled:opacity-30"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
            <button type="button" aria-label="Next featured iPhones" aria-controls="featured-iphone-carousel" disabled={!position.next} onClick={() => scrollProducts(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white transition-colors hover:bg-neutral-100 disabled:opacity-30"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
          </div>
        </div>}
      </ScrollReveal>
    </section>
  );
};
