"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Smartphone } from "lucide-react";
import { Product } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { useProducts } from "@/context/ProductContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { products, getProductPrimaryImage, getLowestPrice } = useProducts();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const matches = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q) ||
        (p.series && p.series.toLowerCase().includes(q)) ||
        (p.storage && p.storage.toLowerCase().includes(q)) ||
        (p.storageOptions && p.storageOptions.some((st) => st.toLowerCase().includes(q))) ||
        (p.variants && p.variants.some((v) => v.sku.toLowerCase().includes(q) || v.color.toLowerCase().includes(q)))
    );

    setResults(matches);
  }, [query, products]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 animate-in fade-in duration-200">
      <div className="glass-modal rounded-2xl sm:rounded-[2.5rem] w-full max-w-2xl border border-slate-200 dark:border-cyan-500/20 p-4 sm:p-6 space-y-4 shadow-2xl">
        
        {/* Search Input Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-cyan-500/15 pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search iPhone 17 Pro, 16, 15, 14, 13, 12, 11, AirPods, SKU, Color..."
              className="bg-transparent border-none text-slate-900 dark:text-white text-base focus:outline-none w-full placeholder-slate-400 dark:placeholder-zinc-500"
            />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white p-1 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto pt-2">
          {query.trim() === "" ? (
            <div className="text-center py-12 text-slate-400 dark:text-zinc-500 text-xs">
              <Smartphone className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-zinc-600" />
              <span>Type model name (e.g. "17 Pro Max", "16", "AirPods", "Titanium", "13 Pro")...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                No products found for "{query}"
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-600 mt-1">
                Try searching for 17, 16, 15, 14, 13, 12, 11, Pro, AirPods or Titanium.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((p) => {
                const img = getProductPrimaryImage(p);
                const minPrice = getLowestPrice(p);
                const hasVariants = p.variants && p.variants.length > 1;

                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={onClose}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/5 flex items-center gap-3.5 transition-colors block"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-950 p-1 flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-slate-200 dark:border-cyan-500/10">
                      {img ? (
                        <Image
                          src={img}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="object-contain max-h-full max-w-full"
                        />
                      ) : (
                        <span className="text-[9px] text-slate-400">No img</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-zinc-400">
                          {p.condition}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {p.storageOptions ? p.storageOptions.join(", ") : p.storage}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-extrabold text-blue-600 dark:text-cyan-400">
                        {hasVariants ? "From " : ""}{formatCurrency(minPrice)}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{p.stock}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
