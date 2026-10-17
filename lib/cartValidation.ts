import type { Product } from "@/data/products";
import { getProductConditions } from "@/data/products";
import type { CartItem } from "@/context/CartContext";
export function reconcileCart(cart: CartItem[], products: Product[]): CartItem[] {
  const allocated = new Map<string, number>();
  return cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    const variant = product?.variants?.find(v => item.variantId ? v.id === item.variantId : v.storage === item.storage && v.color === item.color);
    const key = `${product?.id}:${variant?.id}`;
    const remaining = Math.max(0, (variant?.stock || 0) - (allocated.get(key) || 0));
    const conditionAvailable = product && (!item.condition || getProductConditions(product).some(condition => condition === item.condition));
    const available = product?.stock === "In Stock" && variant && remaining > 0 && conditionAvailable;
    const quantity = available ? Math.max(1, Math.min(item.quantity, remaining)) : item.quantity;
    if (available) allocated.set(key, (allocated.get(key) || 0) + quantity);
    return { ...item, price: variant?.price ?? item.price, quantity, stockStatus: available ? "In Stock" : "Out of Stock" };
  });
}
