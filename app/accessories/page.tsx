"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";

export default function AccessoriesPage() {
  const { products } = useProducts();
  const [subcat, setSubcat] = useState<string>("all");

  const accessories = products.filter((p) => {
    if (p.category !== "accessories") return false;
    if (p.subcategory !== "chargers-cables" && p.subcategory !== "cases-accessories") return false;
    if (subcat === "all") return true;
    return p.subcategory === subcat;
  });

  return (
    <div className="container-custom py-6 sm:py-10 space-y-8 sm:space-y-10 transition-colors duration-300">
      
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-[2.5rem] bg-canvas      p-5 sm:p-8 md:p-12 border border-neutral-200 dark:border-neutral-500/20 relative overflow-hidden shadow-sm dark:shadow-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-xs font-bold text-ink dark:text-ink tracking-widest uppercase mb-2 shadow-xs">
          <Sparkles className="w-3 h-3" /> Original Apple Ecosystem
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-ink dark:text-ink mt-1">
          Accessories
        </h1>
        <p className="text-ink dark:text-ink text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
          Complete your setup with genuine chargers, cables, MagSafe essentials, protective cases, and screen protection.
        </p>

        {/* Subcategory Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <button
            onClick={() => setSubcat("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              subcat === "all"
                ? "bg-action text-on-action shadow-sm"
                : "bg-action dark:bg-action border border-neutral-200 dark:border-white/10 text-on-action dark:text-on-action hover:text-on-action dark:hover:text-on-action"
            }`}
          >
            All Accessories
          </button>

          <button
            onClick={() => setSubcat("chargers-cables")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              subcat === "chargers-cables"
                ? "bg-action text-on-action shadow-sm"
                : "bg-action dark:bg-action border border-neutral-200 dark:border-white/10 text-on-action dark:text-on-action hover:text-on-action dark:hover:text-on-action"
            }`}
          >
            Chargers & Cables
          </button>

          <button
            onClick={() => setSubcat("cases-accessories")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              subcat === "cases-accessories"
                ? "bg-action text-on-action shadow-sm"
                : "bg-action dark:bg-action border border-neutral-200 dark:border-white/10 text-on-action dark:text-on-action hover:text-on-action dark:hover:text-on-action"
            }`}
          >
            Cases & Protection
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        key={subcat}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300"
      >
        {accessories.map((product, idx) => (
          <div
            key={product.id}
            style={{
              animationDelay: `${Math.min(idx * 35, 350)}ms`,
            }}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

    </div>
  );
}
