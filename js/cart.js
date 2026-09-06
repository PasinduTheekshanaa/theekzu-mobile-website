/**
 * Theekzu Mobile - Cart Management & WhatsApp Order Integration
 */

class CartManager {
  constructor() {
    this.storageKey = "theekzu_cart_v1";
    this.cart = this.loadCart();
    this.listeners = [];
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from storage", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
      this.notify();
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.cart);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.cart));
  }

  addItem(product, storage = null, color = null, quantity = 1) {
    const selectedStorage = storage || (product.storageOptions && product.storageOptions[0]) || "Standard";
    const selectedColor = color || (product.colors && product.colors[0]?.name) || "Default";
    const offset = (product.storagePriceOffsets && product.storagePriceOffsets[selectedStorage]) || 0;
    const finalPrice = product.price + offset;

    const cartItemId = `${product.id}-${selectedStorage}-${selectedColor}`;
    const existingIndex = this.cart.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        cartItemId,
        productId: product.id,
        name: product.name,
        image: product.images[0],
        condition: product.condition,
        storage: selectedStorage,
        color: selectedColor,
        unitPrice: finalPrice,
        originalPrice: product.originalPrice ? product.originalPrice + offset : null,
        quantity: quantity
      });
    }

    this.saveCart();
    if (window.showToast) {
      window.showToast(`Added ${product.name} (${selectedStorage}) to cart!`, "success");
    }
  }

  removeItem(cartItemId) {
    this.cart = this.cart.filter(item => item.cartItemId !== cartItemId);
    this.saveCart();
    if (window.showToast) {
      window.showToast("Item removed from cart", "info");
    }
  }

  updateQuantity(cartItemId, delta) {
    const item = this.cart.find(item => item.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(cartItemId);
    } else {
      this.saveCart();
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  getTotalCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  // Generate pre-filled WhatsApp Checkout URL
  getWhatsAppCheckoutUrl(customerNotes = "") {
    if (this.cart.length === 0) return "#";

    const lines = [
      `*Order Inquiry - Theekzu Mobile*`,
      `==============================`,
      ``,
      `Hello Theekzu Mobile, I would like to place an order for the following items:`,
      ``
    ];

    this.cart.forEach((item, index) => {
      lines.push(
        `${index + 1}. *${item.name}*`,
        `   • Storage: ${item.storage}`,
        `   • Color: ${item.color}`,
        `   • Condition: ${item.condition}`,
        `   • Qty: ${item.quantity} × Rs. ${item.unitPrice.toLocaleString("en-LK")}`,
        `   • Subtotal: Rs. ${(item.unitPrice * item.quantity).toLocaleString("en-LK")}`,
        ``
      );
    });

    lines.push(
      `------------------------------`,
      `*Estimated Total:* Rs. ${this.getSubtotal().toLocaleString("en-LK")}`,
      `*Delivery:* Islandwide Express Delivery / Colombo Store Pickup`,
      ``
    );

    if (customerNotes && customerNotes.trim()) {
      lines.push(`*Customer Note:* ${customerNotes.trim()}`, ``);
    }

    lines.push(`Please let me know device availability and payment / bank transfer details. Thank you!`);

    const message = encodeURIComponent(lines.join("\n"));
    const phone = window.STORE_CONFIG?.whatsappNumber || "94771234567";
    return `https://wa.me/${phone}?text=${message}`;
  }

  // Generate single product WhatsApp inquiry
  static getSingleProductWhatsAppUrl(product, selectedStorage = null, selectedColor = null) {
    const storage = selectedStorage || (product.storageOptions && product.storageOptions[0]) || "";
    const color = selectedColor || (product.colors && product.colors[0]?.name) || "";
    const offset = (product.storagePriceOffsets && product.storagePriceOffsets[storage]) || 0;
    const currentPrice = product.price + offset;

    const message = `Hello Theekzu Mobile, I'm interested in the *${product.name}* (${storage}${color ? ', ' + color : ''}, ${product.condition}).
Current Price: Rs. ${currentPrice.toLocaleString('en-LK')}.
Can you please provide availability and the latest offer?`;

    const phone = window.STORE_CONFIG?.whatsappNumber || "94771234567";
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
}

// Global instance
window.cartManager = new CartManager();
