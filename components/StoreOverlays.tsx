"use client";

import dynamic from "next/dynamic";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const CartDrawer = dynamic(() => import("./CartDrawer").then(module => module.CartDrawer), { ssr: false });
const WishlistDrawer = dynamic(() => import("./WishlistDrawer").then(module => module.WishlistDrawer), { ssr: false });

export function StoreOverlays() {
  const { isCartOpen } = useCart();
  const { isWishlistOpen } = useWishlist();

  return <>
    {isCartOpen && <CartDrawer />}
    {isWishlistOpen && <WishlistDrawer />}
  </>;
}
