"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductContext";
import { Product, ProductVariant, ProductColor } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { supabase, isSupabaseConfigured, STORAGE_BUCKET } from "@/lib/supabaseClient";
import { checkIsAdminUser } from "@/lib/supabaseService";
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

  // Verify Admin Session on mount using Supabase Auth and public.admin_users
  useEffect(() => {
    async function verifyAuth() {
      if (!isSupabaseConfigured()) {
        // If Supabase not yet configured, allow viewing dashboard with config warning
        setIsVerifyingAuth(false);
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
        oldPrice: initialOldPrice ? initialOldPrice.toString() : "",
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

  // Save Inline Variant to Supabase
  const handleSaveVariant = async (product: Product, variant: ProductVariant) => {
    const edit = inlineVariantEdits[variant.id];
    if (!edit) return;

    const newPrice = parseInt(edit.price, 10);
    const newOldPrice = edit.oldPrice ? parseInt(edit.oldPrice, 10) : null;
    const newStock = parseInt(edit.stock, 10);

    if (isNaN(newPrice) || newPrice <= 0) {
      showToast("Please enter a valid price greater than 0", "error");
      return;
    }
    if (isNaN(newStock) || newStock < 0) {
      showToast("Please enter a valid non-negative stock count", "error");
      return;
    }

    const updated: ProductVariant = {
      ...variant,
      price: newPrice,
      oldPrice: newOldPrice,
      stock: newStock,
    };

    const ok = await updateVariant(product.id, updated);
    if (ok) {
      showToast(`Saved variant ${variant.storage} (${variant.color}) to Supabase globally!`, "success");
    } else {
      showToast("Saved locally, but failed to sync to Supabase database.", "error");
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
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 10 * 1024 * 1024) {
          showToast(`File ${file.name} exceeds 10MB limit`, "error");
          continue;
        }

        const ok = await uploadImage(imageModalProduct.id, file, undefined, false);
        if (ok) uploadedCount++;
      }

      if (uploadedCount > 0) {
        showToast(`Uploaded ${uploadedCount} image(s) to Supabase Storage bucket "${STORAGE_BUCKET}"!`, "success");
      }
    } catch (e: any) {
      console.error(e);
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

    const storages = formStorages.split(",").map((s) => s.trim()).filter(Boolean);
    const colorNames = formColors.split(",").map((c) => c.trim()).filter(Boolean);
    const updatedColors: ProductColor[] = colorNames.map((name) => {
      const existing = editingProduct.colors?.find((c) => c.name.toLowerCase() === name.toLowerCase());
      return existing || {
        name,
        hex: name.toLowerCase().includes("black") ? "#1c1c1e" : name.toLowerCase().includes("white") ? "#f5f5f7" : "#0066ff",
      };
    });

    await updateProduct({
      ...editingProduct,
      name: formName.trim(),
      model: formModel.trim() || editingProduct.model,
      series: formSeries,
      condition: formCondition,
      conditionBadge: formCondition === "Brand New" ? "Brand New Sealed" : "Grade A+ Pre-Owned",
      stock: formInStock ? "In Stock" : "Out of Stock",
      featured: formFeatured,
      storageOptions: storages.length > 0 ? storages : editingProduct.storageOptions,
      colors: updatedColors.length > 0 ? updatedColors : editingProduct.colors,
      description: formDescription,
    });

    setEditingProduct(null);
    showToast("Product details, storages, and colors updated in Supabase database!", "success");
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
          <strong>Database Status:</strong> {isLiveDatabase ? `Supabase Live — ${products.length} Products` : "Using Default 21-Model Catalog. Click 'Sync 21 iPhones to Supabase' to insert into your database."}
        </span>
      </div>

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
                Manage 21 iPhone models, variants, prices, and upload real images directly to Supabase Storage bucket <code>{STORAGE_BUCKET}</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={handleMigrateAll}
              disabled={isMigrating}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition-all disabled:opacity-50"
              title="Safe one-time migration of all 21 models into public.products"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isMigrating ? "animate-spin" : ""}`} />
              <span>{isMigrating ? "Migrating..." : "Sync 21 iPhones to Supabase"}</span>
            </button>

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

                      <div className="text-xs text-slate-500">
                        Total Variants: <strong>{variants.length}</strong>
                      </div>
                    </div>

                    {/* Variant Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
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

                            const hasChanged =
                              edit.price !== v.price.toString() ||
                              edit.oldPrice !== (v.oldPrice ? v.oldPrice.toString() : "") ||
                              edit.stock !== v.stock.toString();

                            return (
                              <tr key={v.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="p-3 font-bold text-slate-900 dark:text-white">
                                  {v.storage}
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
                                    className="w-28 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
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
                                    className="w-20 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                  />
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleSaveVariant(product, v)}
                                      disabled={!hasChanged}
                                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all ${
                                        hasChanged
                                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                                          : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed"
                                      }`}
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Save</span>
                                    </button>

                                    <button
                                      onClick={async () => {
                                        if (confirm(`Delete variant ${v.storage} - ${v.color} from Supabase?`)) {
                                          await deleteVariant(product.id, v.id);
                                          showToast("Variant deleted from Supabase", "info");
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

                    {/* Quick Add Variant Form */}
                    <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-white/10 bg-white/40 dark:bg-slate-900/30 space-y-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                        <span>Add Single Variant to Supabase</span>
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
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
      {imageModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-6 border border-slate-200 dark:border-cyan-500/30 shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <span>Images: {imageModalProduct.name}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Upload images directly to Supabase Storage bucket <code>{STORAGE_BUCKET}</code> and assign them to specific colors.
                </p>
              </div>
              <button
                onClick={() => setImageModalProduct(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleImageFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-400 dark:border-cyan-500/40 hover:border-blue-600 dark:hover:border-cyan-400 rounded-2xl p-6 text-center cursor-pointer bg-blue-50/50 dark:bg-slate-950/50 transition-colors"
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(e) => handleImageFiles(e.target.files)}
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 mx-auto text-blue-600 dark:text-cyan-400 mb-2 animate-pulse" />
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200">
                {isUploading ? "Uploading image to Supabase Storage..." : "Click to select or drag & drop product images"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                PNG, JPG, WEBP up to 10MB each. Saved globally in Supabase Storage bucket <code>{STORAGE_BUCKET}</code>.
              </p>
            </div>

            {/* Gallery of Uploaded Images */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Supabase Images ({customImages[imageModalProduct.id]?.length || 0})
              </h4>

              {(!customImages[imageModalProduct.id] || customImages[imageModalProduct.id].length === 0) ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No images uploaded yet to Supabase Storage for this product. Default catalog images are currently displayed.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {customImages[imageModalProduct.id].map((img) => (
                    <div
                      key={img.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950"
                    >
                      <div className="w-14 h-14 rounded-lg bg-white dark:bg-slate-900 border p-1 flex items-center justify-center flex-shrink-0">
                        <Image
                          src={img.image_url || img.storage_path || "/logo.png"}
                          alt={img.filename || "Product Image"}
                          width={50}
                          height={50}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white truncate block">
                            {img.filename || "Product Image"}
                          </span>
                          {img.is_primary && (
                            <span className="text-[10px] font-black bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded">
                              Primary
                            </span>
                          )}
                        </div>

                        {/* Color assignment selector */}
                        <div className="flex items-center gap-2">
                          <select
                            value={img.color || ""}
                            onChange={async (e) => {
                              await assignImageToColor(img.id, e.target.value, imageModalProduct.id);
                              showToast("Color assigned and saved to Supabase!", "success");
                            }}
                            className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded px-2 py-0.5 w-full text-slate-700 dark:text-zinc-300"
                          >
                            <option value="">No specific color (General)</option>
                            {imageModalProduct.colors?.map((c) => (
                              <option key={c.name} value={c.name}>
                                Color: {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1">
                          {!img.is_primary ? (
                            <button
                              onClick={async () => {
                                await setPrimaryImage(imageModalProduct.id, img.id);
                                showToast("Primary image set in Supabase!", "success");
                              }}
                              className="text-blue-600 dark:text-cyan-400 hover:underline font-medium"
                            >
                              Set as Primary
                            </button>
                          ) : (
                            <span className="text-emerald-500 font-bold">Current Main</span>
                          )}

                          <button
                            onClick={async () => {
                              await deleteImage(img.id, img.image_url, imageModalProduct.id);
                              showToast("Image removed from Supabase", "info");
                            }}
                            className="text-rose-500 hover:underline flex items-center gap-1 font-medium"
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

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setImageModalProduct(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VARIANT GENERATOR MODAL */}
      {/* ========================================================================= */}
      {variantGenProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 dark:border-cyan-500/30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Variant Generator: {variantGenProduct.name}</span>
              </h3>
              <button onClick={() => setVariantGenProduct(null)}>
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
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRunVariantGenerator}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Generate Combinations into Supabase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD NEW PRODUCT MODAL */}
      {/* ========================================================================= */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-cyan-500/30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>Add New Product to Supabase</span>
              </h3>
              <button onClick={() => setShowAddProductModal(false)}>
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
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProduct}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Create Product in Supabase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT GENERAL PRODUCT MODAL */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-cyan-500/30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>Edit Product Details</span>
              </h3>
              <button onClick={() => setEditingProduct(null)}>
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

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProductEdit}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Save Changes to Supabase
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
