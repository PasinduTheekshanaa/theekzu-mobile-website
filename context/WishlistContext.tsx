"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/data/products";
import { useProducts } from "@/context/ProductContext";

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  totalCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "theekzu_wishlist_next_v1";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products } = useProducts();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        setWishlistIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load wishlist from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlistIds, isHydrated]);

  const toggleWishlist = (productId: string): boolean => {
    const exists = wishlistIds.includes(productId);
    if (exists) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      return false;
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      return true;
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const isWishlisted = (productId: string): boolean => {
    return wishlistIds.includes(productId);
  };

  // Uses the dynamic merged products list
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
  const totalCount = wishlistIds.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        totalCount,
        isWishlistOpen,
        setIsWishlistOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};