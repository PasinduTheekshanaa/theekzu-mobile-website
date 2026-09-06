"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";

export const FeaturedProducts: React.FC = () => {
  const { products } = useProducts();
  const featuredIphones = products
    .filter((p) => p.category === "iphones" && p.featured)
    .slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-xs font-bold tracking-widest text-blue-700 dark:text-cyan-400 uppercase mb-2 shadow-xs">
            <Sparkles className="w-3 h-3" /> Top Tier Devices
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Featured iPhones
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-sm mt-1">
            Discover our latest flagship and most popular certified Apple smartphones.
          </p>
        </div>

        <Link
          href="/iphones"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors"
        >
          <span>View All iPhones</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredIphones.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};