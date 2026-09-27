import type { Product } from "@/data/products";
import type { CartItem } from "@/context/CartContext";
export function reconcileCart(cart: CartItem[], products: Product[]): CartItem[] {
  return cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    const variant = product?.variants?.find(v => item.variantId ? v.id === item.variantId : v.storage === item.storage && v.color === item.color);
    const available = product?.stock === "In Stock" && variant && variant.stock > 0;
    return { ...item, price: variant?.price ?? item.price, quantity: available ? Math.max(1, Math.min(item.quantity, variant.stock)) : item.quantity, stockStatus: available ? "In Stock" : "Out of Stock" };
  });
}
