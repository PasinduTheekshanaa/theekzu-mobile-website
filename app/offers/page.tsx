"use client";

import React from "react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";

export default function OffersPage() {
  const { products } = useProducts();
  const deals = products.filter((p) => p.isWeekendDeal || p.oldPrice);

  return (
    <div className="container-custom py-6 sm:py-10 space-y-10 sm:space-y-16 transition-colors duration-300">
      {/* Deals Grid */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Discounted Devices & Accessories</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Available at special promotional pricing while stock lasts.</p>
          </div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">{deals.length} active offers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {deals.map((product, idx) => (
            <div
              key={product.id}
              style={{
                animationDelay: `${Math.min(idx * 40, 350)}ms`,
              }}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
