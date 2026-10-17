"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Tag, ArrowRight, Zap, Flame, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export const SpecialOffers: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, mins: 45, secs: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) {
          return { ...prev, secs: prev.secs - 1 };
        } else if (prev.mins > 0) {
          return { ...prev, mins: 59, secs: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const offers = [
    {
      title: "Weekend iPhone Deals",
      description: "Exclusive discounts up to Rs. 40,000 on flagship iPhone 15 & 16 models.",
      badge: "Save Up to 12%",
      icon: Flame,
      href: "/offers",
      borderColor: "border-neutral-200 dark:border-neutral-500/30 hover:border-neutral-500",
      tagColor: "text-ink dark:text-ink bg-canvas border-neutral-500/30",
      iconColor: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
    },
    {
      title: "Trade-In Super Bonus",
      description: "Get up to Rs. 25,000 additional valuation when trading in your old iPhone for iPhone 16.",
      badge: "Extra Valuation",
      icon: Sparkles,
      href: "/trade-in",
      borderColor: "border-neutral-200 dark:border-neutral-500/30 hover:border-neutral-500 dark:hover:border-neutral-400",
      tagColor: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/30 dark:border-neutral-500/30",
      iconColor: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
    },
    {
      title: "Apple Audio Bundle",
      description: "Buy any iPhone and get 25% off genuine AirPods Pro 2 or Apple 20W Fast Charger.",
      badge: "Bundle & Save",
      icon: Zap,
      href: "/accessories",
      borderColor: "border-neutral-200 dark:border-neutral-500/30 hover:border-neutral-500",
      tagColor: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/30",
      iconColor: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
    },
    {
      title: "Certified Used Drops",
      description: "Pristine Grade A+ pre-owned iPhones with 6 months warranty at rock-bottom prices.",
      badge: "Limited Units",
      icon: Tag,
      href: "/iphones?type=used",
      borderColor: "border-neutral-200 dark:border-neutral-500/30 hover:border-neutral-500",
      tagColor: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/30",
      iconColor: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
    },
  ];

  return (
    <section className="container-custom transition-colors duration-300">
      <ScrollReveal direction="up">
        <div className="rounded-2xl sm:rounded-[2.5rem] bg-canvas       border border-neutral-200/80 dark:border-neutral-500/30 p-5 sm:p-8 md:p-12 relative overflow-hidden shadow-lg dark:shadow-[0_0_50px_rgba(91,91,91,0.2)]">
        
        {/* Glow Flares */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-canvas dark:bg-canvas rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-canvas dark:bg-canvas rounded-full blur-[100px] pointer-events-none" />

        {/* Header with Countdown */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-neutral-200 dark:border-neutral-500/20 relative z-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/30 text-ink dark:text-ink text-xs font-bold mb-3 shadow-xs">
              <Flame className="w-4 h-4 text-ink dark:text-ink animate-pulse" /> Limited Time Weekend Specials
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink dark:text-ink">
              Special Offers & Exclusive Deals
            </h2>
            <p className="text-ink dark:text-ink text-xs sm:text-sm mt-1">
              Save big on authentic iPhones, trade-in vouchers, and original Apple bundled accessories.
            </p>
          </div>

          {/* Countdown Blocks */}
          <div className="flex items-center gap-1.5 sm:gap-3 bg-canvas dark:bg-canvas p-2.5 sm:p-3 rounded-2xl border border-neutral-200 dark:border-neutral-500/30 shadow-md">
            <div className="text-center">
              <div className="w-11 sm:w-14 h-11 sm:h-14 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/30 flex items-center justify-center text-base sm:text-xl font-black text-ink dark:text-ink shadow-inner">
                {String(timeLeft.days).padStart(2, "0")}
              </div>
              <span className="text-[9px] text-ink dark:text-ink uppercase tracking-wider font-bold mt-1 block">
                Days
              </span>
            </div>
            <span className="text-base sm:text-lg font-bold text-ink dark:text-ink">:</span>
            <div className="text-center">
              <div className="w-11 sm:w-14 h-11 sm:h-14 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/30 flex items-center justify-center text-base sm:text-xl font-black text-ink dark:text-ink shadow-inner">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <span className="text-[9px] text-ink dark:text-ink uppercase tracking-wider font-bold mt-1 block">
                Hours
              </span>
            </div>
            <span className="text-base sm:text-lg font-bold text-ink dark:text-ink">:</span>
            <div className="text-center">
              <div className="w-11 sm:w-14 h-11 sm:h-14 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/30 flex items-center justify-center text-base sm:text-xl font-black text-ink dark:text-ink shadow-inner">
                {String(timeLeft.mins).padStart(2, "0")}
              </div>
              <span className="text-[9px] text-ink dark:text-ink uppercase tracking-wider font-bold mt-1 block">
                Mins
              </span>
            </div>
            <span className="text-base sm:text-lg font-bold text-ink dark:text-ink">:</span>
            <div className="text-center">
              <div className="w-11 sm:w-14 h-11 sm:h-14 rounded-xl bg-canvas dark:bg-canvas border border-neutral-500/30 flex items-center justify-center text-base sm:text-xl font-black text-ink dark:text-ink shadow-xs">
                {String(timeLeft.secs).padStart(2, "0")}
              </div>
              <span className="text-[9px] text-ink dark:text-ink uppercase tracking-wider font-bold mt-1 block">
                Secs
              </span>
            </div>
          </div>
        </div>

        {/* 4 Offers Cards with Animated Shine */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
          {offers.map((offer) => {
            const Icon = offer.icon;
            return (
              <Link
                key={offer.title}
                href={offer.href}
                className={`glass-card p-6 rounded-[2rem] border ${offer.borderColor} flex flex-col justify-between group block transition-all duration-300 hover:-translate-y-1.5 shadow-xs hover:shadow-xl relative overflow-hidden`}
              >
                {/* Subtle animated shine line on card hover */}
                <div className="absolute -inset-x-full top-0 h-full w-1/2 bg-canvas     skew-x-12 group-hover:animate-shine pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${offer.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span data-ui="offer-badge" className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${offer.tagColor}`}>
                      {offer.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-ink dark:text-ink group-hover:text-ink dark:group-hover:text-ink transition-colors mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-ink dark:text-ink leading-relaxed mb-6">
                    {offer.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-ink dark:text-ink group-hover:text-ink dark:group-hover:text-ink transition-colors">
                  <span>Explore Deal</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
};
