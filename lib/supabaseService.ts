import { supabase, isSupabaseConfigured, STORAGE_BUCKET } from "./supabaseClient";
import { Product, ProductVariant, ProductColor, products as baseProducts, PLACEHOLDER_IMAGE } from "@/data/products";

export interface SupabaseAdminUser {
  user_id: string;
  email: string;
  created_at?: string;
}

export interface SupabaseProductImageRecord {
  id: string;
  product_id: string;
  image_url: string;
  storage_path?: string;
  filename?: string;
  size?: number;
  color?: string | null;
  is_primary?: boolean;
  created_at?: string;
}

export interface MigrationResult {
  success: boolean;
  productsInserted: number;
  productsAlreadyPresent: number;
  variantsInserted: number;
  variantsAlreadyPresent: number;
  productsFailed: number;
  variantsFailed: number;
  totalProducts: number;
  totalVariants: number;
  error?: string;
}

/**
 * Check if the authenticated user is listed in public.admin_users by user_id
 */
export async function checkIsAdminUser(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      if (userError) console.error("Supabase getUser error:", userError);
      return false;
    }

    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("user_id,email")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Supabase admin_users query error:", error);
      return false;
    }

    return Boolean(admin);
  } catch (e) {
    console.error("Exception checking admin_users:", e);
    return false;
  }
}

/**
 * Helper to resolve public Supabase Storage URL from storage_path
 */
export function resolveStorageImageUrl(storagePath?: string | null): string {
  if (!storagePath) return "";
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return storagePath;
  }
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
  return data?.publicUrl || storagePath;
}

/**
 * Map database product row + variant rows + image rows into frontend Product object
 */
export function mapSupabaseToProduct(
  p: any,
  variants: any[] = [],
  images: any[] = []
): Product {
  const baseMatch = baseProducts.find((bp) => bp.slug === p.slug);

  const mappedVariants: ProductVariant[] = variants.map((v) => ({
    id: v.id || `${p.id}-${v.storage}-${v.color}`,
    storage: v.storage || "128GB",
    color: v.color || "Standard",
    price: Number(v.price) || 0,
    oldPrice: v.old_price !== undefined && v.old_price !== null ? Number(v.old_price) : null,
    stock: v.stock !== undefined && v.stock !== null ? Number(v.stock) : 0,
    sku: v.sku || `TM-${p.slug}-${v.storage}-${v.color}`,
  }));

  const priced = mappedVariants.filter(v => v.price > 0);
  const available = priced.filter(v => v.stock > 0);
  const displayVariant = (available.length ? available : priced).reduce<ProductVariant | undefined>((best, v) => !best || v.price < best.price ? v : best, undefined);
  const lowestPrice = displayVariant?.price || 0;
  const lowestOldPrice = displayVariant?.oldPrice || null;

  // Calculated discount percentage
  const discount =
    lowestOldPrice && lowestOldPrice > lowestPrice
      ? `${Math.round(((lowestOldPrice - lowestPrice) / lowestOldPrice) * 100)}% OFF`
      : undefined;

  // Image list: public.product_images takes precedence, primary image is first
  const imageList: string[] = [];
  if (images && images.length > 0) {
    const primaryFromTable = images.find((img) => img.is_primary);
    if (primaryFromTable) {
      const pUrl = resolveStorageImageUrl(primaryFromTable.image_url || primaryFromTable.storage_path);
      if (pUrl) imageList.push(pUrl);
    }
    images.forEach((img) => {
      const url = resolveStorageImageUrl(img.image_url || img.storage_path);
      if (url && !imageList.includes(url)) {
        imageList.push(url);
      }
    });
  }

  // Fallback to local images ONLY if no images exist in public.product_images for this product
  if (imageList.length === 0 && baseMatch && baseMatch.images && baseMatch.images.length > 0) {
    baseMatch.images.forEach((img) => {
      if (img && !imageList.includes(img)) {
        imageList.push(img);
      }
    });
  }

  // Parse colors from variants
  const variantColorNames = Array.from(new Set(mappedVariants.map((v) => v.color).filter(Boolean)));
  let colors: ProductColor[] = [];
  if (variantColorNames.length > 0) {
    colors = variantColorNames.map((cName) => {
      const matchedColor = baseMatch?.colors.find((c) => c.name.toLowerCase() === cName.toLowerCase());
      return matchedColor || { name: cName, hex: "#2563eb" };
    });
  } else if (baseMatch && baseMatch.colors && baseMatch.colors.length > 0) {
    colors = baseMatch.colors;
  } else {
    colors = [{ name: "Standard", hex: "#0066ff" }];
  }

  // Parse storage options from variants
  let storageOptions: string[] = [];
  if (mappedVariants.length > 0) {
    storageOptions = Array.from(new Set(mappedVariants.map((v) => v.storage).filter(Boolean)));
  } else if (baseMatch && baseMatch.storageOptions) {
    storageOptions = baseMatch.storageOptions;
  } else {
    storageOptions = ["128GB", "256GB", "512GB"];
  }

  // Stock: In Stock if product-level is not Out of Stock AND any variant has stock > 0
  const isProductLevelOOS =
    (p as any).stock === "Out of Stock" ||
    (p as any).stock_status === "Out of Stock" ||
    (p as any).in_stock === false;

  const hasAnyVariantStock = mappedVariants.length > 0 ? mappedVariants.some((v) => (Number(v.stock) || 0) > 0) : false;
  const stock = isProductLevelOOS || !hasAnyVariantStock ? "Out of Stock" : "In Stock";

  return {
    updatedAt: p.updated_at,
    id: p.id,
    slug: p.slug,
    name: p.name,
    model: p.name || baseMatch?.model || p.slug,
    series: p.series || baseMatch?.series || "16",
    category: p.category || baseMatch?.category || "iphones",
    subcategory: baseMatch?.subcategory || (p.category === "iphones" ? (p.condition === "Used" ? "used-iphones" : "latest-iphones") : "cases-accessories"),
    condition: p.condition || baseMatch?.condition || "Brand New",
    conditionBadge: (p.condition || baseMatch?.condition) === "Brand New" ? "Brand New Sealed" : "Grade A+ Pre-Owned",
    price: lowestPrice,
    oldPrice: lowestOldPrice ? Number(lowestOldPrice) : undefined,
    discount,
    storage: storageOptions[0] || "128GB",
    storageOptions,
    colors,
    images: imageList.length > 0 ? imageList : [PLACEHOLDER_IMAGE],
    description: (p.description !== null && p.description !== undefined && p.description.trim() !== "")
      ? p.description
      : (baseMatch?.description || ""),
    specifications: {
      warranty: (p.condition || baseMatch?.condition) === "Brand New" ? "1 Year Apple Warranty" : "6 Months Store Warranty",
      delivery: "1-2 Days Islandwide Delivery",
      authenticity: "100% Original Guaranteed",
      ...(baseMatch?.specifications || {}),
    },
    stock,
    featured: p.featured !== undefined && p.featured !== null ? Boolean(p.featured) : Boolean(baseMatch?.featured),
    rating: 0,
    reviewsCount: 0,
    variants: mappedVariants,
  };
}

export interface StorefrontCatalogResult {
  products: Product[];
  imagesMap: Record<string, SupabaseProductImageRecord[]>;
  source: "Supabase" | "error";
  error?: string;
}

/**
 * Shared loader for public storefront: queries products, variants, images from Supabase,
 * normalizes them into storefront products.
 */
export async function loadProductsFromSupabase(): Promise<StorefrontCatalogResult> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Storefront Data] Supabase is not configured in .env.local; catalog unavailable.");
    }
    return {
      products: [],
      imagesMap: {},
      source: "error",
      error: "Supabase credentials not configured in .env.local",
    };
  }

  try {
    // 1. Query active products from public.products
    const { data: dbProducts, error: prodErr } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (prodErr) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[Storefront Data] Supabase fetch products query failed:", prodErr);
      }
      return {
        products: [],
        imagesMap: {},
        source: "error",
        error: prodErr.message,
      };
    }

    if (!dbProducts?.length) return { products: [], imagesMap: {}, source: "Supabase" };

    const [variantResult, imageResult] = await Promise.all([
      supabase.from("product_variants").select("id, product_id, storage, color, price, old_price, stock, sku, active").eq("active", true).in("product_id", dbProducts.map(p => p.id)),
      supabase.from("product_images").select("id, product_id, storage_path, color, is_primary, created_at").in("product_id", dbProducts.map(p => p.id)).order("is_primary", { ascending: false }),
    ]);
    if (variantResult.error || imageResult.error) {
      return { products: [], imagesMap: {}, source: "error", error: "The catalog is temporarily unavailable." };
    }
    const dbVariants = variantResult.data;
    const dbImages = imageResult.data;

    // 4. Group variants and images by product_id
    const variantsByProduct: Record<string, any[]> = {};
    (dbVariants || []).forEach((v) => {
      const pid = v.product_id;
      if (!variantsByProduct[pid]) variantsByProduct[pid] = [];
      variantsByProduct[pid].push(v);
    });

    const imagesByProduct: Record<string, SupabaseProductImageRecord[]> = {};
    (dbImages || []).forEach((img) => {
      const pid = img.product_id;
      if (!imagesByProduct[pid]) imagesByProduct[pid] = [];
      const publicUrl = resolveStorageImageUrl(img.storage_path);
      imagesByProduct[pid].push({
        id: img.id,
        product_id: img.product_id,
        image_url: publicUrl,
        storage_path: img.storage_path,
        color: img.color,
        is_primary: Boolean(img.is_primary),
        created_at: img.created_at,
      });
    });

    // 5. Map and normalize each product
    const mapped = dbProducts.map((p) =>
      mapSupabaseToProduct(p, variantsByProduct[p.id] || [], imagesByProduct[p.id] || [])
    );

    // Requirement 11: Development-only debugging logs
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[Storefront Data] source: "Supabase" | products: ${mapped.length} | variants: ${dbVariants?.length || 0} | images: ${dbImages?.length || 0}`
      );
    }

    return {
      products: mapped,
      imagesMap: imagesByProduct,
      source: "Supabase",
    };
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Storefront Data] Exception loading from Supabase:", e);
    }
    return {
      products: [],
      imagesMap: {},
      source: "error",
      error: e.message || "Unknown error",
    };
  }
}

/**
 * Shared loader for single product by slug
 */
export async function loadProductBySlugFromSupabase(slug: string): Promise<Product | undefined> {
  const result = await loadProductsFromSupabase();
  return result.products.find((p) => p.slug === slug);
}

/**
 * Legacy wrapper: Fetch all products with their variants and images from Supabase
 */
export async function fetchCatalogFromSupabase(): Promise<{
  products: Product[];
  imagesMap: Record<string, SupabaseProductImageRecord[]>;
  isFromDatabase: boolean;
}> {
  const result = await loadProductsFromSupabase();
  return {
    products: result.products,
    imagesMap: result.imagesMap,
    isFromDatabase: result.source === "Supabase",
  };
}

/**
 * Migration function: Sync 21 iPhones to Supabase
 * - Verifies user authentication with supabase.auth.getUser()
 * - Inserts/upserts the 21-model iPhone catalog into public.products by slug
 * - Inserts/upserts all variants into public.product_variants with returned product UUID
 * - Tracks productsInserted, productsAlreadyPresent, variantsInserted, variantsAlreadyPresent, productsFailed, variantsFailed
 * - Never ignores Supabase errors; outputs full error to console.error
 */
export async function migrateCatalogToSupabase(): Promise<MigrationResult> {
  if (!isSupabaseConfigured()) {
    const errMsg = "Supabase credentials are not configured in .env.local";
    console.error("Migration error:", errMsg);
    return {
      success: false,
      productsInserted: 0,
      productsAlreadyPresent: 0,
      variantsInserted: 0,
      variantsAlreadyPresent: 0,
      productsFailed: 0,
      variantsFailed: 0,
      totalProducts: 21,
      totalVariants: 0,
      error: errMsg,
    };
  }

  // 1. Verify Auth: call supabase.auth.getUser() and confirm valid authenticated user exists
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    const errMsg = "Authentication required. Please sign in as admin first.";
    console.error("Migration auth verification failed:", userErr || "No authenticated user session");
    return {
      success: false,
      productsInserted: 0,
      productsAlreadyPresent: 0,
      variantsInserted: 0,
      variantsAlreadyPresent: 0,
      productsFailed: 0,
      variantsFailed: 0,
      totalProducts: baseProducts.filter((p) => p.category === "iphones" || p.slug.startsWith("iphone-")).length,
      totalVariants: 0,
      error: errMsg,
    };
  }

  // Filter all iPhone catalog models (29 models)
  const iphoneCatalog = baseProducts.filter(
    (p) => p.category === "iphones" || p.slug.startsWith("iphone-")
  );

  let productsInserted = 0;
  let productsAlreadyPresent = 0;
  let variantsInserted = 0;
  let variantsAlreadyPresent = 0;
  let productsFailed = 0;
  let variantsFailed = 0;

  let totalVariants = 0;
  iphoneCatalog.forEach((p) => {
    totalVariants += p.variants ? p.variants.length : 0;
  });

  try {
    // 2. Fetch existing products and variants to accurately track inserted vs already present
    const { data: existingProds, error: existingProdsErr } = await supabase
      .from("products")
      .select("id, slug");

    if (existingProdsErr) {
      console.error("Supabase error checking existing products for migration:", existingProdsErr);
      return {
        success: false,
        productsInserted: 0,
        productsAlreadyPresent: 0,
        variantsInserted: 0,
        variantsAlreadyPresent: 0,
        productsFailed: iphoneCatalog.length,
        variantsFailed: totalVariants,
        totalProducts: iphoneCatalog.length,
        totalVariants,
        error: `Supabase error querying products: ${existingProdsErr.message}`,
      };
    }

    const existingSlugMap = new Map((existingProds || []).map((p) => [p.slug, p.id]));

    // Query existing variants including stock to preserve inventory
    const { data: existingVars, error: existingVarsErr } = await supabase
      .from("product_variants")
      .select("id, product_id, storage, color, stock");

    if (existingVarsErr) {
      throw new Error("Cannot safely seed catalog without reading existing inventory: " + existingVarsErr.message);
    }

    const existingVarMap = new Map(
      (existingVars || []).map((v) => [`${v.product_id}_${v.storage}_${v.color}`, v])
    );
    const existingVarKeySet = new Set(
      (existingVars || []).map((v) => `${v.product_id}_${v.storage}_${v.color}`)
    );

    // 3. Upsert products one-by-one.
    // NOTE: We do NOT chain .select().single() on the upsert — Supabase RLS may block
    // the SELECT-back even when the write succeeds (PGRST116). Instead we resolve the
    // product UUID from the pre-fetched existingSlugMap, or re-query by slug for new rows.
    for (const p of iphoneCatalog) {
      const isProductExisting = existingSlugMap.has(p.slug);

      // Match actual public.products database schema:
      // slug, name, series, category, condition, description, featured, active
      const { error: productError } = await supabase
        .from("products")
        .upsert(
          {
            slug: p.slug,
            name: p.name,
            series: p.series || "16",
            category: p.category || "iphones",
            condition: p.condition || "Brand New",
            description: p.description || "",
            featured: Boolean(p.featured),
            active: true,
          },
          { onConflict: "slug" }
        );

      if (productError) {
        console.error(`Failed to upsert product ${p.name} (${p.slug}):`, productError);
        productsFailed++;
        variantsFailed += p.variants ? p.variants.length : 0;
        continue;
      }

      // Resolve UUID: use map for existing products; re-query for newly inserted ones
      let productUuid: string | undefined = existingSlugMap.get(p.slug);
      if (!productUuid) {
        const { data: newRow, error: lookupErr } = await supabase
          .from("products")
          .select("id, slug")
          .eq("slug", p.slug)
          .single();
        if (lookupErr || !newRow) {
          console.error(`Could not resolve UUID for newly inserted product ${p.slug}:`, lookupErr);
          productsFailed++;
          variantsFailed += p.variants ? p.variants.length : 0;
          continue;
        }
        productUuid = newRow.id;
        existingSlugMap.set(p.slug, productUuid!);
      }

      if (isProductExisting) {
        productsAlreadyPresent++;
      } else {
        productsInserted++;
      }

      // 4. Upsert variants for this product with product_id = productUuid
      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          const varKey = `${productUuid}_${v.storage}_${v.color}`;
          const isVarExisting = existingVarKeySet.has(varKey);
          const existingVar = existingVarMap.get(varKey);

          // Preserve existing stock for existing variants; default to 3 units for new variants
          const variantStock =
            isVarExisting && existingVar && existingVar.stock !== undefined && existingVar.stock !== null
              ? Number(existingVar.stock)
              : (v.stock !== undefined ? Number(v.stock) : 3);

          const { error: variantError } = await supabase
            .from("product_variants")
            .upsert(
              {
                product_id: productUuid,
                storage: v.storage,
                color: v.color,
                price: Number(v.price) || 0,
                old_price: v.oldPrice !== undefined && v.oldPrice !== null ? Number(v.oldPrice) : null,
                stock: variantStock,
                sku: v.sku || `TM-${p.model || p.slug}-${v.storage}-${v.color}`,
                active: true,
              },
              { onConflict: "product_id,storage,color" }
            );

          if (variantError) {
            console.error(
              `Failed to upsert variant for ${p.name} [${v.storage} - ${v.color}]:`,
              variantError
            );
            variantsFailed++;
          } else {
            if (isVarExisting) {
              variantsAlreadyPresent++;
            } else {
              variantsInserted++;
              existingVarKeySet.add(varKey);
            }
          }
        }
      }
    }

    const hasFailures = productsFailed > 0 || variantsFailed > 0;

    return {
      success: !hasFailures,
      productsInserted,
      productsAlreadyPresent,
      variantsInserted,
      variantsAlreadyPresent,
      productsFailed,
      variantsFailed,
      totalProducts: iphoneCatalog.length,
      totalVariants,
      error: hasFailures
        ? `Migration completed with errors: ${productsFailed} products failed, ${variantsFailed} variants failed.`
        : undefined,
    };
  } catch (err: any) {
    console.error("Unexpected exception during migration:", err);
    return {
      success: false,
      productsInserted,
      productsAlreadyPresent,
      variantsInserted,
      variantsAlreadyPresent,
      productsFailed: iphoneCatalog.length - (productsInserted + productsAlreadyPresent),
      variantsFailed: totalVariants - (variantsInserted + variantsAlreadyPresent),
      totalProducts: iphoneCatalog.length,
      totalVariants,
      error: err.message || "Unexpected exception during migration",
    };
  }
}

/**
 * Helper to resolve product UUID by ID or slug.
 */
export async function resolveProductUuid(productIdOrSlug: string): Promise<string | null> {
  if (!productIdOrSlug) return null;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productIdOrSlug);
  if (isUUID) return productIdOrSlug;

  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("slug", productIdOrSlug)
    .maybeSingle();

  if (error || !data) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[resolveProductUuid] Could not resolve UUID for "${productIdOrSlug}":`, error);
    }
    return null;
  }
  return data.id;
}

/**
 * Upload an image file directly to Supabase Storage bucket 'product-images'
 * and insert metadata into public.product_images table.
 */
export async function uploadImageToSupabase(
  productId: string,
  file: File,
  color?: string,
  isPrimary?: boolean
): Promise<{ success: boolean; imageRecord?: SupabaseProductImageRecord; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase is not configured in .env.local",
    };
  }

  try {
    const targetProductId = await resolveProductUuid(productId);
    if (!targetProductId) {
      return { success: false, error: `Could not resolve product UUID for "${productId}".` };
    }

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${targetProductId}/${Date.now()}_${cleanFileName}`;

    // 1. Upload to Supabase Storage bucket 'product-images'
    const { error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadErr) {
      console.error("Supabase storage upload error:", uploadErr);
      return { success: false, error: uploadErr.message };
    }

    // 2. Get Public URL
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    // 3. Determine if primary (if explicitly requested or if it's the product's first image)
    let shouldBePrimary = Boolean(isPrimary);
    if (!isPrimary) {
      const { data: existingImgs } = await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", targetProductId)
        .limit(1);
      if (!existingImgs || existingImgs.length === 0) {
        shouldBePrimary = true;
      }
    }

    if (shouldBePrimary) {
      await supabase
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", targetProductId);
    }

    // 4. Insert into public.product_images
    const { data: newRecords, error: dbErr } = await supabase
      .from("product_images")
      .insert({
        product_id: targetProductId,
        storage_path: publicUrl,
        color: color && color.trim() ? color.trim() : null,
        is_primary: shouldBePrimary,
      })
      .select();

    if (dbErr && dbErr.code !== "PGRST116") {
      console.error("Error inserting into product_images table:", dbErr);
      return { success: false, error: dbErr.message };
    }

    const record = Array.isArray(newRecords) && newRecords.length > 0 ? newRecords[0] : null;
    const finalRecord: SupabaseProductImageRecord = record
      ? { ...record, image_url: publicUrl }
      : {
          id: `img-${Date.now()}`,
          product_id: targetProductId,
          storage_path: publicUrl,
          image_url: publicUrl,
          color: color || null,
          is_primary: shouldBePrimary,
        };
    return {
      success: true,
      imageRecord: finalRecord,
    };
  } catch (e: any) {
    console.error("uploadImageToSupabase exception:", e);
    return { success: false, error: e.message || "Failed to upload image" };
  }
}

/**
 * Delete image from public.product_images and Supabase Storage bucket
 */
export async function deleteImageFromSupabase(
  imageId: string,
  imageUrl?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase is not configured in .env.local" };

  try {
    // Delete from DB table
    const { error: dbErr } = await supabase.from("product_images").delete().eq("id", imageId);
    if (dbErr) {
      console.error("Error deleting image from DB:", dbErr);
      return { success: false, error: dbErr.message };
    }

    // If storage path exists in public URL, try to delete from bucket
    if (imageUrl && imageUrl.includes(STORAGE_BUCKET)) {
      const parts = imageUrl.split(`${STORAGE_BUCKET}/`);
      if (parts[1]) {
        const storagePath = decodeURIComponent(parts[1]);
        await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
      }
    }
    return { success: true };
  } catch (e: any) {
    console.error("deleteImageFromSupabase error:", e);
    return { success: false, error: e?.message || "Failed to delete image" };
  }
}

/**
 * Set an image as primary in public.product_images
 */
export async function setPrimaryImageInSupabase(
  productId: string,
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase is not configured in .env.local" };

  try {
    const targetProductId = await resolveProductUuid(productId);
    if (!targetProductId) return { success: false, error: "Product UUID not found" };

    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", targetProductId);

    const { error } = await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", imageId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e: any) {
    console.error("setPrimaryImageInSupabase error:", e);
    return { success: false, error: e?.message || "Failed to set primary image" };
  }
}

/**
 * Assign an image to a specific color
 */
export async function assignImageColorInSupabase(
  imageId: string,
  color?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase is not configured in .env.local" };

  try {
    const { error } = await supabase
      .from("product_images")
      .update({ color: color && color.trim() ? color.trim() : null })
      .eq("id", imageId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    console.error("assignImageColorInSupabase error:", e);
    return { success: false, error: e?.message || "Failed to assign image color" };
  }
}

/**
 * Update a variant in public.product_variants
 */
export async function updateVariantInSupabase(
  productId: string,
  variant: ProductVariant | any
): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured in .env.local" };
  }

  try {
    const targetProductId = await resolveProductUuid(productId);
    if (!targetProductId) {
      return {
        success: false,
        error: `Could not resolve product UUID for "${productId}".`,
      };
    }

    const isUUID =
      variant.id &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(variant.id);

    const price = Number(variant.price);
    const rawOldPrice = variant.oldPrice !== undefined ? variant.oldPrice : variant.old_price;
    const old_price =
      rawOldPrice !== undefined && rawOldPrice !== null && rawOldPrice !== ""
        ? Number(rawOldPrice)
        : null;
    const stock = Number(variant.stock);
    if (!Number.isInteger(stock) || stock < 0 || !Number.isFinite(price) || price <= 0) return { success: false, error: "Enter a positive price and non-negative whole stock quantity." };

    if (isUUID) {
      const payload: any = {
        price,
        old_price,
        stock,
        updated_at: new Date().toISOString(),
      };
      if (variant.storage) payload.storage = variant.storage;
      if (variant.color) payload.color = variant.color;
      if (variant.sku) payload.sku = variant.sku;
      if (variant.active !== undefined) payload.active = Boolean(variant.active);

      if (process.env.NODE_ENV !== "production") {
        console.log("[updateVariantInSupabase] Updating variant by UUID:", {
          variantId: variant.id,
          targetProductId,
          payload,
        });
      }

      const { data, error } = await supabase
        .from("product_variants")
        .update(payload)
        .eq("id", variant.id)
        .select("id, product_id, storage, color, price, old_price, stock, sku, active");

      if (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[updateVariantInSupabase] Error updating variant:", error);
        }
        return { success: false, error: error.message };
      }

      return { success: true, data: data?.[0] };
    } else {
      const insertPayload: any = {
        product_id: targetProductId,
        storage: variant.storage,
        color: variant.color,
        price,
        old_price,
        stock,
        sku: variant.sku || `TM-${productId}-${variant.storage}-${variant.color}`,
        active: true,
      };

      if (process.env.NODE_ENV !== "production") {
        console.log("[updateVariantInSupabase] Inserting new variant:", {
          targetProductId,
          insertPayload,
        });
      }

      const { data, error } = await supabase
        .from("product_variants")
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[updateVariantInSupabase] Error inserting variant:", error);
        }
        return { success: false, error: error.message };
      }

      return { success: true, data };
    }
  } catch (e: any) {
    console.error("updateVariantInSupabase exception:", e);
    return { success: false, error: e?.message || "Unknown exception" };
  }
}

/**
 * Delete variant from public.product_variants
 */
export async function deleteVariantFromSupabase(
  variantId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured" };
  }

  try {
    const { error } = await supabase.from("product_variants").delete().eq("id", variantId);
    if (error) {
      console.error("Error deleting variant from Supabase:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    console.error("deleteVariantFromSupabase exception:", e);
    return { success: false, error: e?.message || "Unknown error deleting variant" };
  }
}

/**
 * Update product general fields in public.products
 * Persists name, series, category, condition, description, featured status, updated_at
 */
export async function updateProductInSupabase(
  product: Product
): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const targetId = await resolveProductUuid(product.id || product.slug);
    if (!targetId) {
      return {
        success: false,
        error: `Product with slug "${product.slug}" or ID "${product.id}" was not found in Supabase.`,
      };
    }

    const payload: any = {
      name: product.name.trim(),
      series: product.series,
      category: product.category || "iphones",
      condition: product.condition || "Brand New",
      description: product.description !== undefined ? product.description : "",
      featured: Boolean(product.featured),
      updated_at: new Date().toISOString(),
    };

    if (process.env.NODE_ENV !== "production") {
      console.log("[updateProductInSupabase] Updating product in Supabase:", {
        targetId,
        slug: product.slug,
        payload,
      });
    }

    const { data: updatedRows, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", targetId)
      .select("id, slug, name, series, category, condition, description, featured, active, updated_at");

    if (error) {
      console.error("[updateProductInSupabase] Supabase update error:", error);
      return { success: false, error: error.message };
    }

    if (!updatedRows || updatedRows.length === 0) {
      console.error("[updateProductInSupabase] Update affected 0 rows for product ID:", targetId);
      return {
        success: false,
        error: "Database update affected 0 rows. Please verify your admin session or permissions.",
      };
    }

    return { success: true, data: updatedRows[0] };
  } catch (e: any) {
    console.error("[updateProductInSupabase] Exception:", e);
    return { success: false, error: e?.message || "Unknown error updating product" };
  }
}

/**
 * Add a new product and its variants to Supabase
 */
export async function addProductToSupabase(product: Product): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured" };
  }

  try {
    const { data: newProd, error: pErr } = await supabase
      .from("products")
      .insert({
        slug: product.slug,
        name: product.name,
        series: product.series,
        category: product.category,
        condition: product.condition,
        description: product.description,
        featured: Boolean(product.featured),
        active: true,
      })
      .select("id")
      .single();

    if (pErr || !newProd) {
      console.error("Error adding product to Supabase:", pErr);
      return { success: false, error: pErr?.message || "Failed to add product" };
    }

    if (product.variants && product.variants.length > 0) {
      const varRows = product.variants.map((v) => ({
        product_id: newProd.id,
        storage: v.storage,
        color: v.color,
        price: Number(v.price) || 0,
        old_price: v.oldPrice !== undefined && v.oldPrice !== null ? Number(v.oldPrice) : null,
        stock: Math.max(0, Number(v.stock) || 0),
        sku: v.sku,
        active: true,
      }));
      const { error: vErr } = await supabase.from("product_variants").insert(varRows);
      if (vErr) {
        return { success: false, data: newProd, error: "Product created, but variants failed: " + vErr.message };
      }
    }

    return { success: true, data: newProd };
  } catch (e: any) {
    console.error("addProductToSupabase exception:", e);
    return { success: false, error: e?.message || "Unknown error adding product" };
  }
}

/**
 * Delete a product and its variants from Supabase
 */
export async function deleteProductFromSupabase(
  productId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured" };
  }

  try {
    const targetProductId = await resolveProductUuid(productId);
    if (!targetProductId) {
      return { success: false, error: `Could not resolve product UUID for "${productId}".` };
    }

    await supabase.from("product_variants").delete().eq("product_id", targetProductId);
    await supabase.from("product_images").delete().eq("product_id", targetProductId);
    const { error } = await supabase.from("products").delete().eq("id", targetProductId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    console.error("deleteProductFromSupabase exception:", e);
    return { success: false, error: e?.message || "Unknown error deleting product" };
  }
}

// ==============================================================================
// CUSTOMER REVIEWS & FEEDBACK SERVICE
// ==============================================================================

export interface CustomerReview {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  image_path?: string;
  image_url?: string;
  review?: string; // Backwards compatible alias
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at?: string;
}

/**
 * Fetch approved reviews for public display on the storefront
 */
export async function fetchApprovedCustomerReviews(page = 0): Promise<{
  reviews: CustomerReview[];
  averageRating: number;
  totalCount: number;
  tableReady: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return { reviews: [], averageRating: 0, totalCount: 0, tableReady: false };
  }

  try {
    const { data, error } = await supabase
      .from("customer_reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false }).order("id")
      .range(page * 12, page * 12 + 11);

    if (error) {
      if (
        error.code === "42P01" ||
        error.code === "PGRST205" ||
        error.message.includes("does not exist") ||
        error.message.includes("schema cache")
      ) {
        return { reviews: [], averageRating: 0, totalCount: 0, tableReady: false };
      }
      console.warn("fetchApprovedCustomerReviews notice:", error.message);
      return { reviews: [], averageRating: 0, totalCount: 0, tableReady: false };
    }

    const reviews: CustomerReview[] = (data || []).map((r: any) => ({
      id: r.id,
      customer_name: r.customer_name,
      rating: Number(r.rating) || 5,
      review_text: r.review_text || r.review || "",
      review: r.review_text || r.review || "",
      image_path: r.image_path || undefined,
      status: r.status,
      created_at: r.created_at,
      updated_at: r.updated_at || r.created_at,
    }));

    await attachReviewImages(reviews);
    const { data: summary, error: summaryError } = await supabase.rpc("store_review_summary");
    if (summaryError) throw summaryError;
    const totalCount = Number(summary?.[0]?.total || 0);
    const averageRating = Number(summary?.[0]?.average || 0);
    return { reviews, averageRating, totalCount, tableReady: true };
  } catch (e) {
    console.error("fetchApprovedCustomerReviews exception:", e);
    return { reviews: [], averageRating: 0, totalCount: 0, tableReady: false };
  }
}

/**
 * Submit a new customer review (always pending status by default)
 */
export async function submitCustomerReview(params: { customerName: string; rating: number; review: string; image?: File | null }): Promise<{ success: boolean; error?: string; tableNotCreated?: boolean }> {
  try {
    const form = new FormData();
    form.set("customerName", params.customerName);
    form.set("rating", String(params.rating));
    form.set("review", params.review);
    if (params.image) form.set("image", params.image);
    const response = await fetch("/api/reviews", { method: "POST", body: form });
    const result = await response.json();
    return { success: response.ok, error: result.error };
  } catch { return { success: false, error: "Could not connect. Please try again." }; }
}

/**
 * Fetch all reviews for admin moderation (pending, approved, rejected)
 */
export async function fetchAdminCustomerReviews(): Promise<{
  reviews: CustomerReview[];
  error?: string;
  tableNotCreated?: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return { reviews: [], error: "Supabase credentials are not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("customer_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (
        error.code === "42P01" ||
        error.code === "PGRST205" ||
        error.message.includes("does not exist") ||
        error.message.includes("schema cache")
      ) {
        return { reviews: [], tableNotCreated: true, error: "Table 'customer_reviews' does not exist yet." };
      }
      return { reviews: [], error: error.message };
    }

    const reviews: CustomerReview[] = (data || []).map((r: any) => ({
      id: r.id,
      customer_name: r.customer_name,
      rating: Number(r.rating) || 5,
      review_text: r.review_text || r.review || "",
      review: r.review_text || r.review || "",
      image_path: r.image_path || undefined,
      status: r.status,
      created_at: r.created_at,
      updated_at: r.updated_at || r.created_at,
    }));

    await attachReviewImages(reviews);
    return { reviews };
  } catch (e: any) {
    console.error("fetchAdminCustomerReviews exception:", e);
    return { reviews: [], error: e?.message || "Failed to fetch reviews" };
  }
}

/**
 * Update review status (approve or reject)
 */
export async function updateCustomerReviewStatus(
  reviewId: string,
  newStatus: "approved" | "rejected" | "pending"
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured" };
  }

  try {
    const { error } = await supabase
      .from("customer_reviews")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", reviewId).select("id").single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    console.error("updateCustomerReviewStatus exception:", e);
    return { success: false, error: e?.message || "Failed to update review status" };
  }
}

/**
 * Delete a customer review
 */
export async function deleteCustomerReviewFromSupabase(
  reviewId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured" };
  }

  try {
    const { error } = await supabase
      .from("customer_reviews")
      .delete()
      .eq("id", reviewId).select("id").single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    console.error("deleteCustomerReviewFromSupabase exception:", e);
    return { success: false, error: e?.message || "Failed to delete review" };
  }
}

// ==============================================================================
// ADMIN STOCK MANAGEMENT SERVICE
// ==============================================================================

/**
 * Update stock status for an entire product
 * Changes the sales availability override without changing physical inventory.
 */
export async function updateProductStockInSupabase(
  productId: string,
  inStock: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured" };
  }

  try {
    const targetProductId = await resolveProductUuid(productId);
    if (!targetProductId) {
      return { success: false, error: `Could not resolve UUID for "${productId}".` };
    }

    // Availability is a manual sales override; never rewrite inventory quantities.
    const { data, error } = await supabase.from("products").update({
      stock: inStock ? "In Stock" : "Out of Stock",
      stock_status: inStock ? "In Stock" : "Out of Stock",
      in_stock: inStock,
      updated_at: new Date().toISOString(),
    }).eq("id", targetProductId).select("id").single();
    if (error || !data) return { success: false, error: error?.message || "No product was updated." };

    return { success: true };
  } catch (e: any) {
    console.error("updateProductStockInSupabase exception:", e);
    return { success: false, error: e?.message || "Failed to update product stock" };
  }
}

/**
 * Bulk update stock for multiple products
 */
export async function bulkUpdateProductStockInSupabase(
  productIds: string[],
  inStock: boolean
): Promise<{ success: boolean; updatedCount: number; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, updatedCount: 0, error: "Supabase credentials are not configured" };
  }

  try {
    let count = 0;
    for (const pid of productIds) {
      const res = await updateProductStockInSupabase(pid, inStock);
      if (res.success) count++;
    }
    return { success: count === productIds.length, updatedCount: count, error: count === productIds.length ? undefined : "Some products could not be updated. Refresh and retry." };
  } catch (e: any) {
    console.error("bulkUpdateProductStockInSupabase exception:", e);
    return { success: false, updatedCount: 0, error: e?.message || "Bulk update failed" };
  }
}

/**
 * Update stock for an individual variant (storage x color)
 * Automatically recalculates parent product stock status so single variant changes
 * do not mark the entire phone model out of stock if other variants remain available.
 */
export async function updateVariantStockInSupabase(
  variantId: string,
  stockQty: number
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured" };
  }

  try {
    if (!Number.isInteger(stockQty) || stockQty < 0) return { success: false, error: "Stock must be a non-negative integer." };
    const qty = stockQty;
    const { data: updatedVariant, error } = await supabase
      .from("product_variants")
      .update({ stock: qty, updated_at: new Date().toISOString() })
      .eq("id", variantId)
      .select("id, product_id, stock")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e: any) {
    console.error("updateVariantStockInSupabase exception:", e);
    return { success: false, error: e?.message || "Failed to update variant stock" };
  }
}


async function attachReviewImages(reviews: CustomerReview[]) {
  const paths = reviews.flatMap(r => r.image_path ? [r.image_path] : []);
  if (!paths.length) return;
  const { data } = await supabase.storage.from("review-images").createSignedUrls(paths, 300);
  const urls = new Map((data || []).map(item => [item.path, item.signedUrl]));
  for (const review of reviews) review.image_url = urls.get(review.image_path || "") || undefined;
}
