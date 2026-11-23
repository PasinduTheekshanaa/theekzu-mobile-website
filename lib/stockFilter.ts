import { Product, getEnabledVariants } from '@/data/products';
export type StockSelection = 'all' | 'in-stock' | 'out-of-stock';
export function isProductInStock(product: Product): boolean {
 const variants = getEnabledVariants(product);
 return product.stock !== 'Out of Stock' && (!variants.length || variants.some(v => Number(v.stock) > 0));
}
export function matchesStock(product: Product, selection: StockSelection): boolean {
 return selection === 'all' || (selection === 'in-stock' ? isProductInStock(product) : !isProductInStock(product));
}
