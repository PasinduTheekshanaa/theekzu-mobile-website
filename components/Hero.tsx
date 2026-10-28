"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Tag, Award, Zap } from "lucide-react";
import { storeConfig } from "@/config/store";
import { HeroVideo } from "./HeroVideo";

export const Hero: React.FC = () => {
  return (
    <section data-surface="media" className="relative min-h-[min(680px,100svh)] sm:min-h-[720px] md:min-h-[650px] lg:min-h-[700px] flex items-center py-10 sm:py-14 md:py-16 overflow-hidden bg-white w-full">
      <HeroVideo />
      <div className="absolute inset-0 bg-slate-950/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/52 to-transparent dark:from-slate-950/82 dark:via-slate-950/45 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/15 dark:from-slate-950/45 dark:to-slate-950/10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />

      <div className="container-custom w-full relative z-10">
        <div className="max-w-2xl rounded-[2rem] border border-white/25 bg-transparent px-4 py-6 shadow-[0_24px_60px_rgba(65,65,65,0.28)] backdrop-blur-[3px] sm:px-6 sm:py-8 md:px-0 md:py-0 md:border-transparent md:bg-transparent md:shadow-none md:backdrop-blur-none dark:border-transparent dark:bg-transparent dark:shadow-none dark:backdrop-blur-none">
          {/* Main Content Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 sm:space-y-5 md:space-y-6 pt-1 md:pt-0">
            
            {/* Announcement Badge */}
            <div className="hero-animate-1 inline-flex px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-canvas border border-white/30 text-[11px] sm:text-xs font-bold text-ink shadow-lg backdrop-blur-md max-w-full dark:bg-canvas dark:border-white/20">
              <span className="tracking-wide text-center leading-relaxed">Official Brand New &amp; Certified iPhones • Sri Lanka</span>
            </div>

            {/* Single Primary H1 */}
            <h1
              className="hero-animate-2 font-black tracking-tight leading-[0.98] sm:leading-[1.05] md:leading-[1.08] text-white break-words"
              style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", textShadow: "0 4px 12px rgba(0,0,0,0.9), 0 12px 32px rgba(0,0,0,0.75)" }}
            >
              Upgrade Your World with <br className="hidden sm:inline" />
              <span className="text-white drop-shadow-[0_4px_16px_rgba(23,23,23,0.7)]">Theekzu</span>{" "}
              <span className="text-brand">Mobile</span>
              <span className="sr-only"> - Premium iPhone Store in Sri Lanka</span>
            </h1>

            {/* Subheading */}
            <p className="hero-animate-3 text-[15px] sm:text-base lg:text-lg text-white font-medium leading-[1.6] md:leading-relaxed max-w-xl mx-auto md:mx-0 dark:text-white dark:font-normal" style={{ textShadow: "0 3px 9px rgba(0,0,0,0.95), 0 8px 22px rgba(0,0,0,0.7)" }}>
              Discover authentic Apple iPhones, original accessories and exclusive deals with trusted Sri Lanka warranty and instant WhatsApp ordering.
            </p>

            {/* Action Buttons */}
            <div className="hero-animate-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2 w-full">
              <Link data-ui="primary"
                href="/iphones"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-canvas        text-white text-sm font-bold shadow-lg shadow-neutral-600/25 dark:shadow-[0_0_30px_rgba(91,91,91,0.5)] active:scale-[0.98] transition-all min-h-[44px] btn-press group"
              >
                <span>Shop iPhones</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <a data-ui="whatsapp"
                href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to know more about your available iPhones.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-canvas     text-white text-sm font-bold shadow-md shadow-neutral-500/20 dark:shadow-[0_0_25px_rgba(145,145,145,0.4)] active:scale-[0.98] transition-all min-h-[44px] btn-press group"
              >
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Trust Feature Cards */}
            <div className="hero-animate-5 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-6 border-t border-white/25 dark:border-white/20 w-full">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 bg-canvas border border-white/30 backdrop-blur-md shadow-lg min-w-0 text-left dark:bg-canvas dark:border-white/15">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 flex items-center justify-center text-ink shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-ink leading-snug">Quality Checked</h4>
                  <p className="text-[9px] sm:text-[10px] text-ink leading-snug">32-Point Tested</p>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 bg-canvas border border-white/30 backdrop-blur-md shadow-lg min-w-0 text-left dark:bg-canvas dark:border-white/15">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 flex items-center justify-center text-ink shrink-0">
                  <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-ink leading-snug">Best Prices</h4>
                  <p className="text-[9px] sm:text-[10px] text-ink leading-snug">Transparent LKR</p>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 bg-canvas border border-white/30 backdrop-blur-md shadow-lg min-w-0 text-left dark:bg-canvas dark:border-white/15">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 flex items-center justify-center text-ink shrink-0">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-ink leading-snug">Trusted Service</h4>
                  <p className="text-[9px] sm:text-[10px] text-ink leading-snug">Verified Seller</p>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 bg-canvas border border-white/30 backdrop-blur-md shadow-lg min-w-0 text-left dark:bg-canvas dark:border-white/15">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 flex items-center justify-center text-ink shrink-0">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-ink leading-snug">Fast Support</h4>
                  <p className="text-[9px] sm:text-[10px] text-ink leading-snug">8 AM – 8 PM Daily</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
