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

  // Calculate starting price strictly from minimum active variant price
  const activePrices = mappedVariants.map((v) => v.price).filter((pr) => pr > 0);
  const lowestPrice =
    activePrices.length > 0
      ? Math.min(...activePrices)
      : (baseMatch?.price || 0);

  // Old price: from the lowest priced variant with oldPrice, or any variant with oldPrice
  const lowestVariantWithOldPrice = mappedVariants.find((v) => v.price === lowestPrice && v.oldPrice);
  const lowestOldPrice =
    lowestVariantWithOldPrice?.oldPrice ??
    (mappedVariants.find((v) => v.oldPrice)?.oldPrice ?? baseMatch?.oldPrice ?? null);

  // Calculated discount percentage
  const discount =
    lowestOldPrice && lowestOldPrice > lowestPrice
      ? `${Math.round(((lowestOldPrice - lowestPrice) / lowestOldPrice) * 100)}% OFF`
      : baseMatch?.discount;

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

  // Stock: In Stock if any active variant has stock > 0
  const hasStock = mappedVariants.length > 0 ? mappedVariants.some((v) => v.stock > 0) : true;
  const stock = hasStock ? "In Stock" : "Out of Stock";

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    model: baseMatch?.model || p.name,
    series: p.series || baseMatch?.series || "16",
    category: p.category || baseMatch?.category || "iphones",
    subcategory: baseMatch?.subcategory || (p.category === "iphones" ? (p.condition === "Used" ? "used-iphones" : "latest-iphones") : "cases-accessories"),
    condition: p.condition || "Brand New",
    conditionBadge: p.condition === "Brand New" ? "Brand New Sealed" : "Grade A+ Pre-Owned",
    price: lowestPrice,
    oldPrice: lowestOldPrice ? Number(lowestOldPrice) : undefined,
    discount,
    storage: storageOptions[0] || "128GB",
    storageOptions,
    colors,
    images: imageList.length > 0 ? imageList : [PLACEHOLDER_IMAGE],
    description: p.description || baseMatch?.description || "",
    specifications: baseMatch?.specifications || {},
    stock,
    featured: Boolean(p.featured),
    rating: baseMatch?.rating || 5.0,
    reviewsCount: baseMatch?.reviewsCount || 10,
    variants: mappedVariants,
  };
}

export interface StorefrontCatalogResult {
  products: Product[];
  imagesMap: Record<string, SupabaseProductImageRecord[]>;
  source: "Supabase" | "fallback";
  error?: string;
}

/**
 * Shared loader for public storefront: queries products, variants, images from Supabase,
 * normalizes them into storefront products.
 */
export async function loadProductsFromSupabase(): Promise<StorefrontCatalogResult> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Storefront Data] Supabase is not configured in .env.local; falling back to local data.");
    }
    return {
      products: baseProducts,
      imagesMap: {},
      source: "fallback",
      error: "Supabase credentials not configured in .env.local",
    };
  }

  try {
    // 1. Query active products from public.products
    const { data: dbProducts, error: prodErr } = await supabase
      .from("products")
      .select("id, slug, name, series, category, condition, description, featured, active, created_at, updated_at")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (prodErr) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[Storefront Data] Supabase fetch products query failed:", prodErr);
      }
      return {
        products: baseProducts,
        imagesMap: {},
        source: "fallback",
        error: prodErr.message,
      };
    }

    if (!dbProducts || dbProducts.length === 0) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Storefront Data] Supabase returned 0 active products; falling back to local data.");
      }
      return {
        products: baseProducts,
        imagesMap: {},
        source: "fallback",
        error: "Supabase products table returned 0 active rows",
      };
    }

    // 2. Query active product variants from public.product_variants
    const { data: dbVariants, error: varErr } = await supabase
      .from("product_variants")
      .select("id, product_id, storage, color, price, old_price, stock, sku, active")
      .eq("active", true);

    if (varErr && process.env.NODE_ENV !== "production") {
      console.error("[Storefront Data] Supabase fetch product_variants notice:", varErr);
    }

    // 3. Query product images from public.product_images (primary images first)
    const { data: dbImages, error: imgErr } = await supabase
      .from("product_images")
      .select("id, product_id, storage_path, color, is_primary, created_at")
      .order("is_primary", { ascending: false });

    if (imgErr && process.env.NODE_ENV !== "production") {
      console.warn("[Storefront Data] Supabase fetch product_images notice:", imgErr.message);
    }

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
      console.error("[Storefront Data] Exception loading from Supabase, falling back:", e);
    }
    return {
      products: baseProducts,
      imagesMap: {},
      source: "fallback",
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
      totalProducts: 21,
      totalVariants: 0,
      error: errMsg,
    };
  }

  // Filter exactly the 21 iPhone catalog models
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

    // Query existing variants
    const { data: existingVars, error: existingVarsErr } = await supabase
      .from("product_variants")
      .select("product_id, storage, color");

    if (existingVarsErr) {
      console.warn("Notice: could not pre-fetch existing variants:", existingVarsErr.message);
    }

    const existingVarKeySet = new Set(
      (existingVars || []).map((v) => `${v.product_id}_${v.storage}_${v.color}`)
    );

    // 3. Upsert products one-by-one, returning id (UUID) and slug
    for (const p of iphoneCatalog) {
      const isProductExisting = existingSlugMap.has(p.slug);

      // Match actual public.products database schema:
      // slug, name, series, category, condition, description, featured, active
      const { data: savedProduct, error: productError } = await supabase
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
        )
        .select("id, slug")
        .single();

      if (productError || !savedProduct) {
        console.error(`Failed to upsert product ${p.name} (${p.slug}):`, productError);
        productsFailed++;
        variantsFailed += p.variants ? p.variants.length : 0;
        continue;
      }

      if (isProductExisting) {
        productsAlreadyPresent++;
      } else {
        productsInserted++;
        existingSlugMap.set(savedProduct.slug, savedProduct.id);
      }

      const productUuid = savedProduct.id;

      // 4. Upsert variants for this product with product_id = productUuid
      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          const varKey = `${productUuid}_${v.storage}_${v.color}`;
          const isVarExisting = existingVarKeySet.has(varKey);

          const { error: variantError } = await supabase
            .from("product_variants")
            .upsert(
              {
                product_id: productUuid,
                storage: v.storage,
                color: v.color,
                price: Number(v.price) || 0,
                old_price: v.oldPrice !== undefined && v.oldPrice !== null ? Number(v.oldPrice) : null,
                stock: v.stock !== undefined ? Number(v.stock) : 5,
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
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${productId}/${Date.now()}_${cleanFileName}`;

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

    // 3. If primary, unset existing primary flags for this product
    if (isPrimary) {
      await supabase
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", productId);
    }

    // 4. Insert into public.product_images
    const { data: newRecord, error: dbErr } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        storage_path: publicUrl,
        color: color && color.trim() ? color.trim() : null,
        is_primary: Boolean(isPrimary),
      })
      .select()
      .single();

    if (dbErr) {
      console.error("Error inserting into product_images table:", dbErr);
      return { success: false, error: dbErr.message };
    }

    const finalRecord: SupabaseProductImageRecord = {
      ...newRecord,
      image_url: publicUrl,
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
export async function deleteImageFromSupabase(imageId: string, imageUrl?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    // Delete from DB table
    await supabase.from("product_images").delete().eq("id", imageId);

    // If storage path exists in public URL, try to delete from bucket
    if (imageUrl && imageUrl.includes(STORAGE_BUCKET)) {
      const parts = imageUrl.split(`${STORAGE_BUCKET}/`);
      if (parts[1]) {
        const storagePath = decodeURIComponent(parts[1]);
        await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
      }
    }
    return true;
  } catch (e) {
    console.error("deleteImageFromSupabase error:", e);
    return false;
  }
}

/**
 * Set an image as primary in public.product_images
 */
export async function setPrimaryImageInSupabase(productId: string, imageId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

    await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", imageId);

    return true;
  } catch (e) {
    console.error("setPrimaryImageInSupabase error:", e);
    return false;
  }
}

/**
 * Assign an image to a specific color
 */
export async function assignImageColorInSupabase(imageId: string, color?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    await supabase
      .from("product_images")
      .update({ color: color && color.trim() ? color.trim() : null })
      .eq("id", imageId);
    return true;
  } catch (e) {
    console.error("assignImageColorInSupabase error:", e);
    return false;
  }
}

/**
 * Update a variant in public.product_variants
 */
export async function updateVariantInSupabase(
  productId: string,
  variant: ProductVariant
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const payload: any = {
      product_id: productId,
      storage: variant.storage,
      color: variant.color,
      price: Number(variant.price) || 0,
      old_price: variant.oldPrice !== undefined && variant.oldPrice !== null ? Number(variant.oldPrice) : null,
      stock: Number(variant.stock) || 0,
      sku: variant.sku,
      active: true,
    };

    if (variant.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(variant.id)) {
      payload.id = variant.id;
    }

    const { error } = await supabase
      .from("product_variants")
      .upsert(payload, { onConflict: "product_id,storage,color" });

    if (error) {
      console.error("Error updating variant in Supabase:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("updateVariantInSupabase exception:", e);
    return false;
  }
}

/**
 * Delete variant from public.product_variants
 */
export async function deleteVariantFromSupabase(variantId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase.from("product_variants").delete().eq("id", variantId);
    if (error) {
      console.error("Error deleting variant from Supabase:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("deleteVariantFromSupabase exception:", e);
    return false;
  }
}

/**
 * Update product general fields in public.products
 */
export async function updateProductInSupabase(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from("products")
      .update({
        name: product.name,
        series: product.series,
        category: product.category,
        condition: product.condition,
        description: product.description,
        featured: product.featured,
      })
      .eq("id", product.id);

    if (error) {
      console.error("Error updating product in Supabase:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("updateProductInSupabase exception:", e);
    return false;
  }
}

/**
 * Add a new product and its variants to Supabase
 */
export async function addProductToSupabase(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

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
      return false;
    }

    if (product.variants && product.variants.length > 0) {
      const varRows = product.variants.map((v) => ({
        product_id: newProd.id,
        storage: v.storage,
        color: v.color,
        price: Number(v.price) || 0,
        old_price: v.oldPrice !== undefined && v.oldPrice !== null ? Number(v.oldPrice) : null,
        stock: Number(v.stock) || 5,
        sku: v.sku,
        active: true,
      }));
      const { error: vErr } = await supabase.from("product_variants").insert(varRows);
      if (vErr) {
        console.error("Error adding variants to Supabase:", vErr);
      }
    }

    return true;
  } catch (e) {
    console.error("addProductToSupabase exception:", e);
    return false;
  }
}

/**
 * Delete a product and its variants from Supabase
 */
export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    await supabase.from("product_variants").delete().eq("product_id", productId);
    await supabase.from("product_images").delete().eq("product_id", productId);
    const { error } = await supabase.from("products").delete().eq("id", productId);
    return !error;
  } catch (e) {
    console.error("deleteProductFromSupabase exception:", e);
    return false;
  }
}
