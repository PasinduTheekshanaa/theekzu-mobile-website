// Exact upload overrides: future uploads keep their original URLs.
const cutouts: Record<string, string> = {
  "https://bxkuacptrywwdzacloko.supabase.co/storage/v1/object/public/product-images/f9800863-1a7a-4e8e-b144-8e7d8720e718/1792331823636_ChatGPT_Image_Oct_18__2026__07_26_38_PM-4.png": "/products/mini-cutouts/iphone-12-mini-product-red.webp",
  "https://bxkuacptrywwdzacloko.supabase.co/storage/v1/object/public/product-images/f9800863-1a7a-4e8e-b144-8e7d8720e718/1792331815877_ChatGPT_Image_Oct_18__2026__07_26_35_PM-2.png": "/products/mini-cutouts/iphone-12-mini-blue.webp",
  "https://bxkuacptrywwdzacloko.supabase.co/storage/v1/object/public/product-images/f9800863-1a7a-4e8e-b144-8e7d8720e718/1792331830417_ChatGPT_Image_Oct_18__2026__07_26_39_PM-5.png": "/products/mini-cutouts/iphone-12-mini-white.webp",
  "https://bxkuacptrywwdzacloko.supabase.co/storage/v1/object/public/product-images/f9800863-1a7a-4e8e-b144-8e7d8720e718/1792331827326_ChatGPT_Image_Oct_18__2026__07_26_33_PM-1.png": "/products/mini-cutouts/iphone-12-mini-black.webp",
  "https://bxkuacptrywwdzacloko.supabase.co/storage/v1/object/public/product-images/f9800863-1a7a-4e8e-b144-8e7d8720e718/1792331820618_ChatGPT_Image_Oct_18__2026__07_26_37_PM-3.png": "/products/mini-cutouts/iphone-12-mini-green.webp",
  "https://bxkuacptrywwdzacloko.supabase.co/storage/v1/object/public/product-images/fa15f5d0-2e29-4f27-8811-a958272b0fec/1792311150103_ChatGPT_Image_Oct_18__2026__01_42_14_PM-5.png": "/products/mini-cutouts/iphone-13-mini-green.webp",
  "https://bxkuacptrywwdzacloko.supabase.co/storage/v1/object/public/product-images/fa15f5d0-2e29-4f27-8811-a958272b0fec/1792311172797_ChatGPT_Image_Oct_18__2026__01_42_12_PM-3.png": "/products/mini-cutouts/iphone-13-mini-blue.webp",
  "https://bxkuacptrywwdzacloko.supabase.co/storage/v1/object/public/product-images/fa15f5d0-2e29-4f27-8811-a958272b0fec/1792311177150_ChatGPT_Image_Oct_18__2026__01_42_10_PM-2.png": "/products/mini-cutouts/iphone-13-mini-starlight.webp",
  "https://bxkuacptrywwdzacloko.supabase.co/storage/v1/object/public/product-images/fa15f5d0-2e29-4f27-8811-a958272b0fec/1792311180573_ChatGPT_Image_Oct_18__2026__01_42_13_PM-4.png": "/products/mini-cutouts/iphone-13-mini-pink.webp",
  "https://bxkuacptrywwdzacloko.supabase.co/storage/v1/object/public/product-images/fa15f5d0-2e29-4f27-8811-a958272b0fec/1792311311538_ChatGPT_Image_Oct_18__2026__01_42_09_PM-1.png": "/products/mini-cutouts/iphone-13-mini-midnight.webp"
};

export function productImageAsset(url: string): string {
  return cutouts[url] || url;
}

// Admin deletion still targets the original storage object.
export function originalProductImage(url: string): string {
  return Object.keys(cutouts).find(source => cutouts[source] === url) || url;
}
