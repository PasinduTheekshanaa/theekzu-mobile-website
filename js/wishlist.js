/**
 * Theekzu Mobile - Wishlist Management
 */

class WishlistManager {
  constructor() {
    this.storageKey = "theekzu_wishlist_v1";
    this.items = this.loadWishlist();
    this.listeners = [];
  }

  loadWishlist() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load wishlist", e);
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      this.notify();
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.items);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.items));
  }

  isWishlisted(productId) {
    return this.items.includes(productId);
  }

  toggle(productId) {
    const exists = this.items.includes(productId);
    const product = (window.PRODUCTS || []).find(p => p.id === productId);
    const name = product ? product.name : "Product";

    if (exists) {
      this.items = this.items.filter(id => id !== productId);
      if (window.showToast) window.showToast(`Removed ${name} from Wishlist`, "info");
    } else {
      this.items.push(productId);
      if (window.showToast) window.showToast(`Added ${name} to Wishlist!`, "success");
    }

    this.saveWishlist();
    return !exists;
  }

  remove(productId) {
    this.items = this.items.filter(id => id !== productId);
    this.saveWishlist();
  }

  getCount() {
    return this.items.length;
  }

  getProducts() {
    const all = window.PRODUCTS || [];
    return all.filter(p => this.items.includes(p.id));
  }
}

window.wishlistManager = new WishlistManager();
