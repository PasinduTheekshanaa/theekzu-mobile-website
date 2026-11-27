import { siteUrl } from "@/config/site";
import { MetadataRoute } from "next";
import { getServerCatalog } from "@/lib/serverCatalog";


export const dynamic = "force-dynamic";
export const revalidate = 3600; // revalidate at most every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl(`/reviews`), changeFrequency: "weekly", priority: 0.7 },
    { url: siteUrl(`/compare`), changeFrequency: "weekly", priority: 0.7 },
    {
      url: siteUrl(`/`),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: siteUrl(`/shop`),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: siteUrl(`/iphones`),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: siteUrl(`/accessories`),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: siteUrl(`/trade-in`),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: siteUrl(`/about`),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: siteUrl(`/contact`),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: siteUrl(`/showroom`),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const { products: productList, error } = await getServerCatalog();
  if (error) throw new Error("Sitemap data is temporarily unavailable.");

  const productRoutes: MetadataRoute.Sitemap = Array.from(new Map(productList.filter(p => p.slug && !/[/?#]/.test(p.slug) && ![".", ".."].includes(p.slug)).map(p => [p.slug, p])).values()).map((p) => ({
    url: siteUrl(`/product/${encodeURIComponent(p.slug)}`),
    lastModified: p.updatedAt && Number.isFinite(Date.parse(p.updatedAt)) ? new Date(p.updatedAt) : undefined,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
