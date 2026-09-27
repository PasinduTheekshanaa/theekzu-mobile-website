"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    getWhatsAppCheckoutUrl,
  } = useCart();

  const [checkoutError, setCheckoutError] = React.useState("");
  const [checking, setChecking] = React.useState(false);
  const checkout = async () => {
    setChecking(true); setCheckoutError("");
    try { window.location.assign(await getWhatsAppCheckoutUrl()); }
    catch (error) { setCheckoutError(error instanceof Error ? error.message : "Checkout unavailable."); }
    finally { setChecking(false); }
  };

  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsCartOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-out Drawer */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-md glass-drawer z-50 transition-transform duration-300 flex flex-col border-l border-slate-200 dark:border-cyan-500/20 shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-cyan-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-cyan-500/15 border border-blue-500/20 dark:border-cyan-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Your Shopping Cart</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 mx-auto flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-4 shadow-xs">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Your cart is empty</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6 max-w-xs mx-auto">
                Discover our latest brand new iPhones and original Apple accessories.
              </p>
              <Link
                href="/shop"
                onClick={() => setIsCartOpen(false)}
                className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-500 dark:to-blue-600 text-white text-xs font-bold shadow-md"
              >
                Browse Store
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/15 flex gap-3 items-center shadow-xs"
              >
                <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-950 p-1 flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-slate-200 dark:border-cyan-500/10">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {item.storage} • {item.color} •{" "}
                    <span className="text-blue-600 dark:text-cyan-400 font-medium">{item.condition}</span>
                  </p>
                  <p className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-700 dark:from-white dark:to-cyan-300 mt-1">
                    {formatCurrency(item.price)}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-slate-200 dark:border-cyan-500/20 rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="px-2 py-0.5 text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-slate-400 dark:text-zinc-500 hover:text-rose-500 text-xs ml-auto transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with WhatsApp Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 dark:border-cyan-500/20 bg-slate-50/90 dark:bg-[#070c18] space-y-4">
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">Total (Estimated):</span>
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-700 dark:from-cyan-300 dark:to-blue-400">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              We will verify stock and prices before opening WhatsApp. The store will confirm delivery and payment.
            </p>

            <button
              onClick={checkout}
              disabled={checking}
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 dark:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{checking ? "Checking availability…" : "Checkout via WhatsApp"}</span>
            </button>
            {checkoutError && <p role="alert" className="text-sm text-red-600">{checkoutError}</p>}
          </div>
        )}

      </aside>
    </>
  );
};
