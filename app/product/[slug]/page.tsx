import React from "react";
import { notFound } from "next/navigation";
import { getServerCatalog } from "@/lib/serverCatalog";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products, error } = await getServerCatalog();
  if (error) throw new Error("Product information is temporarily unavailable.");
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return {
      title: "Product Not Found | Theekzu Mobile",
      robots: { index: false, follow: false },
    };
  }

  const primaryImage = product.images?.[0] || "/logo.png";
  const formattedPrice = `Rs. ${product.price.toLocaleString("en-LK")}`;
  const storageInfo =
    product.storageOptions && product.storageOptions.length > 0
      ? ` Available in ${product.storageOptions.join(", ")}.`
      : "";

  const pageTitle = `${product.name} Price in Sri Lanka | Theekzu Mobile`;
  const description = `Buy authentic ${product.name} (${product.condition}) in Sri Lanka starting from ${formattedPrice}.${storageInfo} Genuine warranty, islandwide delivery, and instant WhatsApp ordering at Theekzu Mobile.`;
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
          width: 800,
          height: 800,
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
      creator: "@theekzumobile",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const { products, error } = await getServerCatalog();
  if (error) throw new Error("Product information is temporarily unavailable.");
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const primaryImage = product.images?.[0] || "https://theekzu.vercel.app/logo.png";
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
    description: product.description || `Buy ${product.name} in Sri Lanka with Apple warranty at Theekzu Mobile.`,
    sku: product.variants?.[0]?.sku || `TM-${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "Apple",
    },
    category: product.category === "accessories" ? "Mobile Accessories" : "Smartphones",
    offers: {
      "@type": "Offer",
      url: `https://theekzu.vercel.app/product/${product.slug}`,
      priceCurrency: "LKR",
      price: product.price,

      itemCondition:
        product.condition === "Used"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetailClient product={product} related={related} />
    </div>
  );
}
