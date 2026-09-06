/**
 * Theekzu Mobile - Main Application Controller
 * Handles SPA navigation, views, modals, filters, and user interactions.
 */

// Global state
const AppState = {
  currentView: "home",
  selectedProduct: null,
  selectedStorage: null,
  selectedColor: null,
  selectedQty: 1,
  activeCategoryFilter: "all",
  shopFilters: {
    search: "",
    category: "all",
    condition: "all",
    storage: "all",
    maxPrice: 500000,
    sortBy: "popular"
  }
};

// Toast notification helper
window.showToast = function(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast glass-modal px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border ${
    type === "success" ? "border-emerald-500/40 text-emerald-300" :
    type === "error" ? "border-rose-500/40 text-rose-300" :
    "border-sky-500/40 text-sky-200"
  }`;

  const iconName = type === "success" ? "check-circle" : type === "error" ? "alert-circle" : "info";
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
    <span class="text-sm font-medium text-white">${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};

// Application Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();

  // Bind navigation
  initNavigation();
  initDrawers();
  initSearch();
  initTradeIn();
  initCountdown();
  initContactForm();

  // Listen to Cart & Wishlist updates
  if (window.cartManager) {
    window.cartManager.subscribe(updateCartUI);
  }
  if (window.wishlistManager) {
    window.wishlistManager.subscribe(updateWishlistUI);
  }

  // Render initial page
  renderCurrentView();
});

/* --------------------------------------------------------------------------
   NAVIGATION & VIEW ROUTING
   -------------------------------------------------------------------------- */

function initNavigation() {
  const navLinks = document.querySelectorAll("[data-nav-target]");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-nav-target");
      navigateTo(target);

      // Close mobile menu if open
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
      }
    });
  });

  // Mobile menu button
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
}

function navigateTo(viewName, filterOption = null) {
  AppState.currentView = viewName;
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Update active state in nav links
  document.querySelectorAll("[data-nav-target]").forEach(link => {
    if (link.getAttribute("data-nav-target") === viewName) {
      link.classList.add("text-sky-400", "font-semibold");
      link.classList.remove("text-zinc-400");
    } else {
      link.classList.remove("text-sky-400", "font-semibold");
      link.classList.add("text-zinc-400");
    }
  });

  if (viewName === "shop" && filterOption) {
    AppState.shopFilters.category = filterOption;
  }

  renderCurrentView();
}

function renderCurrentView() {
  const views = ["home", "shop", "iphones", "accessories", "offers", "about", "contact"];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === AppState.currentView) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
  });

  // Call renderers for specific views
  if (AppState.currentView === "home") {
    renderHomeView();
  } else if (AppState.currentView === "shop") {
    renderShopView();
  } else if (AppState.currentView === "iphones") {
    renderIphonesView();
  } else if (AppState.currentView === "accessories") {
    renderAccessoriesView();
  } else if (AppState.currentView === "offers") {
    renderOffersView();
  } else if (AppState.currentView === "about") {
    renderAboutView();
  }

  if (window.lucide) lucide.createIcons();
}

/* --------------------------------------------------------------------------
   HOME VIEW RENDERING
   -------------------------------------------------------------------------- */

function renderHomeView() {
  renderFeaturedProducts();
  renderCategoriesGrid();
  renderSpecialOffers();
  renderReviews();
}

function renderFeaturedProducts() {
  const container = document.getElementById("featured-products-container");
  if (!container) return;

  const featured = PRODUCTS.filter(p => p.isFeatured && p.category === "iphones").slice(0, 6);
  container.innerHTML = featured.map(product => createProductCardHTML(product)).join("");
  bindProductCardEvents(container);
}

function renderCategoriesGrid() {
  const container = document.getElementById("categories-container");
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <div class="glass-card group p-6 rounded-3xl cursor-pointer transition-all duration-300 relative overflow-hidden" onclick="handleCategoryClick('${cat.id}')">
      <div class="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-blue-600/10 group-hover:bg-blue-600/20 blur-2xl transition-all"></div>
      <div class="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-sky-400 mb-5 group-hover:scale-110 group-hover:border-sky-500/40 transition-all">
            <i data-lucide="${cat.icon}" class="w-6 h-6"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">${cat.name}</h3>
          <p class="text-xs text-sky-400 font-medium mb-3 uppercase tracking-wider">${cat.count}</p>
          <p class="text-sm text-zinc-400 line-clamp-2">${cat.description}</p>
        </div>
        <div class="mt-6 flex items-center text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
          <span>Explore Collection</span>
          <i data-lucide="arrow-right" class="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform text-sky-400"></i>
        </div>
      </div>
    </div>
  `).join("");
}

function handleCategoryClick(categoryId) {
  if (categoryId === "latest-iphones" || categoryId === "used-iphones") {
    navigateTo("iphones");
  } else if (categoryId === "airpods" || categoryId === "apple-watch" || categoryId === "chargers-cables" || categoryId === "cases-protection") {
    navigateTo("accessories");
  } else {
    AppState.shopFilters.category = categoryId;
    navigateTo("shop");
  }
}

function renderSpecialOffers() {
  const container = document.getElementById("special-offers-container");
  if (!container) return;

  const deals = PRODUCTS.filter(p => p.isWeekendDeal).slice(0, 4);
  container.innerHTML = deals.map(p => `
    <div class="glass-card p-5 rounded-3xl flex flex-col justify-between relative group">
      <div class="absolute top-4 right-4 z-10 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-bold">
        Save ${p.discountPercent}%
      </div>
      <div>
        <div class="w-full h-44 rounded-2xl overflow-hidden bg-zinc-900/80 mb-4 flex items-center justify-center p-3 relative">
          <img src="${p.images[0]}" alt="${p.name}" class="max-h-full object-contain group-hover:scale-105 transition-transform duration-500">
        </div>
        <div class="text-xs font-semibold text-sky-400 mb-1">${p.conditionBadge}</div>
        <h4 class="text-base font-bold text-white mb-2 line-clamp-1">${p.name}</h4>
        <div class="flex items-baseline gap-2 mb-4">
          <span class="text-lg font-extrabold text-white">${formatLKR(p.price)}</span>
          <span class="text-xs text-zinc-500 line-through">${formatLKR(p.originalPrice)}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors" onclick="openProductModal('${p.id}')">
          View Details
        </button>
        <button class="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center justify-center" onclick="orderOnWhatsAppDirect('${p.id}')" title="Quick WhatsApp Order">
          <i data-lucide="message-circle" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `).join("");
}

function renderReviews() {
  const container = document.getElementById("reviews-container");
  if (!container) return;

  container.innerHTML = REVIEWS.map(r => `
    <div class="glass-card p-6 rounded-3xl flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex text-amber-400">
            ${Array(r.rating).fill('<i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>').join('')}
          </div>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <i data-lucide="check-check" class="w-3 h-3"></i> Verified Buyer
          </span>
        </div>
        <p class="text-sm text-zinc-300 mb-6 italic leading-relaxed">"${r.comment}"</p>
      </div>
      <div class="pt-4 border-t border-white/5">
        <h5 class="text-sm font-bold text-white">${r.name}</h5>
        <p class="text-xs text-zinc-400">${r.location} • <span class="text-sky-400">${r.product}</span></p>
      </div>
    </div>
  `).join("");
}

/* --------------------------------------------------------------------------
   PRODUCT CARD COMPONENT GENERATOR
   -------------------------------------------------------------------------- */

function createProductCardHTML(product) {
  const isWishlisted = window.wishlistManager?.isWishlisted(product.id);
  const colorDots = (product.colors || []).map(c => 
    `<span class="w-3 h-3 rounded-full border border-black/50 shadow-inner" style="background-color: ${c.hex};" title="${c.name}"></span>`
  ).join("");

  return `
    <div class="glass-card product-card rounded-3xl p-5 flex flex-col justify-between relative group" data-product-id="${product.id}">
      
      <!-- Top badges & Wishlist -->
      <div class="flex items-center justify-between gap-2 mb-3 z-10">
        <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${
          product.condition === 'Brand New' 
            ? 'bg-blue-500/15 text-sky-300 border border-blue-500/30' 
            : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
        }">
          ${product.conditionBadge || product.condition}
        </span>
        
        <button class="wishlist-toggle-btn w-9 h-9 rounded-full bg-zinc-900/80 border border-white/10 flex items-center justify-center transition-all ${
          isWishlisted ? 'text-rose-500 border-rose-500/30' : 'text-zinc-400 hover:text-white hover:border-white/30'
        }" data-wishlist-id="${product.id}" title="Add to Wishlist">
          <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}"></i>
        </button>
      </div>

      <!-- Image Area -->
      <div class="product-card-img-container h-52 w-full rounded-2xl bg-zinc-950/60 p-4 mb-4 flex items-center justify-center cursor-pointer" onclick="openProductModal('${product.id}')">
        <img src="${product.images[0]}" alt="${product.name}" class="max-h-full max-w-full object-contain" loading="lazy">
        ${product.discountPercent ? `
          <span class="absolute bottom-3 left-3 bg-rose-500/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
            -${product.discountPercent}% OFF
          </span>
        ` : ''}
      </div>

      <!-- Product Meta -->
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <!-- Storage & Color swatches preview -->
          <div class="flex items-center justify-between gap-2 mb-2 text-xs text-zinc-400">
            <span>${product.storageOptions ? product.storageOptions.join(' • ') : 'Standard'}</span>
            <div class="flex items-center gap-1.5">${colorDots}</div>
          </div>

          <h3 class="text-base font-bold text-white group-hover:text-sky-300 transition-colors mb-2 line-clamp-1 cursor-pointer" onclick="openProductModal('${product.id}')">
            ${product.name}
          </h3>

          <div class="flex items-center gap-1.5 mb-3 text-xs text-zinc-400">
            <div class="flex items-center text-amber-400">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
              <span class="font-bold ml-1 text-white">${product.rating.toFixed(1)}</span>
            </div>
            <span>(${product.reviewCount || 20})</span>
            <span class="text-zinc-600">•</span>
            <span class="text-emerald-400 font-medium">${product.stockStatus}</span>
          </div>
        </div>

        <!-- Pricing -->
        <div class="pt-3 border-t border-white/5">
          <div class="flex items-baseline gap-2 mb-4">
            <span class="text-xl font-extrabold text-white">${formatLKR(product.price)}</span>
            ${product.originalPrice ? `
              <span class="text-xs text-zinc-500 line-through">${formatLKR(product.originalPrice)}</span>
            ` : ''}
          </div>

          <!-- Buttons -->
          <div class="grid grid-cols-2 gap-2">
            <button class="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-all text-center flex items-center justify-center gap-1.5" onclick="openProductModal('${product.id}')">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              <span>Details</span>
            </button>
            <button class="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950" onclick="orderOnWhatsAppDirect('${product.id}')">
              <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  `;
}

function bindProductCardEvents(container) {
  container.querySelectorAll(".wishlist-toggle-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-wishlist-id");
      if (window.wishlistManager) {
        window.wishlistManager.toggle(id);
      }
    });
  });
}

function orderOnWhatsAppDirect(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const url = CartManager.getSingleProductWhatsAppUrl(product);
  window.open(url, "_blank");
}

/* --------------------------------------------------------------------------
   SHOP VIEW & FILTERING
   -------------------------------------------------------------------------- */

function renderShopView() {
  const container = document.getElementById("shop-products-grid");
  const countDisplay = document.getElementById("shop-results-count");
  if (!container) return;

  // Filter products
  let filtered = [...PRODUCTS];

  // Category filter
  if (AppState.shopFilters.category !== "all") {
    filtered = filtered.filter(p => p.category === AppState.shopFilters.category || p.subcategory === AppState.shopFilters.category);
  }

  // Condition filter
  if (AppState.shopFilters.condition !== "all") {
    filtered = filtered.filter(p => p.condition === AppState.shopFilters.condition);
  }

  // Storage filter
  if (AppState.shopFilters.storage !== "all") {
    filtered = filtered.filter(p => p.storageOptions && p.storageOptions.includes(AppState.shopFilters.storage));
  }

  // Max Price filter
  filtered = filtered.filter(p => p.price <= AppState.shopFilters.maxPrice);

  // Search keyword
  if (AppState.shopFilters.search) {
    const q = AppState.shopFilters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.specs && JSON.stringify(p.specs).toLowerCase().includes(q))
    );
  }

  // Sorting
  if (AppState.shopFilters.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (AppState.shopFilters.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (AppState.shopFilters.sortBy === "newest") {
    filtered.sort((a, b) => b.releaseYear - a.releaseYear);
  } else {
    // popular
    filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  }

  // Update counter
  if (countDisplay) {
    countDisplay.textContent = `Showing ${filtered.length} products`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16 glass-card rounded-3xl p-8">
        <i data-lucide="package-search" class="w-12 h-12 mx-auto text-zinc-500 mb-4"></i>
        <h3 class="text-xl font-bold text-white mb-2">No Products Match Your Criteria</h3>
        <p class="text-zinc-400 text-sm mb-6 max-w-md mx-auto">Try clearing some of your filters or searching for another iPhone model or accessory.</p>
        <button class="btn-apple-primary text-sm" onclick="resetShopFilters()">
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
          Reset All Filters
        </button>
      </div>
    `;
  } else {
    container.innerHTML = filtered.map(p => createProductCardHTML(p)).join("");
    bindProductCardEvents(container);
  }

  if (window.lucide) lucide.createIcons();
}

function resetShopFilters() {
  AppState.shopFilters = {
    search: "",
    category: "all",
    condition: "all",
    storage: "all",
    maxPrice: 500000,
    sortBy: "popular"
  };

  // Sync inputs
  const catSelect = document.getElementById("filter-category");
  const condSelect = document.getElementById("filter-condition");
  const storageSelect = document.getElementById("filter-storage");
  const sortSelect = document.getElementById("filter-sort");
  const priceRange = document.getElementById("filter-price-range");
  const priceDisplay = document.getElementById("filter-price-display");

  if (catSelect) catSelect.value = "all";
  if (condSelect) condSelect.value = "all";
  if (storageSelect) storageSelect.value = "all";
  if (sortSelect) sortSelect.value = "popular";
  if (priceRange) priceRange.value = "500000";
  if (priceDisplay) priceDisplay.textContent = formatLKR(500000);

  renderShopView();
}

/* --------------------------------------------------------------------------
   IPHONES & ACCESSORIES SPECIFIC VIEWS
   -------------------------------------------------------------------------- */

function renderIphonesView() {
  const container = document.getElementById("iphones-grid");
  if (!container) return;

  const iphones = PRODUCTS.filter(p => p.category === "iphones");
  container.innerHTML = iphones.map(p => createProductCardHTML(p)).join("");
  bindProductCardEvents(container);
}

function renderAccessoriesView() {
  const container = document.getElementById("accessories-grid");
  if (!container) return;

  const accessories = PRODUCTS.filter(p => p.category === "accessories");
  container.innerHTML = accessories.map(p => createProductCardHTML(p)).join("");
  bindProductCardEvents(container);
}

function renderOffersView() {
  const container = document.getElementById("offers-grid");
  if (!container) return;

  const deals = PRODUCTS.filter(p => p.isWeekendDeal || p.discountPercent >= 10);
  container.innerHTML = deals.map(p => createProductCardHTML(p)).join("");
  bindProductCardEvents(container);
}

function renderAboutView() {
  // Trigger counters
  animateCounters();
}

function animateCounters() {
  const counters = document.querySelectorAll(".stat-counter");
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    let count = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        counter.textContent = target.toLocaleString();
        clearInterval(interval);
      } else {
        counter.textContent = count.toLocaleString();
      }
    }, 30);
  });
}

/* --------------------------------------------------------------------------
   PRODUCT DETAILS MODAL
   -------------------------------------------------------------------------- */

window.openProductModal = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  AppState.selectedProduct = product;
  AppState.selectedStorage = product.storageOptions ? product.storageOptions[0] : "Standard";
  AppState.selectedColor = product.colors && product.colors[0] ? product.colors[0].name : "Default";
  AppState.selectedQty = 1;

  const modal = document.getElementById("product-detail-modal");
  const modalContent = document.getElementById("product-detail-content");
  if (!modal || !modalContent) return;

  renderProductModalContent(product);
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  if (window.lucide) lucide.createIcons();
};

window.closeProductModal = function() {
  const modal = document.getElementById("product-detail-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
};

function renderProductModalContent(product) {
  const modalContent = document.getElementById("product-detail-content");
  if (!modalContent) return;

  const offset = (product.storagePriceOffsets && product.storagePriceOffsets[AppState.selectedStorage]) || 0;
  const currentPrice = product.price + offset;
  const originalPrice = product.originalPrice ? product.originalPrice + offset : null;

  // Gallery thumbnails
  const thumbsHTML = product.images.map((img, idx) => `
    <button class="w-16 h-16 rounded-xl overflow-hidden border ${idx === 0 ? 'border-sky-500' : 'border-white/10'} bg-zinc-900 p-1 flex-shrink-0" onclick="changeMainModalImage('${img}', this)">
      <img src="${img}" alt="${product.name}" class="w-full h-full object-contain">
    </button>
  `).join("");

  // Storage pills
  const storageHTML = (product.storageOptions || []).map(st => `
    <button class="px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
      st === AppState.selectedStorage 
        ? 'border-sky-500 bg-sky-500/15 text-sky-300 ring-2 ring-sky-500/30' 
        : 'border-white/10 bg-zinc-900/60 text-zinc-300 hover:border-white/30'
    }" onclick="selectModalStorage('${st}')">
      ${st}
    </button>
  `).join("");

  // Color options
  const colorHTML = (product.colors || []).map(col => `
    <button class="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs ${
      col.name === AppState.selectedColor
        ? 'border-sky-500 bg-zinc-800 text-white ring-1 ring-sky-500'
        : 'border-white/10 bg-zinc-900/40 text-zinc-400 hover:text-white'
    }" onclick="selectModalColor('${col.name}')">
      <span class="w-3.5 h-3.5 rounded-full border border-black/40" style="background-color: ${col.hex}"></span>
      <span>${col.name}</span>
    </button>
  `).join("");

  // Specs breakdown
  const specs = product.specs || {};
  const specsHTML = Object.entries(specs).map(([key, val]) => `
    <div class="py-2.5 border-b border-white/5 flex flex-col sm:flex-row sm:items-baseline justify-between text-xs gap-1">
      <span class="text-zinc-400 uppercase tracking-wider font-semibold">${key}:</span>
      <span class="text-zinc-200 text-right font-medium">${val}</span>
    </div>
  `).join("");

  // Related products
  const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
  const relatedHTML = related.map(rp => `
    <div class="glass-card p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-sky-500/40 transition-colors" onclick="openProductModal('${rp.id}')">
      <img src="${rp.images[0]}" alt="${rp.name}" class="w-12 h-12 object-contain bg-zinc-900 rounded-xl p-1">
      <div class="flex-1 min-w-0">
        <h5 class="text-xs font-bold text-white truncate">${rp.name}</h5>
        <span class="text-xs text-sky-400 font-extrabold">${formatLKR(rp.price)}</span>
      </div>
    </div>
  `).join("");

  modalContent.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Gallery Column (5 cols) -->
      <div class="lg:col-span-5 flex flex-col gap-4">
        <div class="w-full h-80 rounded-3xl bg-zinc-950/80 border border-white/10 p-6 flex items-center justify-center relative overflow-hidden">
          <img id="modal-main-image" src="${product.images[0]}" alt="${product.name}" class="max-h-full max-w-full object-contain">
          ${product.discountPercent ? `
            <span class="absolute top-4 left-4 bg-rose-500 text-white font-black text-xs px-2.5 py-1 rounded-lg">
              ${product.discountPercent}% OFF
            </span>
          ` : ''}
        </div>
        <div class="flex gap-3 overflow-x-auto pb-2">
          ${thumbsHTML}
        </div>

        <div class="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center gap-3">
          <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400 flex-shrink-0"></i>
          <p class="text-xs text-zinc-300">
            <strong class="text-white">Genuine Guarantee:</strong> ${STORE_CONFIG.warrantyText}
          </p>
        </div>
      </div>

      <!-- Details Column (7 cols) -->
      <div class="lg:col-span-7 flex flex-col justify-between">
        <div>
          <!-- Title & Badges -->
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 border border-sky-500/20 text-sky-400">
              ${product.conditionBadge || product.condition}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              ${product.stockStatus}
            </span>
          </div>

          <h2 class="text-2xl lg:text-3xl font-extrabold text-white mb-3">${product.name}</h2>
          
          <div class="flex items-center gap-3 text-xs text-zinc-400 mb-5">
            <div class="flex items-center text-amber-400">
              ${Array(Math.floor(product.rating)).fill('<i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>').join('')}
              <span class="font-bold ml-1 text-white">${product.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>${product.reviewCount} customer reviews</span>
            <span>•</span>
            <span class="text-sky-400">Islandwide 24-48h Delivery</span>
          </div>

          <!-- Price Display -->
          <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 flex items-baseline gap-3">
            <span id="modal-price-display" class="text-3xl font-black text-white">${formatLKR(currentPrice)}</span>
            ${originalPrice ? `
              <span id="modal-orig-price" class="text-sm text-zinc-500 line-through">${formatLKR(originalPrice)}</span>
            ` : ''}
            <span class="text-xs text-zinc-400 ml-auto">Prices in Sri Lankan Rupees</span>
          </div>

          <!-- Storage Selector -->
          ${product.storageOptions && product.storageOptions.length > 0 ? `
            <div class="mb-5">
              <label class="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2">Storage Capacity</label>
              <div class="flex flex-wrap gap-2">
                ${storageHTML}
              </div>
            </div>
          ` : ''}

          <!-- Color Selector -->
          ${product.colors && product.colors.length > 0 ? `
            <div class="mb-6">
              <label class="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2">Choose Color: <span class="text-sky-400">${AppState.selectedColor}</span></label>
              <div class="flex flex-wrap gap-2">
                ${colorHTML}
              </div>
            </div>
          ` : ''}

          <!-- Quantity & Actions -->
          <div class="flex flex-col sm:flex-row gap-3 mb-6">
            <div class="flex items-center justify-between border border-white/15 bg-zinc-900 rounded-2xl p-1.5 w-full sm:w-36">
              <button class="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white font-bold" onclick="updateModalQty(-1)">-</button>
              <span id="modal-qty-display" class="font-bold text-sm text-white px-2">1</span>
              <button class="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white font-bold" onclick="updateModalQty(1)">+</button>
            </div>

            <button class="btn-apple-primary flex-1 py-3" onclick="addModalItemToCart()">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>Add to Cart</span>
            </button>

            <button class="btn-whatsapp-green py-3 px-5" onclick="orderModalOnWhatsApp()">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>WhatsApp Order</span>
            </button>
          </div>
        </div>

        <!-- Description & Specs Tabbed Area -->
        <div class="pt-6 border-t border-white/10">
          <p class="text-sm text-zinc-300 mb-5 leading-relaxed">${product.description}</p>
          
          <div class="space-y-1 mb-6">
            <h4 class="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-3">Key Specifications</h4>
            ${specsHTML}
          </div>

          <!-- Related items -->
          <div>
            <h4 class="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-3">You Might Also Like</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              ${relatedHTML}
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

window.changeMainModalImage = function(src, btn) {
  const img = document.getElementById("modal-main-image");
  if (img) img.src = src;
  btn.parentElement.querySelectorAll("button").forEach(b => b.classList.replace("border-sky-500", "border-white/10"));
  btn.classList.replace("border-white/10", "border-sky-500");
};

window.selectModalStorage = function(storage) {
  AppState.selectedStorage = storage;
  renderProductModalContent(AppState.selectedProduct);
  if (window.lucide) lucide.createIcons();
};

window.selectModalColor = function(colorName) {
  AppState.selectedColor = colorName;
  renderProductModalContent(AppState.selectedProduct);
  if (window.lucide) lucide.createIcons();
};

window.updateModalQty = function(delta) {
  AppState.selectedQty = Math.max(1, AppState.selectedQty + delta);
  const display = document.getElementById("modal-qty-display");
  if (display) display.textContent = AppState.selectedQty;
};

window.addModalItemToCart = function() {
  if (!AppState.selectedProduct) return;
  window.cartManager.addItem(
    AppState.selectedProduct,
    AppState.selectedStorage,
    AppState.selectedColor,
    AppState.selectedQty
  );
  closeProductModal();
  openCartDrawer();
};

window.orderModalOnWhatsApp = function() {
  if (!AppState.selectedProduct) return;
  const url = CartManager.getSingleProductWhatsAppUrl(
    AppState.selectedProduct,
    AppState.selectedStorage,
    AppState.selectedColor
  );
  window.open(url, "_blank");
};

/* --------------------------------------------------------------------------
   CART & WISHLIST DRAWERS
   -------------------------------------------------------------------------- */

function initDrawers() {
  // Cart drawer buttons
  const openCartButtons = document.querySelectorAll("[data-action='open-cart']");
  openCartButtons.forEach(btn => btn.addEventListener("click", openCartDrawer));

  const closeCartBtn = document.getElementById("close-cart-btn");
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);

  const cartBackdrop = document.getElementById("cart-drawer-backdrop");
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCartDrawer);

  // Wishlist drawer buttons
  const openWishlistButtons = document.querySelectorAll("[data-action='open-wishlist']");
  openWishlistButtons.forEach(btn => btn.addEventListener("click", openWishlistDrawer));

  const closeWishlistBtn = document.getElementById("close-wishlist-btn");
  if (closeWishlistBtn) closeWishlistBtn.addEventListener("click", closeWishlistDrawer);

  const wishlistBackdrop = document.getElementById("wishlist-drawer-backdrop");
  if (wishlistBackdrop) wishlistBackdrop.addEventListener("click", closeWishlistDrawer);
}

function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) {
    drawer.classList.remove("translate-x-full");
    document.getElementById("cart-drawer-backdrop")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) {
    drawer.classList.add("translate-x-full");
    document.getElementById("cart-drawer-backdrop")?.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function openWishlistDrawer() {
  const drawer = document.getElementById("wishlist-drawer");
  if (drawer) {
    renderWishlistDrawerItems();
    drawer.classList.remove("translate-x-full");
    document.getElementById("wishlist-drawer-backdrop")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeWishlistDrawer() {
  const drawer = document.getElementById("wishlist-drawer");
  if (drawer) {
    drawer.classList.add("translate-x-full");
    document.getElementById("wishlist-drawer-backdrop")?.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function updateCartUI(cart) {
  // Update badge counts
  const count = window.cartManager.getTotalCount();
  document.querySelectorAll(".cart-badge").forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  });

  // Render cart items in drawer
  const container = document.getElementById("cart-items-container");
  const subtotalEl = document.getElementById("cart-subtotal-display");
  const totalEl = document.getElementById("cart-total-display");
  const checkoutBtn = document.getElementById("cart-whatsapp-checkout-btn");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center">
        <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto text-zinc-600 mb-4"></i>
        <h4 class="text-base font-bold text-white mb-1">Your cart is empty</h4>
        <p class="text-xs text-zinc-400 mb-6">Discover our latest iPhones and accessories</p>
        <button class="btn-apple-primary text-xs" onclick="closeCartDrawer(); navigateTo('shop');">
          Browse Shop
        </button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = formatLKR(0);
    if (totalEl) totalEl.textContent = formatLKR(0);
    if (checkoutBtn) checkoutBtn.setAttribute("disabled", "true");
  } else {
    container.innerHTML = cart.map(item => `
      <div class="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 flex gap-3 items-center">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-contain bg-zinc-950 p-1 flex-shrink-0">
        <div class="flex-1 min-w-0">
          <h5 class="text-xs font-bold text-white truncate">${item.name}</h5>
          <p class="text-[11px] text-zinc-400">${item.storage} • ${item.color} • <span class="text-sky-400">${item.condition}</span></p>
          <p class="text-xs font-extrabold text-white mt-1">${formatLKR(item.unitPrice)}</p>
          
          <div class="flex items-center gap-2 mt-2">
            <div class="flex items-center border border-white/10 rounded-lg overflow-hidden bg-zinc-950">
              <button class="px-2 py-0.5 text-xs text-zinc-400 hover:text-white" onclick="window.cartManager.updateQuantity('${item.cartItemId}', -1)">-</button>
              <span class="px-2 text-xs font-bold text-white">${item.quantity}</span>
              <button class="px-2 py-0.5 text-xs text-zinc-400 hover:text-white" onclick="window.cartManager.updateQuantity('${item.cartItemId}', 1)">+</button>
            </div>
            <button class="text-zinc-500 hover:text-rose-400 text-xs ml-auto transition-colors" onclick="window.cartManager.removeItem('${item.cartItemId}')">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `).join("");

    const subtotal = window.cartManager.getSubtotal();
    if (subtotalEl) subtotalEl.textContent = formatLKR(subtotal);
    if (totalEl) totalEl.textContent = formatLKR(subtotal);
    if (checkoutBtn) {
      checkoutBtn.removeAttribute("disabled");
      checkoutBtn.onclick = () => {
        const note = document.getElementById("cart-delivery-notes")?.value || "";
        const url = window.cartManager.getWhatsAppCheckoutUrl(note);
        window.open(url, "_blank");
      };
    }
  }

  if (window.lucide) lucide.createIcons();
}

function updateWishlistUI(items) {
  const count = items.length;
  document.querySelectorAll(".wishlist-badge").forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  });

  // Re-render product card wishlist buttons if present
  document.querySelectorAll(".wishlist-toggle-btn").forEach(btn => {
    const id = btn.getAttribute("data-wishlist-id");
    const isWishlisted = items.includes(id);
    const icon = btn.querySelector("i");
    if (isWishlisted) {
      btn.classList.add("text-rose-500", "border-rose-500/30");
      btn.classList.remove("text-zinc-400");
      if (icon) icon.classList.add("fill-rose-500");
    } else {
      btn.classList.remove("text-rose-500", "border-rose-500/30");
      btn.classList.add("text-zinc-400");
      if (icon) icon.classList.remove("fill-rose-500");
    }
  });
}

function renderWishlistDrawerItems() {
  const container = document.getElementById("wishlist-items-container");
  if (!container) return;

  const products = window.wishlistManager.getProducts();
  if (products.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center">
        <i data-lucide="heart" class="w-12 h-12 mx-auto text-zinc-600 mb-4"></i>
        <h4 class="text-base font-bold text-white mb-1">Your wishlist is empty</h4>
        <p class="text-xs text-zinc-400 mb-6">Save devices you love to check back anytime</p>
        <button class="btn-apple-primary text-xs" onclick="closeWishlistDrawer(); navigateTo('shop');">
          Explore Products
        </button>
      </div>
    `;
  } else {
    container.innerHTML = products.map(p => `
      <div class="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 flex gap-3 items-center">
        <img src="${p.images[0]}" alt="${p.name}" class="w-14 h-14 rounded-xl object-contain bg-zinc-950 p-1 flex-shrink-0">
        <div class="flex-1 min-w-0">
          <h5 class="text-xs font-bold text-white truncate">${p.name}</h5>
          <p class="text-xs font-extrabold text-sky-400 mt-0.5">${formatLKR(p.price)}</p>
          <div class="flex items-center gap-2 mt-2">
            <button class="text-[11px] font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-lg" onclick="openProductModal('${p.id}'); closeWishlistDrawer();">
              View
            </button>
            <button class="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1" onclick="window.cartManager.addItem(PRODUCTS.find(pr=>pr.id==='${p.id}')); window.wishlistManager.remove('${p.id}');">
              <i data-lucide="shopping-cart" class="w-3 h-3"></i> Move to Cart
            </button>
            <button class="text-zinc-500 hover:text-rose-400 ml-auto p-1" onclick="window.wishlistManager.remove('${p.id}'); renderWishlistDrawerItems();">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `).join("");
  }

  if (window.lucide) lucide.createIcons();
}

/* --------------------------------------------------------------------------
   SEARCH MODAL
   -------------------------------------------------------------------------- */

function initSearch() {
  const searchModal = document.getElementById("search-modal");
  const openSearchButtons = document.querySelectorAll("[data-action='open-search']");
  const closeSearchBtn = document.getElementById("close-search-btn");
  const searchInput = document.getElementById("search-query-input");
  const resultsContainer = document.getElementById("search-results-container");

  openSearchButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      searchModal?.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      setTimeout(() => searchInput?.focus(), 100);
    });
  });

  const closeSearch = () => {
    searchModal?.classList.add("hidden");
    document.body.style.overflow = "";
    if (searchInput) searchInput.value = "";
    if (resultsContainer) resultsContainer.innerHTML = "";
  };

  closeSearchBtn?.addEventListener("click", closeSearch);
  searchModal?.addEventListener("click", (e) => {
    if (e.target === searchModal) closeSearch();
  });

  // Live input search
  searchInput?.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      resultsContainer.innerHTML = `
        <div class="text-center py-10 text-zinc-500 text-xs">
          Type iPhone model name (e.g. "16 Pro Max", "AirPods", "MagSafe", "15")...
        </div>
      `;
      return;
    }

    const matches = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.specs && JSON.stringify(p.specs).toLowerCase().includes(q))
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center py-10">
          <p class="text-sm font-medium text-zinc-400">No results found for "${q}"</p>
          <p class="text-xs text-zinc-600 mt-1">Try searching for 16, 15, Pro, AirPods or Charger</p>
        </div>
      `;
    } else {
      resultsContainer.innerHTML = `
        <div class="space-y-2">
          ${matches.map(p => `
            <div class="p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 flex items-center gap-3 cursor-pointer transition-colors" onclick="openProductModal('${p.id}'); document.getElementById('search-modal').classList.add('hidden'); document.body.style.overflow='';">
              <img src="${p.images[0]}" alt="${p.name}" class="w-12 h-12 object-contain bg-zinc-950 rounded-xl p-1">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h5 class="text-xs font-bold text-white truncate">${p.name}</h5>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">${p.condition}</span>
                </div>
                <p class="text-xs text-zinc-400">${p.storageOptions ? p.storageOptions.join(', ') : 'Standard'}</p>
              </div>
              <div class="text-right">
                <div class="text-xs font-extrabold text-sky-400">${formatLKR(p.price)}</div>
                <div class="text-[10px] text-emerald-400">${p.stockStatus}</div>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    if (window.lucide) lucide.createIcons();
  });
}

/* --------------------------------------------------------------------------
   TRADE-IN CALCULATOR
   -------------------------------------------------------------------------- */

function initTradeIn() {
  const modelSelect = document.getElementById("trade-model-select");
  const storageSelect = document.getElementById("trade-storage-select");
  const conditionSelect = document.getElementById("trade-condition-select");
  const targetSelect = document.getElementById("trade-target-select");
  const estValDisplay = document.getElementById("trade-estimated-value");
  const balanceDisplay = document.getElementById("trade-balance-pay");
  const whatsappBtn = document.getElementById("trade-whatsapp-submit-btn");

  if (!modelSelect || !TRADE_IN_DATA) return;

  // Populate model dropdown
  modelSelect.innerHTML = TRADE_IN_DATA.models.map(m => 
    `<option value="${m.name}">${m.name}</option>`
  ).join("");

  // Populate target iPhone dropdown
  const targetPhones = PRODUCTS.filter(p => p.category === "iphones");
  targetSelect.innerHTML = targetPhones.map(p => 
    `<option value="${p.id}">${p.name} (${formatLKR(p.price)})</option>`
  ).join("");

  // Condition options
  conditionSelect.innerHTML = TRADE_IN_DATA.conditions.map(c => 
    `<option value="${c.id}">${c.label}</option>`
  ).join("");

  function updateTradeStorages() {
    const selModel = TRADE_IN_DATA.models.find(m => m.name === modelSelect.value);
    if (selModel) {
      storageSelect.innerHTML = selModel.storages.map(st => 
        `<option value="${st}">${st}</option>`
      ).join("");
    }
    recalculate();
  }

  function recalculate() {
    const currentModel = modelSelect.value;
    const currentStorage = storageSelect.value;
    const conditionId = conditionSelect.value;
    const targetProduct = PRODUCTS.find(p => p.id === targetSelect.value);

    const estValue = calculateTradeInValue(currentModel, currentStorage, conditionId);
    estValDisplay.textContent = formatLKR(estValue);

    if (targetProduct) {
      const netPay = Math.max(0, targetProduct.price - estValue);
      balanceDisplay.textContent = formatLKR(netPay);

      const condObj = TRADE_IN_DATA.conditions.find(c => c.id === conditionId);
      const waUrl = generateTradeInWhatsAppLink(
        currentModel,
        currentStorage,
        condObj ? condObj.label : conditionId,
        targetProduct,
        estValue,
        netPay
      );
      whatsappBtn.href = waUrl;
    }
  }

  modelSelect.addEventListener("change", updateTradeStorages);
  storageSelect.addEventListener("change", recalculate);
  conditionSelect.addEventListener("change", recalculate);
  targetSelect.addEventListener("change", recalculate);

  updateTradeStorages();
}

/* --------------------------------------------------------------------------
   COUNTDOWN TIMER
   -------------------------------------------------------------------------- */

function initCountdown() {
  const daysEl = document.getElementById("deal-days");
  const hoursEl = document.getElementById("deal-hours");
  const minsEl = document.getElementById("deal-mins");
  const secsEl = document.getElementById("deal-secs");

  if (!daysEl) return;

  // Set target to upcoming Sunday midnight
  const now = new Date();
  const target = new Date();
  target.setDate(now.getDate() + (7 - now.getDay()) % 7 || 7);
  target.setHours(23, 59, 59, 999);

  function update() {
    const current = new Date().getTime();
    const diff = target.getTime() - current;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, "0");
    hoursEl.textContent = String(h).padStart(2, "0");
    minsEl.textContent = String(m).padStart(2, "0");
    secsEl.textContent = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   CONTACT FORM
   -------------------------------------------------------------------------- */

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contact-name").value;
    const phone = document.getElementById("contact-phone").value;
    const email = document.getElementById("contact-email").value;
    const message = document.getElementById("contact-message").value;

    const waText = `*Inquiry from Theekzu Mobile Website*
----------------------------------------
*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Message:* ${message}`;

    const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`;
    
    // Show toast
    window.showToast("Opening WhatsApp with your inquiry...", "success");
    form.reset();

    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 600);
  });
}
