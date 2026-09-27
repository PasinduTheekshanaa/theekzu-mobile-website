"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Cpu, Eye, Camera, BatteryCharging, Sparkles, MessageCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { storeConfig } from "@/config/store";
import { useProducts } from "@/context/ProductContext";

import { ScrollReveal } from "@/components/ScrollReveal";

export const FlagshipShowcase: React.FC = () => {
  const { products } = useProducts();
  const flagship = products.find((p) => p.slug === "iphone-16-pro-max");
  const flagshipImg = (flagship?.images && flagship.images[0]) || "/theekzu-robot.jpg";

  if (!flagship) return null;

  return (
    <section className="container-custom transition-colors duration-300">
      <ScrollReveal direction="up">
        <div className="glass-card-glow rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-12 lg:p-16 border border-slate-200 dark:border-cyan-500/30 relative overflow-hidden shadow-xl dark:shadow-[0_0_60px_rgba(0,102,255,0.25)]">
        
        {/* Dynamic Background Flare */}
        <div className="absolute top-1/2 -right-20 w-[30rem] h-[30rem] bg-gradient-to-br from-cyan-500/10 to-blue-600/15 dark:from-cyan-500/20 dark:to-blue-600/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Details */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-cyan-500/15 border border-blue-500/20 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> Flagship Showcase
            </span>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {flagship.name} <br />
              <span className="text-gradient-neon">Titanium. A18 Pro. Infinite.</span>
            </h2>

            <p className="text-slate-600 dark:text-zinc-300 text-xs sm:text-sm lg:text-base leading-relaxed">
              {flagship.description}
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/20 hover:border-blue-400 dark:hover:border-cyan-400/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 mb-1.5">
                  <Eye className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Display</h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">6.9" ProMotion 120Hz</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/20 hover:border-blue-400 dark:hover:border-cyan-400/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 mb-1.5">
                  <Cpu className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Chip</h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">A18 Pro with 6-core GPU</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/20 hover:border-blue-400 dark:hover:border-cyan-400/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 mb-1.5">
                  <Camera className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Camera</h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">48MP Fusion + 5x Zoom</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/20 hover:border-blue-400 dark:hover:border-cyan-400/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 mb-1.5">
                  <BatteryCharging className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Battery</h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Up to 33 hrs playback</p>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-cyan-500/20">
              <div>
                <span className="text-xs text-slate-500 dark:text-zinc-400">Starting from</span>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-700 dark:from-cyan-300 dark:to-blue-400">
                  {formatCurrency(flagship.price)}
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Available in {flagship.storageOptions?.join(", ")}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href={`/product/${flagship.slug}`}
                  className="flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 dark:from-cyan-500 dark:to-blue-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 transition-all active:scale-95"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(
                    `Hello Theekzu Mobile, I would like to inquire about purchasing the ${flagship.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 p-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-95"
                  title="Order via WhatsApp"
                  aria-label="Order flagship via WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Image */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="w-64 sm:w-80 lg:w-[28rem] h-64 sm:h-80 lg:h-[28rem] rounded-full bg-gradient-to-tr from-cyan-500/15 to-blue-600/20 dark:from-cyan-500/30 dark:to-blue-600/30 blur-3xl absolute animate-pulse-glow" />
            <div className="relative z-10 w-full max-w-xs sm:max-w-md lg:max-w-lg flex items-center justify-center">
              <Image
                src={flagshipImg}
                alt={`${flagship.name} - Flagship Apple iPhone at Theekzu Mobile Sri Lanka`}
                width={500}
                height={500}
                className="max-h-[300px] sm:max-h-[400px] lg:max-h-[460px] object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] animate-float"
              />
            </div>
          </div>

        </div>

      </div>
      </ScrollReveal>
    </section>
  );
};