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
    if (subcat === "all") return true;
    return p.subcategory === subcat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 transition-colors duration-300">
      
      {/* Header Banner */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-indigo-100 via-sky-50 to-slate-100 dark:from-indigo-950/60 dark:to-zinc-950 p-8 sm:p-12 border border-slate-200 dark:border-indigo-500/20 relative overflow-hidden shadow-sm dark:shadow-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 dark:border-indigo-500/30 text-xs font-bold text-indigo-700 dark:text-indigo-400 tracking-widest uppercase mb-2">
          <Sparkles className="w-3 h-3" /> Original Apple Ecosystem
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-1">
          Accessories & Audio
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 text-sm mt-2 max-w-2xl">
          Complete your Apple setup with 100% genuine AirPods Pro 2, Apple Watch Ultra 2, official 20W fast wall chargers, MagSafe chargers, and drop-proof cases.
        </p>

        {/* Subcategory Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <button
            onClick={() => setSubcat("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              subcat === "all"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Accessories
          </button>

          <button
            onClick={() => setSubcat("airpods")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              subcat === "airpods"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            AirPods
          </button>

          <button
            onClick={() => setSubcat("apple-watch")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              subcat === "apple-watch"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Apple Watch
          </button>

          <button
            onClick={() => setSubcat("chargers-cables")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              subcat === "chargers-cables"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Chargers & Cables
          </button>

          <button
            onClick={() => setSubcat("cases-accessories")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              subcat === "cases-accessories"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Cases & Protection
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accessories.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
}