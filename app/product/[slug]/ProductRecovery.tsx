"use client";

import Link from "next/link";
import { useProducts } from "@/context/ProductContext";
import { ProductDetailClient } from "./ProductDetailClient";
import type { ProductCondition } from "@/data/products";

/** Recover a cold server read failure without trapping the page in an error boundary. */
export function ProductRecovery({ slug, initialCondition }: { slug: string; initialCondition?: ProductCondition }) {
  const { getProductBySlug, getRelatedProducts, isLoading, isLiveDatabase, catalogError, refreshCatalog } = useProducts();
  const product = getProductBySlug(slug);
  if (isLiveDatabase && product) {
    return <ProductDetailClient product={product} related={getRelatedProducts(product, 3)} initialCondition={initialCondition} />;
  }
  return (
    <div className="container-custom py-16 text-center space-y-4" aria-live="polite">
      <h1 className="text-2xl font-bold">{isLoading ? "Loading product…" : isLiveDatabase ? "Product not found" : "Reconnecting to the store"}</h1>
      <p>{isLoading ? "Please wait while we load the latest product details." : catalogError || "This product is no longer available."}</p>
      {!isLiveDatabase && <button data-ui="primary" disabled={isLoading} onClick={() => void refreshCatalog()} className="rounded-xl px-6 py-3 disabled:opacity-50">{isLoading ? "Loading…" : "Try again"}</button>}
      {isLiveDatabase && <Link href="/iphones" className="inline-block underline">Browse iPhones</Link>}
    </div>
  );
}
