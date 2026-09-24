"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { products as baseProducts, Product, ProductVariant } from "@/data/products";
import {
  loadProductsFromSupabase,
  fetchCatalogFromSupabase,
  updateVariantInSupabase,
  deleteVariantFromSupabase,
  updateProductInSupabase,
  addProductToSupabase,
  deleteProductFromSupabase,
  uploadImageToSupabase,
  deleteImageFromSupabase,
  setPrimaryImageInSupabase,
  assignImageColorInSupabase,
  migrateCatalogToSupabase,
  updateProductStockInSupabase,
  bulkUpdateProductStockInSupabase,
  updateVariantStockInSupabase,
  SupabaseProductImageRecord,
  MigrationResult,
} from "@/lib/supabaseService";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  isLiveDatabase: boolean;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getRelatedProducts: (product: Product, limit?: number) => Product[];
  updateProduct: (updatedProduct: Product) => Promise<{ success: boolean; data?: any; error?: string }>;
  addProduct: (product: Product) => Promise<{ success: boolean; data?: any; error?: string }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;
  updateVariant: (productId: string, variant: ProductVariant) => Promise<{ success: boolean; data?: any; error?: string }>;
  addVariant: (productId: string, variant: ProductVariant) => Promise<boolean>;
  deleteVariant: (productId: string, variantId: string) => Promise<{ success: boolean; error?: string }>;
  generateVariants: (productId: string, storages: string[], colors: string[], basePrice?: number) => Promise<boolean>;
  updatePrice: (productId: string, newPrice: number, newOldPrice?: number) => Promise<boolean>;
  updateStock: (productId: string, inStock: boolean) => Promise<boolean>;
  updateProductStock: (productId: string, inStock: boolean) => Promise<{ success: boolean; error?: string }>;
  bulkUpdateProductStock: (productIds: string[], inStock: boolean) => Promise<{ success: boolean; updatedCount: number; error?: string }>;
  updateVariantStock: (variantId: string, stock: number) => Promise<{ success: boolean; error?: string }>;
  updateFeatured: (productId: string, featured: boolean) => Promise<boolean>;
  customImages: Record<string, SupabaseProductImageRecord[]>;
  uploadImage: (productId: string, file: File, color?: string, isPrimary?: boolean) => Promise<{ success: boolean; imageRecord?: SupabaseProductImageRecord; error?: string }>;
  deleteImage: (imageId: string, imageUrl?: string, productId?: string) => Promise<{ success: boolean; error?: string }>;
  setPrimaryImage: (productId: string, imageId: string) => Promise<{ success: boolean; error?: string }>;
  assignImageToColor: (imageId: string, color?: string, productId?: string) => Promise<{ success: boolean; error?: string }>;
  refreshCatalog: () => Promise<void>;
  migrateCatalog: () => Promise<MigrationResult>;
  getProductPrimaryImage: (product: Product) => string;
  getProductColorImage: (product: Product, colorName: string) => string | undefined;
  getLowestPrice: (product: Product) => number;
  getHighestPrice: (product: Product) => number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function computeLowestPrice(product: Product): number {
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map((v) => v.price).filter((p) => p > 0);
    if (prices.length > 0) {
      return Math.min(...prices);
    }
  }
  return product.price || 0;
}

export function computeHighestPrice(product: Product): number {
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map((v) => v.price).filter((p) => p > 0);
    if (prices.length > 0) {
      return Math.max(...prices);
    }
  }
  return product.price || 0;
}

export const ProductProvider: React.FC<{
  children: React.ReactNode;
  initialProducts?: Product[];
  initialImagesMap?: Record<string, SupabaseProductImageRecord[]>;
}> = ({ children, initialProducts, initialImagesMap }) => {
  const [products, setProducts] = useState<Product[]>(
    initialProducts && initialProducts.length > 0 ? initialProducts : []
  );
  const [imagesMap, setImagesMap] = useState<Record<string, SupabaseProductImageRecord[]>>(
    initialImagesMap || {}
  );
  const [isLiveDatabase, setIsLiveDatabase] = useState(
    Boolean(initialProducts && initialProducts.length > 0)
  );
  const [isLoading, setIsLoading] = useState(!initialProducts || initialProducts.length === 0);

  // Load from Supabase as single source of truth
  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await loadProductsFromSupabase();
      if (result.products.length > 0) {
        setProducts(result.products);
        setImagesMap(result.imagesMap);
        setIsLiveDatabase(result.source === "Supabase");
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to load catalog from Supabase:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      loadCatalog();
    }

    // Supabase Realtime channel for instant cross-device updates
    if (isSupabaseConfigured()) {
      const channel = supabase
        .channel("theekzu-catalog-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "products" },
          () => {
            loadCatalog();
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "product_variants" },
          () => {
            loadCatalog();
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "product_images" },
          () => {
            loadCatalog();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [loadCatalog]);

  // Update a variant
  const updateVariant = async (
    productId: string,
    updatedVariant: ProductVariant
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    const res = await updateVariantInSupabase(productId, updatedVariant);
    if (res.success) {
      await loadCatalog();
    }
    return res;
  };

  // Add a variant
  const addVariant = async (productId: string, variant: ProductVariant): Promise<boolean> => {
    const res = await updateVariantInSupabase(productId, variant);
    if (res.success) {
      await loadCatalog();
      return true;
    }
    return false;
  };

  // Delete a variant
  const deleteVariant = async (productId: string, variantId: string): Promise<{ success: boolean; error?: string }> => {
    const res = await deleteVariantFromSupabase(variantId);
    if (res.success) {
      await loadCatalog();
    }
    return res;
  };

  // Generate variants for storage x color
  const generateVariants = async (
    productId: string,
    storages: string[],
    colors: string[],
    basePrice?: number
  ): Promise<boolean> => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    const initialPrice = basePrice || product.price || 150000;
    const newVariants: ProductVariant[] = [...(product.variants || [])];

    storages.forEach((st, stIdx) => {
      const storagePrice = initialPrice + stIdx * 30000;
      colors.forEach((col) => {
        const variantId = `${productId}-${st.toLowerCase().replace(/\s+/g, "")}-${col.toLowerCase().replace(/\s+/g, "-")}`;
        const colorCode = col.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase();
        const storageCode = st.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        const sku = `TM-${product.model.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}-${storageCode}-${colorCode}`;

        if (!newVariants.some((v) => v.id === variantId)) {
          newVariants.push({
            id: variantId,
            storage: st,
            color: col,
            price: storagePrice,
            oldPrice: Math.round(storagePrice * 1.08),
            stock: 5,
            sku,
          });
        }
      });
    });

    for (const v of newVariants) {
      await updateVariantInSupabase(productId, v);
    }
    await loadCatalog();
    return true;
  };

  // Update general product
  const updateProduct = async (
    updatedProduct: Product
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    const res = await updateProductInSupabase(updatedProduct);
    if (res.success) {
      await loadCatalog();
    }
    return res;
  };

  // Add product
  const addProduct = async (
    newProduct: Product
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    const res = await addProductToSupabase(newProduct);
    if (res.success) {
      await loadCatalog();
    }
    return res;
  };

  // Delete product
  const deleteProduct = async (
    productId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await deleteProductFromSupabase(productId);
    if (res.success) {
      await loadCatalog();
    }
    return res;
  };

  const updatePrice = async (productId: string, newPrice: number, newOldPrice?: number): Promise<boolean> => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    const res = await updateProduct({
      ...product,
      price: newPrice,
      ...(newOldPrice !== undefined ? { oldPrice: newOldPrice } : {}),
    });
    return res.success;
  };

  const updateStock = async (productId: string, inStock: boolean): Promise<boolean> => {
    const res = await updateProductStock(productId, inStock);
    return res.success;
  };

  const updateProductStock = async (
    productId: string,
    inStock: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newStockVal = inStock ? 5 : 0;
        const updatedVariants = (p.variants || []).map((v) => ({ ...v, stock: newStockVal }));
        return {
          ...p,
          stock: inStock ? "In Stock" : "Out of Stock",
          variants: updatedVariants,
        };
      })
    );

    const res = await updateProductStockInSupabase(productId, inStock);
    if (!res.success) {
      await loadCatalog(); // Revert on failure
    } else {
      await loadCatalog();
    }
    return res;
  };

  const bulkUpdateProductStock = async (
    productIds: string[],
    inStock: boolean
  ): Promise<{ success: boolean; updatedCount: number; error?: string }> => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => {
        if (!productIds.includes(p.id)) return p;
        const newStockVal = inStock ? 5 : 0;
        const updatedVariants = (p.variants || []).map((v) => ({ ...v, stock: newStockVal }));
        return {
          ...p,
          stock: inStock ? "In Stock" : "Out of Stock",
          variants: updatedVariants,
        };
      })
    );

    const res = await bulkUpdateProductStockInSupabase(productIds, inStock);
    await loadCatalog();
    return res;
  };

  const updateVariantStock = async (
    variantId: string,
    stock: number
  ): Promise<{ success: boolean; error?: string }> => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => {
        const hasVariant = p.variants?.some((v) => v.id === variantId);
        if (!hasVariant) return p;
        const updatedVariants = (p.variants || []).map((v) => (v.id === variantId ? { ...v, stock } : v));
        const hasAnyStock = updatedVariants.some((v) => v.stock > 0);
        return {
          ...p,
          stock: hasAnyStock ? "In Stock" : "Out of Stock",
          variants: updatedVariants,
        };
      })
    );

    const res = await updateVariantStockInSupabase(variantId, stock);
    if (!res.success) {
      await loadCatalog();
    } else {
      await loadCatalog();
    }
    return res;
  };

  const updateFeatured = async (productId: string, featured: boolean): Promise<boolean> => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    const res = await updateProduct({
      ...product,
      featured,
    });
    return res.success;
  };

  // Upload real image to Supabase Storage bucket 'product-images'
  const uploadImage = async (
    productId: string,
    file: File,
    color?: string,
    isPrimary?: boolean
  ): Promise<{ success: boolean; imageRecord?: SupabaseProductImageRecord; error?: string }> => {
    const res = await uploadImageToSupabase(productId, file, color, isPrimary);
    if (res.success && res.imageRecord) {
      await loadCatalog();
    }
    return res;
  };

  // Delete image
  const deleteImage = async (
    imageId: string,
    imageUrl?: string,
    productId?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await deleteImageFromSupabase(imageId, imageUrl);
    if (res.success) {
      await loadCatalog();
    }
    return res;
  };

  // Set primary image
  const setPrimaryImage = async (
    productId: string,
    imageId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await setPrimaryImageInSupabase(productId, imageId);
    if (res.success) {
      await loadCatalog();
    }
    return res;
  };

  // Assign image to color
  const assignImageToColor = async (
    imageId: string,
    color?: string,
    productId?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await assignImageColorInSupabase(imageId, color);
    if (res.success) {
      await loadCatalog();
    }
    return res;
  };

  const getProductPrimaryImage = useCallback((product: Product): string => {
    const list = imagesMap[product.id];
    if (list && list.length > 0) {
      const primary = list.find((img) => img.is_primary);
      if (primary && primary.image_url) return primary.image_url;
      if (list[0]?.image_url) return list[0].image_url;
    }
    return product.images && product.images.length > 0 ? product.images[0] : "";
  }, [imagesMap]);

  const getProductColorImage = useCallback((product: Product, colorName: string): string | undefined => {
    const list = imagesMap[product.id];
    if (list && list.length > 0) {
      const matched = list.find(
        (img) => img.color && img.color.toLowerCase() === colorName.toLowerCase()
      );
      if (matched?.image_url) return matched.image_url;
    }
    return undefined;
  }, [imagesMap]);

  const getProductBySlug = useCallback((slug: string): Product | undefined => {
    return products.find((p) => p.slug === slug);
  }, [products]);

  const getProductById = useCallback((id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  }, [products]);

  const getRelatedProducts = useCallback((product: Product, limit = 3): Product[] => {
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
  }, [products]);

  const contextValue = React.useMemo<ProductContextType>(
    () => ({
      products,
      isLoading,
      isLiveDatabase,
      getProductBySlug,
      getProductById,
      getRelatedProducts,
      updateProduct,
      addProduct,
      deleteProduct,
      updateVariant,
      addVariant,
      deleteVariant,
      generateVariants,
      updatePrice,
      updateStock,
      updateProductStock,
      bulkUpdateProductStock,
      updateVariantStock,
      updateFeatured,
      customImages: imagesMap,
      uploadImage,
      deleteImage,
      setPrimaryImage,
      assignImageToColor,
      refreshCatalog: loadCatalog,
      migrateCatalog: migrateCatalogToSupabase,
      getProductPrimaryImage,
      getProductColorImage,
      getLowestPrice: computeLowestPrice,
      getHighestPrice: computeHighestPrice,
    }),
    [
      products,
      isLoading,
      isLiveDatabase,
      getProductBySlug,
      getProductById,
      getRelatedProducts,
      imagesMap,
      getProductPrimaryImage,
      getProductColorImage,
      loadCatalog,
    ]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
