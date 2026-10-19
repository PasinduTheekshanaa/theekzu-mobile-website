"use client";
import { getEnabledVariants, productForCondition, ProductCondition } from "@/data/products";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Eye, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Product } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { storeConfig } from "@/config/store";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductContext";

interface ProductCardProps {
  product: Product;
  condition?: ProductCondition;
}

export const ProductCardComponent: React.FC<ProductCardProps> = ({ product: originalProduct, condition }) => {
  const product = condition ? productForCondition(originalProduct, condition) : { ...originalProduct, variants: getEnabledVariants(originalProduct) };
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { getProductPrimaryImage, getLowestPrice } = useProducts();
  const router = useRouter();
  const wishlisted = isWishlisted(product.id);

  const displayImage = getProductPrimaryImage(product) || (product.images && product.images[0]) || "";
  const minPrice = getLowestPrice(product);
  const hasVariants = product.variants && product.variants.length > 1;

  // Check overall stock
  const isOutOfStock =
    product.stock === "Out of Stock" ||
    (product.variants && product.variants.length > 0 && product.variants.every((v) => (Number(v.stock) || 0) <= 0));

  const [imgLoaded, setImgLoaded] = useState(false);
  const [isOpeningDetails, setIsOpeningDetails] = useState(false);
  const productUrl = `/product/${product.slug}${condition ? `?condition=${encodeURIComponent(condition)}` : ""}`;

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

  return (
    <div
      className="glass-card rounded-[2rem] px-4 py-3 sm:px-5 sm:py-4 w-full min-w-0 flex flex-col justify-between group relative border border-neutral-200 dark:border-neutral-500/20 hover:border-neutral-500/50 dark:hover:border-neutral-400/60 shadow-xs hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_16px_40px_-10px_rgba(91,91,91,0.35)]"
    >
      {/* Top badges & Wishlist */}
      <div className="flex min-h-9 items-center justify-between gap-2 mb-2 z-10">
        <span
          className={`min-w-0 text-left text-[11px] leading-4 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 [&>svg]:shrink-0 shadow-xs ${
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
          className={`w-9 h-9 shrink-0 rounded-full bg-canvas dark:bg-canvas border flex items-center justify-center transition-all duration-200 active:scale-90 shadow-xs ${
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

      {/* Product image blends into the plain page surface. */}
      <Link
        href={productUrl}
        prefetch={false}
        onMouseEnter={preloadDetails}
        onClick={openDetails}
        className="h-56 w-full rounded-2xl bg-canvas bg-canvas   border border-neutral-200/80 dark:border-neutral-500/10 p-4 mb-3 flex items-center justify-center relative overflow-hidden group-hover:border-neutral-400/40 dark:group-hover:border-neutral-500/30 transition-all"
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
              className={`max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-105 relative z-10 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink text-xs font-mono">
            No Image
          </div>
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
      <div className="min-w-0 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Storage & Colors Preview */}
          <div className="grid min-h-7 grid-cols-[minmax(0,1fr)_auto] items-start gap-2 mb-1.5 text-xs text-ink dark:text-ink">
            <span className="text-ink dark:text-ink font-semibold leading-5 break-words">
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
            <h3 className="min-h-6 text-base leading-6 font-bold text-ink dark:text-ink group-hover:text-ink dark:group-hover:text-ink transition-colors mb-1 line-clamp-2 break-words">
              {product.name}
            </h3>
          </Link>

          <div className="flex min-h-4 min-w-0 items-start gap-2 mb-2 text-xs leading-4 text-ink dark:text-ink">
            <span className={`font-semibold flex items-center gap-1 ${isOutOfStock ? "text-ink" : "text-ink dark:text-ink"}`}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${isOutOfStock ? "bg-canvas" : "bg-canvas animate-pulse"}`} />
              {isOutOfStock ? "Out of Stock" : (product.variants?.length ? `${product.variants.length} Options` : product.stock)}
            </span>
            <span className="text-ink dark:text-ink">•</span>
            <span className="min-w-0 flex-1 line-clamp-2 break-words">{product.model}</span>
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-500/15">
          <div className="flex flex-col gap-0.5 mb-2">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-xs leading-4 text-ink font-medium empty:hidden">
                {hasVariants ? "From" : ""}
              </span>
              <span className="whitespace-nowrap text-xl leading-7 font-black tabular-nums text-ink">
                {minPrice > 0 ? formatCurrency(minPrice) : "Price not available"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1">
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
