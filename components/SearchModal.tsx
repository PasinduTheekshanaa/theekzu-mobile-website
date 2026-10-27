"use client";
import { getProductConditionLabel } from "@/data/products";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ResilientProductImage } from "@/components/ResilientProductImage";
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
        getProductConditionLabel(p).toLowerCase().includes(q) ||
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
      <div className="glass-modal rounded-2xl sm:rounded-[2.5rem] w-full max-w-2xl border border-neutral-200 dark:border-neutral-500/20 p-4 sm:p-6 space-y-4 shadow-2xl">
        
        {/* Search Input Bar */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-500/15 pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-ink dark:text-ink flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search iPhone 17 Pro, 16, 15, 14, 13, 12, 11, AirPods, SKU, Color..."
              className="bg-transparent border-none text-ink dark:text-ink text-base focus:outline-none w-full placeholder-neutral-400 dark:placeholder-neutral-500"
            />
          </div>
          <button
            onClick={onClose}
            className="text-ink dark:text-ink hover:text-ink dark:hover:text-ink p-1 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto pt-2">
          {query.trim() === "" ? (
            <div className="text-center py-12 text-ink dark:text-ink text-xs">
              <Smartphone className="w-8 h-8 mx-auto mb-2 text-ink dark:text-ink" />
              <span>Type model name (e.g. "17 Pro Max", "16", "AirPods", "Titanium", "13 Pro")...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-medium text-ink dark:text-ink">
                No products found for "{query}"
              </p>
              <p className="text-xs text-ink dark:text-ink mt-1">
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
                    className="p-3 rounded-2xl bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas border border-neutral-200/80 dark:border-white/5 flex items-center gap-3.5 transition-colors block"
                  >
                    <div className="w-12 h-12 rounded-xl bg-canvas dark:bg-canvas p-1 flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-neutral-200 dark:border-neutral-500/10">
                      {img ? (
                        <ResilientProductImage
                          src={img}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="object-contain max-h-full max-w-full"
                        />
                      ) : (
                        <span className="text-[9px] text-ink">No img</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-ink dark:text-ink truncate">{p.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-canvas dark:bg-canvas text-ink dark:text-ink">
                          {getProductConditionLabel(p)}
                        </span>
                      </div>
                      <p className="text-xs text-ink dark:text-ink">
                        {p.storageOptions ? p.storageOptions.join(", ") : p.storage}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-extrabold text-ink dark:text-ink">
                        {hasVariants ? "From " : ""}{formatCurrency(minPrice)}
                      </div>
                      <div className="text-[10px] text-ink dark:text-ink font-medium">{p.stock}</div>
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
