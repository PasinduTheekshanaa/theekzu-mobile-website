import React from "react";
import { notFound } from "next/navigation";
import { products, getProductBySlug, getRelatedProducts } from "@/data/products";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Metadata } from "next";
import { storeConfig } from "@/config/store";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Product Not Found | Theekzu Mobile",
    };
  }

  return {
    title: `${product.name} | Theekzu Mobile Sri Lanka`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Price in Sri Lanka | Theekzu Mobile`,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <ProductDetailClient product={product} related={related} />
    </div>
  );
}
