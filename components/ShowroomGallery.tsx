"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Info,
  ExternalLink,
  ShieldCheck,
  Check
} from "lucide-react";
import { showroomPhotos, ShowroomPhoto } from "@/data/showroom";
import { ScrollReveal } from "@/components/ScrollReveal";

type CategoryFilter = "All" | "Showroom Space" | "Display Counter" | "Device Verification";

export const ShowroomGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Touch gesture state for mobile swipe
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtered photo list
  const filteredPhotos = React.useMemo(() => {
    if (selectedCategory === "All") return showroomPhotos;
    return showroomPhotos.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Navigate lightbox next / previous
  const handlePrev = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredPhotos.length - 1 : prev - 1;
    });
  }, [activePhotoIndex, filteredPhotos.length]);

  const handleNext = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => {
      if (prev === null) return null;
      return prev === filteredPhotos.length - 1 ? 0 : prev + 1;
    });
  }, [activePhotoIndex, filteredPhotos.length]);

  const handleClose = useCallback(() => {
    setActivePhotoIndex(null);
  }, []);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhotoIndex, handleClose, handlePrev, handleNext]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left -> show next photo
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> show previous photo
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const activePhoto: ShowroomPhoto | undefined =
    activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : undefined;

  return (
    <section id="gallery" className="py-12 sm:py-16 lg:py-20 relative">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-blue-600 dark:text-cyan-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Showroom Photography</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Curated Showroom Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              Explore authentic high-resolution captures of our display counter setups, iPhone inventory selections, and rigorous pre-handover hardware inspections. Click any photo to inspect in full resolution.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/20 flex-wrap sm:flex-nowrap">
            {(["All", "Showroom Space", "Display Counter", "Device Verification"] as CategoryFilter[]).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setActivePhotoIndex(null);
                  }}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {cat === "All" ? "All Photos" : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid (Editorial & Responsive Masonry-Style Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredPhotos.map((photo, idx) => {
            const isTall = photo.height > photo.width;
            const isVeryHighRes = photo.width >= 4000;

            return (
              <ScrollReveal key={photo.id} delay={idx * 80}>
                <div
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-200 dark:border-cyan-500/20 bg-slate-100 dark:bg-slate-950 transition-all duration-300 hover:shadow-xl hover:border-blue-500/50 dark:hover:border-cyan-400/50 ${
                    idx === 0 && selectedCategory === "All" ? "sm:col-span-2 lg:col-span-2 aspect-[16/10]" : "aspect-[4/3] sm:aspect-[4/4]"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={
                      idx === 0 && selectedCategory === "All"
                        ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                        : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    }
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-black/50 backdrop-blur-md text-cyan-300 border border-white/10">
                      {photo.category}
                    </span>

                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom Caption */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3 sm:p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white">
                    <h3 className="text-xs sm:text-sm font-bold truncate group-hover:text-cyan-300 transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-[11px] text-zinc-300 line-clamp-1 mt-0.5">
                      {photo.subtitle}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Gallery Trust Note */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-blue-500/5 dark:bg-cyan-500/5 border border-blue-500/10 dark:border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>
              All photography represents real devices and actual showroom displays at Theekzu Mobile.
            </span>
          </div>

          <span className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400">
            6 Authentic Photos Available
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN INTERACTIVE LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {mounted && activePhotoIndex !== null && activePhoto && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar: Title, Counter & Close */}
          <div className="flex items-center justify-between text-white z-20 pb-2">
            <div className="flex items-center gap-3 min-w-0 pr-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider flex-shrink-0">
                {activePhoto.category}
              </span>
              <span className="text-xs sm:text-sm font-semibold truncate text-zinc-200">
                {activePhoto.title}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-mono text-zinc-400">
                {activePhotoIndex + 1} / {filteredPhotos.length}
              </span>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close full-screen image viewer"
                className="p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image View Area with Prev/Next buttons */}
          <div
            className="relative flex-1 w-full flex items-center justify-center my-auto min-h-0"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
          >
            {/* Previous Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-4 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md active:scale-90 transition-all shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Active Image container */}
            <div
              className="relative max-w-full max-h-[75vh] w-auto h-auto flex items-center justify-center animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                width={activePhoto.width}
                height={activePhoto.height}
                priority
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="max-h-[75vh] max-w-[90vw] sm:max-w-[85vw] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next photo"
              className="absolute right-2 sm:right-4 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md active:scale-90 transition-all shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Detailed Caption & Navigation Hints */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left z-20 pt-2 border-t border-white/10">
            <div className="text-zinc-300 text-xs sm:text-sm max-w-2xl">
              <span className="font-bold text-white mr-1.5">{activePhoto.title}:</span>
              <span>{activePhoto.subtitle}</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
              <span className="hidden sm:inline">Use Arrow keys &larr; &rarr; to navigate • Esc to close</span>
              <span className="sm:hidden">Swipe left/right to browse</span>
            </div>
          </div>
        </div>,
        document.body
      )}

    </section>
  );
};
