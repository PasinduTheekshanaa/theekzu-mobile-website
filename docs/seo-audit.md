# SEO audit — 2026-11-03

## Existing setup
Next.js App Router. Homepage already has a single brand H1 (Theekzu Mobile), canonical, Open Graph, Twitter card and index/follow metadata. Root layout provides OnlineStore and WebSite JSON-LD. About/contact/footer already identify the brand; public category and product links exist. Category, About, Contact, Trade-In and Showroom pages already have metadata. Admin layout uses noindex; robots blocks admin/API routes without blocking Next assets or product images. Product pages use unique metadata and Product/Offer/BreadcrumbList JSON-LD without fabricated ratings. Condition query URLs canonicalize to the base product URL. Offers redirects permanently to Shop. Existing image compression and original fallback are preserved.

## Findings and changes
- Homepage title/description were accurate but broad: updated config/seo.ts to emphasize the official brand and used iPhones using requested wording. Existing homepage/root metadata and business descriptions consume these constants.
- Compare inherited homepage canonical/social identity: added app/compare/layout.tsx with its own title, description, canonical and Open Graph metadata.
- Compare missing from discovery sitemap: added to app/sitemap.ts.
- Product offers could advertise a zero price and use only the product stock string: app/product/[slug]/page.tsx now omits offers when the price is not positive and derives variant availability from enabled variant stock when variants exist.
- Existing OnlineStore/WebSite schema was retained; no duplicate Organization/schema block was introduced. No new invented business claims, addresses, ratings or reviews.

## Verification
Production build passed; TypeScript passed; existing 41 tests passed. Production server HTTP verification: homepage, Compare, iPhone 15 Pro Max, robots, sitemap and admin login return 200; Offers returns 308 to /shop. Homepage and tested public pages have one production-domain canonical and no noindex; admin login has noindex. JSON-LD blocks parse successfully: homepage OnlineStore/WebSite, product additionally Product/BreadcrumbList. Sitemap contains 47 URLs including Compare and products, no admin routes. Next normalizes the root canonical slash in rendered HTML; it identifies the same root URL.

No design/CSS, logo, image, inventory, description or database edits were made for this SEO task. No browser visual comparison, real mobile usability audit, external Rich Results Test, full-site broken-link crawl or field Core Web Vitals measurement was performed. Search Console account data was not accessed; the cause of missing branded impressions cannot be established from repository code alone. Product database accuracy remains the responsibility of catalog management.

## Deployment and Google Search Console
1. Deploy the reviewed changes to the existing Vercel production project.
2. Select/verify the URL-prefix property https://theekzu.vercel.app/ in Search Console using a supported ownership method. Do not copy a made-up verification token into the site.
3. Submit https://theekzu.vercel.app/sitemap.xml in Sitemaps.
4. Inspect the homepage, Compare and representative product URL. Use Test Live URL, check indexability and Google's chosen canonical, then Request Indexing.
5. Run Google Rich Results Test for product URLs and Schema Markup Validator for OnlineStore/WebSite; check actual offers and visible product facts.
6. Review Page indexing, Product snippets/Merchant listings where available and Core Web Vitals. Use PageSpeed Insights for lab and available field data.
7. Performance > Search results: reset filters, choose Web, inspect both queries and pages, and use a brand query regex such as theekzu|theekzu mobile. Allow reporting/re-crawl time; do not assume indexing guarantees impressions or ranking.

References: https://developers.google.com/search/docs/appearance/site-names and https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl . Google selects site names automatically; metadata/schema communicate a preference, not a guarantee.
