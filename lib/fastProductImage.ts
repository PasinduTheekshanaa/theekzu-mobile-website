import images from '@/data/optimizedProductImages.json';
export function fastProductImage(src: string, width = 840): string {
 const hash = (images as Record<string,string>)[src];
 return hash ? `/products/optimized/${hash}-${width <= 256 ? 256 : 840}.webp` : src;
}
