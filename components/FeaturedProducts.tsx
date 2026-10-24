"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";

import { ScrollReveal } from "@/components/ScrollReveal";

export const FeaturedProducts: React.FC = () => {
  const { products, isLoading, catalogError } = useProducts();
  const featuredIphones = React.useMemo(() => {
    let list = products.filter((p) => p.category === "iphones" && p.featured);
    if (list.length === 0) {
      list = products.filter((p) => p.category === "iphones");
    }
    return list.slice(0, 6);
  }, [products]);

  return (
    <section className="container-custom transition-colors duration-300 pb-2 sm:pb-4">
      {(isLoading || catalogError || products.length === 0) && <p role="status" className="py-6 text-center">{isLoading ? "Loading products…" : catalogError ? "Products are temporarily unavailable. Please try again shortly." : "No products are currently available."}</p>}
      <ScrollReveal direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-4">
          <div>
            <h2 
              className="font-black text-ink dark:text-ink mt-1 leading-[1.1]"
              style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}
            >
              Featured iPhones
            </h2>
            <p className="max-w-full text-ink dark:text-ink text-sm sm:text-base leading-[1.6] mt-1.5">
              Discover our latest flagship and most popular certified Apple smartphones.
            </p>
          </div>

          <div className="pt-1 md:pt-0">
            <Link
              href="/iphones"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-ink dark:text-ink hover:text-ink dark:hover:text-ink transition-colors min-h-[44px] items-center"
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
