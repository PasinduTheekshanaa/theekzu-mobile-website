const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) { return resolve.call(this, name.startsWith('@/') ? path.join(root, name.slice(2)) : name, ...args); };
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, file);

let inserts = [], uploads = [], removed = [], writeError = null, catalogResult, savedCatalog, cachedCallback;
const fakeDb = {
 from(table) { assert.equal(table, 'customer_reviews'); return { async insert(row) { inserts.push(row); return { error: writeError }; } }; },
 storage: { from(bucket) { assert.equal(bucket, 'review-images'); return {
  async upload(name, bytes, opts) { uploads.push({ name, bytes, opts }); return { error: null }; },
  async remove(names) { removed.push(...names); return { error: null }; }
 }; } }
};
const load = Module._load;
Module._load = function(name, ...args) {
 if (name === '@supabase/supabase-js') return { createClient: () => fakeDb };
 if (name === 'next/cache') return { unstable_cache(fn) { cachedCallback = fn; return async () => { const value = await fn(); savedCatalog = value; return value; }; } };
 if (name === 'react') return { ...load.call(this, name, ...args), cache: fn => fn };
 return load.call(this, name, ...args);
};
const { POST } = require('../app/api/reviews/route.ts');
const { NextRequest } = require('next/server');
const request = (body) => new NextRequest('https://store.example/api/reviews', { method: 'POST', headers: { origin: 'https://store.example', 'content-type': 'application/json', 'x-vercel-forwarded-for': '192.0.2.5' }, body: JSON.stringify(body) });
const valid = { customerName: 'Test Customer', rating: 5, review: 'A valid review for automated testing only.' };

test('successive reviews on the same network are all pending, regardless of supplied status', async () => {
 const previous = { ...process.env };
 process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
 process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only';
 delete process.env.REVIEW_RATE_LIMIT_SECRET;
 inserts = [];
 try {
  for (let i = 0; i < 5; i++) {
   const res = await POST(request({ ...valid, status: 'approved', review: valid.review + i }));
   assert.equal(res.status, 200);
   assert.deepEqual(await res.json(), { success: true });
  }
  assert.equal(inserts.length, 5);
  assert.ok(inserts.every(row => row.status === 'pending' && row.image_path === null));
 } finally { for (const key of ['NEXT_PUBLIC_SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','REVIEW_RATE_LIMIT_SECRET']) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key]; } }
});

test('photo reviews retain moderation and failed writes clean up the uploaded photo', async () => {
 const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL, previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
 process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'; process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only';
 const sharp = require('sharp');
 const bytes = await sharp({ create: { width: 40, height: 40, channels: 3, background: '#2299aa' } }).png().toBuffer();
 try {
  for (const fail of [false, true]) {
   const form = new FormData();
   for (const [key, value] of Object.entries(valid)) form.set(key, String(value));
   form.set('image', new File([bytes], 'test.png', { type: 'image/png' }));
   writeError = fail ? { code: 'TEST_FAILURE' } : null;
   const res = await POST(new NextRequest('https://store.example/api/reviews', { method: 'POST', headers: { origin: 'https://store.example' }, body: form }));
   assert.equal(res.status, fail ? 503 : 200);
   const uploaded = uploads.at(-1);
   assert.equal(uploaded.opts.contentType, 'image/webp');
   assert.equal(inserts.at(-1).image_path, uploaded.name);
   assert.equal(inserts.at(-1).status, 'pending');
   if (fail) assert.ok(removed.includes(uploaded.name));
  }
 } finally {
  writeError = null;
  if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
  if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
 }
});

test('read retries recover network failures, stop after two attempts and do not retry permission errors', async () => {
 const { readCatalogQuery } = require('../lib/catalogRead.ts');
 let attempts = 0;
 const result = await readCatalogQuery(async () => { if (++attempts === 1) throw new TypeError('fetch failed'); return { error: null, status: 200 }; });
 assert.equal(result.status, 200); assert.equal(attempts, 2);
 attempts = 0;
 await assert.rejects(readCatalogQuery(async () => { attempts++; throw new DOMException('timeout', 'TimeoutError'); }), /timeout/);
 assert.equal(attempts, 2);
 attempts = 0;
 const denied = await readCatalogQuery(async () => { attempts++; return { status: 403, error: { message: 'denied' } }; });
 assert.equal(denied.status, 403); assert.equal(attempts, 1);
});

test('failed cache refresh throws before replacing a successful catalog; cold failure remains recoverable', async () => {
 const serviceFile = path.join(root, 'lib/supabaseService.ts');
 require.cache[serviceFile] = { id: serviceFile, filename: serviceFile, loaded: true, exports: { loadProductsFromSupabase: async () => catalogResult } };
 const { getServerCatalog } = require('../lib/serverCatalog.ts');
 catalogResult = { products: [{ id: 'live-product' }], imagesMap: {}, source: 'Supabase' };
 const good = await getServerCatalog();
 assert.equal(savedCatalog, good);
 catalogResult = { products: [], imagesMap: {}, source: 'error', error: 'offline' };
 await assert.rejects(cachedCallback(), /Catalog read failed/);
 assert.equal(savedCatalog, good);
 const cold = await getServerCatalog();
 assert.equal(cold.source, 'error'); assert.deepEqual(cold.products, []);
 catalogResult = { products: [], imagesMap: {}, source: 'Supabase' };
 assert.equal((await getServerCatalog()).source, 'Supabase');
 assert.deepEqual(savedCatalog.products, []);
});
