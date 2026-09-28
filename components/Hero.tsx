"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Tag, Award, Zap } from "lucide-react";
import { storeConfig } from "@/config/store";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[680px] sm:min-h-[720px] md:min-h-[650px] lg:min-h-[700px] flex items-center py-10 sm:py-14 md:py-16 overflow-hidden bg-slate-100 dark:bg-slate-950 w-full">
      <video
        className="absolute inset-0 h-full w-full object-cover transform-gpu brightness-100 contrast-120 saturate-115 dark:brightness-110 dark:contrast-110 dark:saturate-110 motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Theekzu Mobile brand video"
      >
        <source src="/theekzu-hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-950/18 dark:bg-slate-950/12 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/42 to-transparent dark:from-slate-950/75 dark:via-slate-950/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/15 dark:from-slate-950/45 dark:to-slate-950/10 pointer-events-none" />
      <div className="absolute -right-24 top-12 h-72 w-72 rounded-full bg-cyan-400/18 blur-[90px] pointer-events-none dark:bg-cyan-400/15" />
      <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/15 blur-[90px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_78%_22%,rgba(34,211,238,0.18),transparent_35%)] dark:bg-[radial-gradient(circle_at_78%_22%,rgba(34,211,238,0.16),transparent_35%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

      <div className="container-custom w-full relative z-10">
        <div className="max-w-2xl rounded-[2rem] border border-white/25 bg-slate-950/12 px-4 py-6 shadow-[0_24px_60px_rgba(30,64,175,0.28)] backdrop-blur-[3px] sm:px-6 sm:py-8 md:px-0 md:py-0 md:border-transparent md:bg-transparent md:shadow-none md:backdrop-blur-none dark:border-transparent dark:bg-transparent dark:shadow-none dark:backdrop-blur-none">
          {/* Main Content Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 sm:space-y-5 md:space-y-6 pt-1 md:pt-0">
            
            {/* Announcement Badge */}
            <div className="hero-animate-1 inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-950/60 border border-white/30 text-[11px] sm:text-xs font-bold text-cyan-100 shadow-lg backdrop-blur-md max-w-full dark:bg-slate-950/65 dark:border-white/20">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 dark:bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-600 dark:bg-cyan-500"></span>
              </span>
              <span className="tracking-wide truncate">Official Brand New &amp; Certified iPhones • Sri Lanka</span>
            </div>

            {/* Single Primary H1 */}
            <h1
              className="hero-animate-2 font-black tracking-tight leading-[0.98] sm:leading-[1.05] md:leading-[1.08] text-white break-words drop-shadow-[0_8px_28px_rgba(0,0,0,0.45)]"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
            >
              Upgrade Your World with <br className="hidden sm:inline" />
              <span className="text-white drop-shadow-[0_4px_16px_rgba(15,23,42,0.7)]">Theekzu</span>{" "}
              <span className="text-gradient-neon drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(0,180,255,0.45)]">Mobile</span>
              <span className="sr-only"> - Premium iPhone Store in Sri Lanka</span>
            </h1>

            {/* Subheading */}
            <p className="hero-animate-3 text-[15px] sm:text-base lg:text-lg text-slate-100/95 font-medium leading-[1.6] md:leading-relaxed max-w-xl mx-auto md:mx-0 drop-shadow-md dark:text-slate-100/90 dark:font-normal">
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
            <div className="hero-animate-5 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-6 border-t border-white/25 dark:border-white/20 w-full">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 bg-white/18 border border-white/30 backdrop-blur-md shadow-lg min-w-0 text-left dark:bg-slate-950/50 dark:border-white/15">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-white leading-snug">Quality Checked</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-200 leading-snug dark:text-slate-300">32-Point Tested</p>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 bg-white/18 border border-white/30 backdrop-blur-md shadow-lg min-w-0 text-left dark:bg-slate-950/50 dark:border-white/15">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-white leading-snug">Best Prices</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-200 leading-snug dark:text-slate-300">Transparent LKR</p>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 bg-white/18 border border-white/30 backdrop-blur-md shadow-lg min-w-0 text-left dark:bg-slate-950/50 dark:border-white/15">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-white leading-snug">Trusted Service</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-200 leading-snug dark:text-slate-300">Verified Seller</p>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 bg-white/18 border border-white/30 backdrop-blur-md shadow-lg min-w-0 text-left dark:bg-slate-950/50 dark:border-white/15">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-white leading-snug">Fast Support</h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-200 leading-snug dark:text-slate-300">8 AM – 8 PM Daily</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
