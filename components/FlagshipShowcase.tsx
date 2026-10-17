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
        <div className="glass-panel rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-12 lg:p-16 border border-neutral-200 dark:border-neutral-500/30 relative overflow-hidden shadow-xl dark:shadow-[0_0_60px_rgba(91,91,91,0.25)]">
        
        {/* Dynamic Background Flare */}
        <div className="absolute top-1/2 -right-20 w-[30rem] h-[30rem] bg-canvas     rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-96 h-96 bg-canvas dark:bg-canvas rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Details */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-ink dark:text-ink text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-ink dark:text-ink" /> Flagship Showcase
            </span>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-ink dark:text-ink tracking-tight leading-tight">
              {flagship.name} <br />
              <span className="text-brand">Titanium. A18 Pro. Infinite.</span>
            </h2>

            <p className="text-ink dark:text-ink text-xs sm:text-sm lg:text-base leading-relaxed">
              {flagship.description}
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 hover:border-neutral-400 dark:hover:border-neutral-400/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2 text-ink dark:text-ink mb-1.5">
                  <Eye className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Display</h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-ink dark:text-ink">6.9" ProMotion 120Hz</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 hover:border-neutral-400 dark:hover:border-neutral-400/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2 text-ink dark:text-ink mb-1.5">
                  <Cpu className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Chip</h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-ink dark:text-ink">A18 Pro with 6-core GPU</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 hover:border-neutral-400 dark:hover:border-neutral-400/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2 text-ink dark:text-ink mb-1.5">
                  <Camera className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Camera</h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-ink dark:text-ink">48MP Fusion + 5x Zoom</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 hover:border-neutral-400 dark:hover:border-neutral-400/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2 text-ink dark:text-ink mb-1.5">
                  <BatteryCharging className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Battery</h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-ink dark:text-ink">Up to 33 hrs playback</p>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-500/20">
              <div>
                <span className="text-xs text-ink dark:text-ink">Starting from</span>
                <div className="text-2xl sm:text-3xl font-black text-ink text-ink text-ink    ">
                  {formatCurrency(flagship.price)}
                </div>
                <span className="text-xs text-ink dark:text-ink font-semibold">
                  Available in {flagship.storageOptions?.join(", ")}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link data-ui="primary"
                  href={`/product/${flagship.slug}`}
                  className="flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-canvas       text-ink text-xs sm:text-sm font-bold shadow-md shadow-neutral-600/25 transition-all active:scale-95"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a data-ui="whatsapp"
                  href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(
                    `Hello Theekzu Mobile, I would like to inquire about purchasing the ${flagship.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 p-3 rounded-full bg-canvas hover:bg-canvas text-ink shadow-md transition-all active:scale-95"
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
            <div className="w-64 sm:w-80 lg:w-[28rem] h-64 sm:h-80 lg:h-[28rem] rounded-full bg-canvas     blur-3xl absolute animate-pulse-glow" />
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