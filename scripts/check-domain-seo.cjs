// Read-only audit of a LOCAL production build; never publishes or writes data.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.argv[2] || 'http://localhost:3005';
const origin = 'https://www.theekzumobile.com';
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], decode(match[2])]));
async function get(path, headers) {
  const response = await fetch(base + path, { redirect: 'manual', headers, signal: AbortSignal.timeout(30000) });
  return { response, html: await response.text() };
}
async function main() {
  const { response: sitemapResponse, html: xml } = await get('/sitemap.xml');
  assert.equal(sitemapResponse.status, 200);
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]));
  assert.ok(urls.length >= 10);
  assert.equal(new Set(urls).size, urls.length);
  for (const url of urls) {
    const parsed = new URL(url);
    assert.equal(parsed.origin, origin);
    assert.ok(!/^\/(admin|api|offers)(\/|$)/.test(parsed.pathname));
    assert.equal(parsed.search, '');
    assert.ok(!parsed.pathname.includes('//'));
  }
  const checks = [];
  const titles = new Set();
  for (let offset = 0; offset < urls.length; offset += 4) {
    await Promise.all(urls.slice(offset, offset + 4).map(async url => {
      const path = new URL(url).pathname;
      const { response, html } = await get(path);
      assert.equal(response.status, 200, path);
      const links = [...html.matchAll(/<link\b[^>]*>/g)].map(match => attributes(match[0]));
      const canonicals = links.filter(link => link.rel === 'canonical');
      assert.equal(canonicals.length, 1, path);
      assert.equal(new URL(canonicals[0].href).pathname, path);
      assert.equal(new URL(canonicals[0].href).origin, origin);
      const tags = [...html.matchAll(/<meta\b[^>]*>/g)].map(match => attributes(match[0]));
      const meta = name => tags.find(tag => tag.name === name || tag.property === name)?.content;
      assert.equal(new URL(meta('og:url')).origin, origin, path);
      assert.equal(new URL(meta('og:url')).pathname, path, path);
      assert.equal(meta('og:site_name'), 'Theekzu Mobile', path);
      assert.ok(meta('description')?.includes('Theekzu Mobile'), path);
      assert.ok(meta('twitter:image'), path);
      assert.ok(!/noindex/.test(meta('robots') || ''), path);
      assert.ok(!/noindex/.test(response.headers.get('x-robots-tag') || ''), path);
      const title = decode(html.match(/<title>(.*?)<\/title>/)?.[1] || '');
      assert.ok(title.includes('Theekzu Mobile'), path);
      assert.ok(!titles.has(title), `Duplicate title: ${title}`);
      titles.add(title);
      const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
      assert.equal(schemas.filter(schema => schema['@type'] === 'WebSite').length, 1, path);
      assert.equal(schemas.filter(schema => schema['@type'] === 'OnlineStore').length, 1, path);
      const website = schemas.find(schema => schema['@type'] === 'WebSite');
      assert.equal(website.url, origin + '/');
      assert.equal(website.name, 'Theekzu Mobile');
      assert.equal(website.alternateName, 'Theekzu');
      assert.ok(!/https?:\/\/(theekzu|theekzumobile)\.vercel\.app/.test(JSON.stringify([canonicals, tags, schemas])), path);
      if (path.startsWith('/product/')) {
        const product = schemas.find(schema => schema['@type'] === 'Product');
        assert.ok(product, path);
        if (product.offers) assert.equal(product.offers.url, origin + path);
        assert.ok(schemas.some(schema => schema['@type'] === 'BreadcrumbList'), path);
      }
      checks.push({ path, status: response.status, canonical: canonicals[0].href, schemas: schemas.map(schema => schema['@type']) });
    }));
  }
  const { html: robots } = await get('/robots.txt');
  assert.ok(robots.includes('Sitemap: ' + origin + '/sitemap.xml'));
  assert.ok(robots.includes('Disallow: /admin') && robots.includes('Disallow: /api/'));
  const productPath = new URL(urls.find(url => url.includes('/product/'))).pathname;
  for (const path of [productPath + '?condition=Used', '/iphones?type=used', '/shop?stock=out-of-stock']) {
    const { html } = await get(path);
    const link = [...html.matchAll(/<link\b[^>]*>/g)].map(match => attributes(match[0])).find(link => link.rel === 'canonical');
    assert.equal(link.href, origin + path.split('?')[0]);
  }
  for (const path of ['/admin', '/admin/login', '/admin/products', '/admin/reviews', '/admin/viewer', '/admin/reset-password']) {
    const { html } = await get(path);
    const tags = [...html.matchAll(/<meta\b[^>]*>/g)].map(match => attributes(match[0]));
    assert.ok(tags.some(tag => tag.name === 'robots' && tag.content.includes('noindex')), path);
  }
  const offers = await get('/offers?source=bookmark');
  assert.equal(offers.response.status, 308);
  assert.equal(offers.response.headers.get('location'), '/shop');
  for (const host of ['theekzu.vercel.app', 'theekzumobile.vercel.app']) {
    const result = await get('/', { host });
    assert.equal(result.response.status, 200);
    assert.equal(result.response.headers.get('location'), null);
  }
  const result = { localOrigin: base, canonicalOrigin: origin, auditedPublicPages: urls.length, productPages: urls.filter(url => url.includes('/product/')).length, publicMetadataAndSchemas: 'passed', robots: 'passed', filteredPageCanonicals: 'passed', adminNoindex: 'passed', existingOffersRedirect: 'passed', migrationRedirects: 'inactive', pages: checks.sort((a, b) => a.path.localeCompare(b.path)) };
  fs.writeFileSync('docs/domain-check-results.json', JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ ...result, pages: undefined }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
