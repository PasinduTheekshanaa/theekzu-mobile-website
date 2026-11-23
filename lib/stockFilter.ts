import { Product, getEnabledVariants } from '@/data/products';
export function matchesStock(product: Product, selection: {inStock:boolean;outOfStock:boolean}): boolean {
 if(selection.inStock === selection.outOfStock)return true;
 const available = product.stock !== 'Out of Stock' && (product.variants.length ? getEnabledVariants(product).some(v=>Number(v.stock)>0) : product.stock === 'In Stock');
 return selection.inStock ? available : !available;
}
