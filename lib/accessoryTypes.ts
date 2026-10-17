import type { Product } from "@/data/products";

export interface AccessoryTypeOption { value: string; label: string }

const defaults: AccessoryTypeOption[] = [
  { value: "chargers-cables", label: "Chargers & Cables" },
  { value: "cases-accessories", label: "Cases & Protection" },
];
const legacyLabels: Record<string, string> = { airpods: "AirPods", "apple-watch": "Apple Watch" };
const prefix = "accessory-type:";

export function normalizeAccessoryType(value: string): string {
  const clean = value.trim().replace(/\s+/g, " ").slice(0, 60);
  if (["all", "iphones", "accessories", "latest-iphones", "used-iphones"].includes(clean.toLowerCase())) return "";
  const known = defaults.find(option => [option.value, option.label].some(name => name.toLowerCase() === clean.toLowerCase()));
  const legacy = Object.entries(legacyLabels).find(([value, label]) => [value, label].some(name => name.toLowerCase() === clean.toLowerCase()));
  return known?.value || legacy?.[0] || clean;
}

export function accessoryTypeLabel(value: string): string {
  return defaults.find(option => option.value === value)?.label || legacyLabels[value] || value;
}

export function getAccessoryTypes(products: Pick<Product, "category" | "subcategory">[], extra: string[] = []): AccessoryTypeOption[] {
  const options = [...defaults];
  for (const raw of [...products.filter(p => p.category === "accessories").map(p => p.subcategory), ...extra]) {
    const value = normalizeAccessoryType(raw);
    if (value && !options.some(option => option.value.toLowerCase() === value.toLowerCase())) {
      options.push({ value, label: accessoryTypeLabel(value) });
    }
  }
  return options;
}

// Accessory products use the existing text series column for their type; iPhone series stay unchanged.
export function accessoryTypeSeries(value: string): string {
  return prefix + (normalizeAccessoryType(value) || defaults[0].value);
}

export function accessoryTypeFromSeries(series: unknown, fallback = "cases-accessories"): string {
  return typeof series === "string" && series.startsWith(prefix)
    ? normalizeAccessoryType(series.slice(prefix.length)) || fallback
    : fallback;
}
