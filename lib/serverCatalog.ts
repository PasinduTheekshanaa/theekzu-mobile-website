import { unstable_cache } from "next/cache";
import { cache } from "react";
import { loadProductsFromSupabase } from "./supabaseService";
import type { StorefrontCatalogResult } from "./supabaseService";

// Keep storefront navigation fast while retaining a short refresh window for
// stock and price changes made in the admin dashboard.
const getCachedCatalog = unstable_cache(
  async () => {
    const result = await loadProductsFromSupabase();
    // A failed refresh must not replace the last successful catalog in Next's
    // persistent cache. Checkout independently verifies live prices and stock.
    if (result.source !== "Supabase") throw new Error("Catalog read failed");
    return result;
  },
  ["theekzu-server-catalog-v2"],
  { revalidate: 30 }
);

// Share one result between layout, metadata and page in the same render.
export const getServerCatalog = cache(async (): Promise<StorefrontCatalogResult> => {
  try {
    return await getCachedCatalog();
  } catch {
    return { products: [], imagesMap: {}, source: "error", error: "The catalog is temporarily unavailable. Please try again." };
  }
});
