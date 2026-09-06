"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Tag, Award, Zap } from "lucide-react";
import { storeConfig } from "@/config/store";
import { AnimatedRobotHero } from "@/components/AnimatedRobotHero";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[80vh] lg:min-h-[85vh] flex items-center pt-4 sm:pt-6 pb-12 sm:pb-16 overflow-hidden radial-glow-hero tech-grid-bg transition-colors duration-300 w-full">
      {/* Ambient background glow blooms */}
      <div className="absolute -top-32 -left-32 w-72 sm:w-[32rem] h-72 sm:h-[32rem] bg-gradient-to-br from-blue-600/15 via-cyan-500/10 to-transparent dark:from-blue-600/25 dark:via-cyan-500/20 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-72 sm:w-[36rem] h-72 sm:h-[36rem] bg-gradient-to-tr from-cyan-500/15 via-purple-600/10 to-transparent dark:from-cyan-500/25 dark:via-purple-600/20 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-64 sm:w-[28rem] h-64 sm:h-[28rem] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

      <div className="container-custom w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* LEFT: Copy, Fluid Headline, Subheading, Responsive CTAs, Trust Cards */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
            
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 text-[11px] sm:text-xs font-bold text-blue-700 dark:text-cyan-300 shadow-sm dark:shadow-[0_0_20px_rgba(0,210,255,0.25)] max-w-full">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 dark:bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-600 dark:bg-cyan-500"></span>
              </span>
              <span className="tracking-wide truncate">Official Brand New & Certified iPhones • Sri Lanka</span>
            </div>

            {/* Main Fluid Headline */}
            <h1 
              className="font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white break-words"
              style={{ fontSize: "clamp(2.1rem, 6.5vw, 4.5rem)" }}
            >
              Upgrade Your World with <br className="hidden sm:inline" />
              <span className="text-gradient-chrome">Theekzu</span>{" "}
              <span className="text-gradient-neon drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(0,180,255,0.45)]">Mobile</span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover authentic Apple iPhones, original accessories and exclusive deals with trusted Sri Lanka warranty and instant WhatsApp ordering.
            </p>

            {/* Action Buttons: Stacks cleanly on mobile, side-by-side on sm+ */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2 w-full">
              <Link
                href="/iphones"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 dark:from-cyan-500 dark:via-blue-600 dark:to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 dark:shadow-[0_0_30px_rgba(0,102,255,0.5)] active:scale-[0.98] transition-all min-h-[44px]"
              >
                <span>Shop iPhones</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to know more about your available iPhones.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 dark:shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-[0.98] transition-all min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Trust Feature Cards: 2 cols on mobile/tablet, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 pt-5 sm:pt-6 border-t border-slate-200 dark:border-cyan-500/20 w-full">
              <div className="glass-card p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3 shadow-xs min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white truncate">Quality Checked</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 truncate">32-Point Tested</p>
                </div>
              </div>

              <div className="glass-card p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3 shadow-xs min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white truncate">Best Prices</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 truncate">Transparent LKR</p>
                </div>
              </div>

              <div className="glass-card p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3 shadow-xs min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white truncate">Trusted Service</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 truncate">Verified Seller</p>
                </div>
              </div>

              <div className="glass-card p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3 shadow-xs min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white truncate">Fast Support</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 truncate">8 AM – 8 PM Daily</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Animated Futuristic Robot Assistant holding an iPhone */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-2 sm:pt-4 lg:pt-0 w-full overflow-hidden sm:overflow-visible">
            <AnimatedRobotHero />
          </div>

        </div>
      </div>
    </section>
  );
};
