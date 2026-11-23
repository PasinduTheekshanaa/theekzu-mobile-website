"use client";

import React from "react";
import Link from "next/link";
import { ResilientProductImage } from "@/components/ResilientProductImage";
import { ArrowRight, Cpu, Eye, Camera, BatteryCharging } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { getEnabledVariants } from "@/data/products";
import { useProducts } from "@/context/ProductContext";

import { ScrollReveal } from "@/components/ScrollReveal";

export const FlagshipShowcase: React.FC = () => {
  const motionRef = React.useRef<HTMLDivElement>(null);
  const resetMotion = () => {
    const node = motionRef.current;
    if (!node) return;
    node.style.setProperty("--phone-rx", "0deg");
    node.style.setProperty("--phone-ry", "0deg");
    node.style.setProperty("--phone-x", "0px");
    node.style.setProperty("--phone-y", "0px");
  };
  const followPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--phone-rx", (-y * 16) + "deg");
    node.style.setProperty("--phone-ry", (x * 20) + "deg");
    node.style.setProperty("--phone-x", (x * 14) + "px");
    node.style.setProperty("--phone-y", (y * 10) + "px");
  };
  const { products, getProductColorImage } = useProducts();
  const flagship = products.find((p) => p.slug === "iphone-17-pro-max");
  const orange = flagship?.colors.find(color => /orange/i.test(color.name));
  const flagshipImg = (flagship && orange && getProductColorImage(flagship, orange.name)) || flagship?.images?.[0] || "/theekzu-robot.jpg";

  if (!flagship) return null;
  const variants = getEnabledVariants(flagship).filter(v => v.storage === "256GB" && v.price > 0);
  const available = variants.filter(v => v.stock > 0);
  const prices = (available.length ? available : variants).map(v => v.price);
  const price = prices.length ? Math.min(...prices) : undefined;

  return (
    <section id="flagship-showcase" className="container-custom transition-colors duration-300">
      <ScrollReveal direction="up">
        <div className="flagship-panel glass-panel rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-12 lg:p-16 border border-neutral-200 dark:border-neutral-500/30 relative overflow-hidden shadow-xl dark:shadow-[0_0_60px_rgba(91,91,91,0.25)]">
        
        {/* Dynamic Background Flare */}
        <div className="absolute top-1/2 -right-20 w-[30rem] h-[30rem] bg-canvas     rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-96 h-96 bg-canvas dark:bg-canvas rounded-full blur-[100px] pointer-events-none" />

        <div className="flagship-layout grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Details */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-ink dark:text-ink text-xs font-bold uppercase tracking-wider shadow-xs">
              Flagship Showcase
            </span>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-ink dark:text-ink tracking-tight leading-tight">
              {flagship.name} <br />
              <span className="text-brand">256GB. Your next flagship.</span>
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
                <p className="text-xs sm:text-sm font-bold text-ink dark:text-ink">{flagship.specifications.display || "See device details"}</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 hover:border-neutral-400 dark:hover:border-neutral-400/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2 text-ink dark:text-ink mb-1.5">
                  <Cpu className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Chip</h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-ink dark:text-ink">{flagship.specifications.chip || "See device details"}</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 hover:border-neutral-400 dark:hover:border-neutral-400/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2 text-ink dark:text-ink mb-1.5">
                  <Camera className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Camera</h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-ink dark:text-ink">{flagship.specifications.camera || "See device details"}</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/20 hover:border-neutral-400 dark:hover:border-neutral-400/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2 text-ink dark:text-ink mb-1.5">
                  <BatteryCharging className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Battery</h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-ink dark:text-ink">{flagship.specifications.battery || "See device details"}</p>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-500/20">
              <div>
                <span className="text-xs text-ink dark:text-ink">Starting from</span>
                <div className="text-2xl sm:text-3xl font-black text-ink text-ink text-ink    ">
                  {price !== undefined ? formatCurrency(price) : "Contact for price"}
                </div>
                <span className="text-xs text-ink dark:text-ink font-semibold">
                  256GB storage ? {orange?.name || "Orange"}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link data-ui="primary"
                  href={`/product/${flagship.slug}`}
                  className="showcase-action inline-flex items-center justify-center rounded-full shadow-md transition-transform active:scale-95"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

          {/* Right Image */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div ref={motionRef} onPointerMove={followPointer} onPointerLeave={resetMotion} onPointerCancel={resetMotion} className="flagship-motion relative z-10 w-full max-w-md sm:max-w-xl lg:max-w-2xl flex items-center justify-center">
              <ResilientProductImage
                src={flagshipImg}
                alt={`${flagship.name} - Flagship Apple iPhone at Theekzu Mobile Sri Lanka`}
                width={640}
                height={640}
                className="max-h-[370px] sm:max-h-[490px] lg:max-h-[570px] object-contain flagship-phone"
              />
            </div>
          </div>

        </div>

      </div>
      </ScrollReveal>
    </section>
  );
};
