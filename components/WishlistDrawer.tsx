"use client";

import React from "react";
import Image from "next/image";
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
      <aside className="fixed top-0 right-0 h-full w-full max-w-md glass-drawer z-50 transition-transform duration-300 flex flex-col border-l border-slate-200 dark:border-cyan-500/20 shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-cyan-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Your Saved Wishlist</h3>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {wishlistProducts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 mx-auto flex items-center justify-center text-rose-500 mb-4 shadow-xs">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Your wishlist is empty</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6 max-w-xs mx-auto">
                Click the heart icon on any device to save it for quick access later.
              </p>
              <Link
                href="/shop"
                onClick={() => setIsWishlistOpen(false)}
                className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-500 dark:to-blue-600 text-white text-xs font-bold shadow-md"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/15 flex gap-3 items-center shadow-xs"
              >
                <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-950 p-1 flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-slate-200 dark:border-cyan-500/10">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">{p.condition}</p>
                  <p className="text-xs font-extrabold text-blue-600 dark:text-cyan-300 mt-0.5">
                    {formatCurrency(p.price)}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        addItem(p);
                        removeFromWishlist(p.id);
                      }}
                      className="text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Cart</span>
                    </button>

                    <button
                      onClick={() => removeFromWishlist(p.id)}
                      className="text-slate-400 dark:text-zinc-500 hover:text-rose-500 text-xs ml-auto transition-colors p-1"
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
