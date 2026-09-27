// ============================================================================
// THEEKZU MOBILE — COMPLETE 21 iPHONE CATALOG & ACCESSORIES
// VARIANT-BASED ARCHITECTURE
// ============================================================================

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  storage: string;
  color: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  sku: string;
}

export interface ProductSpecs {
  chip?: string;
  display?: string;
  camera?: string;
  battery?: string;
  build?: string;
  warranty?: string;
  delivery?: string;
  [key: string]: string | undefined;
}

export interface Product {
  updatedAt?: string;
  id: string;
  slug: string;
  name: string;
  series: string; // e.g. "11", "12", "13", "14", "15", "16", "17", or "accessories"
  model: string;
  category: "iphones" | "accessories";
  subcategory: "latest-iphones" | "used-iphones" | "airpods" | "apple-watch" | "chargers-cables" | "cases-accessories";
  condition: "Brand New" | "Used";
  conditionBadge: string;
  
  // Base / Display price (calculated from lowest available variant if variants present)
  price: number;
  oldPrice?: number;
  discount?: string;
  
  // Storage & Color configurations
  storage: string;
  storageOptions: string[];
  colors: ProductColor[];
  
  // Images (URLs from assets or cloud)
  images: string[];
  
  // Full description & specs
  description: string;
  specifications: ProductSpecs;
  
  // Overall stock status
  stock: string;
  featured: boolean;
  isWeekendDeal?: boolean;
  rating: number;
  reviewsCount: number;

  // Complete variant list (storage + color + price + stock + sku)
  variants: ProductVariant[];
}

// Fallback high-tech placeholder when no specific image is available
export const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80";

// Helper to generate variants
function generateDefaultVariants(
  productId: string,
  prefix: string,
  storages: { storage: string; price: number; oldPrice?: number; stock?: number }[],
  colors: { name: string; hex: string }[]
): ProductVariant[] {
  const variants: ProductVariant[] = [];
  for (const st of storages) {
    for (const col of colors) {
      const colorCode = col.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase();
      const storageCode = st.storage.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      const variantId = `${productId}-${st.storage.toLowerCase()}-${col.name.toLowerCase().replace(/\s+/g, "-")}`;
      const sku = `TM-${prefix}-${storageCode}-${colorCode}`;

      // Slight natural variation for popular colors (e.g. Natural Titanium, Deep Purple)
      let priceOffset = 0;

      variants.push({
        id: variantId,
        storage: st.storage,
        color: col.name,
        price: st.price + priceOffset,
        oldPrice: st.oldPrice ? st.oldPrice + priceOffset : null,
        stock: st.stock !== undefined ? st.stock : 3,
        sku,
      });
    }
  }
  return variants;
}

export const products: Product[] = [
  // ==========================================================================
  // iPHONE 17 SERIES (Next-Gen Flagship)
  // ==========================================================================
  {
    id: "iphone-17-pro-max",
    slug: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    series: "17",
    model: "iPhone 17 Pro Max",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Next-Gen Flagship",
    price: 435000,
    oldPrice: 535000,
    discount: "7% OFF",
    storage: "256GB",
    storageOptions: ["256GB", "512GB", "1TB", "2TB"],
    colors: [
      { name: "Cosmic Orange Titanium", hex: "#d97706" },
      { name: "Deep Space Titanium", hex: "#1e1e24" },
      { name: "Natural Silver Titanium", hex: "#94a3b8" },
      { name: "Sky Blue Titanium", hex: "#38bdf8" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "The visionary iPhone 17 Pro Max featuring 2nm A19 Pro Bionic with Apple Intelligence 2.0, Quad-Fusion 48MP periscope telephoto, ultra-thin forged aerodynamic titanium frame, and anti-reflective sapphire crystal display.",
    specifications: {
      chip: "A19 Pro chip (2nm architecture) with 32-core Neural Engine",
      display: "6.9-inch Super Retina XDR Tandem OLED (120Hz ProMotion, 3500 nits peak)",
      camera: "Pro Quad-Camera: 48MP Wide, 48MP Ultra Wide, 48MP 10x Periscope Telephoto",
      battery: "Up to 36 hours video playback (Next-Gen Solid Silicon-Carbon Battery)",
      build: "Grade 6 Aerodynamic Titanium with Armor Ceramic Glass",
      warranty: "1 Year Official Apple Warranty + Theekzu Mobile Care",
      delivery: "Express Priority Courier across Sri Lanka",
    },
    stock: "In Stock",
    featured: true,
    rating: 5.0,
    reviewsCount: 14,
    variants: generateDefaultVariants(
      "iphone-17-pro-max",
      "17PM",
      [
        { storage: "256GB", price: 435000, oldPrice: 480000, stock: 4 },
        { storage: "512GB", price: 549000, oldPrice: 585000, stock: 3 },
        { storage: "1TB", price: 615000, oldPrice: 650000, stock: 2 },
        { storage: "2TB", price: 695000, oldPrice: 740000, stock: 1 },
      ],
      [
        { name: "Cosmic Orange Titanium", hex: "#d97706" },
        { name: "Deep Space Titanium", hex: "#1e1e24" },
        { name: "Natural Silver Titanium", hex: "#94a3b8" },
        { name: "Sky Blue Titanium", hex: "#38bdf8" },
      ]
    ),
  },

  {
    id: "iphone-17-pro",
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    series: "17",
    model: "iPhone 17 Pro",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 435000,
    oldPrice: 465000,
    discount: "6% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    colors: [
      { name: "Deep Space Titanium", hex: "#1e1e24" },
      { name: "Natural Silver Titanium", hex: "#94a3b8" },
      { name: "Cosmic Orange Titanium", hex: "#d97706" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Compact titanium powerhouse with A19 Pro silicon, 6.3-inch Tandem OLED display, upgraded Camera Control with haptic depth zoom, and USB 4.0 data transfer.",
    specifications: {
      chip: "A19 Pro chip with hardware ray tracing and Apple Intelligence",
      display: "6.3-inch Super Retina XDR OLED with 120Hz ProMotion",
      camera: "Triple 48MP Pro Fusion system with 5x optical telephoto",
      battery: "Up to 30 hours video playback",
      build: "Titanium chassis with Ceramic Shield Next",
      warranty: "1 Year Official Apple Warranty",
      delivery: "Islandwide Delivery 24-48 Hours",
    },
    stock: "In Stock",
    featured: true,
    rating: 5.0,
    reviewsCount: 9,
    variants: generateDefaultVariants(
      "iphone-17-pro",
      "17P",
      [
        { storage: "128GB", price: 435000, oldPrice: 465000, stock: 4 },
        { storage: "256GB", price: 475000, oldPrice: 510000, stock: 3 },
        { storage: "512GB", price: 535000, oldPrice: 570000, stock: 2 },
        { storage: "1TB", price: 595000, oldPrice: 630000, stock: 1 },
      ],
      [
        { name: "Deep Space Titanium", hex: "#1e1e24" },
        { name: "Natural Silver Titanium", hex: "#94a3b8" },
        { name: "Cosmic Orange Titanium", hex: "#d97706" },
      ]
    ),
  },

  {
    id: "iphone-17",
    slug: "iphone-17",
    name: "iPhone 17",
    series: "17",
    model: "iPhone 17",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 335000,
    oldPrice: 360000,
    discount: "7% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB"],
    colors: [
      { name: "Midnight Black", hex: "#171717" },
      { name: "Ice Blue", hex: "#7dd3fc" },
      { name: "Mint Emerald", hex: "#6ee7b7" },
      { name: "Lavender Glow", hex: "#c084fc" },
      { name: "Pure White", hex: "#f8fafc" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "The sleek all-new standard iPhone 17 with 120Hz ProMotion on standard models for the first time, A19 Bionic, enhanced Action button, and 48MP Dual Fusion cameras.",
    specifications: {
      chip: "A19 Bionic with 16-core Neural Engine",
      display: "6.2-inch Super Retina XDR with 120Hz ProMotion",
      camera: "Advanced 48MP Dual Camera system with 2x optical quality crop",
      battery: "All-day battery life (up to 26 hours)",
      build: "Aerospace-grade aluminium with color-infused glass",
      warranty: "1 Year Official Apple Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.9,
    reviewsCount: 11,
    variants: generateDefaultVariants(
      "iphone-17",
      "17",
      [
        { storage: "128GB", price: 335000, oldPrice: 360000, stock: 5 },
        { storage: "256GB", price: 375000, oldPrice: 405000, stock: 4 },
        { storage: "512GB", price: 435000, oldPrice: 465000, stock: 2 },
      ],
      [
        { name: "Midnight Black", hex: "#171717" },
        { name: "Ice Blue", hex: "#7dd3fc" },
        { name: "Mint Emerald", hex: "#6ee7b7" },
        { name: "Lavender Glow", hex: "#c084fc" },
        { name: "Pure White", hex: "#f8fafc" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE 16 SERIES
  // ==========================================================================
  {
    id: "iphone-16-pro-max",
    slug: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    series: "16",
    model: "iPhone 16 Pro Max",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 300000,
    oldPrice: 469900,
    discount: "9% OFF",
    storage: "256GB",
    storageOptions: ["256GB", "512GB", "1TB"],
    colors: [
      { name: "Desert Titanium", hex: "#c5b39b" },
      { name: "Natural Titanium", hex: "#8c8780" },
      { name: "White Titanium", hex: "#e5e5e5" },
      { name: "Black Titanium", hex: "#2b2b2d" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "The flagship iPhone 16 Pro Max forged in Grade 5 Titanium with thinner borders, introducing the groundbreaking A18 Pro chip, 48MP Fusion camera system with 5x optical zoom, and the new Camera Control button.",
    specifications: {
      chip: "A18 Pro chip with 6-core GPU & Apple Intelligence",
      display: "6.9-inch Super Retina XDR OLED with ProMotion 120Hz & Always-On",
      camera: "Pro system: 48MP Fusion, 48MP Ultra Wide, 12MP 5x Telephoto, 4K 120fps Dolby Vision",
      battery: "Up to 33 hours video playback – Longest battery life ever in an iPhone",
      build: "Grade 5 Titanium frame with textured matte glass back & Ceramic Shield front",
      warranty: "1 Year Official Apple Warranty + Theekzu Mobile Service Support",
      delivery: "Same day dispatch in Colombo | 24-48 Hours Islandwide Delivery",
    },
    stock: "In Stock",
    featured: true,
    isWeekendDeal: true,
    rating: 5.0,
    reviewsCount: 48,
    variants: generateDefaultVariants(
      "iphone-16-pro-max",
      "16PM",
      [
        { storage: "256GB", price: 300000, oldPrice: 340000, stock: 5 },
        { storage: "512GB", price: 479900, oldPrice: 519900, stock: 3 },
        { storage: "1TB", price: 539900, oldPrice: 579900, stock: 2 },
      ],
      [
        { name: "Desert Titanium", hex: "#c5b39b" },
        { name: "Natural Titanium", hex: "#8c8780" },
        { name: "White Titanium", hex: "#e5e5e5" },
        { name: "Black Titanium", hex: "#2b2b2d" },
      ]
    ),
  },

  {
    id: "iphone-16-pro",
    slug: "iphone-16-pro",
    name: "iPhone 16 Pro",
    series: "16",
    model: "iPhone 16 Pro",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 260000,
    oldPrice: 399900,
    discount: "8% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    colors: [
      { name: "Desert Titanium", hex: "#c5b39b" },
      { name: "Natural Titanium", hex: "#8c8780" },
      { name: "White Titanium", hex: "#e5e5e5" },
      { name: "Black Titanium", hex: "#2b2b2d" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "iPhone 16 Pro in Grade 5 Titanium with 6.3-inch Super Retina XDR display, A18 Pro chip, 5x Telephoto camera, and dedicated Camera Control touch sensor.",
    specifications: {
      chip: "A18 Pro chip with 16-core Neural Engine",
      display: "6.3-inch Super Retina XDR OLED, 120Hz ProMotion",
      camera: "48MP Fusion, 48MP Ultra Wide, 12MP 5x Telephoto",
      battery: "Up to 27 hours video playback",
      build: "Grade 5 Titanium with Ceramic Shield front",
      warranty: "1 Year Official Apple Warranty",
      delivery: "Islandwide Delivery 24-48 Hours",
    },
    stock: "In Stock",
    featured: true,
    rating: 4.9,
    reviewsCount: 36,
    variants: generateDefaultVariants(
      "iphone-16-pro",
      "16P",
      [
        { storage: "128GB", price: 260000, oldPrice: 295000, stock: 4 },
        { storage: "256GB", price: 270000, oldPrice: 305000, stock: 3 },
        { storage: "512GB", price: 459900, oldPrice: 489900, stock: 2 },
        { storage: "1TB", price: 519900, oldPrice: 559900, stock: 1 },
      ],
      [
        { name: "Desert Titanium", hex: "#c5b39b" },
        { name: "Natural Titanium", hex: "#8c8780" },
        { name: "White Titanium", hex: "#e5e5e5" },
        { name: "Black Titanium", hex: "#2b2b2d" },
      ]
    ),
  },

  {
    id: "iphone-16",
    slug: "iphone-16",
    name: "iPhone 16",
    series: "16",
    model: "iPhone 16",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 190000,
    oldPrice: 315000,
    discount: "8% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB"],
    colors: [
      { name: "Ultramarine", hex: "#3b82f6" },
      { name: "Teal", hex: "#14b8a6" },
      { name: "Pink", hex: "#f472b6" },
      { name: "White", hex: "#f8fafc" },
      { name: "Black", hex: "#1c1917" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "iPhone 16 introduces Camera Control, 48MP Fusion 2-in-1 camera with spatial photo capture, the Action button, and super-fast A18 processor built for Apple Intelligence.",
    specifications: {
      chip: "A18 chip with 5-core GPU",
      display: "6.1-inch Super Retina XDR OLED, Dynamic Island",
      camera: "48MP Fusion and 12MP Ultra Wide with Macro",
      battery: "Up to 22 hours video playback",
      build: "Aerospace-grade aluminium with color-infused glass",
      warranty: "1 Year Official Apple Warranty",
      delivery: "Islandwide Delivery 24-48 Hours",
    },
    stock: "In Stock",
    featured: true,
    rating: 4.8,
    reviewsCount: 29,
    variants: generateDefaultVariants(
      "iphone-16",
      "16",
      [
        { storage: "128GB", price: 190000, oldPrice: 215000, stock: 5 },
        { storage: "256GB", price: 329900, oldPrice: 355000, stock: 3 },
        { storage: "512GB", price: 389900, oldPrice: 415000, stock: 2 },
      ],
      [
        { name: "Ultramarine", hex: "#3b82f6" },
        { name: "Teal", hex: "#14b8a6" },
        { name: "Pink", hex: "#f472b6" },
        { name: "White", hex: "#f8fafc" },
        { name: "Black", hex: "#1c1917" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE 15 SERIES
  // ==========================================================================
  {
    id: "iphone-15-pro-max",
    slug: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    series: "15",
    model: "iPhone 15 Pro Max",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 250000,
    oldPrice: 385000,
    discount: "9% OFF",
    storage: "256GB",
    storageOptions: ["256GB", "512GB", "1TB"],
    colors: [
      { name: "Natural Titanium", hex: "#8c8780" },
      { name: "Blue Titanium", hex: "#3b4859" },
      { name: "White Titanium", hex: "#e5e5e5" },
      { name: "Black Titanium", hex: "#2b2b2d" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Forged in Grade 5 Titanium with breakthrough A17 Pro 3nm chip, customizable Action button, 5x optical Telephoto camera, and USB-C with 10Gbps transfer speeds.",
    specifications: {
      chip: "A17 Pro chip with 6-core GPU and hardware ray tracing",
      display: "6.7-inch Super Retina XDR OLED, 120Hz ProMotion & Dynamic Island",
      camera: "48MP Main, 12MP Ultra Wide, 12MP 5x Telephoto with tetraprism design",
      battery: "Up to 29 hours video playback",
      build: "Titanium with textured matte glass back",
      warranty: "1 Year Official Apple Warranty",
      delivery: "Islandwide Delivery 24-48 Hours",
    },
    stock: "In Stock",
    featured: true,
    isWeekendDeal: true,
    rating: 4.9,
    reviewsCount: 64,
    variants: generateDefaultVariants(
      "iphone-15-pro-max",
      "15PM",
      [
        { storage: "256GB", price: 250000, oldPrice: 280000, stock: 4 },
        { storage: "512GB", price: 265000, oldPrice: 295000, stock: 2 },
        { storage: "1TB", price: 275000, oldPrice: 310000, stock: 1 },
      ],
      [
        { name: "Natural Titanium", hex: "#8c8780" },
        { name: "Blue Titanium", hex: "#3b4859" },
        { name: "White Titanium", hex: "#e5e5e5" },
        { name: "Black Titanium", hex: "#2b2b2d" },
      ]
    ),
  },

  {
    id: "iphone-15-pro",
    slug: "iphone-15-pro",
    name: "iPhone 15 Pro",
    series: "15",
    model: "iPhone 15 Pro",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 210000,
    oldPrice: 295000,
    discount: "5% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    colors: [
      { name: "Natural Titanium", hex: "#8c8780" },
      { name: "Black Titanium", hex: "#2b2b2d" },
      { name: "White Titanium", hex: "#e5e5e5" },
      { name: "Blue Titanium", hex: "#3b4859" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "iPhone 15 Pro with Grade 5 Titanium chassis, lightweight contoured edges, A17 Pro chip, Action Button, 48MP main camera with multiple focal lengths, and USB-C port.",
    specifications: {
      chip: "A17 Pro chip with 6-core GPU",
      display: "6.1-inch Super Retina XDR OLED with ProMotion 120Hz",
      camera: "48MP Main, 12MP Ultra Wide, 12MP 3x Telephoto",
      battery: "Up to 23 hours video playback",
      build: "Titanium with Ceramic Shield front",
      warranty: "1 Year Official Apple Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: true,
    rating: 4.9,
    reviewsCount: 52,
    variants: generateDefaultVariants(
      "iphone-15-pro",
      "15P",
      [
        { storage: "128GB", price: 210000, oldPrice: 235000, stock: 3 },
        { storage: "256GB", price: 225000, oldPrice: 250000, stock: 2 },
        { storage: "512GB", price: 350000, oldPrice: 375000, stock: 1 },
        { storage: "1TB", price: 395000, oldPrice: 420000, stock: 1 },
      ],
      [
        { name: "Natural Titanium", hex: "#8c8780" },
        { name: "Black Titanium", hex: "#2b2b2d" },
        { name: "White Titanium", hex: "#e5e5e5" },
        { name: "Blue Titanium", hex: "#3b4859" },
      ]
    ),
  },

  {
    id: "iphone-15",
    slug: "iphone-15",
    name: "iPhone 15",
    series: "15",
    model: "iPhone 15",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 160000,
    oldPrice: 245000,
    discount: "8% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB"],
    colors: [
      { name: "Black", hex: "#1e1e24" },
      { name: "Blue", hex: "#93c5fd" },
      { name: "Green", hex: "#a7f3d0" },
      { name: "Yellow", hex: "#fef08a" },
      { name: "Pink", hex: "#fbcfe8" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "iPhone 15 features Dynamic Island, 48MP Main camera with 2x Telephoto, color-infused back glass with contoured edges, A16 Bionic chip, and universal USB-C charging.",
    specifications: {
      chip: "A16 Bionic chip with 5-core GPU",
      display: "6.1-inch Super Retina XDR OLED, Dynamic Island",
      camera: "48MP Main with 2x Telephoto crop and 12MP Ultra Wide",
      battery: "Up to 20 hours video playback",
      build: "Aluminium with color-infused glass",
      warranty: "1 Year Official Apple Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: true,
    rating: 4.8,
    reviewsCount: 43,
    variants: generateDefaultVariants(
      "iphone-15",
      "15",
      [
        { storage: "128GB", price: 160000, oldPrice: 180000, stock: 5 },
        { storage: "256GB", price: 175000, oldPrice: 195000, stock: 3 },
        { storage: "512GB", price: 305000, oldPrice: 329000, stock: 2 },
      ],
      [
        { name: "Black", hex: "#1e1e24" },
        { name: "Blue", hex: "#93c5fd" },
        { name: "Green", hex: "#a7f3d0" },
        { name: "Yellow", hex: "#fef08a" },
        { name: "Pink", hex: "#fbcfe8" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE 14 SERIES
  // ==========================================================================
  {
    id: "iphone-14-pro-max",
    slug: "iphone-14-pro-max",
    name: "iPhone 14 Pro Max",
    series: "14",
    model: "iPhone 14 Pro Max",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 200000,
    oldPrice: 279900,
    discount: "11% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    colors: [
      { name: "Deep Purple", hex: "#4b384c" },
      { name: "Space Black", hex: "#1f2022" },
      { name: "Gold", hex: "#f4e8ce" },
      { name: "Silver", hex: "#e2e4e1" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "The phone that introduced the Dynamic Island and 48MP Main Camera. Stainless steel surgical grade body, Always-On display, Crash Detection, and stellar all-day battery life.",
    specifications: {
      chip: "A16 Bionic chip with 6-core CPU",
      display: "6.7-inch Super Retina XDR OLED with ProMotion 120Hz",
      camera: "Pro camera system: 48MP Main, 12MP Ultra Wide, 12MP 3x Telephoto",
      battery: "Verified battery health 92% - 98%",
      build: "Surgical-grade stainless steel with Ceramic Shield",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery 24-48 Hours",
    },
    stock: "In Stock",
    featured: true,
    isWeekendDeal: true,
    rating: 4.9,
    reviewsCount: 78,
    variants: generateDefaultVariants(
      "iphone-14-pro-max",
      "14PM",
      [
        { storage: "128GB", price: 200000, oldPrice: 225000, stock: 3 },
        { storage: "256GB", price: 210000, oldPrice: 235000, stock: 2 },
        { storage: "512GB", price: 225000, oldPrice: 255000, stock: 1 },
        { storage: "1TB", price: 359900, oldPrice: 389900, stock: 1 },
      ],
      [
        { name: "Deep Purple", hex: "#4b384c" },
        { name: "Space Black", hex: "#1f2022" },
        { name: "Gold", hex: "#f4e8ce" },
        { name: "Silver", hex: "#e2e4e1" },
      ]
    ),
  },

  {
    id: "iphone-14-pro",
    slug: "iphone-14-pro",
    name: "iPhone 14 Pro",
    series: "14",
    model: "iPhone 14 Pro",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 175000,
    oldPrice: 245000,
    discount: "10% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    colors: [
      { name: "Deep Purple", hex: "#4b384c" },
      { name: "Space Black", hex: "#1f2022" },
      { name: "Silver", hex: "#e2e4e1" },
      { name: "Gold", hex: "#f4e8ce" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Compact flagship with surgical-grade stainless steel frame, Dynamic Island, A16 Bionic chip, and 48MP Pro triple camera with Action mode video.",
    specifications: {
      chip: "A16 Bionic chip",
      display: "6.1-inch Super Retina XDR OLED, 120Hz ProMotion",
      camera: "48MP Main, 12MP Ultra Wide, 12MP 3x Telephoto",
      battery: "Verified battery health 90%+",
      build: "Stainless steel with Ceramic Shield",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.8,
    reviewsCount: 42,
    variants: generateDefaultVariants(
      "iphone-14-pro",
      "14P",
      [
        { storage: "128GB", price: 175000, oldPrice: 195000, stock: 3 },
        { storage: "256GB", price: 185000, oldPrice: 205000, stock: 2 },
        { storage: "512GB", price: 200000, oldPrice: 225000, stock: 1 },
        { storage: "1TB", price: 210000, oldPrice: 235000, stock: 1 },
      ],
      [
        { name: "Deep Purple", hex: "#4b384c" },
        { name: "Space Black", hex: "#1f2022" },
        { name: "Silver", hex: "#e2e4e1" },
        { name: "Gold", hex: "#f4e8ce" },
      ]
    ),
  },

  {
    id: "iphone-14",
    slug: "iphone-14",
    name: "iPhone 14",
    series: "14",
    model: "iPhone 14",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 125000,
    oldPrice: 189900,
    discount: "11% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB"],
    colors: [
      { name: "Midnight", hex: "#191f28" },
      { name: "Starlight", hex: "#f5f3ee" },
      { name: "Blue", hex: "#a0b5c9" },
      { name: "Purple", hex: "#e5dcf1" },
      { name: "Yellow", hex: "#fde047" },
      { name: "Red", hex: "#dc2626" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Reliable performer with dual camera system with Photonic Engine, Crash Detection, A15 Bionic 5-core GPU, and durable water-resistant aluminium housing.",
    specifications: {
      chip: "A15 Bionic with 5-core GPU",
      display: "6.1-inch Super Retina XDR OLED",
      camera: "Dual 12MP Main and Ultra Wide",
      battery: "Verified battery health 90%+",
      build: "Aluminium with Ceramic Shield front",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.8,
    reviewsCount: 38,
    variants: generateDefaultVariants(
      "iphone-14",
      "14",
      [
        { storage: "128GB", price: 125000, oldPrice: 145000, stock: 4 },
        { storage: "256GB", price: 135000, oldPrice: 155000, stock: 2 },
        { storage: "512GB", price: 229000, oldPrice: 249000, stock: 1 },
      ],
      [
        { name: "Midnight", hex: "#191f28" },
        { name: "Starlight", hex: "#f5f3ee" },
        { name: "Blue", hex: "#a0b5c9" },
        { name: "Purple", hex: "#e5dcf1" },
        { name: "Yellow", hex: "#fde047" },
        { name: "Red", hex: "#dc2626" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE 13 SERIES
  // ==========================================================================
  {
    id: "iphone-13-pro-max",
    slug: "iphone-13-pro-max",
    name: "iPhone 13 Pro Max",
    series: "13",
    model: "iPhone 13 Pro Max",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 155000,
    oldPrice: 225000,
    discount: "11% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    colors: [
      { name: "Sierra Blue", hex: "#9bb5ce" },
      { name: "Alpine Green", hex: "#506053" },
      { name: "Graphite", hex: "#4b4845" },
      { name: "Silver", hex: "#e2e4e1" },
      { name: "Gold", hex: "#fae7cf" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Legendary battery champion of the iPhone lineup. ProMotion 120Hz display, cinematic 4K video recording, macro photography mode, and surgical-grade stainless steel frame.",
    specifications: {
      chip: "A15 Bionic chip with 5-core GPU",
      display: "6.7-inch Super Retina XDR with ProMotion 120Hz",
      camera: "Pro 12MP triple camera with 3x optical zoom and Macro",
      battery: "Verified battery health 88% - 95%",
      build: "Stainless steel chassis with Ceramic Shield",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery 24-48 Hours",
    },
    stock: "In Stock",
    featured: true,
    isWeekendDeal: true,
    rating: 4.9,
    reviewsCount: 95,
    variants: generateDefaultVariants(
      "iphone-13-pro-max",
      "13PM",
      [
        { storage: "128GB", price: 155000, oldPrice: 175000, stock: 4 },
        { storage: "256GB", price: 160000, oldPrice: 180000, stock: 3 },
        { storage: "512GB", price: 175000, oldPrice: 195000, stock: 1 },
        { storage: "1TB", price: 185000, oldPrice: 210000, stock: 1 },
      ],
      [
        { name: "Sierra Blue", hex: "#9bb5ce" },
        { name: "Alpine Green", hex: "#506053" },
        { name: "Graphite", hex: "#4b4845" },
        { name: "Silver", hex: "#e2e4e1" },
        { name: "Gold", hex: "#fae7cf" },
      ]
    ),
  },

  {
    id: "iphone-13-pro",
    slug: "iphone-13-pro",
    name: "iPhone 13 Pro",
    series: "13",
    model: "iPhone 13 Pro",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 130000,
    oldPrice: 199900,
    discount: "10% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    colors: [
      { name: "Sierra Blue", hex: "#9bb5ce" },
      { name: "Graphite", hex: "#4b4845" },
      { name: "Silver", hex: "#e2e4e1" },
      { name: "Gold", hex: "#fae7cf" },
      { name: "Alpine Green", hex: "#506053" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "ProMotion 120Hz in a comfortable 6.1-inch form factor. A15 Bionic, Macro photo mode, and durable matte stainless steel body.",
    specifications: {
      chip: "A15 Bionic chip with 5-core GPU",
      display: "6.1-inch Super Retina XDR OLED, 120Hz ProMotion",
      camera: "12MP Main, 12MP Ultra Wide, 12MP 3x Telephoto",
      battery: "Verified battery health 88%+",
      build: "Stainless steel with Ceramic Shield",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.8,
    reviewsCount: 51,
    variants: generateDefaultVariants(
      "iphone-13-pro",
      "13P",
      [
        { storage: "128GB", price: 130000, oldPrice: 150000, stock: 3 },
        { storage: "256GB", price: 140000, oldPrice: 160000, stock: 2 },
        { storage: "512GB", price: 150000, oldPrice: 170000, stock: 1 },
        { storage: "1TB", price: 259000, oldPrice: 279000, stock: 1 },
      ],
      [
        { name: "Sierra Blue", hex: "#9bb5ce" },
        { name: "Graphite", hex: "#4b4845" },
        { name: "Silver", hex: "#e2e4e1" },
        { name: "Gold", hex: "#fae7cf" },
        { name: "Alpine Green", hex: "#506053" },
      ]
    ),
  },

  {
    id: "iphone-13",
    slug: "iphone-13",
    name: "iPhone 13",
    series: "13",
    model: "iPhone 13",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 100000,
    oldPrice: 159900,
    discount: "13% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB"],
    colors: [
      { name: "Midnight", hex: "#191f28" },
      { name: "Starlight", hex: "#f5f3ee" },
      { name: "Blue", hex: "#275d86" },
      { name: "Pink", hex: "#fbcfe8" },
      { name: "Green", hex: "#3b533d" },
      { name: "Red", hex: "#dc2626" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "The most popular value-for-money iPhone in Sri Lanka. Diagonal dual camera with sensor-shift OIS, bright Super Retina display, and snappy A15 performance.",
    specifications: {
      chip: "A15 Bionic chip with 4-core GPU",
      display: "6.1-inch Super Retina XDR OLED",
      camera: "Dual 12MP with Sensor-shift optical stabilization",
      battery: "Verified battery health 88% - 94%",
      build: "Aluminium frame with glass back",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: true,
    rating: 4.8,
    reviewsCount: 88,
    variants: generateDefaultVariants(
      "iphone-13",
      "13",
      [
        { storage: "128GB", price: 100000, oldPrice: 120000, stock: 6 },
        { storage: "256GB", price: 110000, oldPrice: 130000, stock: 3 },
        { storage: "512GB", price: 189900, oldPrice: 209900, stock: 1 },
      ],
      [
        { name: "Midnight", hex: "#191f28" },
        { name: "Starlight", hex: "#f5f3ee" },
        { name: "Blue", hex: "#275d86" },
        { name: "Pink", hex: "#fbcfe8" },
        { name: "Green", hex: "#3b533d" },
        { name: "Red", hex: "#dc2626" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE 12 SERIES
  // ==========================================================================
  {
    id: "iphone-12-pro-max",
    slug: "iphone-12-pro-max",
    name: "iPhone 12 Pro Max",
    series: "12",
    model: "iPhone 12 Pro Max",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 123000,
    oldPrice: 189900,
    discount: "11% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB"],
    colors: [
      { name: "Pacific Blue", hex: "#2b4554" },
      { name: "Graphite", hex: "#403e3d" },
      { name: "Silver", hex: "#e2e4e1" },
      { name: "Gold", hex: "#fae7cf" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "The pioneer of modern flat-edge design with 5G speed, 6.7-inch OLED screen, LiDAR scanner for night portraits, and 2.5x optical zoom.",
    specifications: {
      chip: "A14 Bionic chip with Neural Engine",
      display: "6.7-inch Super Retina XDR OLED",
      camera: "Triple 12MP with LiDAR scanner and Night Mode portraits",
      battery: "Verified battery health 85%+",
      build: "Surgical stainless steel with Ceramic Shield",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.7,
    reviewsCount: 65,
    variants: generateDefaultVariants(
      "iphone-12-pro-max",
      "12PM",
      [
        { storage: "128GB", price: 123000, oldPrice: 140000, stock: 3 },
        { storage: "256GB", price: 130000, oldPrice: 148000, stock: 2 },
        { storage: "512GB", price: 140000, oldPrice: 160000, stock: 1 },
      ],
      [
        { name: "Pacific Blue", hex: "#2b4554" },
        { name: "Graphite", hex: "#403e3d" },
        { name: "Silver", hex: "#e2e4e1" },
        { name: "Gold", hex: "#fae7cf" },
      ]
    ),
  },

  {
    id: "iphone-12-pro",
    slug: "iphone-12-pro",
    name: "iPhone 12 Pro",
    series: "12",
    model: "iPhone 12 Pro",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 99000,
    oldPrice: 169900,
    discount: "12% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB", "512GB"],
    colors: [
      { name: "Pacific Blue", hex: "#2b4554" },
      { name: "Graphite", hex: "#403e3d" },
      { name: "Silver", hex: "#e2e4e1" },
      { name: "Gold", hex: "#fae7cf" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "6.1-inch stainless steel pro phone with LiDAR scanner, Apple ProRAW photo capability, and A14 Bionic performance.",
    specifications: {
      chip: "A14 Bionic chip",
      display: "6.1-inch Super Retina XDR OLED",
      camera: "12MP Main, 12MP Ultra Wide, 12MP Telephoto with LiDAR",
      battery: "Verified battery health 85%+",
      build: "Stainless steel frame",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.7,
    reviewsCount: 44,
    variants: generateDefaultVariants(
      "iphone-12-pro",
      "12P",
      [
        { storage: "128GB", price: 99000, oldPrice: 115000, stock: 3 },
        { storage: "256GB", price: 105000, oldPrice: 122000, stock: 2 },
        { storage: "512GB", price: 118000, oldPrice: 135000, stock: 1 },
      ],
      [
        { name: "Pacific Blue", hex: "#2b4554" },
        { name: "Graphite", hex: "#403e3d" },
        { name: "Silver", hex: "#e2e4e1" },
        { name: "Gold", hex: "#fae7cf" },
      ]
    ),
  },

  {
    id: "iphone-12",
    slug: "iphone-12",
    name: "iPhone 12",
    series: "12",
    model: "iPhone 12",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 85000,
    oldPrice: 125000,
    discount: "12% OFF",
    storage: "64GB",
    storageOptions: ["64GB", "128GB", "256GB"],
    colors: [
      { name: "Black", hex: "#1f2022" },
      { name: "White", hex: "#f9fafb" },
      { name: "Blue", hex: "#1d4ed8" },
      { name: "Green", hex: "#bbf7d0" },
      { name: "Purple", hex: "#d8b4fe" },
      { name: "Red", hex: "#dc2626" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Crisp Super Retina XDR OLED display, 5G connectivity, MagSafe ecosystem support, and dependable A14 Bionic processor at an accessible entry price.",
    specifications: {
      chip: "A14 Bionic chip",
      display: "6.1-inch Super Retina XDR OLED",
      camera: "Dual 12MP Ultra Wide and Wide cameras with Night mode",
      battery: "Verified battery health 85%+",
      build: "Aerospace aluminium with Ceramic Shield",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.7,
    reviewsCount: 73,
    variants: generateDefaultVariants(
      "iphone-12",
      "12",
      [
        { storage: "64GB", price: 109900, oldPrice: 125000, stock: 4 },
        { storage: "128GB", price: 85000, oldPrice: 100000, stock: 3 },
        { storage: "256GB", price: 95000, oldPrice: 110000, stock: 1 },
      ],
      [
        { name: "Black", hex: "#1f2022" },
        { name: "White", hex: "#f9fafb" },
        { name: "Blue", hex: "#1d4ed8" },
        { name: "Green", hex: "#bbf7d0" },
        { name: "Purple", hex: "#d8b4fe" },
        { name: "Red", hex: "#dc2626" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE 11 SERIES
  // ==========================================================================
  {
    id: "iphone-11-pro-max",
    slug: "iphone-11-pro-max",
    name: "iPhone 11 Pro Max",
    series: "11",
    model: "iPhone 11 Pro Max",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 93000,
    oldPrice: 155000,
    discount: "10% OFF",
    storage: "64GB",
    storageOptions: ["64GB", "256GB", "512GB"],
    colors: [
      { name: "Midnight Green", hex: "#4e5851" },
      { name: "Space Gray", hex: "#535150" },
      { name: "Silver", hex: "#ebebe3" },
      { name: "Gold", hex: "#fad7bd" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "The classic flagship with 6.5-inch Super Retina XDR OLED, iconic triple camera with Midnight Green matte glass finish, and proven A13 Bionic power.",
    specifications: {
      chip: "A13 Bionic chip with third-generation Neural Engine",
      display: "6.5-inch Super Retina XDR OLED display",
      camera: "Triple 12MP Ultra Wide, Wide, and Telephoto cameras with Night mode",
      battery: "Verified battery health 85%+",
      build: "Textured matte glass and stainless steel design",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.7,
    reviewsCount: 56,
    variants: generateDefaultVariants(
      "iphone-11-pro-max",
      "11PM",
      [
        { storage: "64GB", price: 93000, oldPrice: 110000, stock: 3 },
        { storage: "256GB", price: 103000, oldPrice: 120000, stock: 2 },
        { storage: "512GB", price: 179900, oldPrice: 195000, stock: 1 },
      ],
      [
        { name: "Midnight Green", hex: "#4e5851" },
        { name: "Space Gray", hex: "#535150" },
        { name: "Silver", hex: "#ebebe3" },
        { name: "Gold", hex: "#fad7bd" },
      ]
    ),
  },

  {
    id: "iphone-11-pro",
    slug: "iphone-11-pro",
    name: "iPhone 11 Pro",
    series: "11",
    model: "iPhone 11 Pro",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 78000,
    oldPrice: 135000,
    discount: "11% OFF",
    storage: "64GB",
    storageOptions: ["64GB", "256GB", "512GB"],
    colors: [
      { name: "Midnight Green", hex: "#4e5851" },
      { name: "Space Gray", hex: "#535150" },
      { name: "Silver", hex: "#ebebe3" },
      { name: "Gold", hex: "#fad7bd" },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Compact 5.8-inch OLED pro smartphone featuring triple 12MP cameras with 4K video at 60fps, stainless steel chassis, and fast charging support.",
    specifications: {
      chip: "A13 Bionic chip",
      display: "5.8-inch Super Retina XDR OLED",
      camera: "Triple 12MP cameras with Ultra Wide and 2x Telephoto",
      battery: "Verified battery health 85%+",
      build: "Stainless steel and matte glass",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.6,
    reviewsCount: 39,
    variants: generateDefaultVariants(
      "iphone-11-pro",
      "11P",
      [
        { storage: "64GB", price: 78000, oldPrice: 92000, stock: 3 },
        { storage: "256GB", price: 88000, oldPrice: 105000, stock: 2 },
        { storage: "512GB", price: 98000, oldPrice: 118000, stock: 1 },
      ],
      [
        { name: "Midnight Green", hex: "#4e5851" },
        { name: "Space Gray", hex: "#535150" },
        { name: "Silver", hex: "#ebebe3" },
        { name: "Gold", hex: "#fad7bd" },
      ]
    ),
  },

  {
    id: "iphone-11",
    slug: "iphone-11",
    name: "iPhone 11",
    series: "11",
    model: "iPhone 11",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Grade A+",
    price: 65000,
    oldPrice: 99900,
    discount: "15% OFF",
    storage: "64GB",
    storageOptions: ["64GB", "128GB", "256GB"],
    colors: [
      { name: "Black", hex: "#1f2022" },
      { name: "White", hex: "#f9fafb" },
      { name: "Green", hex: "#bbf7d0" },
      { name: "Yellow", hex: "#fef08a" },
      { name: "Purple", hex: "#d8b4fe" },
      { name: "Red", hex: "#dc2626" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "The ultimate budget entry into the Apple ecosystem. Liquid Retina 6.1-inch display, dual 12MP Ultra Wide and Wide cameras with Night mode, and dependable battery life.",
    specifications: {
      chip: "A13 Bionic chip",
      display: "6.1-inch Liquid Retina HD display",
      camera: "Dual 12MP Ultra Wide and Wide cameras",
      battery: "Verified battery health 85%+",
      build: "Glass and aerospace aluminium",
      warranty: "6 Months Theekzu Mobile Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.7,
    reviewsCount: 112,
    variants: generateDefaultVariants(
      "iphone-11",
      "11",
      [
        { storage: "64GB", price: 65000, oldPrice: 78000, stock: 5 },
        { storage: "128GB", price: 75000, oldPrice: 89000, stock: 4 },
        { storage: "256GB", price: 83000, oldPrice: 98000, stock: 2 },
      ],
      [
        { name: "Black", hex: "#1f2022" },
        { name: "White", hex: "#f9fafb" },
        { name: "Green", hex: "#bbf7d0" },
        { name: "Yellow", hex: "#fef08a" },
        { name: "Purple", hex: "#d8b4fe" },
        { name: "Red", hex: "#dc2626" },
      ]
    ),
  },

  
  // ==========================================================================
  // iPHONE 15 PLUS
  // ==========================================================================
  {
    id: "iphone-15-plus",
    slug: "iphone-15-plus",
    name: "iPhone 15 Plus",
    series: "15",
    model: "iPhone 15 Plus",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Grade A+ Pre-Owned",
    price: 188000,
    oldPrice: 205000,
    discount: "8% OFF",
    storage: "128GB",
    storageOptions: ["128GB"],
    colors: [
      { name: "Black", hex: "#343538" },
      { name: "Blue", hex: "#d2dde4" },
      { name: "Green", hex: "#d4e1d7" },
      { name: "Yellow", hex: "#f6eac7" },
      { name: "Pink", hex: "#e9d3d5" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Apple iPhone 15 Plus featuring Dynamic Island, 48MP Main camera with 2x Telephoto, color-infused durable back glass, USB-C connector, and massive 6.7-inch OLED display.",
    specifications: {
      chip: "A16 Bionic chip with 5-core GPU and 16-core Neural Engine",
      display: "6.7-inch Super Retina XDR OLED display (2000 nits peak outdoor)",
      camera: "48MP Main camera with 24MP super-high-resolution default and 2x Telephoto",
      battery: "Up to 26 hours video playback with USB-C convenience",
      build: "Color-infused back glass with contoured aluminum edges, IP68 water resistance",
      warranty: "6 Months Theekzu Mobile Care Warranty",
      delivery: "Express Islandwide Delivery across Sri Lanka",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.9,
    reviewsCount: 16,
    variants: generateDefaultVariants(
      "iphone-15-plus",
      "15P",
      [
        { storage: "128GB", price: 188000, oldPrice: 205000, stock: 3 },
      ],
      [
        { name: "Black", hex: "#343538" },
        { name: "Blue", hex: "#d2dde4" },
        { name: "Green", hex: "#d4e1d7" },
        { name: "Yellow", hex: "#f6eac7" },
        { name: "Pink", hex: "#e9d3d5" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE 14 PLUS
  // ==========================================================================
  {
    id: "iphone-14-plus",
    slug: "iphone-14-plus",
    name: "iPhone 14 Plus",
    series: "14",
    model: "iPhone 14 Plus",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Grade A+ Pre-Owned",
    price: 135000,
    oldPrice: 150000,
    discount: "10% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB"],
    colors: [
      { name: "Midnight", hex: "#1a232e" },
      { name: "Starlight", hex: "#fbf7f4" },
      { name: "Blue", hex: "#a0b3c6" },
      { name: "Purple", hex: "#e5ddea" },
      { name: "Yellow", hex: "#f8e79b" },
      { name: "(PRODUCT)RED", hex: "#e11c2a" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Apple iPhone 14 Plus with expansive 6.7-inch Super Retina XDR OLED, all-day battery life, Action mode video, Crash Detection, and enhanced low-light photography.",
    specifications: {
      chip: "A15 Bionic chip with 5-core GPU and 16-core Neural Engine",
      display: "6.7-inch Super Retina XDR OLED display (2778 x 1284)",
      camera: "Dual 12MP Main and Ultra Wide with Photonic Engine and Action mode",
      battery: "Up to 26 hours video playback (longest battery life in iPhone 14 series)",
      build: "Aerospace-grade aluminum with Ceramic Shield front and IP68 rating",
      warranty: "6 Months Theekzu Mobile Care Warranty",
      delivery: "Express Islandwide Delivery across Sri Lanka",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.8,
    reviewsCount: 19,
    variants: generateDefaultVariants(
      "iphone-14-plus",
      "14PL",
      [
        { storage: "128GB", price: 135000, oldPrice: 150000, stock: 3 },
        { storage: "256GB", price: 145000, oldPrice: 162000, stock: 3 },
      ],
      [
        { name: "Midnight", hex: "#1a232e" },
        { name: "Starlight", hex: "#fbf7f4" },
        { name: "Blue", hex: "#a0b3c6" },
        { name: "Purple", hex: "#e5ddea" },
        { name: "Yellow", hex: "#f8e79b" },
        { name: "(PRODUCT)RED", hex: "#e11c2a" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE 13 MINI
  // ==========================================================================
  {
    id: "iphone-13-mini",
    slug: "iphone-13-mini",
    name: "iPhone 13 Mini",
    series: "13",
    model: "iPhone 13 Mini",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Grade A+ Pre-Owned",
    price: 85000,
    oldPrice: 98000,
    discount: "13% OFF",
    storage: "128GB",
    storageOptions: ["128GB"],
    colors: [
      { name: "Midnight", hex: "#1a232e" },
      { name: "Starlight", hex: "#fbf7f4" },
      { name: "Blue", hex: "#2c4b64" },
      { name: "Pink", hex: "#faddd7" },
      { name: "Green", hex: "#394c38" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Apple iPhone 13 Mini featuring lightning-fast A15 Bionic, Cinematic mode, diagonal dual 12MP camera system with sensor-shift OIS, and vibrant 5.4-inch OLED display.",
    specifications: {
      chip: "A15 Bionic chip with 6-core CPU and 4-core GPU",
      display: "5.4-inch Super Retina XDR OLED (800 nits peak brightness)",
      camera: "Dual 12MP system with Sensor-shift optical image stabilization and Cinematic mode",
      battery: "Up to 17 hours video playback (improved battery life)",
      build: "Ceramic Shield front, aluminum design with IP68 water resistance",
      warranty: "6 Months Theekzu Mobile Care Warranty",
      delivery: "Express Islandwide Delivery across Sri Lanka",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.8,
    reviewsCount: 24,
    variants: generateDefaultVariants(
      "iphone-13-mini",
      "13M",
      [
        { storage: "128GB", price: 85000, oldPrice: 98000, stock: 3 },
      ],
      [
        { name: "Midnight", hex: "#1a232e" },
        { name: "Starlight", hex: "#fbf7f4" },
        { name: "Blue", hex: "#2c4b64" },
        { name: "Pink", hex: "#faddd7" },
        { name: "Green", hex: "#394c38" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE 12 MINI
  // ==========================================================================
  {
    id: "iphone-12-mini",
    slug: "iphone-12-mini",
    name: "iPhone 12 Mini",
    series: "12",
    model: "iPhone 12 Mini",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Grade A+ Pre-Owned",
    price: 75000,
    oldPrice: 88000,
    discount: "14% OFF",
    storage: "128GB",
    storageOptions: ["128GB", "256GB"],
    colors: [
      { name: "Black", hex: "#1f2022" },
      { name: "White", hex: "#f9f6ef" },
      { name: "Blue", hex: "#276787" },
      { name: "Green", hex: "#daf0ce" },
      { name: "(PRODUCT)RED", hex: "#ba0c2f" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Compact 5.4-inch iPhone 12 Mini with 5G capability, Ceramic Shield front, Super Retina XDR OLED, A14 Bionic chip, and Night mode on all cameras.",
    specifications: {
      chip: "A14 Bionic chip with 16-core Neural Engine",
      display: "5.4-inch Super Retina XDR OLED display (2340 x 1080)",
      camera: "Dual 12MP Ultra Wide and Wide cameras with Night mode and Deep Fusion",
      battery: "Up to 15 hours video playback",
      build: "Ceramic Shield front, aerospace-grade aluminum with IP68 water resistance",
      warranty: "6 Months Theekzu Mobile Care Warranty",
      delivery: "Express Islandwide Delivery across Sri Lanka",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.7,
    reviewsCount: 21,
    variants: generateDefaultVariants(
      "iphone-12-mini",
      "12M",
      [
        { storage: "128GB", price: 75000, oldPrice: 88000, stock: 3 },
        { storage: "256GB", price: 85000, oldPrice: 99000, stock: 3 },
      ],
      [
        { name: "Black", hex: "#1f2022" },
        { name: "White", hex: "#f9f6ef" },
        { name: "Blue", hex: "#276787" },
        { name: "Green", hex: "#daf0ce" },
        { name: "(PRODUCT)RED", hex: "#ba0c2f" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE XS MAX
  // ==========================================================================
  {
    id: "iphone-xs-max",
    slug: "iphone-xs-max",
    name: "iPhone XS Max",
    series: "XS",
    model: "iPhone XS Max",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Grade A+ Pre-Owned",
    price: 65000,
    oldPrice: 78000,
    discount: "16% OFF",
    storage: "64GB",
    storageOptions: ["64GB", "256GB"],
    colors: [
      { name: "Space Gray", hex: "#4b4846" },
      { name: "Silver", hex: "#e2e4e1" },
      { name: "Gold", hex: "#f9e5c9" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Apple iPhone XS Max with massive 6.5-inch Super Retina OLED display, A12 Bionic chip, dual 12MP cameras with Depth Control, and premium stainless steel chassis.",
    specifications: {
      chip: "A12 Bionic chip with Next-Generation Neural Engine",
      display: "6.5-inch Super Retina OLED display (2688 x 1242, True Tone)",
      camera: "Dual 12MP Wide and Telephoto with Smart HDR and 4K recording up to 60 fps",
      battery: "Up to 15 hours video playback",
      build: "Surgical-grade stainless steel with durable glass back",
      warranty: "6 Months Theekzu Mobile Care Warranty",
      delivery: "Express Islandwide Delivery across Sri Lanka",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.8,
    reviewsCount: 30,
    variants: generateDefaultVariants(
      "iphone-xs-max",
      "XSM",
      [
        { storage: "64GB", price: 65000, oldPrice: 78000, stock: 3 },
        { storage: "256GB", price: 75000, oldPrice: 88000, stock: 3 },
      ],
      [
        { name: "Space Gray", hex: "#4b4846" },
        { name: "Silver", hex: "#e2e4e1" },
        { name: "Gold", hex: "#f9e5c9" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE XS
  // ==========================================================================
  {
    id: "iphone-xs",
    slug: "iphone-xs",
    name: "iPhone XS",
    series: "XS",
    model: "iPhone XS",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Grade A+ Pre-Owned",
    price: 65000,
    oldPrice: 75000,
    discount: "13% OFF",
    storage: "256GB",
    storageOptions: ["256GB"],
    colors: [
      { name: "Space Gray", hex: "#4b4846" },
      { name: "Silver", hex: "#e2e4e1" },
      { name: "Gold", hex: "#f9e5c9" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Apple iPhone XS with 5.8-inch Super Retina OLED display, A12 Bionic with Next-Generation Neural Engine, advanced Face ID, and dual-camera system with Smart HDR.",
    specifications: {
      chip: "A12 Bionic chip with Next-Generation Neural Engine",
      display: "5.8-inch Super Retina OLED display (2436 x 1125, True Tone)",
      camera: "Dual 12MP Wide and Telephoto cameras with Smart HDR and Depth Control",
      battery: "Up to 14 hours video playback",
      build: "Surgical-grade stainless steel frame with IP68 water resistance",
      warranty: "6 Months Theekzu Mobile Care Warranty",
      delivery: "Express Islandwide Delivery across Sri Lanka",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.7,
    reviewsCount: 26,
    variants: generateDefaultVariants(
      "iphone-xs",
      "XS",
      [
        { storage: "256GB", price: 65000, oldPrice: 75000, stock: 3 },
      ],
      [
        { name: "Space Gray", hex: "#4b4846" },
        { name: "Silver", hex: "#e2e4e1" },
        { name: "Gold", hex: "#f9e5c9" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE X
  // ==========================================================================
  {
    id: "iphone-x",
    slug: "iphone-x",
    name: "iPhone X",
    series: "X",
    model: "iPhone X",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Grade A+ Pre-Owned",
    price: 48000,
    oldPrice: 58000,
    discount: "17% OFF",
    storage: "256GB",
    storageOptions: ["256GB"],
    colors: [
      { name: "Space Gray", hex: "#4b4846" },
      { name: "Silver", hex: "#e2e4e1" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "The revolutionary iPhone X featuring 5.8-inch Super Retina OLED display, Face ID, A11 Bionic chip, and dual 12MP cameras with dual optical image stabilization.",
    specifications: {
      chip: "A11 Bionic chip with Neural Engine",
      display: "5.8-inch Super Retina HD OLED display with HDR and True Tone",
      camera: "Dual 12MP Wide and Telephoto cameras with Portrait mode and dual OIS",
      battery: "Up to 21 hours talk time",
      build: "Surgical-grade stainless steel with durable all-glass design",
      warranty: "6 Months Theekzu Mobile Care Warranty",
      delivery: "Express Islandwide Delivery across Sri Lanka",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.7,
    reviewsCount: 35,
    variants: generateDefaultVariants(
      "iphone-x",
      "X",
      [
        { storage: "256GB", price: 48000, oldPrice: 58000, stock: 3 },
      ],
      [
        { name: "Space Gray", hex: "#4b4846" },
        { name: "Silver", hex: "#e2e4e1" },
      ]
    ),
  },

  // ==========================================================================
  // iPHONE SE (2nd Gen)
  // ==========================================================================
  {
    id: "iphone-se2",
    slug: "iphone-se2",
    name: "iPhone SE (2nd Gen)",
    series: "SE",
    model: "iPhone SE (2nd Gen)",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Grade A+ Pre-Owned",
    price: 37000,
    oldPrice: 45000,
    discount: "18% OFF",
    storage: "64GB",
    storageOptions: ["64GB", "128GB", "256GB"],
    colors: [
      { name: "Black", hex: "#1f2022" },
      { name: "White", hex: "#f9f6ef" },
      { name: "(PRODUCT)RED", hex: "#ba0c2f" },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Apple iPhone SE (2nd Generation) featuring A13 Bionic chip, 4.7-inch Retina HD display, advanced single-camera system with Portrait mode, and Touch ID. Fully tested and certified.",
    specifications: {
      chip: "A13 Bionic chip with third-generation Neural Engine",
      display: "4.7-inch Retina HD display with True Tone",
      camera: "12MP Wide camera with Portrait mode, 4K video recording up to 60 fps",
      battery: "Up to 13 hours video playback",
      build: "Aerospace-grade aluminum and durable glass design with IP67 water resistance",
      warranty: "6 Months Theekzu Mobile Care Warranty",
      delivery: "Express Islandwide Delivery across Sri Lanka",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.8,
    reviewsCount: 42,
    variants: generateDefaultVariants(
      "iphone-se2",
      "SE2",
      [
        { storage: "64GB", price: 37000, oldPrice: 45000, stock: 3 },
        { storage: "128GB", price: 47000, oldPrice: 55000, stock: 3 },
        { storage: "256GB", price: 57000, oldPrice: 65000, stock: 3 },
      ],
      [
        { name: "Black", hex: "#1f2022" },
        { name: "White", hex: "#f9f6ef" },
        { name: "(PRODUCT)RED", hex: "#ba0c2f" },
      ]
    ),
  },

  // ==========================================================================
  // ACCESSORIES (Audio, Watch, Fast Charging, Cases)
  // ==========================================================================
  {
    id: "airpods-pro-2-usbc",
    slug: "airpods-pro-2-usbc",
    name: "Apple AirPods Pro (2nd Generation with USB-C)",
    series: "accessories",
    model: "AirPods Pro 2",
    category: "accessories",
    subcategory: "airpods",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 69900,
    oldPrice: 79900,
    discount: "13% OFF",
    storage: "Standard Case",
    storageOptions: ["MagSafe USB-C Case"],
    colors: [{ name: "Gloss White", hex: "#f8fafc" }],
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Features up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and Personalized Spatial Audio with dynamic head tracking.",
    specifications: {
      audio: "H2 Apple silicon chip, Adaptive Audio, Active Noise Cancellation",
      case: "MagSafe Charging Case (USB-C) with Speaker and Lanyard loop",
      battery: "Up to 6 hours listening with ANC on / 30 hours total with case",
      warranty: "1 Year Official Apple Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: true,
    rating: 5.0,
    reviewsCount: 41,
    variants: [
      {
        id: "airpods-pro-2-standard",
        storage: "MagSafe USB-C Case",
        color: "Gloss White",
        price: 69900,
        oldPrice: 79900,
        stock: 8,
        sku: "TM-APP2-USBC",
      },
    ],
  },

  {
    id: "apple-20w-usbc-power-adapter",
    slug: "apple-20w-usbc-power-adapter",
    name: "Original Apple 20W USB-C Power Adapter",
    series: "accessories",
    model: "20W Charger",
    category: "accessories",
    subcategory: "chargers-cables",
    condition: "Brand New",
    conditionBadge: "100% Genuine Apple",
    price: 7900,
    oldPrice: 9900,
    discount: "20% OFF",
    storage: "20W UK Pin",
    storageOptions: ["20W UK Pin (3-pin)"],
    colors: [{ name: "White", hex: "#ffffff" }],
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Genuine Apple 20W USB-C Power Adapter offers fast, efficient charging at home, in the office, or on the go. Charges iPhone 8 or later up to 50 percent in 30 minutes.",
    specifications: {
      power: "20W USB Power Delivery (USB-PD 3.0)",
      compatibility: "All iPhone models, iPad, Apple Watch pucks",
      warranty: "6 Months Replacement Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: false,
    rating: 4.9,
    reviewsCount: 115,
    variants: [
      {
        id: "apple-20w-uk",
        storage: "20W UK Pin (3-pin)",
        color: "White",
        price: 7900,
        oldPrice: 9900,
        stock: 25,
        sku: "TM-20W-UK",
      },
    ],
  },

  {
    id: "apple-watch-ultra-2",
    slug: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2 (GPS + Cellular)",
    series: "accessories",
    model: "Apple Watch Ultra 2",
    category: "accessories",
    subcategory: "apple-watch",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 269000,
    oldPrice: 295000,
    discount: "9% OFF",
    storage: "49mm Titanium",
    storageOptions: ["49mm Titanium"],
    colors: [
      { name: "Natural Titanium (Alpine Loop)", hex: "#c2bab2" },
      { name: "Black Titanium (Trail Loop)", hex: "#222224" },
    ],
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "The ultimate sports and adventure watch. 49mm aerospace titanium case, 3000-nit display, precision dual-frequency GPS, and up to 72 hours in Low Power Mode.",
    specifications: {
      case: "49mm Aerospace Titanium Case",
      display: "3000 nits Always-On Retina Display",
      battery: "Up to 36 hours normal use / 72 hours in Low Power Mode",
      waterResistance: "100m Water Resistant, EN13319 Recreational Dive to 40m",
      warranty: "1 Year Official Apple Warranty",
      delivery: "Islandwide Delivery",
    },
    stock: "In Stock",
    featured: true,
    rating: 5.0,
    reviewsCount: 22,
    variants: [
      {
        id: "aw-ultra-2-natural",
        storage: "49mm Titanium",
        color: "Natural Titanium (Alpine Loop)",
        price: 269000,
        oldPrice: 295000,
        stock: 2,
        sku: "TM-AWU2-NAT",
      },
      {
        id: "aw-ultra-2-black",
        storage: "49mm Titanium",
        color: "Black Titanium (Trail Loop)",
        price: 275000,
        oldPrice: 299000,
        stock: 2,
        sku: "TM-AWU2-BLK",
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}
