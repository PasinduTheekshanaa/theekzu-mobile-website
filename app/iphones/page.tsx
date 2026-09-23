"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";

export default function IPhonesPage() {
  const { products } = useProducts();
  const [filter, setFilter] = useState<"all" | "new" | "used">("all");

  const iphones = products.filter((p) => {
    if (p.category !== "iphones") return false;
    if (filter === "new") return p.condition === "Brand New";
    if (filter === "used") return p.condition === "Used";
    return true;
  });

  return (
    <div className="container-custom py-6 sm:py-10 space-y-8 sm:space-y-10 transition-colors duration-300">
      
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-r from-blue-100 via-indigo-50 to-slate-100 dark:from-blue-950/60 dark:to-zinc-950 p-5 sm:p-8 md:p-12 border border-slate-200 dark:border-blue-500/20 relative overflow-hidden shadow-sm dark:shadow-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-xs font-bold text-blue-700 dark:text-cyan-400 tracking-widest uppercase mb-2 shadow-xs">
          <Sparkles className="w-3 h-3" /> Apple Smartphone Lineup
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-1">
          Apple iPhones in Sri Lanka
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
          From the flagship titanium iPhone 16 Pro Max to certified pre-owned iPhone 13 models. All devices covered with Apple warranty or Theekzu Mobile store warranty.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All iPhones ({products.filter((p) => p.category === "iphones").length})
          </button>

          <button
            onClick={() => setFilter("new")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === "new"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Brand New Sealed
          </button>

          <button
            onClick={() => setFilter("used")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === "used"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Certified Pre-Owned (Grade A+)
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        key={filter}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300"
      >
        {iphones.map((product, idx) => (
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