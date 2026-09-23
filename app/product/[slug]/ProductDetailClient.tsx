"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MessageCircle, ShoppingBag, Zap, ShieldCheck, ChevronRight, Plus, Minus, Heart, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Product, ProductVariant } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { storeConfig, getWhatsAppUrl } from "@/config/store";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product: initialProduct,
  related: initialRelated,
}) => {
  const { getProductBySlug, getRelatedProducts, getProductPrimaryImage, getProductColorImage, customImages, isLiveDatabase } = useProducts();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Use live product from context if context has confirmed database load, else initialProduct (from server Supabase query)
  const contextProduct = getProductBySlug(initialProduct.slug);
  const liveProduct = (isLiveDatabase && contextProduct) ? contextProduct : initialProduct;
  const liveRelated =
    (isLiveDatabase && getRelatedProducts(liveProduct, 3).length > 0)
      ? getRelatedProducts(liveProduct, 3)
      : initialRelated;

  const defaultStorage =
    liveProduct.storageOptions && liveProduct.storageOptions.length > 0
      ? liveProduct.storageOptions[0]
      : liveProduct.storage || "128GB";
  const defaultColor =
    liveProduct.colors && liveProduct.colors.length > 0
      ? liveProduct.colors[0].name
      : "Standard";

  const [selectedStorage, setSelectedStorage] = useState(defaultStorage);
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");

  // Primary image fallback
  useEffect(() => {
    const primary = getProductPrimaryImage(liveProduct);
    setActiveImage(primary || (liveProduct.images && liveProduct.images[0]) || "");
  }, [liveProduct, getProductPrimaryImage]);

  // When color changes, check if there is an image mapped to that color in IndexedDB
  useEffect(() => {
    const colorImg = getProductColorImage(liveProduct, selectedColor);
    if (colorImg) {
      setActiveImage(colorImg);
    }
  }, [selectedColor, liveProduct, getProductColorImage]);

  // Find exact matching variant
  const currentVariant: ProductVariant | undefined =
    liveProduct.variants?.find(
      (v) =>
        v.storage.toLowerCase() === selectedStorage.toLowerCase() &&
        v.color.toLowerCase() === selectedColor.toLowerCase()
    ) ||
    liveProduct.variants?.find((v) => v.storage.toLowerCase() === selectedStorage.toLowerCase()) ||
    liveProduct.variants?.[0];

  // Dynamic pricing
  const currentPrice = currentVariant ? currentVariant.price : liveProduct.price;
  const oldPrice = currentVariant ? currentVariant.oldPrice : liveProduct.oldPrice;
  const currentStock = currentVariant ? currentVariant.stock : (liveProduct.stock === "Out of Stock" ? 0 : 5);
  const isOutOfStock = currentStock <= 0;
  const sku = currentVariant?.sku || `TM-${liveProduct.model}-${selectedStorage}`;

  // Calculated discount
  const discountPercent =
    oldPrice && oldPrice > currentPrice
      ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
      : null;

  const wishlisted = isWishlisted(liveProduct.id);

  // High-precision WhatsApp message
  const waMessage = `🛒 *THEEKZU MOBILE - PRODUCT INQUIRY*

Hello Theekzu Mobile, I would like to order/inquire about:

• *Product:* ${liveProduct.name}
• *Storage:* ${selectedStorage}
• *Color:* ${selectedColor}
• *SKU:* ${sku}
• *Price:* ${formatCurrency(currentPrice)}
• *Stock Status:* ${isOutOfStock ? "Out of Stock (Inquiry)" : "In Stock"}
• *Quantity:* ${quantity}
• *Condition:* ${liveProduct.condition}

Can you please confirm order details and delivery?`;

  const waUrl = getWhatsAppUrl(waMessage);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(liveProduct, selectedStorage, selectedColor, quantity, currentPrice, activeImage, currentVariant?.id);
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addItem(liveProduct, selectedStorage, selectedColor, quantity, currentPrice, activeImage, currentVariant?.id);
    }
    window.open(waUrl, "_blank");
  };

  // Combine product gallery images with live database images (primary image first)
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    (liveProduct.images || []).forEach((img) => {
      if (img && !list.includes(img)) list.push(img);
    });
    const customList = customImages[liveProduct.id] || [];
    customList.forEach((c: any) => {
      const url = c.image_url || c.url || c.dataUrl;
      if (url && !list.includes(url)) list.push(url);
    });
    return list;
  }, [customImages, liveProduct]);

  return (
    <div className="space-y-16 transition-colors duration-300">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-600" />
        <Link href={liveProduct.category === "iphones" ? "/iphones" : "/accessories"} className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors capitalize">
          {liveProduct.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-600" />
        <span className="text-slate-900 dark:text-white font-medium truncate">{liveProduct.name}</span>
      </nav>

      {/* Main Product Layout (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full h-72 sm:h-96 md:h-[480px] rounded-2xl sm:rounded-[2.5rem] bg-slate-50 dark:bg-gradient-to-b dark:from-slate-900/60 dark:to-slate-950/80 border border-slate-200 dark:border-cyan-500/25 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden shadow-sm dark:shadow-[0_0_35px_rgba(0,102,255,0.2)]">
            {activeImage ? (
              <Image
                key={activeImage}
                src={activeImage}
                alt={liveProduct.name}
                width={420}
                height={420}
                priority
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] transition-all duration-300 animate-in fade-in zoom-in-95"
              />
            ) : (
              <div className="text-slate-400 font-mono text-sm">No Image Available</div>
            )}

            {discountPercent && discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs px-3.5 py-1 rounded-xl shadow-xs">
                {discountPercent}% OFF
              </span>
            )}

            <button
              onClick={() => toggleWishlist(liveProduct.id)}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 shadow-sm active:scale-90 transition-transform"
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border p-1 bg-white dark:bg-slate-900/90 flex-shrink-0 transition-all ${
                    activeImage === img
                      ? "border-blue-600 ring-2 ring-blue-500/30 dark:border-cyan-400 dark:ring-cyan-500/30"
                      : "border-slate-200 dark:border-cyan-500/20"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${liveProduct.name} thumbnail ${idx + 1}`}
                    width={70}
                    height={70}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Guarantee Banner */}
          <div className="glass-card p-4 rounded-2xl flex items-center gap-3 text-xs text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-cyan-500/20 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white block font-bold">Official Theekzu Guarantee:</strong>
              <span className="text-slate-500 dark:text-zinc-400">{liveProduct.specifications.warranty || "Official warranty, verified battery health, and reliable after-sales store support."}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Details & Purchase Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          
          <div>
            {/* Badges & SKU */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 dark:bg-cyan-500/15 border border-blue-500/20 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-300">
                {liveProduct.conditionBadge || liveProduct.condition}
              </span>
              
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                isOutOfStock
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
              }`}>
                {isOutOfStock ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Out of Stock</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock ({currentStock} available)</span>
                  </>
                )}
              </span>

              {sku && (
                <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-white/5">
                  SKU: {sku}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
              {liveProduct.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-zinc-400 mb-5 sm:mb-6 flex-wrap">
              <div className="flex items-center text-amber-500 dark:text-amber-400">
                {Array.from({ length: Math.floor(liveProduct.rating) }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" />
                ))}
                <span className="font-bold ml-1.5 text-slate-900 dark:text-white">{liveProduct.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{liveProduct.reviewsCount} verified reviews</span>
              <span>•</span>
              <span className="text-blue-600 dark:text-cyan-400 font-semibold">Islandwide Courier</span>
            </div>

            {/* Price Display */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/25 mb-6 flex flex-wrap sm:flex-nowrap items-baseline gap-2.5 sm:gap-3 shadow-xs">
              <span
                key={currentPrice}
                className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-700 dark:from-white dark:via-slate-100 dark:to-cyan-300 animate-price-change"
              >
                {formatCurrency(currentPrice)}
              </span>
              {oldPrice && (
                <span className="text-xs sm:text-sm text-slate-400 dark:text-zinc-500 line-through">
                  {formatCurrency(oldPrice)}
                </span>
              )}
              <span className="text-[11px] sm:text-xs text-blue-600 dark:text-cyan-400/80 sm:ml-auto font-medium">
                Variant Price (LKR)
              </span>
            </div>

            {/* Storage Selector */}
            {liveProduct.storageOptions && liveProduct.storageOptions.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs uppercase tracking-wider text-slate-700 dark:text-zinc-400 font-bold">
                    Storage Capacity: <span className="text-blue-600 dark:text-cyan-400">{selectedStorage}</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {liveProduct.storageOptions.map((st) => {
                    const isSelected = st === selectedStorage;
                    // Check if this storage option has any stock in any color
                    const stStock = liveProduct.variants
                      ?.filter((v) => v.storage.toLowerCase() === st.toLowerCase())
                      .reduce((acc, curr) => acc + curr.stock, 0);

                    return (
                      <button
                        key={st}
                        onClick={() => setSelectedStorage(st)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 btn-press ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 dark:border-cyan-400 dark:bg-cyan-500/20 dark:text-cyan-200 dark:ring-cyan-500/40 shadow-xs animate-variant-pop"
                            : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70 text-slate-700 dark:text-zinc-300 hover:border-blue-400 dark:hover:border-cyan-500/40"
                        }`}
                      >
                        <span>{st}</span>
                        {stStock !== undefined && stStock <= 0 && (
                          <span className="text-[10px] text-rose-500 font-normal">(Sold out)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {liveProduct.colors && liveProduct.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs uppercase tracking-wider text-slate-700 dark:text-zinc-400 font-bold">
                    Select Color: <span className="text-blue-600 dark:text-cyan-400">{selectedColor}</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {liveProduct.colors.map((col) => {
                    const isSelected = col.name === selectedColor;
                    const variantForCol = liveProduct.variants?.find(
                      (v) =>
                        v.storage.toLowerCase() === selectedStorage.toLowerCase() &&
                        v.color.toLowerCase() === col.name.toLowerCase()
                    );
                    const colStock = variantForCol ? variantForCol.stock : 5;

                    return (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col.name)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all text-xs font-semibold btn-press ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 text-slate-900 ring-1 ring-blue-500/30 dark:border-cyan-400 dark:bg-slate-800 dark:text-white dark:ring-cyan-400 shadow-xs animate-variant-pop"
                            : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs flex-shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        {colStock <= 0 && (
                          <span className="text-[10px] text-rose-500 font-bold">Sold Out</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart / Buy Now / WhatsApp */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center justify-between border border-slate-200 dark:border-cyan-500/25 bg-slate-50 dark:bg-slate-900 rounded-2xl p-1.5 w-full sm:w-36 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-white font-bold shadow-xs disabled:opacity-40 btn-press"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-sm text-slate-900 dark:text-white px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-white font-bold shadow-xs disabled:opacity-40 btn-press"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 min-h-[44px] py-3.5 px-6 rounded-full text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] btn-press ${
                    isOutOfStock
                      ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 dark:from-cyan-500 dark:to-blue-600 dark:hover:from-cyan-400 dark:hover:to-blue-500 shadow-blue-500/20"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleBuyNow}
                  className="min-h-[44px] py-3.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 border border-slate-200 dark:border-cyan-500/30 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] btn-press"
                >
                  <Zap className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                  <span>{isOutOfStock ? "Inquire on WhatsApp" : "Buy Now (Instant WhatsApp)"}</span>
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] py-3.5 px-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 dark:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all active:scale-[0.98] btn-press"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="pt-6 border-t border-slate-200 dark:border-cyan-500/15">
            <h3 className="text-xs uppercase tracking-wider text-blue-600 dark:text-cyan-300 font-bold mb-2">
              Overview
            </h3>
            <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              {liveProduct.description}
            </p>
          </div>

        </div>

      </div>

      {/* Specifications Detailed Accordion / Table */}
      <div className="glass-card rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-slate-200 dark:border-cyan-500/20 space-y-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-cyan-500/15 pb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>Detailed Specifications</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          {liveProduct.specifications &&
            Object.entries(liveProduct.specifications).map(([key, val]) => (
              <div key={key} className="py-2.5 border-b border-slate-200/80 dark:border-cyan-500/10 flex items-baseline justify-between text-xs gap-4">
                <span className="text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold capitalize">
                  {key}:
                </span>
                <span className="text-slate-800 dark:text-zinc-200 text-right font-medium">{val}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Related Products */}
      {liveRelated.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Related Products</h3>
            <Link
              href={liveProduct.category === "iphones" ? "/iphones" : "/accessories"}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveRelated.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
