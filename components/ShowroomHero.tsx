"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShieldCheck, Sparkles, ArrowRight, Eye, CheckCircle2 } from "lucide-react";
import { getWhatsAppUrl } from "@/config/store";

export const ShowroomHero: React.FC = () => {
  const whatsappUrl = getWhatsAppUrl(
    "Hello Theekzu Mobile! I would like to inquire about visiting your showroom or checking available iPhone stock."
  );

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pb-20">
      {/* Background ambient neon glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/15 to-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Badges */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-blue-600 dark:text-cyan-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 animate-pulse" />
              <span>Official Theekzu Mobile Showroom</span>
              <span className="w-1 h-1 rounded-full bg-blue-400 dark:bg-cyan-400" />
              <span className="text-slate-500 dark:text-zinc-400 font-medium">Sri Lanka</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Experience Authentic Apple Innovation Up Close
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Welcome to the official Theekzu Mobile showroom gallery. Discover genuine Apple iPhones displayed in pristine condition, verified retail collections, and transparent device diagnostics tailored for discerning Sri Lankan tech enthusiasts.
            </p>

            {/* Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>100% Genuine Apple stock</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Live device display counters</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>On-the-spot battery verification</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Instant WhatsApp support</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="#gallery"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/20 text-slate-800 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:border-blue-500 dark:hover:border-cyan-400 active:scale-95 transition-all shadow-xs"
              >
                <Eye className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>Explore Photo Gallery</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Right Column: Hero Showroom Image with Premium Presentation */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-none">
              {/* Backlight halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-blue-600/30 to-purple-600/20 rounded-3xl blur-2xl -z-10 scale-95" />

              <div className="glass-card rounded-3xl p-2.5 sm:p-3 border border-slate-200 dark:border-cyan-500/30 shadow-2xl overflow-hidden bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl group">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-900">
                  <Image
                    src="/showroom/showroom-main-apple-flag.jpg"
                    alt="Theekzu Mobile showroom main desk featuring illuminated Apple logo, Sri Lankan national flag, and retail iPhone collections"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Overlaid caption badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                        Live Showroom Interior
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold truncate">
                      Illuminated Apple Brand Wall &amp; Display Counter
                    </p>
                    <p className="text-[11px] text-zinc-300 line-clamp-1 mt-0.5">
                      Showcasing premium Apple iPhone series with authentic warranty
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Quality Badge */}
              <div className="absolute -bottom-4 -left-3 sm:-left-6 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 shadow-xl flex items-center gap-3 backdrop-blur-xl">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Sri Lanka Certified</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">100% Genuine Devices</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
