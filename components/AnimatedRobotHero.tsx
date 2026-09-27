"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { formatCurrency } from "@/lib/formatCurrency";
import { storeConfig } from "@/config/store";

export const AnimatedRobotHero: React.FC<{ className?: string; mode?: "auto" | "desktop" | "mobile" }> = ({ className = "" }) => {
  const { products, isLoading, catalogError } = useProducts();
  const flagship = products.find(p => p.slug === "iphone-16-pro-max") || products.find(p => p.category === "iphones");
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const reset = () => {
    cancelAnimationFrame(frame.current);
    if (stage.current) stage.current.style.transform = "";
  };
  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (stage.current) stage.current.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
    });
  };
  return <div className={`w-full max-w-[360px] lg:max-w-[400px] mx-auto space-y-3 ${className}`} onPointerMove={track} onPointerLeave={reset}>
    <div ref={stage} className="relative w-full aspect-[4/3] md:aspect-[4/5] overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 shadow-xl transition-transform duration-200 motion-reduce:transform-none">
      <Image src="/theekzu-robot.jpg" alt="Theekzu robot holding an iPhone" fill priority sizes="(max-width: 400px) calc(100vw - 32px), (max-width: 767px) 360px, (max-width: 1023px) 38vw, 400px" className="object-cover object-top" />
      <div className="absolute inset-x-3 top-3 flex flex-wrap gap-2 text-[11px] font-semibold">
        <span className="rounded-full bg-slate-950/90 px-3 py-2 text-cyan-200">Theekzu showroom</span>
        {flagship && <span className="rounded-full bg-slate-950/90 px-3 py-2 text-white">{flagship.stock}</span>}
      </div>
    </div>
    <div className="glass-card rounded-2xl p-4 space-y-3 text-left">
      {flagship ? <>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div><h2 className="font-bold text-sm">{flagship.name}</h2><p className="text-xs text-slate-500">{flagship.condition}</p></div>
          <p className="text-sm font-bold">From {formatCurrency(flagship.price)}</p>
        </div>
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2">
          <Link href={`/product/${flagship.slug}`} className="min-h-[44px] flex items-center justify-center gap-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold">View specs <ArrowRight size={14}/></Link>
          <a href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent('Hello, please confirm availability and price for ' + flagship.name)}`} target="_blank" rel="noopener noreferrer" className="min-h-[44px] flex items-center justify-center gap-1 rounded-xl bg-emerald-700 text-white text-xs font-bold"><MessageCircle size={15}/>Check availability</a>
        </div>
      </> : <p role="status" className="text-sm">{isLoading ? "Loading products…" : catalogError ? "Product details are temporarily unavailable." : "New arrivals coming soon."}</p>}
    </div>
  </div>;
};
export default AnimatedRobotHero;
