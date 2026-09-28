"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, Filter, RotateCcw, PackageSearch, Sparkles, ChevronDown } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";
import { formatCurrency } from "@/lib/formatCurrency";

type FilterOption = { value: string; label: string };

function CatalogSelect({ label, value, options, onChange }: { label: string; value: string; options: FilterOption[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label ?? options[0]?.label;

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <span className="block text-xs uppercase tracking-wider text-slate-700 dark:text-zinc-400 font-bold mb-1.5">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full min-h-[42px] flex items-center justify-between gap-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-left text-xs text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-500 dark:text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="listbox" aria-label={label} className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-cyan-500/30 dark:bg-[#0b1326]">
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  value === option.value
                    ? "bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950"
                    : "text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  const { products, getLowestPrice } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => { setSearchQuery(new URLSearchParams(window.location.search).get("q") || ""); }, []);
  const [selectedSeries, setSelectedSeries] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedStorage, setSelectedStorage] = useState("all");
  const [maxPrice, setMaxPrice] = useState(700000);
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price-low" | "price-high">("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Dynamic available storages
  const availableStorages = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      (p.storageOptions || []).forEach((st) => set.add(st));
      if (p.storage) set.add(p.storage);
      (p.variants || []).forEach((v) => set.add(v.storage));
    });
    // Order storage logically
    const order = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];
    return Array.from(set).sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return a.localeCompare(b);
    });
  }, [products]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query (names, models, description, storage, skus, colors)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const modelMatch = p.model.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const seriesMatch = p.series?.toLowerCase().includes(q);
        const variantMatch = p.variants?.some(
          (v) =>
            v.sku.toLowerCase().includes(q) ||
            v.storage.toLowerCase().includes(q) ||
            v.color.toLowerCase().includes(q)
        );
        return nameMatch || modelMatch || descMatch || seriesMatch || variantMatch;
      });
    }

    // Series filter
    if (selectedSeries !== "all") {
      result = result.filter((p) => p.series === selectedSeries);
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category === selectedCategory || p.subcategory === selectedCategory
      );
    }

    // Condition filter
    if (selectedCondition !== "all") {
      result = result.filter((p) => p.condition === selectedCondition);
    }

    // Storage filter
    if (selectedStorage !== "all") {
      result = result.filter((p) => {
        const hasInOptions = p.storageOptions && p.storageOptions.includes(selectedStorage);
        const hasInVariants = p.variants && p.variants.some((v) => v.storage === selectedStorage);
        return p.storage === selectedStorage || hasInOptions || hasInVariants;
      });
    }

    // Price range using lowest available variant price
    result = result.filter((p) => getLowestPrice(p) <= maxPrice);

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      // popular
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [products, searchQuery, selectedSeries, selectedCategory, selectedCondition, selectedStorage, maxPrice, sortBy, getLowestPrice]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSeries("all");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSelectedStorage("all");
    setMaxPrice(700000);
    setSortBy("popular");
  };

  return (
    <div className="container-custom py-6 sm:py-10 space-y-6 sm:space-y-8 transition-colors duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 text-xs font-bold text-blue-700 dark:text-cyan-400 tracking-widest uppercase mb-2 shadow-xs">
            <Sparkles className="w-3 h-3" /> Theekzu Mobile iPhone Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Shop All iPhones & Accessories
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-1">
            Browse genuine brand new iPhones (11 to 17 Series), certified pre-owned devices, and Apple accessories.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
            Showing {filteredProducts.length} of {products.length} products
          </span>

          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white active:scale-95 transition-all shadow-xs"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>Filters ({mobileFiltersOpen ? "Hide" : "Show"})</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className={`glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-5 sm:space-y-6 border border-slate-200 dark:border-cyan-500/20 shadow-sm ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}>
        
        {/* Search Bar inside Filters */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900/90 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2.5 shadow-xs">
          <Search className="w-4 h-4 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by model, SKU, color or storage (e.g. 17 Pro Max, 256GB, Natural Titanium, TM-IP16PM)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none w-full placeholder-slate-400 dark:placeholder-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-slate-400 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdowns & Range Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          
          <CatalogSelect label="iPhone Series" value={selectedSeries} onChange={setSelectedSeries} options={[
            { value: "all", label: "All Series" }, { value: "17", label: "iPhone 17 Series" }, { value: "16", label: "iPhone 16 Series" }, { value: "15", label: "iPhone 15 Series" }, { value: "14", label: "iPhone 14 Series" }, { value: "13", label: "iPhone 13 Series" }, { value: "12", label: "iPhone 12 Series" }, { value: "11", label: "iPhone 11 Series" }, { value: "accessories", label: "Accessories" },
          ]} />

          <CatalogSelect label="Category" value={selectedCategory} onChange={setSelectedCategory} options={[
            { value: "all", label: "All Categories" }, { value: "iphones", label: "All iPhones" }, { value: "latest-iphones", label: "Latest Flagships" }, { value: "used-iphones", label: "Used / Pre-Owned" }, { value: "accessories", label: "All Accessories" }, { value: "airpods", label: "AirPods" }, { value: "apple-watch", label: "Apple Watch" }, { value: "chargers-cables", label: "Chargers & Cables" }, { value: "cases-accessories", label: "Cases & Protection" },
          ]} />

          <CatalogSelect label="Condition" value={selectedCondition} onChange={setSelectedCondition} options={[
            { value: "all", label: "All Conditions" }, { value: "Brand New", label: "Brand New Sealed" }, { value: "Used", label: "Certified Pre-Owned" },
          ]} />

          <CatalogSelect label="Storage" value={selectedStorage} onChange={setSelectedStorage} options={[
            { value: "all", label: "Any Storage" }, ...availableStorages.map((storage) => ({ value: storage, label: storage })),
          ]} />

          <CatalogSelect label="Sort By" value={sortBy} onChange={(value) => setSortBy(value as typeof sortBy)} options={[
            { value: "popular", label: "Most Popular" }, { value: "newest", label: "Newest First" }, { value: "price-low", label: "Price: Low to High" }, { value: "price-high", label: "Price: High to Low" },
          ]} />

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs uppercase tracking-wider text-slate-700 dark:text-zinc-400 font-bold">
                Max Price
              </label>
              <span className="text-xs font-bold text-blue-600 dark:text-cyan-400">{formatCurrency(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={700000}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer"
            />
          </div>

        </div>

        {/* Active Filters & Reset */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-white/10 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedSeries !== "all" && (
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-cyan-400 border border-blue-500/20 font-medium">
                Series: iPhone {selectedSeries}
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-cyan-400 border border-blue-500/20 font-medium">
                Category: {selectedCategory}
              </span>
            )}
            {selectedCondition !== "all" && (
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 font-medium">
                Condition: {selectedCondition}
              </span>
            )}
            {selectedStorage !== "all" && (
              <span className="px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium">
                Storage: {selectedStorage}
              </span>
            )}
            {maxPrice < 700000 && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                Under {formatCurrency(maxPrice)}
              </span>
            )}
          </div>

          <button
            onClick={resetFilters}
            className="min-h-[36px] inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white font-medium self-end sm:self-auto sm:ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

      </div>

      {/* Product Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center space-y-4 border border-slate-200 dark:border-white/10 shadow-sm">
          <PackageSearch className="w-16 h-16 mx-auto text-slate-400 dark:text-zinc-600 mb-2" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Matching Products Found</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
            Try adjusting your search query, increasing your maximum price filter, or selecting a different series.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 text-white text-xs font-semibold shadow-md"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div
          key={`${selectedSeries}-${selectedCategory}-${selectedCondition}-${selectedStorage}-${maxPrice}-${sortBy}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300"
        >
          {filteredProducts.map((p, idx) => (
            <div
              key={p.id}
              style={{
                animationDelay: `${Math.min(idx * 35, 350)}ms`,
              }}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
