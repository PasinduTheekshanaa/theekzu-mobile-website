"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Tag, Award, Zap } from "lucide-react";
import { storeConfig } from "@/config/store";
import { AnimatedRobotHero } from "@/components/AnimatedRobotHero";

export const Hero: React.FC = () => {

  return (
    <section
      className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center pt-4 sm:pt-6 pb-12 sm:pb-16 overflow-hidden radial-glow-hero tech-grid-bg transition-colors duration-300"
    >
      {/* Dynamic Animated Ambient Light Mesh Blobs */}
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-gradient-to-br from-blue-600/15 via-cyan-500/10 to-transparent dark:from-blue-600/25 dark:via-cyan-500/20 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/4 right-[-10%] w-[38rem] h-[38rem] bg-gradient-to-tr from-cyan-500/15 via-purple-600/10 to-transparent dark:from-cyan-500/25 dark:via-purple-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 left-1/3 w-[30rem] h-[30rem] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT: Copy, Headline, Subheading, CTAs, Trust Badges */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 text-xs font-bold text-blue-700 dark:text-cyan-300 shadow-sm dark:shadow-[0_0_20px_rgba(0,210,255,0.25)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 dark:bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 dark:bg-cyan-500"></span>
              </span>
              <span className="tracking-wide">Official Brand New & Certified iPhones • Sri Lanka</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
              Upgrade Your World with <br className="hidden sm:inline" />
              <span className="text-gradient-chrome">Theekzu</span>{" "}
              <span className="text-gradient-neon drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(0,180,255,0.45)]">Mobile</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover authentic Apple iPhones, original accessories and exclusive deals with trusted Sri Lanka warranty and instant WhatsApp ordering.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/iphones"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 dark:from-cyan-500 dark:via-blue-600 dark:to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-600/25 dark:shadow-[0_0_30px_rgba(0,102,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Shop iPhones</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to know more about your available iPhones.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-bold shadow-md shadow-emerald-500/20 dark:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Trust Badges Under Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 border-t border-slate-200 dark:border-cyan-500/20">
              <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Quality Checked</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">32-Point Inspected</p>
                </div>
              </div>

              <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Best Prices</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Transparent LKR</p>
                </div>
              </div>

              <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Trusted Service</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Verified Seller</p>
                </div>
              </div>

              <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Fast Support</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">8 AM – 8 PM Daily</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Animated Futuristic Robot Assistant holding an iPhone */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0">
            <AnimatedRobotHero />
          </div>

        </div>
      </div>
    </section>
  );
};