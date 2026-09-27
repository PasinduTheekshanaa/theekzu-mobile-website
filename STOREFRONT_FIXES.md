# Storefront fixes and database rollout

## Local changes
- Catalog errors and empty results never show the sample catalog; variant/image failures fail closed.
- Product-level availability pauses/resumes sales without rewriting inventory quantities. Zero stays zero.
- Cart quantities and prices are reconciled against current variants; checkout reads Supabase again before opening WhatsApp.
- One responsive robot view with real stock labels, an empty state, frame-limited pointer animation and reduced-motion support.
- Reviews show only approved real submissions; no fabricated ratings or purchase verification. Public reviews are paginated.
- Product/layout/metadata share one request-scoped catalog snapshot. Variant and image requests run concurrently; realtime bursts are debounced.
- Sitemap uses stored product timestamps. Product structured data uses the available variant price, escapes script delimiters, and does not invent price expiry dates. The unsupported SearchAction was removed.

## Database rollout and deployment
The configured live database responds to products, variants and images reads. On inspection it did not contain customer_reviews or products.stock/stock_status/in_stock.

1. Completed on live project bxkuacptrywwdzacloko: supabase_customer_reviews.sql and supabase/migrations/20260927_storefront_hardening.sql applied together in a transaction.
2. Keep at least one known administrator listed by auth user UUID in public.admin_users. An empty admin table now grants no admin privileges.
3. Set server-only SUPABASE_SERVICE_ROLE_KEY and REVIEW_RATE_LIMIT_SECRET in the deployment environment. The latter should be a securely generated random value. Never use NEXT_PUBLIC_ for either secret.
4. Review submission trusts Vercel's x-vercel-forwarded-for header only on Vercel; localhost development shares one test rate-limit identity. Other production hosts need an explicit trusted proxy adapter before submissions are enabled.
5. Deploy the app, then verify approved review reads, pending submission, moderation and stock edits using test records in a non-production environment. Do not seed the catalog to apply schema changes.

The migration restricts catalog/review/image writes to existing admins; preserves inventory; adds review rate limits and summary RPCs; includes product_images in Realtime; and updates product timestamps after variant changes.
Existing negative/null inventory is not silently rewritten: the new constraint is NOT VALID for historical rows and should be validated after an inventory audit.

## Validation
Run npm test, then npm run build. Tests cover empty/error catalogs, stock overrides, failed writes, zero quantity creation, changed-price cart checks and removed variants.
Public-read checks do not verify authenticated write policies. A successful local build does not apply the SQL migration or deploy the website.

Vercel header contract: https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for

## Completed validation on 2026-09-27
- Next.js upgraded to 15.5.26; PostCSS resolved to 8.5.28 through a scoped override; sharp installed. npm install audit: 0 vulnerabilities.
- npm test: 12 passing regression tests.
- npm run build: passed with Next.js 15.5.26.
- Local PostgreSQL (PGlite) migration validation: six checks passed, including repeat execution, non-admin write denial, private pending reviews, summary aggregation, rate limiting and inventory preservation. This is not a test against the production Supabase configuration.
- Mobile widths 320px and 390px checked; narrow-screen menu fixed. Available/unavailable product variant states verified in the browser.
- Optimized robot response: HTTP 200, image/webp, 53,872 bytes at 640px (original JPEG: 724,091 bytes). This is an asset check, not a Lighthouse score.
- Product route and sitemap HTTP checks: 200. Product HTML contains one H1 and parseable Product/BreadcrumbList JSON-LD.
- Live database migration completed. Existing backend secret and rate-limit salt configured in ignored local .env.local. Local server restarted. Deployment environment still needs its own server secrets; website has not been deployed.
- Security advisory checked: https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36

Review follow-up: REVIEW_LOCAL_TESTING=true permits localhost production previews to use a shared rate-limit bucket. Never enable this flag on deployment. The local server-only key and rate-limit salt are configured, and the live migration is complete. Regression tests: 12 passing.

## Live review verification
- Browser form submission saved successfully as pending.
- Anonymous reads cannot see pending reviews.
- Immediate repeat submission returned HTTP 429.
- Clearly labelled integration-test record was marked rejected, never published. Local test cooldown was reset so the user can submit now.
- Public summary RPC and new product stock columns verified successfully.
