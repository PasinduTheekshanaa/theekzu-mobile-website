"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";

import { ScrollReveal } from "@/components/ScrollReveal";

export const FeaturedProducts: React.FC = () => {
  const { products } = useProducts();
  const featuredIphones = products
    .filter((p) => p.category === "iphones" && p.featured)
    .slice(0, 6);

  return (
    <section className="container-custom transition-colors duration-300 pb-2 sm:pb-4">
      <ScrollReveal direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-xs font-bold tracking-widest text-blue-700 dark:text-cyan-400 uppercase mb-2 shadow-xs">
              <Sparkles className="w-3 h-3" /> Top Tier Devices
            </span>
            <h2 
              className="font-black text-slate-900 dark:text-white mt-1 leading-[1.1]"
              style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}
            >
              Featured iPhones
            </h2>
            <p className="max-w-full text-slate-600 dark:text-zinc-400 text-sm sm:text-base leading-[1.6] mt-1.5">
              Discover our latest flagship and most popular certified Apple smartphones.
            </p>
          </div>

          <div className="pt-1 md:pt-0">
            <Link
              href="/iphones"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors min-h-[44px] items-center"
            >
              <span>View All iPhones</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {featuredIphones.map((product, idx) => (
          <ScrollReveal key={product.id} direction="up" delay={idx * 60}>
            <ProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};