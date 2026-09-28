"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Tag, Award, Zap } from "lucide-react";
import { storeConfig } from "@/config/store";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-0 md:min-h-[65vh] lg:min-h-[70vh] flex items-center pt-2 sm:pt-4 md:pt-6 pb-6 sm:pb-10 md:pb-16 overflow-hidden radial-glow-hero tech-grid-bg transition-colors duration-300 w-full cursor-glow-area">
      {/* Ambient background glow blooms */}
      <div className="absolute -top-32 -left-32 w-72 sm:w-[32rem] h-72 sm:h-[32rem] bg-gradient-to-br from-blue-600/15 via-cyan-500/10 to-transparent dark:from-blue-600/25 dark:via-cyan-500/20 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none animate-glow-breathe" />
      <div className="absolute top-1/4 -right-20 w-72 sm:w-[36rem] h-72 sm:h-[36rem] bg-gradient-to-tr from-cyan-500/15 via-purple-600/10 to-transparent dark:from-cyan-500/25 dark:via-purple-600/20 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none animate-glow-breathe [animation-delay:2s]" />
      <div className="absolute -bottom-24 left-1/3 w-64 sm:w-[28rem] h-64 sm:h-[28rem] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

      <div className="container-custom w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Content Column */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-4 sm:space-y-5 md:space-y-6 pt-1 md:pt-0">
            
            {/* Announcement Badge */}
            <div className="hero-animate-1 inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 text-[11px] sm:text-xs font-bold text-blue-700 dark:text-cyan-300 shadow-sm dark:shadow-[0_0_20px_rgba(0,210,255,0.25)] max-w-full">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 dark:bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-600 dark:bg-cyan-500"></span>
              </span>
              <span className="tracking-wide truncate">Official Brand New &amp; Certified iPhones • Sri Lanka</span>
            </div>

            {/* Single Primary H1 */}
            <h1
              className="hero-animate-2 font-black tracking-tight leading-[0.98] sm:leading-[1.05] md:leading-[1.08] text-slate-900 dark:text-white break-words"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
            >
              Upgrade Your World with <br className="hidden sm:inline" />
              <span className="text-gradient-chrome">Theekzu</span>{" "}
              <span className="text-gradient-neon drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(0,180,255,0.45)]">Mobile</span>
              <span className="sr-only"> - Premium iPhone Store in Sri Lanka</span>
            </h1>

            {/* Subheading */}
            <p className="hero-animate-3 text-[15px] sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-normal leading-[1.6] md:leading-relaxed max-w-xl mx-auto md:mx-0">
              Discover authentic Apple iPhones, original accessories and exclusive deals with trusted Sri Lanka warranty and instant WhatsApp ordering.
            </p>

            {/* Action Buttons */}
            <div className="hero-animate-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2 w-full">
              <Link
                href="/iphones"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 dark:from-cyan-500 dark:via-blue-600 dark:to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-600/25 dark:shadow-[0_0_30px_rgba(0,102,255,0.5)] active:scale-[0.98] transition-all min-h-[44px] btn-press group"
              >
                <span>Shop iPhones</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <a
                href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to know more about your available iPhones.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-bold shadow-md shadow-emerald-500/20 dark:shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-[0.98] transition-all min-h-[44px] btn-press group"
              >
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Trust Feature Cards */}
            <div className="hero-animate-5 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-6 border-t border-slate-200 dark:border-cyan-500/20 w-full">
              <div className="glass-card p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-xs min-w-0 text-left">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white leading-snug">Quality Checked</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 leading-snug">32-Point Tested</p>
                </div>
              </div>

              <div className="glass-card p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-xs min-w-0 text-left">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white leading-snug">Best Prices</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 leading-snug">Transparent LKR</p>
                </div>
              </div>

              <div className="glass-card p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-xs min-w-0 text-left">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white leading-snug">Trusted Service</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 leading-snug">Verified Seller</p>
                </div>
              </div>

              <div className="glass-card p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-xs min-w-0 text-left">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white leading-snug">Fast Support</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 leading-snug">8 AM – 8 PM Daily</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Theekzu brand film */}
          <div className="md:col-span-5 relative flex items-center justify-center w-full hero-animate-img pt-2 md:pt-0">
            <div className="relative w-full max-w-[360px] lg:max-w-[400px] aspect-[4/3] md:aspect-[4/5] overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 shadow-xl shadow-blue-950/20 group">
              <video
                className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Theekzu Mobile brand video"
              >
                <source src="/theekzu-hero.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-slate-950/30 pointer-events-none" />
              <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_75%_15%,rgba(34,211,238,0.35),transparent_35%)]" />

              <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider text-white">
                <span className="rounded-full border border-white/20 bg-slate-950/70 px-3 py-2 backdrop-blur-sm">Theekzu Mobile</span>
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-500/20 px-3 py-2 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Sri Lanka
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white pointer-events-none">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200">Authentic Apple. Real support.</p>
                <p className="mt-2 text-lg sm:text-xl font-black leading-tight">Choose your next iPhone with confidence.</p>
              </div>

              <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full border border-cyan-300/30 animate-[spin_12s_linear_infinite] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
