import { cache } from "react";
import { loadProductsFromSupabase } from "./supabaseService";

// Share one catalog snapshot between layout, metadata and page within a request.
export const getServerCatalog = cache(loadProductsFromSupabase);
