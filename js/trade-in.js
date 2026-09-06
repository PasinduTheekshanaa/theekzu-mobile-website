/**
 * Theekzu Mobile - Trade-In Value Calculator & WhatsApp Upgrade Inquiry
 */

const TRADE_IN_DATA = {
  models: [
    { name: "iPhone 15 Pro Max", base: 260000, storages: ["256GB", "512GB", "1TB"] },
    { name: "iPhone 15 Pro", base: 215000, storages: ["128GB", "256GB", "512GB", "1TB"] },
    { name: "iPhone 15 Plus", base: 185000, storages: ["128GB", "256GB", "512GB"] },
    { name: "iPhone 15", base: 170000, storages: ["128GB", "256GB", "512GB"] },
    { name: "iPhone 14 Pro Max", base: 195000, storages: ["128GB", "256GB", "512GB", "1TB"] },
    { name: "iPhone 14 Pro", base: 165000, storages: ["128GB", "256GB", "512GB", "1TB"] },
    { name: "iPhone 14 Plus", base: 145000, storages: ["128GB", "256GB", "512GB"] },
    { name: "iPhone 14", base: 135000, storages: ["128GB", "256GB", "512GB"] },
    { name: "iPhone 13 Pro Max", base: 155000, storages: ["128GB", "256GB", "512GB", "1TB"] },
    { name: "iPhone 13 Pro", base: 135000, storages: ["128GB", "256GB", "512GB", "1TB"] },
    { name: "iPhone 13", base: 110000, storages: ["128GB", "256GB", "512GB"] },
    { name: "iPhone 12 Pro Max", base: 120000, storages: ["128GB", "256GB", "512GB"] },
    { name: "iPhone 12 Pro", base: 105000, storages: ["128GB", "256GB", "512GB"] },
    { name: "iPhone 12", base: 85000, storages: ["64GB", "128GB", "256GB"] },
    { name: "iPhone 11 Pro Max", base: 88000, storages: ["64GB", "256GB", "512GB"] },
    { name: "iPhone 11", base: 65000, storages: ["64GB", "128GB", "256GB"] }
  ],
  conditions: [
    { id: "flawless", label: "Pristine / Flawless (Battery 90%+, No Scratches)", factor: 1.0 },
    { id: "good", label: "Good Condition (Normal minor micro-scratches, Battery 80%+)", factor: 0.88 },
    { id: "fair", label: "Fair / Heavy Wear (Noticeable dents/scratches, Original parts)", factor: 0.72 },
    { id: "damaged", label: "Display / Glass Cracked (Device still powers on)", factor: 0.45 }
  ],
  storageMultipliers: {
    "64GB": 0.92,
    "128GB": 1.0,
    "256GB": 1.10,
    "512GB": 1.22,
    "1TB": 1.35
  }
};

function calculateTradeInValue(modelName, storage, conditionId) {
  const model = TRADE_IN_DATA.models.find(m => m.name === modelName) || TRADE_IN_DATA.models[0];
  const storageMult = TRADE_IN_DATA.storageMultipliers[storage] || 1.0;
  const cond = TRADE_IN_DATA.conditions.find(c => c.id === conditionId) || TRADE_IN_DATA.conditions[0];

  const estimatedValue = Math.round((model.base * storageMult * cond.factor) / 500) * 500;
  return estimatedValue;
}

function generateTradeInWhatsAppLink(oldModel, storage, conditionLabel, targetProduct, estimatedVal, diffVal) {
  const phone = window.STORE_CONFIG?.whatsappNumber || "94771234567";
  const lines = [
    `*Trade-In Valuation Inquiry - Theekzu Mobile*`,
    `==========================================`,
    `Hello Theekzu Mobile, I would like to trade in my current phone:`,
    ``,
    `*Current Device:* ${oldModel} (${storage})`,
    `*Condition:* ${conditionLabel}`,
    `*Estimated Valuation:* Rs. ${estimatedVal.toLocaleString('en-LK')}`,
    ``,
    `*I want to upgrade to:* ${targetProduct ? targetProduct.name : 'iPhone 16 Pro Max'}`,
    targetProduct ? `*Target Phone Price:* Rs. ${targetProduct.price.toLocaleString('en-LK')}` : '',
    diffVal !== null ? `*Estimated Balance to Pay:* Rs. ${Math.max(0, diffVal).toLocaleString('en-LK')}` : '',
    ``,
    `Could you please verify device inspection and final trade-in quote? Thank you!`
  ].filter(Boolean);

  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
}

window.TRADE_IN_DATA = TRADE_IN_DATA;
window.calculateTradeInValue = calculateTradeInValue;
window.generateTradeInWhatsAppLink = generateTradeInWhatsAppLink;
