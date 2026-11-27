// PREPARATION ONLY. Not imported by next.config.mjs; redirects remain OFF.
// After explicit migration approval, merge these rules into redirects() or use
// equivalent Vercel host routing. Do not enable both approaches.
const destination = "https://www.theekzumobile.com";
export const legacyDomainRedirects = [
  "theekzu.vercel.app",
  "theekzumobile.vercel.app",
].flatMap(host => [
  {
    // This retired route already redirects to /shop. Avoid a two-hop migration.
    source: "/offers",
    has: [{ type: "host", value: host }],
    destination: `${destination}/shop`,
    permanent: true,
  },
  {
    source: "/:path*",
    has: [{ type: "host", value: host }],
    destination: `${destination}/:path*`,
    permanent: true,
  },
]);
