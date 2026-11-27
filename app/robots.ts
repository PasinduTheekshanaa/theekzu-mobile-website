import { siteUrl } from "@/config/site";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {

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
    sitemap: siteUrl(`/sitemap.xml`),
    host: siteUrl("/"),
  };
}
