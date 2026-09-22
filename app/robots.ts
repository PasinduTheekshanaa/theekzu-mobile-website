import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://theekzu.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/favicon.ico"],
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/favicon.ico"],
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/favicon.ico", "/*.png", "/*.jpg", "/*.jpeg", "/*.webp", "/*.ico"],
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
