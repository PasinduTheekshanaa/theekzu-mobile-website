"use client";

import React from "react";
import { ResilientProductImage } from "@/components/ResilientProductImage";
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
      <aside className="fixed top-0 right-0 h-full w-full max-w-md glass-drawer z-50 transition-transform duration-300 flex flex-col border-l border-neutral-200 dark:border-neutral-500/20 shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 flex items-center justify-center text-ink dark:text-ink">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-ink dark:text-ink">Your Shopping Cart</h3>
          </div>
          <button data-ui="primary"
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-white/10 flex items-center justify-center text-ink dark:text-ink hover:text-ink dark:hover:text-ink transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/20 mx-auto flex items-center justify-center text-ink dark:text-ink mb-4 shadow-xs">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-ink dark:text-ink mb-1">Your cart is empty</h4>
              <p className="text-xs text-ink dark:text-ink mb-6 max-w-xs mx-auto">
                Discover our latest brand new iPhones and original Apple accessories.
              </p>
              <Link data-ui="primary"
                href="/shop"
                onClick={() => setIsCartOpen(false)}
                className="inline-flex px-6 py-3 rounded-full bg-canvas     text-ink text-xs font-bold shadow-md"
              >
                Browse Store
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-3.5 rounded-2xl bg-canvas dark:bg-canvas border border-neutral-200 dark:border-neutral-500/15 flex gap-3 items-center shadow-xs"
              >
                <div className="w-16 h-16 rounded-xl bg-canvas dark:bg-canvas p-1 flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-neutral-200 dark:border-neutral-500/10">
                  <ResilientProductImage
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-ink dark:text-ink truncate">{item.name}</h4>
                  <p className="text-[11px] text-ink dark:text-ink">
                    {item.storage} • {item.color} •{" "}
                    <span className="text-ink dark:text-ink font-medium">{item.condition}</span>
                  </p>
                  {item.iphoneModel && <p className="text-[11px] mt-1">iPhone Model: {item.iphoneModel}</p>}
                  <p className="text-xs font-extrabold text-ink text-ink text-ink     mt-1">
                    {formatCurrency(item.price)}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-neutral-200 dark:border-neutral-500/20 rounded-lg overflow-hidden bg-canvas dark:bg-canvas">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="px-2 py-0.5 text-xs text-ink dark:text-ink hover:text-ink dark:hover:text-ink"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-ink dark:text-ink">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="px-2 py-0.5 text-xs text-ink dark:text-ink hover:text-ink dark:hover:text-ink"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-ink dark:text-ink hover:text-ink text-xs ml-auto transition-colors p-1"
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
          <div className="p-5 border-t border-neutral-200 dark:border-neutral-500/20 bg-canvas dark:bg-canvas space-y-4">
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-sm font-bold text-ink dark:text-ink">Total (Estimated):</span>
              <span className="text-xl font-black text-ink text-ink text-ink    ">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <p className="text-[11px] text-ink dark:text-ink">
              We will verify stock and prices before opening WhatsApp. The store will confirm delivery and payment.
            </p>

            <button data-ui="whatsapp"
              onClick={checkout}
              disabled={checking}
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-4 rounded-full bg-canvas     text-ink text-xs font-bold shadow-md shadow-neutral-500/20 dark:shadow-[0_0_20px_rgba(145,145,145,0.35)] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{checking ? "Checking availability…" : "Checkout via WhatsApp"}</span>
            </button>
            {checkoutError && <p role="alert" className="text-sm text-ink">{checkoutError}</p>}
          </div>
        )}

      </aside>
    </>
  );
};
