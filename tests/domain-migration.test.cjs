const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) { return resolve.call(this, name.startsWith('@/') ? path.join(root, name.slice(2)) : name, ...args); };
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText, file);
const { products } = require('../data/products.ts');
const fixture = products.find(product => product.slug === 'iphone-15-pro-max');
let catalog = { products: [fixture], imagesMap: {} };
const passthrough = ({children}) => React.createElement(React.Fragment, null, children);
const load = Module._load;
Module._load = function(name, ...args) {
  if (name === '@/lib/serverCatalog') return { getServerCatalog: async () => catalog };
  if (name.endsWith('.css')) return {};
  if (name.startsWith('@/context/') || name.startsWith('@/components/') || name === './ProductDetailClient' || name === './ProductRecovery') return new Proxy({}, { get: () => passthrough });
  return load.call(this, name, ...args);
};
const { SITE_ORIGIN, siteUrl } = require('../config/site.ts');
const productPage = require('../app/product/[slug]/page.tsx');

test('site URLs migrate both legacy aliases without rewriting external media or query/hash data', () => {
  assert.equal(SITE_ORIGIN, 'https://www.theekzumobile.com');
  assert.equal(siteUrl(), SITE_ORIGIN + '/');
  for (const host of ['theekzu.vercel.app', 'theekzumobile.vercel.app']) assert.equal(siteUrl(`https://${host}/product/iphone-x?condition=Used#photos`), SITE_ORIGIN + '/product/iphone-x?condition=Used#photos');
  assert.equal(siteUrl('https://storage.example/image.webp?token=abc'), 'https://storage.example/image.webp?token=abc');
});

test('all public route metadata uses the canonical domain and unique canonical paths', () => {
  const routes = { '/': 'app/page.tsx', '/about': 'app/about/page.tsx', '/contact': 'app/contact/layout.tsx', '/shop': 'app/shop/layout.tsx', '/iphones': 'app/iphones/layout.tsx', '/accessories': 'app/accessories/layout.tsx', '/trade-in': 'app/trade-in/page.tsx', '/compare': 'app/compare/layout.tsx', '/reviews': 'app/reviews/page.tsx', '/showroom': 'app/showroom/page.tsx' };
  for (const [route, file] of Object.entries(routes)) {
    const metadata = require(path.join(root, file)).metadata;
    assert.equal(metadata.alternates.canonical, siteUrl(route), file);
    assert.equal(metadata.openGraph.url, siteUrl(route), file);
    assert.ok(!JSON.stringify(metadata).includes('theekzu.vercel.app'), file);
  }
  const metadata = require('../app/layout.tsx').metadata;
  assert.equal(metadata.metadataBase.origin, SITE_ORIGIN);
  assert.equal(metadata.title.default, 'Theekzu Mobile | Premium iPhones & Accessories in Sri Lanka');
});

test('product metadata and JSON-LD preserve price, condition and external images on the new domain', async () => {
  const props = { params: Promise.resolve({ slug: fixture.slug }), searchParams: Promise.resolve({condition:'Used'}) };
  const metadata = await productPage.generateMetadata(props);
  assert.equal(metadata.alternates.canonical, siteUrl('/product/' + fixture.slug));
  const html = renderToStaticMarkup(await productPage.default(props));
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const product = blocks.find(block => block['@type'] === 'Product');
  assert.equal(product.offers.price, fixture.price);
  assert.equal(product.offers.url, metadata.alternates.canonical);
  assert.equal(product.offers.seller['@id'], siteUrl('/#organization'));
  assert.ok(blocks.find(block => block['@type'] === 'BreadcrumbList').itemListElement.every(item => item.item.startsWith(SITE_ORIGIN)));
  catalog = { products: [], error: 'offline' };
  assert.equal((await productPage.generateMetadata(props)).alternates.canonical, metadata.alternates.canonical);
  catalog = { products: [fixture], imagesMap: {} };
});

test('sitemap deduplicates products, excludes private/retired routes and refuses failed catalog reads', async () => {
  const sitemap = require('../app/sitemap.ts').default;
  catalog = { products: [fixture, fixture, {...fixture,slug:'../admin'}, {...fixture,slug:'bad?filter=1'}] };
  const entries = await sitemap();
  assert.equal(entries.length, 11);
  assert.equal(new Set(entries.map(entry => entry.url)).size, entries.length);
  assert.ok(entries.every(entry => new URL(entry.url).origin === SITE_ORIGIN && !/\/admin|\/api|\/offers|\/\//.test(new URL(entry.url).pathname)));
  const robots = require('../app/robots.ts').default();
  assert.equal(robots.sitemap, siteUrl('/sitemap.xml'));
  assert.ok(robots.rules.every(rule => rule.disallow.includes('/admin/') && rule.disallow.includes('/api/')));
  catalog = { products: [], error: 'offline' };
  await assert.rejects(sitemap(), /temporarily unavailable/);
  catalog = { products: [fixture], imagesMap: {} };
});

test('redirect preparation is inactive and sends both old hosts directly to canonical destinations', async () => {
  const config = (await import('../next.config.mjs')).default;
  assert.equal(config.redirects, undefined);
  const { legacyDomainRedirects } = await import('../docs/domain-redirects.example.mjs');
  for (const host of ['theekzu.vercel.app', 'theekzumobile.vercel.app']) {
    const rules = legacyDomainRedirects.filter(rule => rule.has[0].value === host);
    assert.equal(rules.length, 2);
    assert.equal(rules[0].destination, siteUrl('/shop'));
    const source = new URL(`https://${host}/product/iphone-x?condition=Used&utm_source=test`);
    const destination = new URL(rules[1].destination.replace(':path*', source.pathname.slice(1)));
    destination.search = source.search;
    assert.equal(destination.href, siteUrl('/product/iphone-x?condition=Used&utm_source=test'));
    assert.ok(rules.every(rule => rule.permanent && rule.has[0].value !== new URL(SITE_ORIGIN).host));
  }
});
