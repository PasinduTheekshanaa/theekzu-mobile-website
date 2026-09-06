"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { products as baseProducts, Product, ProductVariant } from "@/data/products";
import {
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
  updateProduct: (updatedProduct: Product) => Promise<boolean>;
  addProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  updateVariant: (productId: string, variant: ProductVariant) => Promise<boolean>;
  addVariant: (productId: string, variant: ProductVariant) => Promise<boolean>;
  deleteVariant: (productId: string, variantId: string) => Promise<boolean>;
  generateVariants: (productId: string, storages: string[], colors: string[], basePrice?: number) => Promise<boolean>;
  updatePrice: (productId: string, newPrice: number, newOldPrice?: number) => Promise<boolean>;
  updateStock: (productId: string, inStock: boolean) => Promise<boolean>;
  updateFeatured: (productId: string, featured: boolean) => Promise<boolean>;
  customImages: Record<string, SupabaseProductImageRecord[]>;
  uploadImage: (productId: string, file: File, color?: string, isPrimary?: boolean) => Promise<boolean>;
  deleteImage: (imageId: string, imageUrl?: string, productId?: string) => Promise<boolean>;
  setPrimaryImage: (productId: string, imageId: string) => Promise<boolean>;
  assignImageToColor: (imageId: string, color?: string, productId?: string) => Promise<boolean>;
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

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(baseProducts);
  const [imagesMap, setImagesMap] = useState<Record<string, SupabaseProductImageRecord[]>>({});
  const [isLiveDatabase, setIsLiveDatabase] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load from Supabase
  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchCatalogFromSupabase();
      if (result.isFromDatabase && result.products.length > 0) {
        setProducts(result.products);
        setImagesMap(result.imagesMap);
        setIsLiveDatabase(true);
      } else {
        // Supabase products table is empty: show default catalog as temporary fallback
        setProducts(baseProducts);
        setImagesMap({});
        setIsLiveDatabase(false);
      }
    } catch (err) {
      console.error("Failed to load catalog from Supabase:", err);
      setProducts(baseProducts);
      setIsLiveDatabase(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();

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
  const updateVariant = async (productId: string, updatedVariant: ProductVariant): Promise<boolean> => {
    // 1. Optimistic local update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const variants = p.variants ? [...p.variants] : [];
        const idx = variants.findIndex((v) => v.id === updatedVariant.id);
        if (idx !== -1) variants[idx] = updatedVariant;
        else variants.push(updatedVariant);

        const hasAnyStock = variants.some((v) => v.stock > 0);
        return {
          ...p,
          variants,
          stock: hasAnyStock ? "In Stock" : "Out of Stock",
          price: Math.min(...variants.map((v) => v.price).filter((pr) => pr > 0)),
        };
      })
    );

    // 2. Persist to Supabase
    const ok = await updateVariantInSupabase(productId, updatedVariant);
    if (!ok && isSupabaseConfigured()) {
      await loadCatalog(); // rollback if failed
      return false;
    }
    return true;
  };

  // Add a variant
  const addVariant = async (productId: string, variant: ProductVariant): Promise<boolean> => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const variants = p.variants ? [...p.variants, variant] : [variant];
        return {
          ...p,
          variants,
          price: Math.min(...variants.map((v) => v.price).filter((pr) => pr > 0)),
        };
      })
    );

    const ok = await updateVariantInSupabase(productId, variant);
    return ok;
  };

  // Delete a variant
  const deleteVariant = async (productId: string, variantId: string): Promise<boolean> => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const variants = (p.variants || []).filter((v) => v.id !== variantId);
        return {
          ...p,
          variants,
          price: variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : p.price,
        };
      })
    );

    const ok = await deleteVariantFromSupabase(variantId);
    return ok;
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

    const updatedProduct = {
      ...product,
      storageOptions: Array.from(new Set([...product.storageOptions, ...storages])),
      variants: newVariants,
      price: Math.min(...newVariants.map((v) => v.price)),
    };

    setProducts((prev) => prev.map((p) => (p.id === productId ? updatedProduct : p)));

    // Save all to Supabase
    for (const v of newVariants) {
      await updateVariantInSupabase(productId, v);
    }
    await updateProductInSupabase(updatedProduct);
    return true;
  };

  // Update general product
  const updateProduct = async (updatedProduct: Product): Promise<boolean> => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    const ok = await updateProductInSupabase(updatedProduct);
    return ok;
  };

  // Add product
  const addProduct = async (newProduct: Product): Promise<boolean> => {
    setProducts((prev) => [newProduct, ...prev]);
    const ok = await addProductToSupabase(newProduct);
    return ok;
  };

  // Delete product
  const deleteProduct = async (productId: string): Promise<boolean> => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    const ok = await deleteProductFromSupabase(productId);
    return ok;
  };

  const updatePrice = async (productId: string, newPrice: number, newOldPrice?: number): Promise<boolean> => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    return updateProduct({
      ...product,
      price: newPrice,
      ...(newOldPrice !== undefined ? { oldPrice: newOldPrice } : {}),
    });
  };

  const updateStock = async (productId: string, inStock: boolean): Promise<boolean> => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    return updateProduct({
      ...product,
      stock: inStock ? "In Stock" : "Out of Stock",
    });
  };

  const updateFeatured = async (productId: string, featured: boolean): Promise<boolean> => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    return updateProduct({
      ...product,
      featured,
    });
  };

  // Upload real image to Supabase Storage bucket 'product-images'
  const uploadImage = async (
    productId: string,
    file: File,
    color?: string,
    isPrimary?: boolean
  ): Promise<boolean> => {
    const res = await uploadImageToSupabase(productId, file, color, isPrimary);
    if (res.success && res.imageRecord) {
      // Update local imagesMap
      setImagesMap((prev) => {
        const currentList = prev[productId] ? [...prev[productId]] : [];
        if (isPrimary) {
          currentList.forEach((img) => (img.is_primary = false));
        }
        currentList.push(res.imageRecord!);
        return { ...prev, [productId]: currentList };
      });

      // If primary, also update product image list
      if (isPrimary) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id !== productId) return p;
            return {
              ...p,
              images: [res.imageRecord!.image_url, ...(p.images || []).filter((u) => u !== res.imageRecord!.image_url)],
            };
          })
        );
      }
      return true;
    }
    return false;
  };

  // Delete image
  const deleteImage = async (imageId: string, imageUrl?: string, productId?: string): Promise<boolean> => {
    const ok = await deleteImageFromSupabase(imageId, imageUrl);
    if (productId) {
      setImagesMap((prev) => ({
        ...prev,
        [productId]: (prev[productId] || []).filter((img) => img.id !== imageId),
      }));
    }
    return ok;
  };

  // Set primary image
  const setPrimaryImage = async (productId: string, imageId: string): Promise<boolean> => {
    const ok = await setPrimaryImageInSupabase(productId, imageId);
    if (ok) {
      setImagesMap((prev) => {
        const list = (prev[productId] || []).map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }));
        return { ...prev, [productId]: list };
      });

      const matchedImg = (imagesMap[productId] || []).find((i) => i.id === imageId);
      if (matchedImg) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id !== productId) return p;
            return {
              ...p,
              images: [matchedImg.image_url, ...(p.images || []).filter((u) => u !== matchedImg.image_url)],
            };
          })
        );
      }
    }
    return ok;
  };

  // Assign image to color
  const assignImageToColor = async (imageId: string, color?: string, productId?: string): Promise<boolean> => {
    const ok = await assignImageColorInSupabase(imageId, color);
    if (ok && productId) {
      setImagesMap((prev) => {
        const list = (prev[productId] || []).map((img) => {
          if (img.id === imageId) {
            return { ...img, color: color && color.trim() ? color.trim() : null };
          }
          return img;
        });
        return { ...prev, [productId]: list };
      });
    }
    return ok;
  };

  const getProductPrimaryImage = (product: Product): string => {
    const list = imagesMap[product.id];
    if (list && list.length > 0) {
      const primary = list.find((img) => img.is_primary);
      if (primary && primary.image_url) return primary.image_url;
      if (list[0]?.image_url) return list[0].image_url;
    }
    return product.images && product.images.length > 0 ? product.images[0] : "";
  };

  const getProductColorImage = (product: Product, colorName: string): string | undefined => {
    const list = imagesMap[product.id];
    if (list && list.length > 0) {
      const matched = list.find(
        (img) => img.color && img.color.toLowerCase() === colorName.toLowerCase()
      );
      if (matched?.image_url) return matched.image_url;
    }
    return undefined;
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find((p) => p.slug === slug);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const getRelatedProducts = (product: Product, limit = 3): Product[] => {
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
  };

  return (
    <ProductContext.Provider
      value={{
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
      }}
    >
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
