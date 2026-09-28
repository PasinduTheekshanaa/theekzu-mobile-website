import { unstable_cache } from "next/cache";
import { loadProductsFromSupabase } from "./supabaseService";

// Keep storefront navigation fast while retaining a short refresh window for
// stock and price changes made in the admin dashboard.
export const getServerCatalog = unstable_cache(
  async () => loadProductsFromSupabase(),
  ["theekzu-server-catalog"],
  { revalidate: 30 }
);
