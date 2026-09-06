import { storeConfig } from "@/config/store";

/**
 * Format numeric price into Sri Lankan Rupee standard display (e.g. Rs. 429,900)
 * Central formatter used by cards, checkout, cart, wishlist, and details.
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) {
    return `${storeConfig.currencySymbol} 0`;
  }
  return `${storeConfig.currencySymbol} ${amount.toLocaleString("en-LK")}`;
}

export function formatLKR(amount: number): string {
  return formatCurrency(amount);
}

export default formatCurrency;
