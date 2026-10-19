import type { Product } from "@/data/products";

export function needsIphoneModel(product: Product): boolean {
  if (product.category !== "accessories") return false;
  const text = `${product.slug} ${product.name} ${product.model}`.toLowerCase();
  return (/mag[\s-]*safe/.test(text) && /case|back[\s-]*cover/.test(text)) ||
    /tempered[\s-]*glass|protection[\s-]*glass|screen[\s-]*protector/.test(text);
}

// Include every listed iPhone, including models currently out of stock.
export function getIphoneModels(products: Product[]): string[] {
  return [...new Set(products.filter(p => p.category === "iphones").map(p => p.name))];
}

export function validAccessoryModel(product: Product, model: string | undefined, products: Product[]): boolean {
  return !needsIphoneModel(product) || Boolean(model && getIphoneModels(products).includes(model));
}
