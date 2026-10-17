"use client";
import { getProductConditionLabel } from "@/data/products";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Eye, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Product } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { storeConfig } from "@/config/store";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCardComponent: React.FC<ProductCardProps> = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { getProductPrimaryImage, getLowestPrice } = useProducts();
  const router = useRouter();
  const wishlisted = isWishlisted(product.id);

  const defaultColor = product.colors && product.colors[0] ? product.colors[0].name : "Standard";
  const defaultStorage = product.storage || (product.storageOptions && product.storageOptions[0]) || "Standard";
  const displayImage = getProductPrimaryImage(product) || (product.images && product.images[0]) || "";
  const minPrice = getLowestPrice(product);
  const hasVariants = product.variants && product.variants.length > 1;

  // Check overall stock
  const isOutOfStock =
    product.stock === "Out of Stock" ||
    (product.variants && product.variants.length > 0 && product.variants.every((v) => (Number(v.stock) || 0) <= 0));

  const [imgLoaded, setImgLoaded] = useState(false);
  const [isOpeningDetails, setIsOpeningDetails] = useState(false);
  const productUrl = `/product/${product.slug}`;

  const preloadDetails = useCallback(() => {
    router.prefetch(productUrl);
  }, [router, productUrl]);

  const openDetails = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setIsOpeningDetails(true);
    preloadDetails();
    router.push(productUrl);
  }, [preloadDetails, productUrl, router]);

  const waMessage = isOutOfStock
    ? `Hello Theekzu Mobile,

I noticed that ${product.name} is currently marked as Out of Stock.
Could you please let me know when this model or specific variants will be back in stock?

Product: ${product.name}
Condition: ${getProductConditionLabel(product)}`
    : `Hello Theekzu Mobile,

I am interested in:

Product: ${product.name}
Price: ${hasVariants ? "From " : ""}${formatCurrency(minPrice)}
Available Storage: ${product.storageOptions ? product.storageOptions.join(", ") : defaultStorage}
Color: ${defaultColor}
Condition: ${getProductConditionLabel(product)}

Can you confirm availability and latest variant pricing?`;

  const waUrl = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div
      className="glass-card rounded-[2rem] p-4 sm:p-5 w-full min-w-0 flex flex-col justify-between group relative border border-neutral-200 dark:border-neutral-500/20 hover:border-neutral-500/50 dark:hover:border-neutral-400/60 shadow-xs hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_16px_40px_-10px_rgba(91,91,91,0.35)]"
    >
      {/* Top badges & Wishlist */}
      <div className="flex items-center justify-between gap-2 mb-3 z-10">
        <span
          className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs ${
            product.condition === "Brand New"
              ? "bg-canvas dark:bg-canvas text-ink dark:text-ink border border-neutral-500/20 dark:border-neutral-500/40"
              : "bg-canvas dark:bg-canvas text-ink dark:text-ink border border-neutral-500/20 dark:border-neutral-500/40"
          }`}
        >
          {product.condition === "Brand New" ? (
            <Sparkles className="w-3 h-3 text-ink dark:text-ink" />
          ) : (
            <ShieldCheck className="w-3 h-3 text-ink dark:text-ink" />
          )}
          {product.conditionBadge || product.condition}
        </span>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`w-9 h-9 rounded-full bg-canvas dark:bg-canvas border flex items-center justify-center transition-all duration-200 active:scale-90 shadow-xs ${
            wishlisted
              ? "text-ink border-neutral-500/50 shadow-xs"
              : "text-ink dark:text-ink border-neutral-200 dark:border-white/10 hover:text-ink dark:hover:text-ink hover:border-neutral-400 dark:hover:border-neutral-400/50"
          }`}
          title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 transition-transform ${wishlisted ? "fill-neutral-500 text-ink scale-110" : ""}`} />
        </button>
      </div>

      {/* Product Image Area with Smooth Zoom and Lighting */}
      <Link
        href={productUrl}
        prefetch={false}
        onMouseEnter={preloadDetails}
        onClick={openDetails}
        className="h-56 w-full rounded-2xl bg-canvas bg-canvas   border border-neutral-200/80 dark:border-neutral-500/10 p-4 mb-4 flex items-center justify-center relative overflow-hidden group-hover:border-neutral-400/40 dark:group-hover:border-neutral-500/30 transition-all"
      >
        {displayImage ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-4 rounded-xl skeleton z-0" />
            )}
            <Image
              src={displayImage}
              alt={`${product.name} - Theekzu Mobile Sri Lanka`}
              width={280}
              height={280}
              onLoad={() => setImgLoaded(true)}
              className={`max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-105 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_18px_28px_rgba(0,102,255,0.3)] dark:drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] relative z-10 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink text-xs font-mono">
            No Image
          </div>
        )}

        {product.discount && (
          <span data-ui="offer-badge" className="absolute bottom-3 left-3 bg-canvas   text-ink text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs z-20">
            {product.discount}
          </span>
        )}

        {/* Stock Status Badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 bg-canvas text-ink text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md z-20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-canvas animate-pulse" />
            Out of Stock
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-canvas backdrop-blur-md text-ink text-[10px] font-bold px-2 py-0.5 rounded shadow z-20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            In Stock
          </span>
        )}
      </Link>

      {/* Product Meta */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Storage & Colors Preview */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs text-ink dark:text-ink">
            <span className="text-ink dark:text-ink font-semibold truncate">
              {product.storageOptions ? product.storageOptions.join(" • ") : product.storage}
            </span>
            <div className="flex items-center gap-1.5 bg-canvas dark:bg-canvas px-2 py-1 rounded-full border border-neutral-200 dark:border-white/5 shadow-xs flex-shrink-0">
              {product.colors &&
                product.colors.slice(0, 4).map((c) => (
                  <span
                    key={c.name}
                    className="w-2.5 h-2.5 rounded-full border border-black/30 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              {product.colors && product.colors.length > 4 && (
                <span className="text-[9px] text-ink font-bold">+{product.colors.length - 4}</span>
              )}
            </div>
          </div>

          <Link href={productUrl} prefetch={false} onMouseEnter={preloadDetails} onClick={openDetails}>
            <h3 className="text-base font-bold text-ink dark:text-ink group-hover:text-ink dark:group-hover:text-ink transition-colors mb-1.5 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mb-3 text-xs text-ink dark:text-ink">
            <span className={`font-semibold flex items-center gap-1 ${isOutOfStock ? "text-ink" : "text-ink dark:text-ink"}`}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${isOutOfStock ? "bg-canvas" : "bg-canvas animate-pulse"}`} />
              {isOutOfStock ? "Out of Stock" : (product.variants?.length ? `${product.variants.length} Options` : product.stock)}
            </span>
            <span className="text-ink dark:text-ink">•</span>
            <span className="truncate">{product.model}</span>
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-500/15">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xs text-ink dark:text-ink font-medium">
              {hasVariants ? "From" : ""}
            </span>
            <span data-ui={product.oldPrice && product.oldPrice > minPrice ? "sale-price" : undefined} className="text-xl font-black text-ink text-ink text-ink     ">
              {formatCurrency(minPrice)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-ink dark:text-ink line-through">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link data-ui="primary"
              href={productUrl}
              prefetch={false}
              onMouseEnter={preloadDetails}
              onClick={openDetails}
              className="min-h-[44px] py-2.5 px-2.5 sm:px-3 rounded-xl bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas border border-neutral-200 dark:border-white/10 text-xs font-semibold text-ink dark:text-ink hover:text-ink dark:hover:text-ink transition-all text-center flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] btn-press group/btn"
            >
              <Eye className="w-3.5 h-3.5 text-ink dark:text-ink shrink-0 group-hover/btn:scale-110 transition-transform" />
              <span>Details</span>
            </Link>

            <a data-ui="whatsapp"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`min-h-[44px] py-2.5 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] btn-press ${
                isOutOfStock
                  ? "bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas text-ink dark:text-ink border border-neutral-300 dark:border-white/10"
                  : "bg-canvas     text-ink shadow-neutral-500/20 group/wa"
              }`}
              title={isOutOfStock ? "Inquire about stock availability" : "Inquire or order via WhatsApp"}
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0 group-hover/wa:scale-110 transition-transform" />
              <span>{isOutOfStock ? "Inquire Stock" : "WhatsApp"}</span>
            </a>
          </div>
        </div>

      </div>

      {isOpeningDetails && (
        <div className="absolute inset-0 z-30 rounded-[2rem] bg-canvas dark:bg-canvas backdrop-blur-[2px] flex items-center justify-center gap-2 text-xs font-bold text-ink dark:text-ink animate-in fade-in duration-150 pointer-events-none">
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          Opening details…
        </div>
      )}

    </div>
  );
};

export const ProductCard = React.memo(ProductCardComponent);
