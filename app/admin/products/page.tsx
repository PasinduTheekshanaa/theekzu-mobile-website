"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductContext";
import { Product, ProductVariant, ProductColor } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { supabase, isSupabaseConfigured, STORAGE_BUCKET } from "@/lib/supabaseClient";
import { checkIsAdminUser, updateVariantInSupabase } from "@/lib/supabaseService";
import {
  Edit,
  Search,
  Check,
  AlertCircle,
  ArrowLeft,
  X,
  ExternalLink,
  LogOut,
  UploadCloud,
  Trash2,
  Plus,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  CheckCircle2,
  Database,
  RefreshCw,
  UserCheck
} from "lucide-react";

export default function AdminProductsPage() {
  const router = useRouter();
  const {
    products,
    isLoading,
    isLiveDatabase,
    updateProduct,
    addProduct,
    deleteProduct,
    updateVariant,
    addVariant,
    deleteVariant,
    generateVariants,
    customImages,
    uploadImage,
    deleteImage,
    setPrimaryImage,
    assignImageToColor,
    refreshCatalog,
    migrateCatalog,
    getProductPrimaryImage,
    getLowestPrice,
  } = useProducts();

  // Auth gate check
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedStock, setSelectedStock] = useState<string>("all");
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);

  // Expanded variant rows (productId => boolean)
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({});

  // Inline Variant Edits state { [variantId]: { price: string, oldPrice: string, stock: string } }
  const [inlineVariantEdits, setInlineVariantEdits] = useState<
    Record<string, { price: string; oldPrice: string; stock: string }>
  >({});

  // Individual saving state per variant ID
  const [savingVariantIds, setSavingVariantIds] = useState<Record<string, boolean>>({});

  // Recently saved indicator per variant ID (green feedback for 3 seconds)
  const [recentlySavedVariantIds, setRecentlySavedVariantIds] = useState<Record<string, boolean>>({});

  // Batch saving state per product ID (for "Save All Changes" button)
  const [isSavingProductBatch, setIsSavingProductBatch] = useState<Record<string, boolean>>({});

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  // Image Management Modal State
  const [imageModalProduct, setImageModalProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Variant Generator Modal State
  const [variantGenProduct, setVariantGenProduct] = useState<Product | null>(null);
  const [genStorages, setGenStorages] = useState<string[]>(["128GB", "256GB", "512GB", "1TB"]);
  const [genColorsText, setGenColorsText] = useState("");
  const [genBasePrice, setGenBasePrice] = useState("");

  // Quick Add Variant State (inside product expansion)
  const [newVariantInputs, setNewVariantInputs] = useState<
    Record<string, { storage: string; color: string; price: string; oldPrice: string; stock: string; sku: string }>
  >({});

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState("");
  const [formModel, setFormModel] = useState("");
  const [formSeries, setFormSeries] = useState("16");
  const [formCondition, setFormCondition] = useState<"Brand New" | "Used">("Brand New");
  const [formInStock, setFormInStock] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formStorages, setFormStorages] = useState("");
  const [formColors, setFormColors] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isSavingProductEdit, setIsSavingProductEdit] = useState(false);

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdModel, setNewProdModel] = useState("");
  const [newProdSeries, setNewProdSeries] = useState("16");
  const [newProdCategory, setNewProdCategory] = useState<"iphones" | "accessories">("iphones");
  const [newProdCondition, setNewProdCondition] = useState<"Brand New" | "Used">("Brand New");
  const [newProdBasePrice, setNewProdBasePrice] = useState("");
  const [newProdStorages, setNewProdStorages] = useState("128GB, 256GB, 512GB");
  const [newProdColors, setNewProdColors] = useState("Natural Titanium, Black Titanium");

  // Migration running state
  const [isMigrating, setIsMigrating] = useState(false);

  // Client-side mount flag for React Portals
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and close on Escape when ANY modal is active
  useEffect(() => {
    const isAnyModalOpen = Boolean(imageModalProduct || variantGenProduct || showAddProductModal || editingProduct);
    if (!isAnyModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!isUploading && !isSavingProductEdit) {
          setImageModalProduct(null);
          setVariantGenProduct(null);
          setShowAddProductModal(false);
          setEditingProduct(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageModalProduct, variantGenProduct, showAddProductModal, editingProduct, isUploading, isSavingProductEdit]);

  // Verify Admin Session on mount using Supabase Auth and public.admin_users
  useEffect(() => {
    async function verifyAuth() {
      if (!isSupabaseConfigured()) {
        router.replace("/admin/login");
        return;
      }

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (userError) console.error("Supabase getUser error:", userError);
          router.replace("/admin/login");
          return;
        }

        const { data: admin, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id,email")
          .eq("user_id", user.id)
          .maybeSingle();

        if (adminError) {
          console.error("Supabase admin_users query error:", adminError);
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        if (!admin) {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        setAdminEmail(user.email || admin.email || "Admin");
        setIsVerifyingAuth(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/admin/login");
      }
    }

    verifyAuth();
  }, [router]);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleExpandVariants = (productId: string) => {
    setExpandedVariants((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        (p.series && p.series.toLowerCase().includes(q)) ||
        (p.variants && p.variants.some((v) => v.sku.toLowerCase().includes(q) || v.color.toLowerCase().includes(q)));

      const matchesSeries = selectedSeries === "all" || p.series === selectedSeries;
      const matchesCondition = selectedCondition === "all" || p.condition === selectedCondition;
      const isInStock = p.stock.toLowerCase().includes("in stock");
      const matchesStock =
        selectedStock === "all" || (selectedStock === "in_stock" ? isInStock : !isInStock);
      const matchesFeatured = !onlyFeatured || p.featured;

      return matchesSearch && matchesSeries && matchesCondition && matchesStock && matchesFeatured;
    });
  }, [products, searchQuery, selectedSeries, selectedCondition, selectedStock, onlyFeatured]);

  // Check if a variant has unsaved modifications
  const isVariantDirty = (v: ProductVariant) => {
    const edit = inlineVariantEdits[v.id];
    if (!edit) return false;

    const currentPriceStr = edit.price.trim();
    const currentOldPriceStr = edit.oldPrice.trim();
    const currentStockStr = edit.stock.trim();

    const origPriceStr = v.price.toString();
    const origOldPriceStr = v.oldPrice !== undefined && v.oldPrice !== null ? v.oldPrice.toString() : "";
    const origStockStr = v.stock.toString();

    return (
      currentPriceStr !== origPriceStr ||
      currentOldPriceStr !== origOldPriceStr ||
      currentStockStr !== origStockStr
    );
  };

  const getDirtyVariantsForProduct = (product: Product): ProductVariant[] => {
    return (product.variants || []).filter(isVariantDirty);
  };

  // Validate variant edit inputs
  const validateVariantEdit = (
    edit: { price: string; oldPrice: string; stock: string },
    label: string
  ): { isValid: boolean; error?: string; price: number; oldPrice: number | null; stock: number } => {
    const price = Number(edit.price);
    if (isNaN(price) || price <= 0) {
      return {
        isValid: false,
        error: `Price must be greater than 0 for ${label}`,
        price: 0,
        oldPrice: null,
        stock: 0,
      };
    }

    let oldPrice: number | null = null;
    if (edit.oldPrice && edit.oldPrice.trim() !== "") {
      oldPrice = Number(edit.oldPrice);
      if (isNaN(oldPrice) || oldPrice < 0) {
        return {
          isValid: false,
          error: `Old price cannot be negative for ${label}`,
          price: 0,
          oldPrice: null,
          stock: 0,
        };
      }
    }

    const stock = Number(edit.stock);
    if (isNaN(stock) || !Number.isInteger(stock) || stock < 0) {
      return {
        isValid: false,
        error: `Stock must be a whole number (>= 0) for ${label}`,
        price: 0,
        oldPrice: null,
        stock: 0,
      };
    }

    return { isValid: true, price, oldPrice, stock };
  };

  // Handle Inline Variant Edit Change
  const handleInlineVariantChange = (
    variantId: string,
    field: "price" | "oldPrice" | "stock",
    val: string,
    initialPrice: number,
    initialOldPrice?: number | null,
    initialStock: number = 5
  ) => {
    setInlineVariantEdits((prev) => {
      const current = prev[variantId] || {
        price: initialPrice.toString(),
        oldPrice: initialOldPrice !== undefined && initialOldPrice !== null ? initialOldPrice.toString() : "",
        stock: initialStock.toString(),
      };
      return {
        ...prev,
        [variantId]: {
          ...current,
          [field]: val,
        },
      };
    });
  };

  // Save Inline Variant to Supabase by variant.id UUID
  const handleSaveVariant = async (product: Product, variant: ProductVariant) => {
    const edit = inlineVariantEdits[variant.id] || {
      price: variant.price.toString(),
      oldPrice: variant.oldPrice !== undefined && variant.oldPrice !== null ? variant.oldPrice.toString() : "",
      stock: variant.stock.toString(),
    };

    const val = validateVariantEdit(edit, `${variant.storage} (${variant.color})`);
    if (!val.isValid) {
      showToast(val.error || "Validation failed", "error");
      return;
    }

    setSavingVariantIds((prev) => ({ ...prev, [variant.id]: true }));

    try {
      const updated: ProductVariant = {
        ...variant,
        price: val.price,
        oldPrice: val.oldPrice,
        stock: val.stock,
      };

      const res = await updateVariant(product.id, updated);
      if (res.success) {
        // Mark as recently saved for green feedback
        setRecentlySavedVariantIds((prev) => ({ ...prev, [variant.id]: true }));
        setTimeout(() => {
          setRecentlySavedVariantIds((prev) => {
            const next = { ...prev };
            delete next[variant.id];
            return next;
          });
        }, 3000);

        // Reset inline edit state to newly saved values so dirty flag is cleared
        setInlineVariantEdits((prev) => ({
          ...prev,
          [variant.id]: {
            price: val.price.toString(),
            oldPrice: val.oldPrice !== null ? val.oldPrice.toString() : "",
            stock: val.stock.toString(),
          },
        }));

        showToast(`Saved variant ${variant.storage} (${variant.color}) to Supabase!`, "success");
      } else {
        showToast(`Failed to sync variant update: ${res.error || "Supabase error"}`, "error");
      }
    } catch (err: any) {
      showToast(`Error saving variant: ${err?.message || "Unknown error"}`, "error");
    } finally {
      setSavingVariantIds((prev) => {
        const next = { ...prev };
        delete next[variant.id];
        return next;
      });
    }
  };

  // Save All Modified Variants for a Product
  const handleSaveAllVariants = async (product: Product) => {
    const dirtyVariants = getDirtyVariantsForProduct(product);
    if (dirtyVariants.length === 0) return;

    // Validate all dirty variants first before sending
    for (const v of dirtyVariants) {
      const edit = inlineVariantEdits[v.id];
      if (!edit) continue;
      const val = validateVariantEdit(edit, `${v.storage} (${v.color})`);
      if (!val.isValid) {
        showToast(val.error || "Validation failed", "error");
        return;
      }
    }

    setIsSavingProductBatch((prev) => ({ ...prev, [product.id]: true }));

    let successCount = 0;
    let failCount = 0;
    const failedVariants: string[] = [];

    try {
      for (const v of dirtyVariants) {
        const edit = inlineVariantEdits[v.id]!;
        const val = validateVariantEdit(edit, `${v.storage} (${v.color})`);
        const updated: ProductVariant = {
          ...v,
          price: val.price,
          oldPrice: val.oldPrice,
          stock: val.stock,
        };

        const res = await updateVariantInSupabase(product.id, updated);
        if (res.success) {
          successCount++;
          setRecentlySavedVariantIds((prev) => ({ ...prev, [v.id]: true }));
          setInlineVariantEdits((prev) => ({
            ...prev,
            [v.id]: {
              price: val.price.toString(),
              oldPrice: val.oldPrice !== null ? val.oldPrice.toString() : "",
              stock: val.stock.toString(),
            },
          }));
        } else {
          failCount++;
          failedVariants.push(`${v.storage} (${v.color})`);
        }
      }

      // Re-fetch catalog once after batch updates to recalculate lowest starting prices and store state
      await refreshCatalog();

      // Clear recently saved green state after 3 seconds
      setTimeout(() => {
        setRecentlySavedVariantIds((prev) => {
          const next = { ...prev };
          dirtyVariants.forEach((v) => delete next[v.id]);
          return next;
        });
      }, 3000);

      if (failCount === 0) {
        showToast(`All ${successCount} variant changes saved to Supabase!`, "success");
      } else if (successCount > 0) {
        showToast(
          `Saved ${successCount} variants. ${failCount} failed: ${failedVariants.join(", ")}`,
          "error"
        );
      } else {
        showToast(`Failed to save variant changes to Supabase database.`, "error");
      }
    } catch (err: any) {
      showToast(`Error saving variants: ${err?.message || "Unknown error"}`, "error");
    } finally {
      setIsSavingProductBatch((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  // Handle Quick Add Variant
  const handleAddSingleVariant = async (product: Product) => {
    const input = newVariantInputs[product.id] || {
      storage: "128GB",
      color: "Black",
      price: "150000",
      oldPrice: "",
      stock: "5",
      sku: "",
    };

    const price = parseInt(input.price, 10);
    const oldPrice = input.oldPrice ? parseInt(input.oldPrice, 10) : null;
    const stock = parseInt(input.stock, 10) || 5;

    if (!input.storage.trim() || !input.color.trim()) {
      showToast("Storage and Color are required", "error");
      return;
    }
    if (isNaN(price) || price <= 0) {
      showToast("Please enter a valid price", "error");
      return;
    }

    const variantId = `${product.id}-${input.storage.toLowerCase().replace(/\s+/g, "")}-${input.color.toLowerCase().replace(/\s+/g, "-")}`;
    const sku = input.sku.trim() || `TM-${product.model.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}-${input.storage.toUpperCase()}-${input.color.slice(0, 3).toUpperCase()}`;

    const newVar: ProductVariant = {
      id: variantId,
      storage: input.storage.trim(),
      color: input.color.trim(),
      price,
      oldPrice,
      stock,
      sku,
    };

    await addVariant(product.id, newVar);
    setNewVariantInputs((prev) => ({
      ...prev,
      [product.id]: { storage: "", color: "", price: "", oldPrice: "", stock: "5", sku: "" },
    }));
    showToast("Variant added and saved to Supabase!", "success");
  };

  // Run Variant Generator
  const handleRunVariantGenerator = async () => {
    if (!variantGenProduct) return;
    if (genStorages.length === 0) {
      showToast("Select at least one storage option", "error");
      return;
    }
    const colors = genColorsText
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    if (colors.length === 0) {
      showToast("Enter at least one color name", "error");
      return;
    }

    const basePrice = genBasePrice ? parseInt(genBasePrice, 10) : undefined;
    await generateVariants(variantGenProduct.id, genStorages, colors, basePrice);
    setVariantGenProduct(null);
    showToast(`Generated combinations for ${variantGenProduct.name} and saved to Supabase!`, "success");
  };

  // Real Image Upload to Supabase Storage bucket 'product-images'
  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !imageModalProduct) return;
    setIsUploading(true);

    try {
      let uploadedCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          errors.push(`${file.name}: Not an image file`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name}: Exceeds 10MB limit`);
          continue;
        }

        const res = await uploadImage(imageModalProduct.id, file, undefined, false);
        if (res.success) {
          uploadedCount++;
        } else {
          errors.push(`${file.name}: ${res.error || "Upload failed"}`);
        }
      }

      if (uploadedCount > 0) {
        showToast(`Uploaded ${uploadedCount} image(s) to Supabase Storage bucket "${STORAGE_BUCKET}"!`, "success");
        await refreshCatalog();
        router.refresh();
      }

      if (errors.length > 0) {
        showToast(`Upload issues: ${errors.join("; ")}`, "error");
      }
    } catch (e: any) {
      console.error("handleImageFiles exception:", e);
      showToast(e.message || "Failed to upload image to Supabase", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Add New Product
  const handleCreateProduct = async () => {
    if (!newProdName.trim() || !newProdModel.trim()) {
      showToast("Product name and model are required", "error");
      return;
    }
    const basePrice = parseInt(newProdBasePrice, 10);
    if (isNaN(basePrice) || basePrice <= 0) {
      showToast("Please enter a valid starting price", "error");
      return;
    }

    const slug = newProdName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = `custom-${Date.now()}`;

    const storages = newProdStorages.split(",").map((s) => s.trim()).filter(Boolean);
    const colorNames = newProdColors.split(",").map((c) => c.trim()).filter(Boolean);

    const colors: ProductColor[] = colorNames.map((name) => ({
      name,
      hex: name.toLowerCase().includes("black") ? "#1c1c1e" : name.toLowerCase().includes("white") ? "#f5f5f7" : "#8e8e93",
    }));

    const variants: ProductVariant[] = [];
    storages.forEach((st, stIdx) => {
      const storagePrice = basePrice + stIdx * 25000;
      colorNames.forEach((col) => {
        variants.push({
          id: `${id}-${st.toLowerCase().replace(/\s+/g, "")}-${col.toLowerCase().replace(/\s+/g, "-")}`,
          storage: st,
          color: col,
          price: storagePrice,
          oldPrice: Math.round(storagePrice * 1.08),
          stock: 5,
          sku: `TM-${newProdModel.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}-${st.toUpperCase()}-${col.slice(0, 3).toUpperCase()}`,
        });
      });
    });

    const newProduct: Product = {
      id,
      slug,
      name: newProdName.trim(),
      model: newProdModel.trim(),
      series: newProdSeries,
      category: newProdCategory,
      subcategory: newProdCategory === "iphones" ? "latest-iphones" : "cases-accessories",
      condition: newProdCondition,
      conditionBadge: newProdCondition === "Brand New" ? "Brand New Sealed" : "Grade A+ Pre-Owned",
      price: basePrice,
      oldPrice: Math.round(basePrice * 1.08),
      storage: storages[0] || "128GB",
      storageOptions: storages,
      colors,
      images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80"],
      description: `Official ${newProdName} available at Theekzu Mobile Sri Lanka.`,
      specifications: {
        warranty: newProdCondition === "Brand New" ? "1 Year Apple Warranty" : "6 Months Store Warranty",
        delivery: "1-2 Days Islandwide Delivery",
      },
      stock: "In Stock",
      featured: false,
      rating: 5.0,
      reviewsCount: 1,
      variants,
    };

    await addProduct(newProduct);
    setShowAddProductModal(false);
    showToast(`Product "${newProdName}" added and synced to Supabase!`, "success");
  };

  // Open Edit Modal for general details
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormModel(p.model);
    setFormSeries(p.series || "16");
    setFormCondition(p.condition);
    setFormInStock(p.stock.toLowerCase().includes("in stock"));
    setFormFeatured(Boolean(p.featured));
    setFormStorages(p.storageOptions ? p.storageOptions.join(", ") : p.storage || "128GB");
    setFormColors(p.colors ? p.colors.map((c) => c.name).join(", ") : "");
    setFormDescription(p.description);
  };

  const handleSaveProductEdit = async () => {
    if (!editingProduct) return;
    if (!formName.trim()) {
      showToast("Product name cannot be empty", "error");
      return;
    }

    setIsSavingProductEdit(true);

    try {
      const storages = formStorages.split(",").map((s) => s.trim()).filter(Boolean);
      const colorNames = formColors.split(",").map((c) => c.trim()).filter(Boolean);
      const updatedColors: ProductColor[] = colorNames.map((name) => {
        const existing = editingProduct.colors?.find((c) => c.name.toLowerCase() === name.toLowerCase());
        return existing || {
          name,
          hex: name.toLowerCase().includes("black") ? "#1c1c1e" : name.toLowerCase().includes("white") ? "#f5f5f7" : "#0066ff",
        };
      });

      const updatedProductData: Product = {
        ...editingProduct,
        name: formName.trim(),
        model: formModel.trim() || formName.trim(),
        series: formSeries,
        condition: formCondition,
        conditionBadge: formCondition === "Brand New" ? "Brand New Sealed" : "Grade A+ Pre-Owned",
        stock: formInStock ? "In Stock" : "Out of Stock",
        featured: formFeatured,
        storageOptions: storages.length > 0 ? storages : editingProduct.storageOptions,
        colors: updatedColors.length > 0 ? updatedColors : editingProduct.colors,
        description: formDescription,
      };

      const res = await updateProduct(updatedProductData);

      if (res.success) {
        // Synchronize any newly added storages or colors into product_variants
        const existingVariants = editingProduct.variants || [];
        const missingVariantsToAdd: ProductVariant[] = [];

        storages.forEach((st) => {
          colorNames.forEach((col) => {
            const hasVariant = existingVariants.some(
              (v) => v.storage.toLowerCase() === st.toLowerCase() && v.color.toLowerCase() === col.toLowerCase()
            );
            if (!hasVariant) {
              const basePrice = editingProduct.price || 150000;
              const sku = `TM-${(editingProduct.model || editingProduct.name).replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}-${st.toUpperCase()}-${col.slice(0, 3).toUpperCase()}`;
              missingVariantsToAdd.push({
                id: `new-${Date.now()}-${st}-${col}`,
                storage: st,
                color: col,
                price: basePrice,
                oldPrice: Math.round(basePrice * 1.08),
                stock: 3,
                sku,
              });
            }
          });
        });

        if (missingVariantsToAdd.length > 0) {
          for (const newVar of missingVariantsToAdd) {
            await updateVariantInSupabase(editingProduct.id, newVar);
          }
          await refreshCatalog();
        }

        setEditingProduct(null);
        showToast("Product updated successfully", "success");
        router.refresh();
      } else {
        showToast(`Failed to update product: ${res.error || "Supabase update rejected"}`, "error");
      }
    } catch (err: any) {
      console.error("handleSaveProductEdit error:", err);
      showToast(`Error updating product: ${err?.message || "Unexpected error"}`, "error");
    } finally {
      setIsSavingProductEdit(false);
    }
  };

  // Trigger one-time migration of all 21 models
  const handleMigrateAll = async () => {
    if (isMigrating) return;
    setIsMigrating(true);
    try {
      const res = await migrateCatalog();
      if (res.success) {
        await refreshCatalog();
        const totalSyncedProducts = res.productsInserted + res.productsAlreadyPresent;
        const totalSyncedVariants = res.variantsInserted + res.variantsAlreadyPresent;

        let summaryMsg = `Migration complete: ${totalSyncedProducts} products synced, ${totalSyncedVariants} variants synced, 0 failed.`;
        if (res.productsInserted > 0 || res.variantsInserted > 0) {
          summaryMsg = `Migration complete: ${totalSyncedProducts} products synced (${res.productsInserted} newly inserted), ${totalSyncedVariants} variants synced (${res.variantsInserted} newly inserted), 0 failed.`;
        }
        showToast(summaryMsg, "success");
      } else {
        console.error("Migration failed response:", res);
        showToast(res.error || "Migration failed. Check the console for the Supabase error.", "error");
      }
    } catch (e: any) {
      console.error("Migration exception in handleMigrateAll:", e);
      showToast(e.message || "Migration failed. Check the console for the Supabase error.", "error");
    } finally {
      setIsMigrating(false);
    }
  };

  // Sign out admin
  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    router.replace("/admin/login");
  };

  if (isVerifyingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 dark:border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            Verifying Admin Authorization with Supabase...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-xl animate-in slide-in-from-top-4 duration-300 ${
            toast.type === "success"
              ? "bg-emerald-500/95 text-white border-emerald-400"
              : toast.type === "error"
              ? "bg-rose-600/95 text-white border-rose-500"
              : "bg-blue-600/95 text-white border-blue-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Supabase Live Status Notice Banner */}
      <div className={`px-4 py-2 text-center text-xs font-semibold shadow-md flex items-center justify-center gap-2 ${
        isLiveDatabase
          ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white"
          : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white"
      }`}>
        <Database className="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>Database Status:</strong> {isLiveDatabase ? `Supabase Live — ${products.length} Products` : "Catalog ready. Click 'Sync 29 iPhones & Price List to Supabase' to insert into your database."}
        </span>
      </div>

      {/* Sync Prompt Banner when missing models are detected */}
      {isLiveDatabase && products.length < 29 && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 animate-pulse" />
            <span>
              <strong>Price List & Catalog Update Ready:</strong> Database currently has {products.length} products. 8 new iPhone models (SE 2nd Gen, X, XS, XS Max, 12 Mini, 13 Mini, 14 Plus, 15 Plus) and revised prices are ready to sync into Supabase.
            </span>
          </div>
          <button
            onClick={handleMigrateAll}
            disabled={isMigrating}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isMigrating ? "animate-spin" : ""}`} />
            <span>{isMigrating ? "Applying..." : "Apply Database Update Now"}</span>
          </button>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black tracking-tight">
                  Theekzu Mobile Admin Dashboard
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>Supabase Live</span>
                </span>
                {adminEmail && (
                  <span className="text-xs text-slate-500 dark:text-zinc-400 hidden sm:inline flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-blue-500" />
                    <span>{adminEmail}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Manage 29 iPhone models, variants, prices, and images. All edits save directly to Supabase in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Database • Edits save directly</span>
            </div>

            {products.length < 29 && (
              <button
                onClick={handleMigrateAll}
                disabled={isMigrating}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition-all disabled:opacity-50"
                title="Only use if initial products are missing from Supabase"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isMigrating ? "animate-spin" : ""}`} />
                <span>{isMigrating ? "Seeding Catalog..." : "Seed Baseline Catalog"}</span>
              </button>
            )}

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 transition-colors"
              title="Sign Out from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        {/* Filters & Search Bar */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-cyan-500/20 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Search Input */}
            <div className="lg:col-span-2 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2">
              <Search className="w-4 h-4 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search model, series, color or SKU (e.g. 17 Pro, Natural, TM-IP16)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-xs text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Series Filter */}
            <div>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
              >
                <option value="all">All iPhone Series</option>
                <option value="17">iPhone 17 Series</option>
                <option value="16">iPhone 16 Series</option>
                <option value="15">iPhone 15 Series</option>
                <option value="14">iPhone 14 Series</option>
                <option value="13">iPhone 13 Series</option>
                <option value="12">iPhone 12 Series</option>
                <option value="11">iPhone 11 Series</option>
                <option value="XS">iPhone XS Series</option>
                <option value="X">iPhone X</option>
                <option value="SE">iPhone SE Series</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
              >
                <option value="all">All Conditions</option>
                <option value="Brand New">Brand New</option>
                <option value="Used">Certified Pre-Owned</option>
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in_stock">In Stock Only</option>
                <option value="out_of_stock">Out of Stock Only</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-zinc-400">
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={onlyFeatured}
                onChange={(e) => setOnlyFeatured(e.target.checked)}
                className="rounded accent-blue-600"
              />
              <span>Featured Only</span>
            </label>
          </div>
        </div>

        {/* Product Cards & Variant Rows */}
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const isExpanded = Boolean(expandedVariants[product.id]);
            const primaryImg = getProductPrimaryImage(product);
            const lowestPrice = getLowestPrice(product);
            const variants = product.variants || [];
            const imagesList = customImages[product.id] || [];

            return (
              <div
                key={product.id}
                className="glass-card rounded-2xl border border-slate-200 dark:border-cyan-500/20 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Product Summary Row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/40">
                  
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-1 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      {primaryImg ? (
                        <Image
                          src={primaryImg}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400">No Img</span>
                      )}
                      {imagesList.length > 0 && (
                        <span
                          className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400"
                          title="Has uploaded Supabase Storage images"
                        />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {product.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                          Series {product.series}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          {product.condition}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
                        <span>
                          Starting From: <strong className="text-slate-900 dark:text-cyan-300 font-bold">{formatCurrency(lowestPrice)}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          <strong className="text-blue-600 dark:text-cyan-400">{variants.length}</strong> Variants
                        </span>
                        <span>•</span>
                        <span className={product.stock === "In Stock" ? "text-emerald-600 font-semibold" : "text-rose-500 font-semibold"}>
                          {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => toggleExpandVariants(product.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                        isExpanded
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-white/10 hover:border-blue-500"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{isExpanded ? "Hide Variants" : `Manage Variants (${variants.length})`}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <button
                      onClick={() => setImageModalProduct(product)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 flex items-center gap-1.5"
                      title="Upload and assign images via Supabase Storage"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Images ({imagesList.length || product.images?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => {
                        setVariantGenProduct(product);
                        setGenStorages(product.storageOptions || ["128GB", "256GB", "512GB", "1TB"]);
                        setGenColorsText(product.colors?.map((c) => c.name).join(", ") || "");
                        setGenBasePrice(lowestPrice.toString());
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-white/10 hover:text-blue-600"
                      title="Generate storage x color combinations"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span className="hidden sm:inline">Generator</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-white/10 hover:text-blue-600"
                      title="Edit Product Info"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-white/10 hover:text-cyan-400"
                      title="View live product page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={async () => {
                        if (confirm(`Delete ${product.name} from Supabase database?`)) {
                          await deleteProduct(product.id);
                          showToast("Product deleted from Supabase", "info");
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/20"
                      title="Delete product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

                {/* Expanded Variant Table & Quick Add */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-cyan-500/20 bg-slate-50/70 dark:bg-slate-950/60 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                          <span>Individual Variants for {product.name} (Supabase public.product_variants)</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          Edit the exact price, old price, and stock count for each combination. Changes save globally across all devices.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="text-xs text-slate-500">
                          Total Variants: <strong>{variants.length}</strong>
                        </div>

                        {/* Save All Changes Button */}
                        {(() => {
                          const dirtyCount = getDirtyVariantsForProduct(product).length;
                          const isBatchSaving = Boolean(isSavingProductBatch[product.id]);

                          return (
                            <button
                              onClick={() => handleSaveAllVariants(product)}
                              disabled={dirtyCount === 0 || isBatchSaving}
                              className={`min-h-[38px] sm:min-h-[36px] px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95 ${
                                dirtyCount > 0 && !isBatchSaving
                                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 cursor-pointer"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed border border-slate-300 dark:border-white/5"
                              }`}
                              title={
                                dirtyCount > 0
                                  ? `Save all ${dirtyCount} modified variants to Supabase`
                                  : "No unsaved changes in variants"
                              }
                            >
                              {isBatchSaving ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                                  <span>Saving {dirtyCount} Changes...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Save All Changes ({dirtyCount})</span>
                                </>
                              )}
                            </button>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Variant View: Desktop Table + Mobile Stacked Cards */}
                    {/* Desktop Table (hidden on mobile) */}
                    <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                          <tr>
                            <th className="p-3">Storage</th>
                            <th className="p-3">Color</th>
                            <th className="p-3">SKU</th>
                            <th className="p-3">Price (LKR)</th>
                            <th className="p-3">Old Price (LKR)</th>
                            <th className="p-3">Stock Qty</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                          {variants.map((v) => {
                            const edit = inlineVariantEdits[v.id] || {
                              price: v.price.toString(),
                              oldPrice: v.oldPrice ? v.oldPrice.toString() : "",
                              stock: v.stock.toString(),
                            };

                            const isDirty = isVariantDirty(v);
                            const isSaving = Boolean(savingVariantIds[v.id]);
                            const isRecentlySaved = Boolean(recentlySavedVariantIds[v.id]);

                            return (
                              <tr
                                key={v.id}
                                className={`transition-colors ${
                                  isDirty
                                    ? "bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-500/5 dark:hover:bg-amber-500/10"
                                    : isRecentlySaved
                                    ? "bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10"
                                    : "hover:bg-slate-100/50 dark:hover:bg-slate-900/50"
                                }`}
                              >
                                <td className="p-3 font-bold text-slate-900 dark:text-white">
                                  <div className="flex items-center gap-1.5">
                                    <span>{v.storage}</span>
                                    {isDirty && (
                                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                                        Unsaved
                                      </span>
                                    )}
                                    {isRecentlySaved && (
                                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider flex items-center gap-0.5">
                                        <Check className="w-2.5 h-2.5" /> Saved
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full border border-black/20" />
                                  <span>{v.color}</span>
                                </td>
                                <td className="p-3 font-mono text-[11px] text-slate-400 dark:text-zinc-500">
                                  {v.sku}
                                </td>
                                <td className="p-3">
                                  <input
                                    type="number"
                                    value={edit.price}
                                    onChange={(e) =>
                                      handleInlineVariantChange(v.id, "price", e.target.value, v.price, v.oldPrice, v.stock)
                                    }
                                    className={`w-28 px-2 py-1 rounded bg-white dark:bg-slate-900 border font-bold text-slate-900 dark:text-white focus:outline-none ${
                                      isDirty
                                        ? "border-amber-400 dark:border-amber-500 focus:border-amber-500 ring-1 ring-amber-400/20"
                                        : "border-slate-200 dark:border-white/10 focus:border-blue-500"
                                    }`}
                                  />
                                </td>
                                <td className="p-3">
                                  <input
                                    type="number"
                                    placeholder="Optional"
                                    value={edit.oldPrice}
                                    onChange={(e) =>
                                      handleInlineVariantChange(v.id, "oldPrice", e.target.value, v.price, v.oldPrice, v.stock)
                                    }
                                    className="w-28 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 focus:outline-none focus:border-blue-500"
                                  />
                                </td>
                                <td className="p-3">
                                  <input
                                    type="number"
                                    value={edit.stock}
                                    onChange={(e) =>
                                      handleInlineVariantChange(v.id, "stock", e.target.value, v.price, v.oldPrice, v.stock)
                                    }
                                    className={`w-20 px-2 py-1 rounded bg-white dark:bg-slate-900 border font-semibold text-slate-900 dark:text-white focus:outline-none ${
                                      isDirty
                                        ? "border-amber-400 dark:border-amber-500 focus:border-amber-500 ring-1 ring-amber-400/20"
                                        : "border-slate-200 dark:border-white/10 focus:border-blue-500"
                                    }`}
                                  />
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleSaveVariant(product, v)}
                                      disabled={!isDirty || isSaving}
                                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all ${
                                        isSaving
                                          ? "bg-blue-600 text-white cursor-wait"
                                          : isRecentlySaved
                                          ? "bg-emerald-600 text-white shadow-xs"
                                          : isDirty
                                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                                          : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed"
                                      }`}
                                    >
                                      {isSaving ? (
                                        <>
                                          <RefreshCw className="w-3 h-3 animate-spin" />
                                          <span>Saving...</span>
                                        </>
                                      ) : isRecentlySaved ? (
                                        <>
                                          <Check className="w-3 h-3" />
                                          <span>Saved</span>
                                        </>
                                      ) : isDirty ? (
                                        <>
                                          <Check className="w-3 h-3" />
                                          <span>Save*</span>
                                        </>
                                      ) : (
                                        <>
                                          <Check className="w-3 h-3" />
                                          <span>Save</span>
                                        </>
                                      )}
                                    </button>

                                    <button
                                      onClick={async () => {
                                        if (confirm(`Delete variant ${v.storage} - ${v.color} from Supabase?`)) {
                                          const res = await deleteVariant(product.id, v.id);
                                          if (res.success) {
                                            showToast("Variant deleted from Supabase", "info");
                                          } else {
                                            showToast(`Failed to delete variant: ${res.error || "Supabase error"}`, "error");
                                          }
                                        }
                                      }}
                                      className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                                      title="Delete variant"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards (visible on md:hidden) */}
                    <div className="md:hidden space-y-3">
                      {variants.map((v) => {
                        const edit = inlineVariantEdits[v.id] || {
                          price: v.price.toString(),
                          oldPrice: v.oldPrice ? v.oldPrice.toString() : "",
                          stock: v.stock.toString(),
                        };

                        const isDirty = isVariantDirty(v);
                        const isSaving = Boolean(savingVariantIds[v.id]);
                        const isRecentlySaved = Boolean(recentlySavedVariantIds[v.id]);

                        return (
                          <div
                            key={v.id}
                            className={`p-3.5 rounded-xl border shadow-xs space-y-2.5 transition-colors ${
                              isDirty
                                ? "bg-amber-500/5 dark:bg-amber-500/5 border-amber-500/30"
                                : isRecentlySaved
                                ? "bg-emerald-500/5 dark:bg-emerald-500/5 border-emerald-500/30"
                                : "bg-white dark:bg-slate-900/90 border-slate-200 dark:border-white/10"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs text-slate-900 dark:text-white">{v.storage}</span>
                                <span className="text-slate-400">•</span>
                                <span className="text-xs text-slate-600 dark:text-zinc-300">{v.color}</span>
                                {isDirty && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                                    Unsaved
                                  </span>
                                )}
                                {isRecentlySaved && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider flex items-center gap-0.5">
                                    <Check className="w-2.5 h-2.5" /> Saved
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-[120px]">
                                {v.sku}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-zinc-400 block mb-1">
                                  Price (LKR)
                                </label>
                                <input
                                  type="number"
                                  value={edit.price}
                                  onChange={(e) =>
                                    handleInlineVariantChange(v.id, "price", e.target.value, v.price, v.oldPrice, v.stock)
                                  }
                                  className={`w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border font-bold text-xs text-slate-900 dark:text-white focus:outline-none ${
                                    isDirty
                                      ? "border-amber-400 dark:border-amber-500 focus:border-amber-500 ring-1 ring-amber-400/20"
                                      : "border-slate-200 dark:border-white/10"
                                  }`}
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-zinc-400 block mb-1">
                                  Stock Qty
                                </label>
                                <input
                                  type="number"
                                  value={edit.stock}
                                  onChange={(e) =>
                                    handleInlineVariantChange(v.id, "stock", e.target.value, v.price, v.oldPrice, v.stock)
                                  }
                                  className={`w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border font-bold text-xs text-slate-900 dark:text-white focus:outline-none ${
                                    isDirty
                                      ? "border-amber-400 dark:border-amber-500 focus:border-amber-500 ring-1 ring-amber-400/20"
                                      : "border-slate-200 dark:border-white/10"
                                  }`}
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-white/5">
                              <button
                                onClick={() => handleSaveVariant(product, v)}
                                disabled={!isDirty || isSaving}
                                className={`min-h-[44px] flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                                  isSaving
                                    ? "bg-blue-600 text-white cursor-wait"
                                    : isRecentlySaved
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : isDirty
                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs active:scale-95"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed"
                                }`}
                              >
                                {isSaving ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Saving...</span>
                                  </>
                                ) : isRecentlySaved ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Saved</span>
                                  </>
                                ) : isDirty ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Save Changes*</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Saved</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={async () => {
                                  if (confirm(`Delete variant ${v.storage} - ${v.color} from Supabase?`)) {
                                    const res = await deleteVariant(product.id, v.id);
                                    if (res.success) {
                                      showToast("Variant deleted from Supabase", "info");
                                    } else {
                                      showToast(`Failed to delete variant: ${res.error || "Supabase error"}`, "error");
                                    }
                                  }
                                }}
                                className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 flex items-center justify-center transition-colors active:scale-95"
                                title="Delete variant"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Add Variant Form */}
                    <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-white/10 bg-white/40 dark:bg-slate-900/30 space-y-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                        <span>Add Single Variant to Supabase</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
                        <input
                          type="text"
                          placeholder="Storage (e.g. 512GB)"
                          value={newVariantInputs[product.id]?.storage || ""}
                          onChange={(e) =>
                            setNewVariantInputs((prev) => ({
                              ...prev,
                              [product.id]: { ...(prev[product.id] || { color: "", price: "", oldPrice: "", stock: "5", sku: "" }), storage: e.target.value },
                            }))
                          }
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Color (e.g. Desert Titanium)"
                          value={newVariantInputs[product.id]?.color || ""}
                          onChange={(e) =>
                            setNewVariantInputs((prev) => ({
                              ...prev,
                              [product.id]: { ...(prev[product.id] || { storage: "", price: "", oldPrice: "", stock: "5", sku: "" }), color: e.target.value },
                            }))
                          }
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Price (LKR)"
                          value={newVariantInputs[product.id]?.price || ""}
                          onChange={(e) =>
                            setNewVariantInputs((prev) => ({
                              ...prev,
                              [product.id]: { ...(prev[product.id] || { storage: "", color: "", oldPrice: "", stock: "5", sku: "" }), price: e.target.value },
                            }))
                          }
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Old Price (Optional)"
                          value={newVariantInputs[product.id]?.oldPrice || ""}
                          onChange={(e) =>
                            setNewVariantInputs((prev) => ({
                              ...prev,
                              [product.id]: { ...(prev[product.id] || { storage: "", color: "", price: "", stock: "5", sku: "" }), oldPrice: e.target.value },
                            }))
                          }
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Stock (Default: 5)"
                          value={newVariantInputs[product.id]?.stock || ""}
                          onChange={(e) =>
                            setNewVariantInputs((prev) => ({
                              ...prev,
                              [product.id]: { ...(prev[product.id] || { storage: "", color: "", price: "", oldPrice: "", sku: "" }), stock: e.target.value },
                            }))
                          }
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddSingleVariant(product)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Variant</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

      </main>

      {/* ========================================================================= */}
      {/* IMAGE MANAGEMENT MODAL (Supabase Storage bucket 'product-images') */}
      {/* ========================================================================= */}
      {mounted && imageModalProduct && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isUploading) {
              setImageModalProduct(null);
            }
          }}
        >
          {(() => {
            const currentModalProduct = products.find((p) => p.id === imageModalProduct.id) || imageModalProduct;
            const currentImages = customImages[currentModalProduct.id] || [];
            const primaryImageUrl = getProductPrimaryImage(currentModalProduct);

            return (
              <div
                className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 dark:border-cyan-500/30 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 p-5 sm:p-6 pb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                        <span>Product Images</span>
                      </h3>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                        {currentModalProduct.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                      Supabase Storage bucket: <code className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">{STORAGE_BUCKET}</code>
                    </p>
                  </div>
                  <button
                    onClick={() => !isUploading && setImageModalProduct(null)}
                    disabled={isUploading}
                    aria-label="Close modal"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                  {/* Current Storefront Image Preview */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-1.5 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      {primaryImageUrl ? (
                        <Image
                          src={primaryImageUrl}
                          alt={currentModalProduct.name}
                          width={80}
                          height={80}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-[11px] text-slate-400">No Image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                          Storefront Display
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Active Main Image
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate mt-0.5">
                        {currentModalProduct.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        This is the photo buyers will see on the storefront catalog and product showcase.
                      </p>
                    </div>
                  </div>

                  {/* Upload Actions & Dropzone */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        Upload New Images
                      </h4>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>{isUploading ? "Uploading..." : "Upload / Add Image"}</span>
                      </button>
                    </div>

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (!isUploading) handleImageFiles(e.dataTransfer.files);
                      }}
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                        isUploading
                          ? "border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 cursor-wait opacity-80"
                          : "border-blue-300 dark:border-cyan-500/40 hover:border-blue-500 dark:hover:border-cyan-400 bg-blue-50/30 dark:bg-slate-950/50 hover:bg-blue-50/60 dark:hover:bg-slate-950/80"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => handleImageFiles(e.target.files)}
                        className="hidden"
                      />
                      {isUploading ? (
                        <div className="flex flex-col items-center py-2">
                          <RefreshCw className="w-8 h-8 text-blue-600 dark:text-cyan-400 animate-spin mb-2" />
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            Uploading images to Supabase Storage...
                          </p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                            Saving directly to bucket <code className="font-mono">{STORAGE_BUCKET}</code> and linking to database.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <UploadCloud className="w-10 h-10 text-blue-600 dark:text-cyan-400 mb-2 transition-transform hover:scale-110" />
                          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200">
                            Click &quot;Upload / Add Image&quot; or drag &amp; drop photos here
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                            PNG, JPG, WEBP up to 10MB each. Saved globally in Supabase bucket <code className="font-mono">{STORAGE_BUCKET}</code>.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery of Uploaded Images */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        Supabase Images ({currentImages.length})
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                        {currentImages.length === 0 ? "Showing catalog fallback" : "Custom images active"}
                      </span>
                    </div>

                    {currentImages.length === 0 ? (
                      <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-zinc-400">
                        <ImageIcon className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-xs font-semibold">No custom images uploaded yet for {currentModalProduct.name}.</p>
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                          The storefront currently displays the default catalog photo. Upload an image above to customize it.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                        {currentImages.map((img) => (
                          <div
                            key={img.id}
                            className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-cyan-500/30 transition-all"
                          >
                            <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-1 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                              <Image
                                src={img.image_url || img.storage_path || "/logo.png"}
                                alt={img.filename || "Product Image"}
                                width={60}
                                height={60}
                                className="max-h-full max-w-full object-contain"
                              />
                              {img.is_primary && (
                                <span className="absolute top-1 left-1 px-1 py-0.2 text-[8px] font-black bg-cyan-500 text-slate-950 rounded uppercase">
                                  Main
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 space-y-1.5">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate block">
                                  {img.filename || "Image"}
                                </span>
                                {img.is_primary && (
                                  <span className="text-[10px] font-black bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <Check className="w-2.5 h-2.5" /> Primary
                                  </span>
                                )}
                              </div>

                              {/* Color assignment selector */}
                              <div className="flex items-center gap-1.5">
                                <select
                                  value={img.color || ""}
                                  onChange={async (e) => {
                                    const res = await assignImageToColor(img.id, e.target.value, currentModalProduct.id);
                                    if (res.success) {
                                      showToast("Color assigned and saved to Supabase!", "success");
                                    } else {
                                      showToast(`Failed: ${res.error || "Supabase error"}`, "error");
                                    }
                                  }}
                                  className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 w-full text-slate-700 dark:text-zinc-300 focus:outline-none focus:border-blue-500"
                                >
                                  <option value="">All Colors (General Image)</option>
                                  {currentModalProduct.colors?.map((c) => (
                                    <option key={c.name} value={c.name}>
                                      Color: {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="flex items-center justify-between text-[11px] pt-0.5">
                                {!img.is_primary ? (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const res = await setPrimaryImage(currentModalProduct.id, img.id);
                                      if (res.success) {
                                        showToast("Primary image set in Supabase!", "success");
                                      } else {
                                        showToast(`Failed: ${res.error || "Supabase error"}`, "error");
                                      }
                                    }}
                                    className="text-blue-600 dark:text-cyan-400 hover:underline font-bold"
                                  >
                                    Set as Primary
                                  </button>
                                ) : (
                                  <span className="text-emerald-500 font-bold flex items-center gap-1 text-[11px]">
                                    <CheckCircle2 className="w-3 h-3" /> Current Main
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={async () => {
                                    const res = await deleteImage(img.id, img.image_url, currentModalProduct.id);
                                    if (res.success) {
                                      showToast("Image removed from Supabase", "info");
                                    } else {
                                      showToast(`Failed to delete: ${res.error || "Database error"}`, "error");
                                    }
                                  }}
                                  className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline flex items-center gap-1 font-semibold ml-auto"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                    <span className="font-bold text-slate-800 dark:text-zinc-200">{currentImages.length}</span> image(s) in Supabase Storage
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageModalProduct(null)}
                      disabled={isUploading}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* VARIANT GENERATOR MODAL */}
      {/* ========================================================================= */}
      {mounted && variantGenProduct && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setVariantGenProduct(null);
          }}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 border border-slate-200 dark:border-cyan-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Variant Generator: {variantGenProduct.name}</span>
              </h3>
              <button
                onClick={() => setVariantGenProduct(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Select Storage Capacities:</label>
                <div className="flex flex-wrap gap-2">
                  {["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"].map((st) => (
                    <label
                      key={st}
                      className={`px-3 py-1.5 rounded-lg border cursor-pointer font-bold transition-all ${
                        genStorages.includes(st)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={genStorages.includes(st)}
                        onChange={(e) => {
                          if (e.target.checked) setGenStorages([...genStorages, st]);
                          else setGenStorages(genStorages.filter((s) => s !== st));
                        }}
                        className="hidden"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Color Names (comma separated):</label>
                <textarea
                  rows={2}
                  value={genColorsText}
                  onChange={(e) => setGenColorsText(e.target.value)}
                  placeholder="e.g. Natural Titanium, Black Titanium, White Titanium, Desert Titanium"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Base Price (Lowest Storage) in LKR:</label>
                <input
                  type="number"
                  value={genBasePrice}
                  onChange={(e) => setGenBasePrice(e.target.value)}
                  placeholder="e.g. 295000"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setVariantGenProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRunVariantGenerator}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20"
              >
                Generate Combinations into Supabase
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* ADD NEW PRODUCT MODAL */}
      {/* ========================================================================= */}
      {mounted && showAddProductModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddProductModal(false);
          }}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 border border-slate-200 dark:border-cyan-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>Add New Product to Supabase</span>
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Product Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Apple iPhone 17 Ultra 5G"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Model Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. iPhone 17 Ultra"
                    value={newProdModel}
                    onChange={(e) => setNewProdModel(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Series:</label>
                  <select
                    value={newProdSeries}
                    onChange={(e) => setNewProdSeries(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                  >
                    <option value="17">iPhone 17</option>
                    <option value="16">iPhone 16</option>
                    <option value="15">iPhone 15</option>
                    <option value="14">iPhone 14</option>
                    <option value="13">iPhone 13</option>
                    <option value="12">iPhone 12</option>
                    <option value="11">iPhone 11</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Condition:</label>
                  <select
                    value={newProdCondition}
                    onChange={(e) => setNewProdCondition(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                  >
                    <option value="Brand New">Brand New Sealed</option>
                    <option value="Used">Certified Pre-Owned</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Starting Price (LKR):</label>
                  <input
                    type="number"
                    placeholder="e.g. 350000"
                    value={newProdBasePrice}
                    onChange={(e) => setNewProdBasePrice(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Storage Options (comma separated):</label>
                <input
                  type="text"
                  value={newProdStorages}
                  onChange={(e) => setNewProdStorages(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Colors (comma separated):</label>
                <input
                  type="text"
                  value={newProdColors}
                  onChange={(e) => setNewProdColors(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProduct}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20"
              >
                Create Product in Supabase
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* EDIT GENERAL PRODUCT MODAL */}
      {/* ========================================================================= */}
      {mounted && editingProduct && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSavingProductEdit) {
              setEditingProduct(null);
            }
          }}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 border border-slate-200 dark:border-cyan-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>Edit Product Details</span>
              </h3>
              <button
                onClick={() => !isSavingProductEdit && setEditingProduct(null)}
                disabled={isSavingProductEdit}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Product Title:</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Series:</label>
                  <input
                    type="text"
                    value={formSeries}
                    onChange={(e) => setFormSeries(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Condition:</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Used">Certified Pre-Owned</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Overall In Stock</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Featured Product</span>
                </label>
              </div>

              <div>
                <label className="font-bold block mb-1">Storage Capacities (comma separated):</label>
                <input
                  type="text"
                  placeholder="e.g. 128GB, 256GB, 512GB, 1TB"
                  value={formStorages}
                  onChange={(e) => setFormStorages(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Color Options (comma separated):</label>
                <input
                  type="text"
                  placeholder="e.g. Natural Titanium, Black Titanium, Desert Titanium"
                  value={formColors}
                  onChange={(e) => setFormColors(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Overview Description:</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-zinc-400 bg-blue-500/5 dark:bg-cyan-500/5 p-2.5 rounded-xl border border-blue-500/10 dark:border-cyan-500/10 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
              <span>Edits save directly to Supabase and immediately reflect on the live storefront. No catalog sync needed.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setEditingProduct(null)}
                disabled={isSavingProductEdit}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProductEdit}
                disabled={isSavingProductEdit}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-blue-500/20"
              >
                {isSavingProductEdit ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
