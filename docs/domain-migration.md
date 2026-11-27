# Theekzu Mobile custom-domain migration

Prepared locally on 28 November 2026. **Not committed, pushed or deployed. No migration redirect has been activated.** Review the production preview at <http://localhost:3005/> before approving any launch.

Primary origin: **https://www.theekzumobile.com**. Legacy aliases: `theekzu.vercel.app` and `theekzumobile.vercel.app`. All existing domains must stay attached to the same Vercel project.

## Audit before changes

- The existing root `metadataBase`, public canonicals, Open Graph URLs, sitemap, robots and JSON-LD contained the old `theekzu.vercel.app` origin across 15 route files.
- The root already emitted one `WebSite` entity and one `OnlineStore` entity. These were reused; no second organization or website was added. Existing brand names, real contact details and social profile links were retained.
- Product metadata and structured data came from the existing server catalog. Product/stock/pricing logic did not need changing.
- Internal navigation uses relative URLs. Product and cart WhatsApp messages contain product/order information rather than a hard-coded website domain. Social links point to their external platforms. No runtime sharing URL needed rewriting beyond the SEO metadata.
- No website-origin environment variable was found in the repository's environment template or local configuration. Supabase API/storage URLs identify the Supabase project, not the website, and must remain unchanged.
- Admin authentication is Supabase email/password. The reset email's redirect is generated from `window.location.origin` plus `/admin/reset-password`. There is no application OAuth callback route to rename.
- The browser Supabase client uses origin-scoped persistent storage. Reviews POST requests enforce the current request's origin, rather than an old-domain allow-list. No domain-specific application cookie or CORS setting needed rewriting.
- `/offers` already returns a permanent redirect to `/shop`. Admin/API routes were already excluded from crawling; admin pages already emit `noindex`.

Read-only live checks found the following **before deployment**:

| Request | Observed result |
| --- | --- |
| `https://www.theekzumobile.com/` | HTTP 200; still advertised the old homepage canonical |
| `https://theekzu.vercel.app/` | HTTP 200; old homepage canonical |
| `https://theekzumobile.vercel.app/` | HTTP 307 to `https://theekzu.vercel.app/` |

The secondary domain's existing redirect must be replaced with a direct permanent redirect to the new primary domain at the approved launch. Otherwise it would introduce a redirect chain. These remote settings have not been changed.

## SEO changes made

1. Added `config/site.ts` as the single production-origin source. `siteUrl()` builds absolute URLs on the new primary domain, translates both legacy self-hosted asset URLs, and preserves external image hosts and their query strings. Preview/localhost hostnames cannot accidentally become the public canonical origin.
2. Updated root `metadataBase`, author URL, homepage canonical and Open Graph URL. Updated canonicals and Open Graph URLs for all 10 public page routes and every active product. Filter/condition query URLs retain the clean page canonical.
3. Set the homepage title to **Theekzu Mobile | Premium iPhones & Accessories in Sri Lanka** and description to **Explore premium iPhones, certified used iPhones, genuine accessories and trusted service at Theekzu Mobile. Browse our latest products and order online in Sri Lanka.** These reflect offerings already described by the site. The same values are used in homepage Open Graph/Twitter metadata and the store description.
4. Improved Shop, iPhones and Accessories descriptions using natural descriptions of the current catalog. Removed unsupported Apple Watch/AirPods and “best prices” claims from Shop metadata. The Accessories title now describes iPhone accessories without implying every accessory brand is Apple. Removed unsubstantiated Colombo targeting from metadata keywords. The root keyword list is concise; Google does not use the meta-keywords tag as a ranking signal.
5. Kept `openGraph.siteName` as **Theekzu Mobile**. Relative Open Graph and Twitter images now resolve against the new `metadataBase`; explicit Twitter metadata was added to Compare and Reviews to prevent inherited homepage share titles. Corrected reviewed brand-logo metadata dimensions to the existing asset's actual 1024 × 1024 size. No media file was modified.
6. Migrated the existing `WebSite` and `OnlineStore` URLs and IDs to `/#website` and `/#organization` on the new origin. Kept `name: Theekzu Mobile` and `alternateName: Theekzu`; preserved actual contact/social data. Product sellers now reference the existing organization ID. Product image URLs, Offer URLs and breadcrumb URLs use the new origin, preserving existing prices, availability and conditions. Other page breadcrumbs were migrated too.
7. Migrated all sitemap URLs and the robots sitemap/host declarations. The sitemap contains the 10 public canonical pages plus active catalog products, deduplicates product slugs and rejects malformed paths. Invalid product update dates are omitted instead of emitting invalid dates. Catalog failures still fail explicitly rather than publishing invented or empty product data. Admin/API/retired routes and query variants are excluded.
8. Added regression tests and a read-only production HTML audit. Marked the two earlier SEO reports as historical so their old-domain instructions are not mistaken for the current launch plan.

All metadata/schema changes render on the server. There are no new hidden keyword blocks, fabricated reviews/addresses/social profiles, UI/layout/CSS changes, catalog edits, price edits or authentication rewrites. Existing components, images, videos, animations, themes, cart/wishlist, stock management and review uploads remain in place.

The brand, country, products and services already appear naturally in visible homepage/category copy. No additional repeated keyword text was necessary. Technical SEO can improve clarity and consolidation; it cannot guarantee rankings or directly control Google's spelling corrections. [Google's site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) describes migration processing and potential fluctuations.

## Automated tests

- `npm.cmd test`: **47 tests passed**, including five domain-migration regression tests and the existing stock/cart/review/auth boundary tests.

## TypeScript check

- `npx.cmd tsc --noEmit --incremental false`: **passed**.

## Production build check

- Production build with `THEEKZU_BUILD_DIR=.next-domain-check`: **passed**, including compilation, type validation and route generation. The isolated local build output is excluded locally from Git. Build-generated changes to `next-env.d.ts` and `tsconfig.json` were restored; they are not part of the migration.
- Production preview is running at <http://localhost:3005/>. To reproduce in two PowerShell terminals:

```powershell
$env:THEEKZU_BUILD_DIR = '.next-domain-check'
npm.cmd run build
npm.cmd run start -- --port 3005
```

After a future isolated build, check for Next-generated type configuration changes before including them in a commit.

## Lint check

`CI=1 npm.cmd run lint` could not complete: the project has no ESLint configuration/dependencies and `next lint` prompts for initial setup (Strict/Base/Cancel). No lint rules or dependency changes were added as part of this migration. Lint is **blocked**, not passed.

## Metadata, sitemap and structured-data checks

`node scripts/check-domain-seo.cjs http://localhost:3005` passed against the production server. [Machine-readable results](./domain-check-results.json) list every audited URL.

- **48 public URLs**, including **38 product pages**, returned HTTP 200 with one correct canonical, unique branded titles, descriptions, correct Open Graph URLs and share images, and no `noindex` directive.
- Each page had one top-level `WebSite` and one `OnlineStore` JSON-LD entity, with correct brand and new URLs. Product and breadcrumb JSON-LD parsed successfully. No legacy website URLs remained in audited metadata or JSON-LD.
- Sitemap entries all used the primary HTTPS origin and resolved to indexable pages. Robots retained admin/API restrictions and advertised the new sitemap.
- Representative filtered/condition URLs canonicalized to their clean page paths. Six admin routes retained `noindex`. The existing `/offers` redirect remained intact.
- Requests using either legacy Host header still returned the local page without migration redirects. The prepared migration redirect module is not imported by the runtime configuration.

## Existing functionality checks

Browser smoke checks confirmed search results and product-detail navigation, catalog-backed product options, cart add/remove (test item removed afterward), WhatsApp order link construction, review loading with customer photos, navigation and the admin sign-in screen. Desktop 1440 × 900 and mobile 390 × 844 views were checked without horizontal page overflow; temporary viewport overrides were reset.

Source review confirmed all media, styles, themes, wishlist, admin, upload, authentication, checkout and API implementations are unchanged. Existing automated tests cover additional behavior. This does **not** claim a complete live transaction test: authenticated admin CRUD/login, password-reset email delivery, new review submissions/uploads, real WhatsApp messages/payments and remote dashboard settings were not exercised. Those owner smoke tests remain part of launch validation; no customer data was changed.

## Required Vercel/environment review

- Keep the new primary and both legacy domains connected to the **existing** project; retain DNS/TLS configuration. No Hostinger/domain replacement or new project is required.
- This patch uses a fixed canonical origin and requires **no new website-URL environment variable**. Do not change `NEXT_PUBLIC_SUPABASE_URL` to the website domain. Preserve existing Supabase keys and server-only secrets, and do not add a `NEXT_PUBLIC_` prefix to server secrets.
- The Vercel environment dashboard was not accessed. If deployment-only variables, integrations, analytics, email templates or webhooks contain the old website URL, review their purpose before updating them; keep legitimate authentication and verification compatibility. Public environment changes require a fresh build. No secret values need to be copied into this report.
- Preview/deployment protection headers are controlled by Vercel, outside local HTML generation. On the approved production deployment, confirm there is no `X-Robots-Tag: noindex` or authentication protection on the public primary domain. Keep previews protected.

## Required Supabase/dashboard review

In the same Supabase project, open **Authentication → URL Configuration**:

1. Set the production **Site URL** to `https://www.theekzumobile.com/` when coordinating the approved launch.
2. Add the exact redirect URL `https://www.theekzumobile.com/admin/reset-password`. Retain existing localhost and legacy reset URLs during the transition so already-issued recovery links and local development continue to work. Prefer exact production paths over broad wildcards.
3. Test an owner-requested password-reset email and admin login on the new host. The application already generates the recovery destination from the current host, so no code replacement is required.

Do not change the Supabase project API/storage origin or its OAuth provider callback merely because the storefront domain changes. There is no OAuth sign-in flow in the current application. If an independently configured provider/custom auth domain exists outside this codebase, inspect that integration separately. These requirements follow [Supabase's redirect URL documentation](https://supabase.com/docs/guides/auth/redirect-urls).

Browser auth sessions, cart and wishlist storage are scoped to each website origin. Customers/admins may start with an empty local cart/wishlist and need to sign in again on the new host; do not transfer tokens in query strings. No application cross-domain cookie migration is needed. Same-origin review API validation works with the new hostname without weakening CORS. If external Formspree allowed-domain restrictions are enabled, add the new primary host there; those remote settings were not inspected.

## Permanent redirects — prepared, OFF pending approval

[domain-redirects.example.mjs](./domain-redirects.example.mjs) is a dormant host-specific Next.js redirect configuration. It is deliberately absent from `next.config.mjs`. It prepares **308** permanent redirects from each old host directly to the primary domain, preserves paths and query parameters, and handles the retired `/offers` path directly as `/shop` to avoid an extra hop. It cannot match the new primary hostname. [Next.js redirect documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects) explains permanent redirects and automatic query forwarding.

After local review and **explicit approval**:

1. Complete the Supabase/domain-setting review above. Deploy the reviewed SEO changes to the existing project and verify the new primary site, SSL, core flows, metadata, robots and sitemap before activating legacy redirects.
2. Choose **one** routing approach:
   - Import `legacyDomainRedirects` from `./docs/domain-redirects.example.mjs` in `next.config.mjs` and add `async redirects() { return legacyDomainRedirects; }` to the existing configuration. Preserve all existing image/distDir settings. Both old aliases must serve this project instead of being intercepted by the existing secondary-to-old-primary domain redirect.
   - Or configure equivalent host/path-aware permanent 301/308 redirects in Vercel. Send both aliases **directly** to `https://www.theekzumobile.com`, preserve paths/query strings and implement the `/offers` exception if required. Use [Vercel's domain routing documentation](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting). Do not enable duplicate rules at multiple layers.
3. Replace the currently observed secondary-domain 307 to the old primary. Do not leave a secondary → old primary → new primary chain. Keep all aliases attached; do not delete the old Vercel domains. If the non-www custom domain is attached, ensure its existing redirect goes directly to www and never back to an old Vercel host.
4. Test each old host with `/`, `/product/iphone-14-pro-max?condition=Used&utm_source=migration-test`, `/shop?stock=in-stock`, `/offers?source=bookmark` and an unknown path. Verify one permanent hop to the expected new URL (unknown pages should stay 404), retained query parameters, and no loop/extra canonical-host hop. Confirm the primary itself never redirects to a legacy alias. Test recovery links privately; URL fragments are handled by browsers rather than sent to servers.
5. Rerun the read-only SEO checks against the approved production deployment, then run the Google Search Console steps below. The audit script's final legacy-Host check intentionally expects redirects to be inactive locally; use real old-domain HTTP checks for the post-launch redirect verification.

If a problem arises, disable the newly enabled redirect rules and restore the previous domain routing while investigating; keep the domains attached. Retain permanent redirects for at least a year after a successful move, preferably longer for old bookmarks/backlinks, as recommended in [Google's migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

## Google Search Console migration

After the approved deployment and permanent redirects are verified:

1. Keep ownership verification for both old sites and the already verified new domain. Select/add the appropriate `https://www.theekzumobile.com/` URL-prefix property if needed by the Change of Address workflow.
2. Submit **https://www.theekzumobile.com/sitemap.xml** in the new property's Sitemaps report. Inspect the homepage, category URLs and representative products; check Google's selected canonical and use a live test before requesting indexing.
3. Use **Settings → Change of Address** for each eligible old URL-prefix property, selecting the new primary destination. Follow Google's prechecks rather than submitting a change before redirects work. [Google's Change of Address instructions](https://support.google.com/webmasters/answer/9370220) explain property ownership, eligibility and timing.
4. Monitor Page Indexing, sitemap processing, crawl/redirect errors, selected canonicals and branded-query performance on old/new properties. Update public business/profile links you control to the new domain when ready. Do not remove old verification or block legacy crawling during the move.

Public endpoints after the approved deployment:

- [Sitemap](https://www.theekzumobile.com/sitemap.xml)
- [Robots](https://www.theekzumobile.com/robots.txt)

## Complete modified-file manifest

| File | Change |
| --- | --- |
| `config/site.ts` (new) | Central canonical origin and legacy-aware SEO URL helper |
| `config/seo.ts` | Homepage title/description |
| `app/layout.tsx` | Global metadata, brand keyword cleanup, existing WebSite/OnlineStore migration |
| `app/page.tsx` | Homepage canonical/Open Graph migration |
| `app/about/page.tsx` | Metadata/breadcrumb migration, image metadata dimensions, location keyword cleanup |
| `app/accessories/layout.tsx` | Canonical/share metadata migration and truthful accessories title/description |
| `app/compare/layout.tsx` | Canonical/Open Graph migration and page-specific Twitter metadata |
| `app/contact/layout.tsx` | Metadata/breadcrumb migration and image metadata dimensions |
| `app/iphones/layout.tsx` | Category descriptions, canonical/share/breadcrumb migration |
| `app/product/[slug]/page.tsx` | Dynamic metadata, product images, Offer/seller/breadcrumb URLs |
| `app/reviews/page.tsx` | Canonical/Open Graph migration and page-specific Twitter metadata |
| `app/shop/layout.tsx` | Category descriptions, canonical/share/breadcrumb migration |
| `app/showroom/layout.tsx` | Showroom layout canonical/Open Graph migration |
| `app/showroom/page.tsx` | Showroom page metadata/breadcrumb migration and image metadata dimensions |
| `app/trade-in/page.tsx` | Metadata/breadcrumb migration and image metadata dimensions |
| `app/robots.ts` | Primary-domain sitemap/host, existing restrictions preserved |
| `app/sitemap.ts` | Primary URLs, valid/deduplicated catalog paths and dates |
| `tests/domain-migration.test.cjs` (new) | Five migration regression tests |
| `scripts/check-domain-seo.cjs` (new) | Read-only production HTML/robots/sitemap audit |
| `docs/domain-check-results.json` (new) | Per-page local production audit results |
| `docs/domain-redirects.example.mjs` (new) | Dormant permanent redirect preparation |
| `docs/domain-migration.md` (new) | Audit, changes, results and gated launch instructions |
| `docs/seo-audit.md` | Historical report notice linking here |
| `docs/seo-review.md` | Historical report notice linking here |

No package/lockfile, environment/secret, CSS, visual component, catalog or runtime redirect configuration was changed. A local-only `.git/info/exclude` entry prevents the isolated build output appearing in Git; it is not a tracked website change.

## Remaining issues / owner actions

Deployment and redirect activation remain pending review/approval. The live site will continue advertising the earlier SEO configuration until deployment. Lint setup is missing. Supabase URL allow-list, deployment-only configuration and actual authenticated/email/transaction flows need owner verification. The secondary domain currently has a temporary redirect to the old primary; replace it during the approved launch. No cloud setting has been changed and no Search Console migration request has been submitted.
