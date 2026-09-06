import React from "react";
import Link from "next/link";
import { MessageCircle, Grid, Sparkles, Clock, Phone } from "lucide-react";
import { storeConfig } from "@/config/store";

export const FinalCTA: React.FC = () => {
  return (
    <section className="container-custom transition-colors duration-300">
      <div className="rounded-2xl sm:rounded-[3rem] bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 dark:from-blue-900/60 dark:via-[#07132a] dark:to-[#040711] border border-blue-400/40 dark:border-cyan-500/40 p-6 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-2xl dark:shadow-[0_0_60px_rgba(0,102,255,0.3)]">
        
        {/* Ambient radial glows */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-400/20 dark:bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6 relative z-10">
          
          <span className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/15 dark:bg-cyan-500/15 border border-white/25 dark:border-cyan-500/30 text-white dark:text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 dark:text-cyan-400" /> Start Your Apple Upgrade Today
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Ready for Your Next iPhone? <br />
            <span className="text-cyan-300 dark:text-gradient-neon">Theekzu Mobile Is Here for You.</span>
          </h2>

          <p className="text-slate-100 dark:text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Experience genuine Apple devices, certified pre-owned phones, islandwide delivery, and friendly support. Message us on WhatsApp or browse our catalog today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-slate-200 dark:text-zinc-400 pt-2 font-medium">
            <span className="flex items-center gap-1.5 text-cyan-200 dark:text-cyan-300">
              <Phone className="w-3.5 h-3.5" /> Direct: {storeConfig.phone}
            </span>
            <span className="text-white/40 dark:text-zinc-600">•</span>
            <span className="flex items-center gap-1.5 text-emerald-300 dark:text-emerald-400">
              <Clock className="w-3.5 h-3.5" /> Support: {storeConfig.businessHours} Daily
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4">
            <Link
              href="/iphones"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/15 hover:bg-white/25 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-white/30 dark:border-cyan-500/30 text-white text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95"
            >
              <Grid className="w-4 h-4 text-cyan-300 dark:text-cyan-400" />
              <span>Browse All iPhones</span>
            </Link>

            <a
              href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to inquire about buying an iPhone.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 text-xs sm:text-sm font-bold shadow-xl transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
