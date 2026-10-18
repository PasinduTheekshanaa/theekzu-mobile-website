"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MessageCircle, ShoppingBag, ShieldCheck, ChevronRight, Plus, Minus, Heart, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Product, ProductVariant, ProductCondition, getProductConditions, getConditionVariants } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { PRODUCT_WARRANTY_NOTICE } from "@/config/warranty";
import { storeConfig, getWhatsAppUrl } from "@/config/store";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
  initialCondition?: ProductCondition;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product: initialProduct,
  related: initialRelated,
  initialCondition,
}) => {
  const { getProductBySlug, getRelatedProducts, getProductPrimaryImage, getProductColorImage, customImages, isLiveDatabase, catalogError } = useProducts();
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

  const availableConditions = getProductConditions(liveProduct);
  const [conditionChoice, setConditionChoice] = useState<ProductCondition>(initialCondition || liveProduct.condition);
  const selectedCondition = availableConditions.includes(conditionChoice) ? conditionChoice : availableConditions[0];
  const conditionVariants = getConditionVariants(liveProduct, selectedCondition);
  const firstVariant = conditionVariants.find(v => v.stock > 0) || conditionVariants[0];
  const [selectedStorage, setSelectedStorage] = useState(firstVariant?.storage || defaultStorage);
  const [selectedColor, setSelectedColor] = useState(firstVariant?.color || defaultColor);
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
    conditionVariants.find(
      (v) =>
        v.storage.toLowerCase() === selectedStorage.toLowerCase() &&
        v.color.toLowerCase() === selectedColor.toLowerCase()
    );

  // Dynamic pricing & Stock Verification
  const currentPrice = currentVariant?.price;

  // Variant & Product Stock logic
  const currentVariantStock = currentVariant ? (Number(currentVariant.stock) || 0) : 0;
  const isProductLevelOutOfStock = liveProduct.stock === "Out of Stock";
  const areAllVariantsOutOfStock = Boolean(
    conditionVariants.length === 0 || conditionVariants.every((v) => (Number(v.stock) || 0) <= 0)
  );
  const isOutOfStock = Boolean(catalogError) || !contextProduct || isProductLevelOutOfStock || areAllVariantsOutOfStock || currentVariantStock <= 0 || !currentPrice;
  React.useEffect(() => { setQuantity(q => Math.max(1, Math.min(q, currentVariantStock))); }, [currentVariantStock]);
  const sku = currentVariant?.sku;

  const chooseCondition = (condition: ProductCondition) => {
    setConditionChoice(condition);
    const variants = getConditionVariants(liveProduct, condition);
    const first = variants.find(v => v.stock > 0) || variants[0];
    if (first) { setSelectedStorage(first.storage); setSelectedColor(first.color); }
    setQuantity(1);
  };

  const chooseStorage = (storage: string) => {
    setSelectedStorage(storage);
    const matches = conditionVariants.filter(v => v.storage === storage);
    if (!matches.some(v => v.color === selectedColor)) {
      const first = matches.find(v => v.stock > 0) || matches[0];
      if (first) setSelectedColor(first.color);
    }
    setQuantity(1);
  };

  const wishlisted = isWishlisted(liveProduct.id);

  // High-precision WhatsApp message: inquiry vs confirmed order
  const waMessage = isOutOfStock
    ? `💬 *THEEKZU MOBILE - STOCK AVAILABILITY INQUIRY*

Hello Theekzu Mobile,

I noticed that the following item is currently marked as Out of Stock:

• *Product:* ${liveProduct.name}
• *Storage:* ${selectedStorage}
• *Color:* ${selectedColor}
• *Condition:* ${selectedCondition}

Can you please let me know when this model or variant will be restocked, or if there is an alternative available?`
    : `🛒 *THEEKZU MOBILE - PRODUCT ORDER*

Hello Theekzu Mobile, I would like to place an order for:

• *Product:* ${liveProduct.name}
• *Storage:* ${selectedStorage}
• *Color:* ${selectedColor}
• *SKU:* ${sku}
• *Price:* ${formatCurrency(currentPrice || 0)}
• *Stock Status:* In Stock (${currentVariantStock} available)
• *Quantity:* ${quantity}
• *Condition:* ${selectedCondition}

Please confirm availability and islandwide delivery options!`;

  const waUrl = getWhatsAppUrl(waMessage);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({ ...liveProduct, condition: selectedCondition }, selectedStorage, selectedColor, quantity, currentPrice, activeImage, currentVariant?.id);
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
    <div className="space-y-5 sm:space-y-6 transition-colors duration-300">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-ink dark:text-ink">
        <Link href="/" className="hover:text-ink dark:hover:text-ink transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-ink dark:text-ink" />
        <Link href={liveProduct.category === "iphones" ? "/iphones" : "/accessories"} className="hover:text-ink dark:hover:text-ink transition-colors capitalize">
          {liveProduct.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-ink dark:text-ink" />
        <span className="text-ink dark:text-ink font-medium truncate">{liveProduct.name}</span>
      </nav>

      {/* Main Product Layout (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full h-72 sm:h-96 md:h-[480px] rounded-2xl sm:rounded-[2.5rem] bg-canvas border border-neutral-200 dark:border-neutral-500/25 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
            {activeImage ? (
              <Image
                key={activeImage}
                src={activeImage}
                alt={liveProduct.name}
                width={420}
                height={420}
                priority
                className="max-h-full max-w-full object-contain transition-all duration-300 animate-in fade-in zoom-in-95"
              />
            ) : (
              <div className="text-ink font-mono text-sm">No Image Available</div>
            )}


            <button
              onClick={() => toggleWishlist(liveProduct.id)}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/30 flex items-center justify-center text-ink dark:text-ink hover:text-ink shadow-sm active:scale-90 transition-transform"
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? "fill-neutral-500 text-ink" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border p-1 bg-canvas dark:bg-canvas flex-shrink-0 transition-all ${
                    activeImage === img
                      ? "border-neutral-600 ring-2 ring-neutral-500/30 dark:border-neutral-400 dark:ring-neutral-500/30"
                      : "border-neutral-200 dark:border-neutral-500/20"
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
          <div className="glass-card p-4 rounded-2xl flex items-center gap-3 text-xs text-ink dark:text-ink border border-neutral-200 dark:border-neutral-500/20 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-ink dark:text-ink flex-shrink-0" />
            <div>
              <strong className="text-ink dark:text-ink block font-bold">Theekzu Mobile Warranty:</strong>
              <span className="text-ink dark:text-ink">{PRODUCT_WARRANTY_NOTICE}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Details & Purchase Actions */}
        <div className="lg:col-span-6 min-w-0 flex flex-col justify-between space-y-6 text-left">
          
          <div>
            {/* Badges & SKU */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-ink dark:text-ink">
                {availableConditions.join(" & ")}
              </span>
              
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                isOutOfStock
                  ? "bg-canvas border-neutral-500/30 text-ink dark:text-ink"
                  : "bg-canvas border-neutral-500/30 text-ink dark:text-ink"
              }`}>
                {isOutOfStock ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Out of Stock</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock ({currentVariantStock} available)</span>
                  </>
                )}
              </span>

              {sku && (
                <span className="min-w-0 max-w-full break-all text-[11px] font-mono text-ink dark:text-ink bg-canvas dark:bg-canvas px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-white/5">
                  SKU: {sku}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl leading-tight break-words font-black text-ink dark:text-ink mb-2">
              {liveProduct.name}
            </h1>

            <p className="text-xs mb-5 text-ink dark:text-ink">Islandwide Courier</p>

            {/* Price Display */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/25 mb-6 flex flex-wrap sm:flex-nowrap items-baseline gap-2.5 sm:gap-3 shadow-xs">
              <span
                key={currentPrice}
                className="whitespace-nowrap tabular-nums text-2xl sm:text-3xl md:text-4xl font-black text-ink animate-price-change"
              >
                {currentPrice ? formatCurrency(currentPrice) : "Price not available"}
              </span>
              <span className="text-[11px] sm:text-xs text-ink dark:text-ink sm:ml-auto font-medium">
                Variant Price (LKR)
              </span>
            </div>

            {liveProduct.category === "iphones" && <fieldset className="mb-6">
              <legend className="text-xs uppercase tracking-wider font-bold mb-2.5">Condition: {selectedCondition}</legend>
              <div className="flex flex-wrap gap-2.5">
                {availableConditions.map(condition => (
                  <button key={condition} type="button" aria-pressed={condition === selectedCondition}
                    onClick={() => chooseCondition(condition)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${condition === selectedCondition ? "border-neutral-600 bg-canvas text-ink dark:bg-canvas dark:text-ink" : "border-neutral-200 dark:border-white/10"}`}>
                    {condition}
                  </button>
                ))}
              </div>
            </fieldset>}

            {/* Storage Selector */}
            {liveProduct.storageOptions && liveProduct.storageOptions.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs uppercase tracking-wider text-ink dark:text-ink font-bold">
                    Storage Capacity: <span className="text-ink dark:text-ink">{selectedStorage}</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {liveProduct.storageOptions.map((st) => {
                    const isSelected = st === selectedStorage;
                    // Check if this storage option has any stock in any color
                    const stStock = conditionVariants
                      ?.filter((v) => v.storage.toLowerCase() === st.toLowerCase())
                      .reduce((acc, curr) => acc + curr.stock, 0);

                    return (
                      <button
                        key={st}
                        onClick={() => chooseStorage(st)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 btn-press ${
                          isSelected
                            ? "border-neutral-600 bg-canvas text-ink ring-2 ring-neutral-500/20 dark:border-neutral-400 dark:bg-canvas dark:text-ink dark:ring-neutral-500/40 shadow-xs animate-variant-pop"
                            : "border-neutral-200 bg-canvas dark:border-white/10 dark:bg-canvas text-ink dark:text-ink hover:border-neutral-400 dark:hover:border-neutral-500/40"
                        }`}
                      >
                        <span>{st}</span>
                        {stStock !== undefined && stStock <= 0 && (
                          <span className="text-[10px] text-ink font-normal">(Sold out)</span>
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
                  <label className="text-xs uppercase tracking-wider text-ink dark:text-ink font-bold">
                    Select Color: <span className="text-ink dark:text-ink">{selectedColor}</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {liveProduct.colors.map((col) => {
                    const isSelected = col.name === selectedColor;
                    const variantForCol = conditionVariants.find(
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
                            ? "border-neutral-600 bg-action text-on-action ring-1 ring-neutral-500/30 dark:border-neutral-400 dark:bg-action dark:text-on-action dark:ring-neutral-400 shadow-xs animate-variant-pop"
                            : "border-neutral-200 bg-canvas dark:border-white/10 dark:bg-canvas text-ink dark:text-ink hover:text-ink dark:hover:text-ink"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs flex-shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        {colStock <= 0 && (
                          <span className="text-[10px] text-ink font-bold">Sold Out</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector, Add to Cart & WhatsApp */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center justify-between border border-neutral-200 dark:border-neutral-500/25 bg-canvas dark:bg-canvas rounded-2xl p-1.5 w-full sm:w-36 shadow-xs">
                  <button data-ui="primary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="w-8 h-8 rounded-xl bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas flex items-center justify-center text-ink dark:text-ink font-bold shadow-xs disabled:opacity-40 btn-press"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-sm text-ink dark:text-ink px-2">{quantity}</span>
                  <button data-ui="primary"
                    onClick={() => setQuantity(Math.min(currentVariantStock, quantity + 1))}
                    disabled={isOutOfStock}
                    className="w-8 h-8 rounded-xl bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas flex items-center justify-center text-ink dark:text-ink font-bold shadow-xs disabled:opacity-40 btn-press"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  data-ui="primary"
                  disabled={isOutOfStock}
                  className={`flex-1 min-h-[44px] py-3.5 px-6 rounded-full text-ink text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] btn-press ${
                    isOutOfStock
                      ? "bg-canvas dark:bg-canvas cursor-not-allowed opacity-60"
                      : "bg-canvas         shadow-neutral-500/20"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">

                <a data-ui="whatsapp"
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`min-h-[44px] py-3.5 px-4 rounded-full text-ink text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] btn-press ${
                    isOutOfStock
                      ? "bg-canvas     shadow-neutral-500/20"
                      : "bg-canvas     shadow-neutral-500/20 dark:shadow-[0_0_20px_rgba(145,145,145,0.35)]"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{isOutOfStock ? "Inquire Availability on WhatsApp" : "Order via WhatsApp"}</span>
                </a>
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-500/15">
            <h3 className="text-xs uppercase tracking-wider text-ink dark:text-ink font-bold mb-2">
              Overview
            </h3>
            <p className="text-sm text-ink dark:text-ink leading-relaxed">
              {liveProduct.description}
            </p>
          </div>

        </div>

      </div>

      {/* Specifications Detailed Accordion / Table */}
      <div className="glass-card rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-neutral-200 dark:border-neutral-500/20 space-y-6 shadow-sm">
        <h3 className="text-xl font-bold text-ink dark:text-ink border-b border-neutral-200 dark:border-neutral-500/15 pb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-ink dark:text-ink" />
          <span>Detailed Specifications</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          {liveProduct.specifications &&
            Object.entries(liveProduct.specifications).map(([key, val]) => (
              <div key={key} className="py-2.5 border-b border-neutral-200/80 dark:border-neutral-500/10 flex items-baseline justify-between text-xs gap-4">
                <span className="text-ink dark:text-ink uppercase tracking-wider font-semibold capitalize">
                  {key}:
                </span>
                <span className="text-ink dark:text-ink text-right font-medium">{val}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Related Products */}
      {liveRelated.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-ink dark:text-ink">Related Products</h3>
            <Link
              href={liveProduct.category === "iphones" ? "/iphones" : "/accessories"}
              className="text-xs font-bold text-ink dark:text-ink hover:underline"
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
