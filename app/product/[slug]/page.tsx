import React from "react";
import { getProductConditions, getProductConditionLabel } from "@/data/products";
import { notFound } from "next/navigation";
import { getServerCatalog } from "@/lib/serverCatalog";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductRecovery } from "./ProductRecovery";
import type { Metadata } from "next";

interface Props {
  searchParams?: Promise<{ condition?: string }>;
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products, error } = await getServerCatalog();
  if (error) return {
    title: { absolute: "Product | Theekzu Mobile" },
    alternates: { canonical: `https://theekzu.vercel.app/product/${encodeURIComponent(slug)}` },
    openGraph: { title: "Product | Theekzu Mobile", url: `https://theekzu.vercel.app/product/${encodeURIComponent(slug)}`, siteName: "Theekzu Mobile" },
  };
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return {
      title: { absolute: "Product Not Found | Theekzu Mobile" },
      robots: { index: false, follow: false },
    };
  }

  const primaryImage = product.images?.[0] || "/brand-logo.png";
  const formattedPrice = `Rs. ${product.price.toLocaleString("en-LK")}`;
  const storageInfo =
    product.storageOptions && product.storageOptions.length > 0
      ? ` Available in ${product.storageOptions.join(", ")}.`
      : "";

  const pageTitle = `${product.name} Price in Sri Lanka | Theekzu Mobile`;
  const description = `Explore ${product.name} (${getProductConditionLabel(product)}) at Theekzu Mobile in Sri Lanka${product.price > 0 ? ` from ${formattedPrice}` : ""}.${storageInfo} 6-month Theekzu Mobile warranty, islandwide delivery and WhatsApp ordering.`;
  const canonicalUrl = `https://theekzu.vercel.app/product/${product.slug}`;

  return {
    title: {
      absolute: pageTitle,
    },
    description,
    keywords: [
      product.name,
      `${product.name} Sri Lanka`,
      `${product.name} price Sri Lanka`,
      `Buy ${product.name} Sri Lanka`,
      "Theekzu Mobile",
      "Apple iPhone Sri Lanka",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: "Theekzu Mobile",
      images: [
        {
          url: primaryImage,
          alt: `${product.name} - Theekzu Mobile Sri Lanka`,
        },
      ],
      locale: "en_LK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const preferred = (await searchParams)?.condition;
  const initialCondition = preferred === "Brand New" || preferred === "Used" ? preferred : undefined;
  const { products, error } = await getServerCatalog();
  if (error) return <ProductRecovery slug={slug} initialCondition={initialCondition} />;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const primaryImage = product.images?.[0] || "https://theekzu.vercel.app/brand-logo.png";
  const fullImageUrl = primaryImage.startsWith("http")
    ? primaryImage
    : `https://theekzu.vercel.app${primaryImage}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image:
      product.images && product.images.length > 0
        ? product.images.map((img) => (img.startsWith("http") ? img : `https://theekzu.vercel.app${img}`))
        : [fullImageUrl],
    description: product.description || `Buy ${product.name} in Sri Lanka with a 6-month warranty from Theekzu Mobile.`,
    sku: product.variants?.[0]?.sku || `TM-${product.slug}`,
    brand: product.category === "iphones" ? {
      "@type": "Brand",
      name: "Apple",
    } : undefined,
    category: product.category === "accessories" ? "Mobile Accessories" : "Smartphones",
    offers: {
      "@type": "Offer",
      url: `https://theekzu.vercel.app/product/${product.slug}`,
      priceCurrency: "LKR",
      price: product.price,

      itemCondition:
        getProductConditions(product).length > 1 ? undefined : product.condition === "Used"
          ? "https://schema.org/UsedCondition"
          : "https://schema.org/NewCondition",
      availability:
        product.stock === "In Stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "OnlineStore",
        name: "Theekzu Mobile",
        url: "https://theekzu.vercel.app",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://theekzu.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category === "accessories" ? "Accessories" : "iPhones",
        item:
          product.category === "accessories"
            ? "https://theekzu.vercel.app/accessories"
            : "https://theekzu.vercel.app/iphones",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://theekzu.vercel.app/product/${product.slug}`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 sm:pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetailClient key={`${product.id}:${initialCondition || product.condition}`} product={product} related={related} initialCondition={initialCondition} />
    </div>
  );
}
