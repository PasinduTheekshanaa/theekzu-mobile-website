import React from "react";
import { notFound } from "next/navigation";
import { loadProductsFromSupabase } from "@/lib/supabaseService";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { products } = await loadProductsFromSupabase();
  const product = products.find((p) => p.slug === params.slug);
  if (!product) {
    return {
      title: "Product Not Found | Theekzu Mobile",
    };
  }

  const primaryImage = product.images?.[0] || "/logo.png";

  return {
    title: `${product.name} | Theekzu Mobile Sri Lanka`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Price in Sri Lanka | Theekzu Mobile`,
      description: product.description,
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { products } = await loadProductsFromSupabase();
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <ProductDetailClient product={product} related={related} />
    </div>
  );
}
