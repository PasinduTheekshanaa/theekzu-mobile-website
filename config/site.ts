// The canonical production origin is deliberate: preview/localhost hosts must
// never leak into public metadata, structured data or the production sitemap.
export const SITE_ORIGIN = "https://www.theekzumobile.com";
export const SITE_URL = `${SITE_ORIGIN}/`;
export const LEGACY_SITE_HOSTS = ["theekzu.vercel.app", "theekzumobile.vercel.app"] as const;

/** Absolute SEO URL; preserve external media hosts and update old site assets. */
export function siteUrl(path = "/"): string {
  const url = new URL(path, SITE_URL);
  if ((LEGACY_SITE_HOSTS as readonly string[]).includes(url.hostname)) {
    url.protocol = "https:";
    url.host = new URL(SITE_ORIGIN).host;
  }
  return url.href;
}
