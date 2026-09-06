/**
 * Theekzu Mobile - Product Catalog & Store Configuration
 * Currency: Sri Lankan Rupees (LKR)
 */

const STORE_CONFIG = {
  name: "Theekzu Mobile",
  tagline: "Your Trusted Destination for Premium iPhones",
  phone: "+94 77 123 4567",
  whatsappNumber: "94771234567", // WhatsApp international format
  email: "sales@theekzumobile.lk",
  address: "No. 45, 1st Floor, Liberty Plaza, Colombo 03, Sri Lanka",
  hours: "Mon - Sat: 9:30 AM - 7:30 PM | Sun: 10:00 AM - 5:00 PM",
  currency: "LKR",
  currencySymbol: "Rs.",
  warrantyText: "1 Year Comprehensive Apple Care / Store Warranty + 14-Day Replacement Guarantee"
};

const PRODUCTS = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    slug: "iphone-16-pro-max",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "New Sealed",
    price: 429900,
    originalPrice: 469900,
    discountPercent: 9,
    rating: 5.0,
    reviewCount: 48,
    stockStatus: "In Stock",
    badge: "Flagship 2024/2025",
    isFeatured: true,
    isWeekendDeal: true,
    releaseYear: 2024,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["256GB", "512GB", "1TB"],
    storagePriceOffsets: {
      "256GB": 0,
      "512GB": 45000,
      "1TB": 95000
    },
    colors: [
      { name: "Desert Titanium", hex: "#c5b39b", code: "desert" },
      { name: "Natural Titanium", hex: "#8c8780", code: "natural" },
      { name: "White Titanium", hex: "#e5e5e5", code: "white" },
      { name: "Black Titanium", hex: "#2b2b2d", code: "black" }
    ],
    description: "The iPhone 16 Pro Max features a stunning Grade 5 Titanium design with thinner borders, the powerful A18 Pro chip, 48MP Fusion Camera with 5x optical zoom, and the innovative Camera Control button. Engineered for peak performance and unprecedented battery life.",
    specs: {
      chip: "A18 Pro chip with 6-core GPU & Apple Intelligence",
      display: "6.9-inch Super Retina XDR with ProMotion 120Hz & Always-On",
      camera: "Pro camera system: 48MP Main, 48MP Ultra Wide, 12MP 5x Telephoto with 4K 120 fps Dolby Vision",
      battery: "Up to 33 hours video playback - Best battery life in any iPhone",
      build: "Grade 5 Titanium with Ceramic Shield front & textured matte glass back",
      connectivity: "5G, Wi-Fi 7, USB-C (USB 3 up to 10Gb/s), Action Button, Camera Control",
      warranty: "1 Year Apple International Warranty + 1 Year Theekzu Service Guarantee"
    }
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    slug: "iphone-16-pro",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "New Sealed",
    price: 369900,
    originalPrice: 399900,
    discountPercent: 8,
    rating: 4.9,
    reviewCount: 36,
    stockStatus: "In Stock",
    badge: "Popular Pro",
    isFeatured: true,
    isWeekendDeal: false,
    releaseYear: 2024,
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    storagePriceOffsets: {
      "128GB": 0,
      "256GB": 32000,
      "512GB": 75000,
      "1TB": 125000
    },
    colors: [
      { name: "Natural Titanium", hex: "#8c8780", code: "natural" },
      { name: "Desert Titanium", hex: "#c5b39b", code: "desert" },
      { name: "White Titanium", hex: "#e5e5e5", code: "white" },
      { name: "Black Titanium", hex: "#2b2b2d", code: "black" }
    ],
    description: "Compact titanium powerhouse. Featuring the groundbreaking A18 Pro chip, 6.3-inch Super Retina XDR ProMotion display, and 5x Telephoto zoom on both Pro models.",
    specs: {
      chip: "A18 Pro chip with 16-core Neural Engine",
      display: "6.3-inch Super Retina XDR with ProMotion & Always-On",
      camera: "48MP Fusion, 48MP Ultra Wide, 12MP 5x Telephoto",
      battery: "Up to 27 hours video playback",
      build: "Aerospace-grade Titanium with textured matte glass",
      connectivity: "5G, USB-C (USB 3), Wi-Fi 7, Camera Control",
      warranty: "1 Year Official Apple Warranty"
    }
  },
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Best Value Pro",
    price: 339900,
    originalPrice: 379900,
    discountPercent: 11,
    rating: 4.9,
    reviewCount: 92,
    stockStatus: "In Stock",
    badge: "Hot Seller",
    isFeatured: true,
    isWeekendDeal: true,
    releaseYear: 2023,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["256GB", "512GB", "1TB"],
    storagePriceOffsets: {
      "256GB": 0,
      "512GB": 40000,
      "1TB": 80000
    },
    colors: [
      { name: "Natural Titanium", hex: "#9a958e", code: "natural" },
      { name: "Blue Titanium", hex: "#2f3844", code: "blue" },
      { name: "White Titanium", hex: "#f0ede6", code: "white" },
      { name: "Black Titanium", hex: "#3b3a39", code: "black" }
    ],
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, customizable Action button, and the most versatile iPhone camera system with 5x Optical Zoom.",
    specs: {
      chip: "A17 Pro chip with 6-core GPU",
      display: "6.7-inch Super Retina XDR with ProMotion 120Hz",
      camera: "48MP Main, Ultra Wide, and 5x Telephoto lens",
      battery: "Up to 29 hours video playback",
      build: "Titanium with Ceramic Shield",
      connectivity: "USB-C (USB 3), 5G, Wi-Fi 6E, Action Button",
      warranty: "1 Year Full Warranty + Screen Protector Free"
    }
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    slug: "iphone-15",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Brand New",
    price: 239900,
    originalPrice: 265000,
    discountPercent: 9,
    rating: 4.8,
    reviewCount: 64,
    stockStatus: "In Stock",
    badge: "Everyday Favorite",
    isFeatured: true,
    isWeekendDeal: false,
    releaseYear: 2023,
    images: [
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["128GB", "256GB", "512GB"],
    storagePriceOffsets: {
      "128GB": 0,
      "256GB": 28000,
      "512GB": 60000
    },
    colors: [
      { name: "Black", hex: "#35393b", code: "black" },
      { name: "Blue", hex: "#d3e0ea", code: "blue" },
      { name: "Pink", hex: "#f8d8d8", code: "pink" },
      { name: "Green", hex: "#d8e2dc", code: "green" },
      { name: "Yellow", hex: "#fbf3c8", code: "yellow" }
    ],
    description: "Dynamic Island brings your alerts and live activities right to you. 48MP main camera takes super-high-resolution photos with 2x Telephoto. Color-infused glass and aluminum design with USB-C connector.",
    specs: {
      chip: "A16 Bionic chip",
      display: "6.1-inch Super Retina XDR with Dynamic Island",
      camera: "Advanced dual-camera: 48MP Main + 12MP Ultra Wide with 2x Telephoto",
      battery: "Up to 20 hours video playback",
      build: "Color-infused back glass with aerospace-grade aluminum",
      connectivity: "USB-C, 5G, Wi-Fi 6",
      warranty: "1 Year Official Apple Warranty"
    }
  },
  {
    id: "iphone-14-pro-max-used",
    name: "iPhone 14 Pro Max (Used - Grade A+)",
    slug: "iphone-14-pro-max-used",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Pre-Owned",
    price: 245000,
    originalPrice: 275000,
    discountPercent: 11,
    rating: 4.8,
    reviewCount: 51,
    stockStatus: "Low Stock (2 Left)",
    badge: "90%+ Battery Health",
    isFeatured: true,
    isWeekendDeal: true,
    releaseYear: 2022,
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["128GB", "256GB", "512GB"],
    storagePriceOffsets: {
      "128GB": 0,
      "256GB": 22000,
      "512GB": 45000
    },
    colors: [
      { name: "Deep Purple", hex: "#4b4152", code: "purple" },
      { name: "Space Black", hex: "#2b2a2c", code: "space-black" },
      { name: "Gold", hex: "#f0e5d1", code: "gold" },
      { name: "Silver", hex: "#e2e4e1", code: "silver" }
    ],
    description: "Strictly 32-point hardware tested, 100% original parts guaranteed with battery health 92%-98%. Flawless cosmetic condition with Dynamic Island and 48MP camera.",
    specs: {
      chip: "A16 Bionic chip",
      display: "6.7-inch Super Retina XDR with Dynamic Island & ProMotion",
      camera: "48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto",
      battery: "Verified 92%+ Original Health, All-day life",
      build: "Surgical-grade stainless steel with textured matte glass",
      connectivity: "Lightning, 5G, Emergency SOS via Satellite",
      warranty: "6 Months Theekzu Store Warranty + 1 Month Replacement"
    }
  },
  {
    id: "iphone-13-brand-new",
    name: "iPhone 13",
    slug: "iphone-13",
    category: "iphones",
    subcategory: "latest-iphones",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 175000,
    originalPrice: 195000,
    discountPercent: 10,
    rating: 4.8,
    reviewCount: 78,
    stockStatus: "In Stock",
    badge: "Best Budget iPhone",
    isFeatured: true,
    isWeekendDeal: false,
    releaseYear: 2021,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["128GB", "256GB"],
    storagePriceOffsets: {
      "128GB": 0,
      "256GB": 25000
    },
    colors: [
      { name: "Midnight", hex: "#1f242b", code: "midnight" },
      { name: "Starlight", hex: "#f0ece4", code: "starlight" },
      { name: "Blue", hex: "#2b4b6f", code: "blue" },
      { name: "Pink", hex: "#fae0de", code: "pink" }
    ],
    description: "The most popular budget-friendly flagship iPhone in Sri Lanka. Exceptional battery life, cinematic mode, fast A15 Bionic performance, and vivid OLED display.",
    specs: {
      chip: "A15 Bionic chip with 4-core GPU",
      display: "6.1-inch Super Retina XDR OLED",
      camera: "Dual 12MP camera system with Sensor-shift OIS & Photographic Styles",
      battery: "Up to 19 hours video playback",
      build: "Ceramic Shield front, Glass back and aluminum design",
      connectivity: "5G, Lightning, MagSafe compatible",
      warranty: "1 Year Official Apple Warranty"
    }
  },
  {
    id: "iphone-13-used",
    name: "iPhone 13 (Used - Grade A+)",
    slug: "iphone-13-used",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Pre-Owned",
    price: 138000,
    originalPrice: 155000,
    discountPercent: 11,
    rating: 4.7,
    reviewCount: 42,
    stockStatus: "In Stock",
    badge: "Budget King",
    isFeatured: false,
    isWeekendDeal: false,
    releaseYear: 2021,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["128GB", "256GB"],
    storagePriceOffsets: {
      "128GB": 0,
      "256GB": 18000
    },
    colors: [
      { name: "Midnight", hex: "#1f242b", code: "midnight" },
      { name: "Blue", hex: "#2b4b6f", code: "blue" },
      { name: "Starlight", hex: "#f0ece4", code: "starlight" }
    ],
    description: "Quality tested pre-owned iPhone 13 in spotless condition. Genuine battery 88-94%, complete with test report and store warranty.",
    specs: {
      chip: "A15 Bionic chip",
      display: "6.1-inch OLED Super Retina XDR",
      camera: "Dual 12MP system with Cinematic Mode",
      battery: "Verified genuine 88%+ health",
      build: "Aluminum with Ceramic Shield",
      connectivity: "5G, Lightning",
      warranty: "6 Months Theekzu Store Warranty"
    }
  },
  {
    id: "iphone-15-pro-used",
    name: "iPhone 15 Pro (Used - Grade A+)",
    slug: "iphone-15-pro-used",
    category: "iphones",
    subcategory: "used-iphones",
    condition: "Used",
    conditionBadge: "Certified Pre-Owned",
    price: 279000,
    originalPrice: 305000,
    discountPercent: 9,
    rating: 4.9,
    reviewCount: 38,
    stockStatus: "In Stock",
    badge: "Titanium Compact",
    isFeatured: false,
    isWeekendDeal: true,
    releaseYear: 2023,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["128GB", "256GB", "512GB"],
    storagePriceOffsets: {
      "128GB": 0,
      "256GB": 25000,
      "512GB": 55000
    },
    colors: [
      { name: "Natural Titanium", hex: "#9a958e", code: "natural" },
      { name: "Black Titanium", hex: "#3b3a39", code: "black" }
    ],
    description: "Pre-owned iPhone 15 Pro in pristine mint condition. USB-C port, A17 Pro chip with ray tracing, 120Hz ProMotion screen, Action button.",
    specs: {
      chip: "A17 Pro chip",
      display: "6.1-inch Super Retina XDR 120Hz ProMotion",
      camera: "48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto",
      battery: "94%+ Original Health",
      build: "Titanium body with textured matte glass",
      connectivity: "USB-C, Action Button, 5G",
      warranty: "6 Months Full Warranty"
    }
  },
  // ACCESSORIES
  {
    id: "airpods-pro-2-usbc",
    name: "Apple AirPods Pro (2nd Gen) with USB-C",
    slug: "airpods-pro-2-usbc",
    category: "accessories",
    subcategory: "airpods",
    condition: "Brand New",
    conditionBadge: "Original Sealed",
    price: 74900,
    originalPrice: 85000,
    discountPercent: 12,
    rating: 5.0,
    reviewCount: 67,
    stockStatus: "In Stock",
    badge: "Top Seller",
    isFeatured: true,
    isWeekendDeal: true,
    releaseYear: 2023,
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["Standard"],
    storagePriceOffsets: { "Standard": 0 },
    colors: [
      { name: "White", hex: "#ffffff", code: "white" }
    ],
    description: "Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, Personalized Spatial Audio, and MagSafe Case (USB-C) with Precision Finding.",
    specs: {
      chip: "Apple H2 headphone chip, Apple U1 chip in case",
      battery: "Up to 6 hours listening time on single charge, up to 30 hours with case",
      charging: "USB-C, MagSafe, Apple Watch charger, Qi-certified",
      durability: "IP54 dust, sweat, and water resistant",
      warranty: "1 Year Apple Warranty"
    }
  },
  {
    id: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2 (GPS + Cellular)",
    slug: "apple-watch-ultra-2",
    category: "accessories",
    subcategory: "apple-watch",
    condition: "Brand New",
    conditionBadge: "Brand New Sealed",
    price: 269000,
    originalPrice: 295000,
    discountPercent: 9,
    rating: 4.9,
    reviewCount: 29,
    stockStatus: "In Stock",
    badge: "Rugged Premium",
    isFeatured: true,
    isWeekendDeal: false,
    releaseYear: 2024,
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["49mm"],
    storagePriceOffsets: { "49mm": 0 },
    colors: [
      { name: "Natural Titanium (Alpine Loop)", hex: "#c2bab2", code: "natural" },
      { name: "Black Titanium (Trail Loop)", hex: "#222224", code: "black" }
    ],
    description: "The ultimate sports and adventure watch. 49mm aerospace titanium case, 3000-nit display, precision dual-frequency GPS, up to 72-hour battery life in Low Power Mode.",
    specs: {
      chip: "S9 SiP with 64-bit dual-core processor",
      display: "49mm Always-On Retina OLED, 3000 nits brightness",
      durability: "100m water resistance, EN13319 certified for diving to 40m",
      battery: "Up to 36 hours normal use / 72 hours low power",
      warranty: "1 Year Official Apple Warranty"
    }
  },
  {
    id: "apple-20w-usbc-adapter",
    name: "Original Apple 20W USB-C Power Adapter (UK Pin)",
    slug: "apple-20w-adapter",
    category: "accessories",
    subcategory: "chargers-cables",
    condition: "Brand New",
    conditionBadge: "100% Genuine Apple",
    price: 8500,
    originalPrice: 11000,
    discountPercent: 23,
    rating: 5.0,
    reviewCount: 140,
    stockStatus: "In Stock",
    badge: "Must Have",
    isFeatured: false,
    isWeekendDeal: false,
    releaseYear: 2023,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["UK 3-Pin Original"],
    storagePriceOffsets: { "UK 3-Pin Original": 0 },
    colors: [
      { name: "White", hex: "#ffffff", code: "white" }
    ],
    description: "Official Sri Lanka / UK 3-pin Apple 20W Fast Charger. Delivers fast, efficient charging at home, in the office, or on the go. Charges iPhone 8 or later up to 50% in 30 minutes.",
    specs: {
      power: "20W Fast Power Delivery",
      port: "USB-C",
      pinType: "UK 3-Pin Standard (Sri Lanka compatible)",
      warranty: "1 Year Apple Replacement Warranty"
    }
  },
  {
    id: "apple-magsafe-charger",
    name: "Official Apple MagSafe Charger (1m)",
    slug: "apple-magsafe-charger",
    category: "accessories",
    subcategory: "chargers-cables",
    condition: "Brand New",
    conditionBadge: "Original Sealed",
    price: 15500,
    originalPrice: 18500,
    discountPercent: 16,
    rating: 4.9,
    reviewCount: 54,
    stockStatus: "In Stock",
    badge: "Fast Magnetic",
    isFeatured: false,
    isWeekendDeal: true,
    releaseYear: 2023,
    images: [
      "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["1m Cable"],
    storagePriceOffsets: { "1m Cable": 0 },
    colors: [
      { name: "Silver / White", hex: "#e5e5e5", code: "silver" }
    ],
    description: "The MagSafe Charger makes wireless charging a snap. The perfectly aligned magnets attach to your iPhone 12 or later for faster wireless charging up to 15W.",
    specs: {
      power: "Up to 15W wireless charging for iPhone",
      compatibility: "iPhone 12 to 16 series, AirPods with MagSafe",
      warranty: "1 Year Official Apple Warranty"
    }
  },
  {
    id: "magsafe-clear-case-16-pro-max",
    name: "iPhone 16 Pro Max MagSafe Clear Protective Case",
    slug: "iphone-16-pro-max-clear-case",
    category: "accessories",
    subcategory: "cases-protection",
    condition: "Brand New",
    conditionBadge: "Premium Anti-Yellowing",
    price: 5900,
    originalPrice: 8500,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 33,
    stockStatus: "In Stock",
    badge: "Best Seller",
    isFeatured: false,
    isWeekendDeal: false,
    releaseYear: 2024,
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["Pro Max 6.9\""],
    storagePriceOffsets: { "Pro Max 6.9\"": 0 },
    colors: [
      { name: "Crystal Clear", hex: "#f8f9fa", code: "clear" }
    ],
    description: "Engineered with anti-yellowing German Bayer TPU, camera bumper guard, reinforced corner air cushions, and strong MagSafe magnetic ring array.",
    specs: {
      material: "Anti-Yellowing Polycarbonate + Flexible TPU",
      protection: "Military Grade 10ft Drop Protection",
      compatibility: "iPhone 16 Pro Max with Camera Control cutout",
      warranty: "30-Day Anti-Yellow Guarantee"
    }
  },
  {
    id: "premium-tempered-glass-screen-protector",
    name: "9H Diamond Privacy Tempered Glass Screen Protector",
    slug: "diamond-privacy-screen-protector",
    category: "accessories",
    subcategory: "cases-protection",
    condition: "Brand New",
    conditionBadge: "Free In-Store Fitting",
    price: 3500,
    originalPrice: 5000,
    discountPercent: 30,
    rating: 4.9,
    reviewCount: 88,
    stockStatus: "In Stock",
    badge: "Privacy Shield",
    isFeatured: false,
    isWeekendDeal: false,
    releaseYear: 2024,
    images: [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["iPhone 16 Series", "iPhone 15 Series", "iPhone 14 Series", "iPhone 13 Series"],
    storagePriceOffsets: {
      "iPhone 16 Series": 0,
      "iPhone 15 Series": 0,
      "iPhone 14 Series": 0,
      "iPhone 13 Series": 0
    },
    colors: [
      { name: "28° Anti-Peep Privacy", hex: "#111111", code: "privacy" },
      { name: "Ultra HD Clear", hex: "#f0f0f0", code: "clear" }
    ],
    description: "Edge-to-edge 9H diamond hardness tempered glass. 28° privacy anti-peep technology keeps your personal banking and chats private in public.",
    specs: {
      hardness: "9H Diamond Shatterproof Rating",
      clarity: "99.9% High Definition Transparency with Oleophobic coating",
      installation: "Free dust-free machine application at our Colombo store",
      warranty: "Installation Guarantee"
    }
  },
  {
    id: "anker-65w-gan-fast-charger",
    name: "Anker Prime 65W GaN 3-Port Fast Wall Charger",
    slug: "anker-65w-gan-charger",
    category: "accessories",
    subcategory: "chargers-cables",
    condition: "Brand New",
    conditionBadge: "Genuine Anker",
    price: 21500,
    originalPrice: 25000,
    discountPercent: 14,
    rating: 5.0,
    reviewCount: 45,
    stockStatus: "In Stock",
    badge: "High Power GaN",
    isFeatured: false,
    isWeekendDeal: false,
    releaseYear: 2024,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80"
    ],
    storageOptions: ["65W 3-Port (2x USB-C, 1x USB-A)"],
    storagePriceOffsets: { "65W 3-Port (2x USB-C, 1x USB-A)": 0 },
    colors: [
      { name: "Space Gray", hex: "#4a4d52", code: "gray" },
      { name: "White", hex: "#ffffff", code: "white" }
    ],
    description: "Compact GaN technology charges your MacBook, iPhone, and Apple Watch simultaneously at lightning speeds with ActiveShield 2.0 safety temperature monitoring.",
    specs: {
      output: "65W Max Power Delivery 3.0",
      ports: "2x USB-C (65W max), 1x USB-A (22.5W max)",
      technology: "GaNPrime with PowerIQ 4.0",
      warranty: "18 Months Anker Sri Lanka Warranty"
    }
  }
];

const CATEGORIES = [
  {
    id: "latest-iphones",
    name: "Latest iPhones",
    count: "iPhone 15 & 16 Series",
    icon: "smartphone",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    description: "Brand new sealed Apple flagships with full international & store warranty."
  },
  {
    id: "used-iphones",
    name: "Used iPhones",
    count: "Certified Pre-Owned",
    icon: "shield-check",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
    description: "32-point hardware tested, pristine Grade A+ condition with battery health 90%+."
  },
  {
    id: "airpods",
    name: "AirPods",
    count: "Pro & Gen 3 / 4",
    icon: "headphones",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80",
    description: "Original Apple AirPods Pro 2, AirPods 3 & 4 with USB-C and Active Noise Cancellation."
  },
  {
    id: "apple-watch",
    name: "Apple Watch",
    count: "Ultra 2 & Series 9/10",
    icon: "watch",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
    description: "Precision titanium fitness trackers, health monitoring, and all-day battery life."
  },
  {
    id: "chargers-cables",
    name: "Chargers & Cables",
    count: "Fast 20W/30W/65W",
    icon: "zap",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
    description: "Original Apple 20W adapters, braided USB-C cables, MagSafe pucks, and Anker GaN chargers."
  },
  {
    id: "cases-protection",
    name: "Cases & Protection",
    count: "MagSafe & 9H Glass",
    icon: "shield",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80",
    description: "Crystal clear MagSafe cases, matte silicone, and 9H privacy tempered glass protectors."
  }
];

const REVIEWS = [
  {
    id: "rev-1",
    name: "Kavinda Wickramasinghe",
    location: "Colombo 07",
    product: "iPhone 16 Pro Max 256GB Desert Titanium",
    rating: 5,
    date: "3 days ago",
    comment: "Unbelievable service from Theekzu Mobile! Got the brand new 16 Pro Max sealed with Apple warranty at the best price in Colombo. Delivered to my doorstep within 3 hours through their express islandwide delivery. WhatsApp replies were instant!",
    verified: true
  },
  {
    id: "rev-2",
    name: "Dilini Senanayake",
    location: "Kandy",
    product: "iPhone 15 Pro (Grade A+ Certified Used)",
    rating: 5,
    date: "1 week ago",
    comment: "I was hesitant about buying a pre-owned iPhone online, but Theekzu Mobile sent me full 3uTools hardware battery reports and video proofs on WhatsApp before shipping. The phone is in 100% mint condition with 96% battery. 10/10 recommendation!",
    verified: true
  },
  {
    id: "rev-3",
    name: "Mohamed Rilwan",
    location: "Dehiwala",
    product: "iPhone Trade-In (iPhone 12 to 15 Pro Max)",
    rating: 5,
    date: "2 weeks ago",
    comment: "Traded in my old iPhone 12 for an iPhone 15 Pro Max. They evaluated my device very fairly compared to other Liberty Plaza shops and deducted the value on the spot. Hassle-free and genuine people.",
    verified: true
  },
  {
    id: "rev-4",
    name: "Shenal Perera",
    location: "Negombo",
    product: "AirPods Pro 2 USB-C + 20W Adapter",
    rating: 5,
    date: "3 weeks ago",
    comment: "Both items are 100% original Apple products verified on checkcoverage.apple.com. The fast 20W adapter and AirPods arrived safely packed with bubble wrap. Will buy my next phone here for sure.",
    verified: true
  }
];

const TRADE_IN_MODELS = [
  { model: "iPhone 15 Pro Max", baseVal: 260000 },
  { model: "iPhone 15 Pro", baseVal: 215000 },
  { model: "iPhone 15", baseVal: 170000 },
  { model: "iPhone 14 Pro Max", baseVal: 195000 },
  { model: "iPhone 14 Pro", baseVal: 165000 },
  { model: "iPhone 14", baseVal: 135000 },
  { model: "iPhone 13 Pro Max", baseVal: 155000 },
  { model: "iPhone 13 Pro", baseVal: 135000 },
  { model: "iPhone 13", baseVal: 110000 },
  { model: "iPhone 12 Pro Max", baseVal: 120000 },
  { model: "iPhone 12", baseVal: 85000 },
  { model: "iPhone 11", baseVal: 65000 }
];

// Helper to format LKR Currency
function formatLKR(amount) {
  return "Rs. " + Number(amount).toLocaleString("en-LK");
}

// Export for browser
if (typeof window !== "undefined") {
  window.STORE_CONFIG = STORE_CONFIG;
  window.PRODUCTS = PRODUCTS;
  window.CATEGORIES = CATEGORIES;
  window.REVIEWS = REVIEWS;
  window.TRADE_IN_MODELS = TRADE_IN_MODELS;
  window.formatLKR = formatLKR;
}
