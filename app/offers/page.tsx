"use client";

import React from "react";
import { Flame } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";
import { SpecialOffers } from "@/components/SpecialOffers";

export default function OffersPage() {
  const { products } = useProducts();
  const deals = products.filter((p) => p.isWeekendDeal || p.oldPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 transition-colors duration-300">
      
      {/* Top Banner */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-rose-100 via-pink-50 to-slate-100 dark:from-rose-950/60 dark:to-zinc-950 p-8 sm:p-12 border border-rose-200 dark:border-rose-500/20 relative overflow-hidden shadow-sm dark:shadow-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-bold mb-3">
          <Flame className="w-3.5 h-3.5" /> Sri Lanka Flash Promotions
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-1">
          Special Offers & Weekend Deals
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 text-sm mt-2 max-w-2xl">
          Save on brand new sealed flagships, certified pre-owned phones, and high-speed fast charging kits. Order on WhatsApp for instant confirmation.
        </p>
      </div>

      {/* Countdown component */}
      <SpecialOffers />

      {/* Deals Grid */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Discounted Devices & Accessories</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Available at special promotional pricing while stock lasts.</p>
          </div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">{deals.length} active offers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
}