"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, Eye, ShieldCheck, Sparkles } from "lucide-react";
import { Product } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { storeConfig } from "@/config/store";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { getProductPrimaryImage, getLowestPrice } = useProducts();
  const wishlisted = isWishlisted(product.id);

  const defaultColor = product.colors && product.colors[0] ? product.colors[0].name : "Standard";
  const defaultStorage = product.storage || (product.storageOptions && product.storageOptions[0]) || "Standard";
  const displayImage = getProductPrimaryImage(product) || (product.images && product.images[0]) || "";
  const minPrice = getLowestPrice(product);
  const hasVariants = product.variants && product.variants.length > 1;

  // Check overall stock
  const isOutOfStock = product.stock === "Out of Stock" || (product.variants && product.variants.every((v) => v.stock <= 0));

  // Subtle 3D tilt calculation on desktop hover
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const waMessage = `Hello Theekzu Mobile,

I am interested in:

Product: ${product.name}
Price: ${hasVariants ? "From " : ""}${formatCurrency(minPrice)}
Available Storage: ${product.storageOptions ? product.storageOptions.join(", ") : defaultStorage}
Color: ${defaultColor}
Condition: ${product.condition}

Can you confirm availability and latest variant pricing?`;

  const waUrl = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`,
        transition: "transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      className="glass-card rounded-[2rem] p-5 flex flex-col justify-between group relative border border-slate-200 dark:border-cyan-500/20 hover:border-blue-500/50 dark:hover:border-cyan-400/60 shadow-xs hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_16px_40px_-10px_rgba(0,102,255,0.35)]"
    >
      {/* Top badges & Wishlist */}
      <div className="flex items-center justify-between gap-2 mb-3 z-10">
        <span
          className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs ${
            product.condition === "Brand New"
              ? "bg-blue-500/10 dark:bg-blue-600/20 text-blue-700 dark:text-cyan-300 border border-blue-500/20 dark:border-cyan-500/40"
              : "bg-purple-500/10 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 dark:border-purple-500/40"
          }`}
        >
          {product.condition === "Brand New" ? (
            <Sparkles className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
          ) : (
            <ShieldCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          )}
          {product.conditionBadge || product.condition}
        </span>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900/90 border flex items-center justify-center transition-all duration-200 active:scale-90 shadow-xs ${
            wishlisted
              ? "text-rose-500 border-rose-500/50 shadow-xs"
              : "text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:border-blue-400 dark:hover:border-cyan-400/50"
          }`}
          title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 transition-transform ${wishlisted ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
        </button>
      </div>

      {/* Product Image Area with Smooth Zoom and Lighting */}
      <Link
        href={`/product/${product.slug}`}
        className="h-56 w-full rounded-2xl bg-slate-50/80 dark:bg-gradient-to-b dark:from-slate-900/50 dark:to-slate-950/80 border border-slate-200/80 dark:border-cyan-500/10 p-4 mb-4 flex items-center justify-center relative overflow-hidden group-hover:border-blue-400/40 dark:group-hover:border-cyan-500/30 transition-all"
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.name}
            width={280}
            height={280}
            className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-mono">
            No Image
          </div>
        )}

        {product.discount && (
          <span className="absolute bottom-3 left-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
            {product.discount}
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute top-3 right-3 bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Product Meta */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Storage & Colors Preview */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500 dark:text-zinc-400">
            <span className="text-blue-600 dark:text-cyan-300/90 font-semibold truncate">
              {product.storageOptions ? product.storageOptions.join(" • ") : product.storage}
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/80 px-2 py-1 rounded-full border border-slate-200 dark:border-white/5 shadow-xs flex-shrink-0">
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
                <span className="text-[9px] text-slate-400 font-bold">+{product.colors.length - 4}</span>
              )}
            </div>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors mb-1.5 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mb-3 text-xs text-slate-500 dark:text-zinc-400">
            <span className={`font-semibold flex items-center gap-1 ${isOutOfStock ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}`}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${isOutOfStock ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`} />
              {isOutOfStock ? "Out of Stock" : (product.variants?.length ? `${product.variants.length} Options` : product.stock)}
            </span>
            <span className="text-slate-400 dark:text-zinc-600">•</span>
            <span className="truncate">{product.model}</span>
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="pt-3 border-t border-slate-200 dark:border-cyan-500/15">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
              {hasVariants ? "From" : ""}
            </span>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-700 dark:from-white dark:via-slate-100 dark:to-cyan-300">
              {formatCurrency(minPrice)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-slate-400 dark:text-zinc-500 line-through">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all text-center flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Details</span>
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-xs font-bold text-white transition-all text-center flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-[0.98]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
