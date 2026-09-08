"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, CheckCircle2, Quote, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { customerReviews } from "@/data/reviews";
import { ScrollReveal } from "@/components/ScrollReveal";

export const CustomerReviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-play slowly every 5 seconds, pauses on mouse hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % customerReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? customerReviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % customerReviews.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    } else if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
  };

  return (
    <section className="container-custom transition-colors duration-300">
      <ScrollReveal direction="up">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-xs font-bold tracking-widest text-blue-700 dark:text-cyan-400 uppercase shadow-xs">
            <Sparkles className="w-3 h-3" /> Real Client Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-3">
            What Our Customers Say
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-2">
            Read genuine experiences from iPhone buyers across all 25 districts in Sri Lanka.
          </p>
        </div>
      </ScrollReveal>

      {/* Carousel Container */}
      <div
        className="relative max-w-4xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Review Card */}
        <div className="glass-card-glow rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 border border-slate-200 dark:border-cyan-500/25 shadow-xl relative overflow-hidden transition-all duration-500">
          
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between min-h-[180px] sm:min-h-[200px]">
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex text-amber-500 dark:text-amber-400 gap-1">
                  {Array.from({ length: customerReviews[currentIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {customerReviews[currentIndex].verified && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Purchase
                  </span>
                )}
              </div>

              <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500/30 dark:text-cyan-500/30 mb-2 sm:mb-3" />

              <p className="text-sm sm:text-lg md:text-xl text-slate-800 dark:text-zinc-200 italic leading-relaxed font-normal">
                "{customerReviews[currentIndex].reviewText}"
              </p>
            </div>

            <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-slate-200 dark:border-cyan-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {customerReviews[currentIndex].name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  {customerReviews[currentIndex].location} • Purchased{" "}
                  <span className="text-blue-600 dark:text-cyan-400 font-semibold">
                    {customerReviews[currentIndex].productBought}
                  </span>
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={prevSlide}
                  className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/20 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:border-blue-400 transition-colors active:scale-95 shadow-xs"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/20 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:border-blue-400 transition-colors active:scale-95 shadow-xs"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Indicators Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {customerReviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-cyan-400 dark:to-blue-600"
                  : "w-2 bg-slate-300 dark:bg-slate-800 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
