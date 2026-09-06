export interface StoreConfig {
  businessName: string;
  tagline: string;
  phone: string;
  phoneRaw: string;
  whatsappNumber: string;
  email: string;
  location: string;
  businessHours: string;
  currency: string;
  currencySymbol: string;
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
  };
}

export const storeConfig: StoreConfig = {
  businessName: "Theekzu Mobile",
  tagline: "Premium iPhones. Trusted Service.",
  phone: "0740245749",
  phoneRaw: "0740245749",
  whatsappNumber: "94740245749",
  email: "pasindutheekshana21@gmail.com",
  location: "Online Store – Sri Lanka",
  businessHours: "8.00 AM – 8.00 PM",
  currency: "LKR",
  currencySymbol: "Rs.",
  social: {
    facebook: "https://www.facebook.com/share/1EF6rMFmEN/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/theekzu_mobile?igsi=MThtZGd1OTM3dmJiMg==",
    tiktok: "https://www.tiktok.com/@theekzu?_r=1&_t=ZS-99Tf73AGf1l",
    whatsapp: "https://wa.me/94740245749",
  },
};

/**
 * Format numeric price into Sri Lankan Rupee format (e.g. Rs. 429,900)
 */
export function formatLKR(amount: number): string {
  return `${storeConfig.currencySymbol} ${amount.toLocaleString("en-LK")}`;
}

/**
 * Generate a pre-filled direct WhatsApp message URL
 */
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
