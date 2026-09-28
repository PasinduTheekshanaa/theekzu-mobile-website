"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Heart } from "lucide-react";
import { Product } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { useProducts } from "@/context/ProductContext";
import { useWishlist } from "@/context/WishlistContext";
export const ProductCardComponent: React.FC<{product: Product}> = ({product}) => {
 const {getProductPrimaryImage,getLowestPrice}=useProducts();
 const {isWishlisted,toggleWishlist}=useWishlist();
 const image=getProductPrimaryImage(product)||product.images?.[0];
 const out=product.stock === "Out of Stock" || (!!product.variants?.length && product.variants.every(v=>Number(v.stock)<=0));
 const price=getLowestPrice(product);
 return <article className="studio-product-card">
  <div className="studio-card-top"><span>{product.condition === "Brand New" ? "BRAND NEW" : "PRE-OWNED"}</span><button onClick={()=>toggleWishlist(product.id)} aria-label={`${isWishlisted(product.id)?'Remove':'Save'} ${product.name} ${isWishlisted(product.id)?'from':'to'} wishlist`} aria-pressed={isWishlisted(product.id)}><Heart size={18} fill={isWishlisted(product.id)?'currentColor':'none'}/></button></div>
  <Link href={`/product/${product.slug}`} className="studio-card-image" aria-label={`View ${product.name}`}>{image && <Image src={image} alt={product.name} fill sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 28vw" className="object-contain"/>}</Link>
  <div className="studio-card-info"><div className="studio-swatches" aria-hidden="true">{product.colors?.slice(0,5).map(c=><span key={c.name} style={{background:c.hex||'#c5c5c5'}}/>)}</div><h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3><p className="studio-storage">{product.storageOptions?.join(' / ') || product.storage}</p><div className="studio-price-row"><div><span className="studio-from">FROM</span><strong>{formatCurrency(price)}</strong></div><Link className="studio-circle" href={`/product/${product.slug}`} aria-label={`Explore ${product.name}`}><ArrowUpRight size={20}/></Link></div><span className={`studio-stock ${out?'is-out':''}`}><i/>{out?'Check availability':'Available now'}</span></div>
 </article>;
};
export const ProductCard=React.memo(ProductCardComponent);
