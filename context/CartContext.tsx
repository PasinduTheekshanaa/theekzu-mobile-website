"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, ProductVariant } from "@/data/products";
import { storeConfig, formatLKR, getWhatsAppUrl } from "@/config/store";

export interface CartItem {
  cartItemId: string;
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  storage: string;
  color: string;
  condition: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (
    product: Product,
    storage?: string,
    color?: string,
    quantity?: number,
    customPrice?: number,
    customImage?: string,
    variantId?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  getWhatsAppCheckoutUrl: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "theekzu_cart_next_v2";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart, isHydrated]);

  const addItem = (
    product: Product,
    storage?: string,
    color?: string,
    quantity: number = 1,
    customPrice?: number,
    customImage?: string,
    variantId?: string
  ) => {
    const selectedStorage = storage || product.storage || (product.storageOptions && product.storageOptions[0]) || "Standard";
    const selectedColor = color || (product.colors && product.colors[0]?.name) || "Default";
    
    // Find matching variant if price not passed explicitly
    let finalPrice = customPrice;
    let finalVariantId = variantId;

    if (finalPrice === undefined && product.variants && product.variants.length > 0) {
      const matchedVariant = product.variants.find(
        (v) =>
          v.storage.toLowerCase() === selectedStorage.toLowerCase() &&
          v.color.toLowerCase() === selectedColor.toLowerCase()
      );
      if (matchedVariant) {
        finalPrice = matchedVariant.price;
        finalVariantId = matchedVariant.id;
      }
    }

    if (finalPrice === undefined) {
      finalPrice = product.price;
    }

    const finalImage = customImage || (product.images && product.images[0]) || "";
    const cartItemId = `${product.id}-${selectedStorage}-${selectedColor}`;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity, price: finalPrice!, image: finalImage || item.image }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            productId: product.id,
            variantId: finalVariantId,
            slug: product.slug,
            name: product.name,
            price: finalPrice!,
            image: finalImage,
            storage: selectedStorage,
            color: selectedColor,
            condition: product.condition,
            quantity,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getWhatsAppCheckoutUrl = (): string => {
    if (cart.length === 0) {
      return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent("Hello Theekzu Mobile, I would like to inquire about your iPhones.")}`;
    }

    const lines = [
      "🛒 *NEW ORDER - THEEKZU MOBILE*",
      "Hello Theekzu Mobile, I would like to place an order:",
      "",
    ];

    cart.forEach((item, index) => {
      lines.push(`*${index + 1}. ${item.name}*`);
      if (item.storage && item.storage !== "Standard") {
        lines.push(`   • Storage: ${item.storage}`);
      }
      if (item.color && item.color !== "Default") {
        lines.push(`   • Color: ${item.color}`);
      }
      lines.push(`   • Condition: ${item.condition}`);
      lines.push(`   • Quantity: ${item.quantity}`);
      lines.push(`   • Price: ${formatLKR(item.price * item.quantity)}`);
      lines.push("");
    });

    lines.push(`💰 *Total Amount: ${formatLKR(subtotal)}*`);
    lines.push("");
    lines.push("Please confirm availability, delivery fee, and payment options.");

    return getWhatsAppUrl(lines.join("\n"));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        getWhatsAppCheckoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
