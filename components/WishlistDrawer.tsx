"use client";
import { getProductConditionLabel } from "@/data/products";

import React from "react";
import { ResilientProductImage } from "@/components/ResilientProductImage";
import Link from "next/link";
import { Heart, X, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";

export const WishlistDrawer: React.FC = () => {
  const { wishlistProducts, isWishlistOpen, setIsWishlistOpen, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  React.useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsWishlistOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isWishlistOpen, setIsWishlistOpen]);

  if (!isWishlistOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Slide-out Drawer */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-md glass-drawer z-50 transition-transform duration-300 flex flex-col border-l border-neutral-200 dark:border-neutral-500/20 shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-canvas border border-neutral-500/20 flex items-center justify-center text-ink">
              <Heart className="w-4 h-4 fill-neutral-500" />
            </div>
            <h3 className="text-base font-bold text-ink dark:text-ink">Your Saved Wishlist</h3>
          </div>
          <button data-ui="primary"
            onClick={() => setIsWishlistOpen(false)}
            className="w-9 h-9 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-white/10 flex items-center justify-center text-ink dark:text-ink hover:text-ink dark:hover:text-ink transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {wishlistProducts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-canvas border border-neutral-500/20 mx-auto flex items-center justify-center text-ink mb-4 shadow-xs">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-ink dark:text-ink mb-1">Your wishlist is empty</h4>
              <p className="text-xs text-ink dark:text-ink mb-6 max-w-xs mx-auto">
                Click the heart icon on any device to save it for quick access later.
              </p>
              <Link data-ui="primary"
                href="/shop"
                onClick={() => setIsWishlistOpen(false)}
                className="inline-flex px-6 py-3 rounded-full bg-canvas     text-ink text-xs font-bold shadow-md"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/15 flex gap-3 items-center shadow-xs"
              >
                <div className="w-16 h-16 rounded-xl bg-canvas dark:bg-canvas p-1 flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-neutral-200 dark:border-neutral-500/10">
                  <ResilientProductImage
                    src={p.images[0]}
                    alt={p.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-ink dark:text-ink truncate">{p.name}</h4>
                  <p className="text-[11px] text-ink dark:text-ink">{getProductConditionLabel(p)}</p>
                  <p className="text-xs font-extrabold text-ink dark:text-ink mt-0.5">
                    {formatCurrency(p.price)}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {p.stock === "Out of Stock" ? (
                      <span className="text-[11px] font-bold text-ink dark:text-ink bg-canvas border border-neutral-500/20 px-2.5 py-1 rounded-lg">
                        Out of Stock
                      </span>
                    ) : (
                      <button data-ui="primary"
                        onClick={() => {
                          addItem(p);
                          removeFromWishlist(p.id);
                        }}
                        className="text-[11px] font-semibold text-ink bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas px-3 py-1 rounded-lg flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>
                    )}

                    <button
                      onClick={() => removeFromWishlist(p.id)}
                      className="text-ink dark:text-ink hover:text-ink text-xs ml-auto transition-colors p-1"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </aside>
    </>
  );
};
