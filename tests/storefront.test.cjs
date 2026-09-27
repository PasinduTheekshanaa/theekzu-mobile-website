const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) { return resolve.call(this, name.startsWith('@/') ? path.join(root, name.slice(2)) : name, ...args); };
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, file);
let replies = {}; let calls = [];
const db = { from(table) { const q = { then(ok, fail) { return Promise.resolve(replies[table] || { data: [], error: null }).then(ok, fail); } }; for (const method of ['select','eq','in','order','update','insert','single','maybeSingle','range']) q[method] = (...args) => { calls.push({ table, method, args }); return q; }; return q; }, storage: { from() { return { getPublicUrl(p) { return { data: { publicUrl: p } }; } }; } } };
const clientFile = path.join(root, 'lib/supabaseClient.ts');
require.cache[clientFile] = { id: clientFile, filename: clientFile, loaded: true, exports: { supabase: db, isSupabaseConfigured: () => true, STORAGE_BUCKET: 'product-images' } };
const service = require('../lib/supabaseService.ts');
const { reconcileCart } = require('../lib/cartValidation.ts');
const row = { id: 'product-1', slug: 'test-phone', name: 'Phone', category: 'iphones', active: true };
const variants = [{ id: 'variant-1', stock: 3, price: 100, storage: '128GB', color: 'Black' }];
test('missing variants and manual override cannot advertise stock', () => {
 assert.equal(service.mapSupabaseToProduct(row, []).stock, 'Out of Stock');
 assert.equal(service.mapSupabaseToProduct({ ...row, in_stock: false }, variants).stock, 'Out of Stock');
 assert.equal(service.mapSupabaseToProduct(row, variants).stock, 'In Stock');
});
test('empty active catalog stays empty', async () => {
 replies = { products: { data: [], error: null } };
 const result = await service.loadProductsFromSupabase();
 assert.equal(result.source, 'Supabase'); assert.deepEqual(result.products, []);
});
test('variant query failure fails closed instead of fabricating stock', async () => {
 replies = { products: { data: [row], error: null }, product_variants: { data: null, error: { message: 'offline' } } };
 const result = await service.loadProductsFromSupabase();
 assert.equal(result.source, 'error'); assert.deepEqual(result.products, []);
});
test('stock toggle does not overwrite any variant quantities', async () => {
 calls = []; replies = { products: { data: { id: '1' }, error: null } };
 const result = await service.updateProductStockInSupabase('8b4cbe14-0f64-4b50-9274-b542d86c118d', false);
 assert.equal(result.success, true);
 assert.equal(calls.some(c => c.table === 'product_variants' && c.method === 'update'), false);
});
test('failed stock writes are not reported as successful', async () => {
 replies = { products: { data: null, error: { message: 'denied' } } };
 assert.equal((await service.updateProductStockInSupabase('8b4cbe14-0f64-4b50-9274-b542d86c118d', true)).success, false);
});
test('cart revalidates changed price and caps quantities', () => {
 const p = service.mapSupabaseToProduct(row, variants);
 const result = reconcileCart([{ productId: p.id, variantId: 'variant-1', price: 10, quantity: 9 }], [p]);
 assert.equal(result[0].quantity, 3); assert.equal(result[0].price, 100); assert.equal(result[0].stockStatus, 'In Stock');
});
test('removed variants and products cannot remain orderable', () => {
 const item = { productId: row.id, variantId: 'missing', quantity: 1, price: 10 };
 assert.equal(reconcileCart([item], [service.mapSupabaseToProduct(row, variants)])[0].stockStatus, 'Out of Stock');
 assert.equal(reconcileCart([item], [])[0].stockStatus, 'Out of Stock');
});
test('invalid inventory quantities never reach the database', async () => {
 calls = [];
 for (const stock of [-1, 1.5, NaN]) assert.equal((await service.updateVariantStockInSupabase('variant-1', stock)).success, false);
 assert.equal(calls.length, 0);
});

test('zero-stock product creation preserves zero and reports variant failures', async () => {
 calls = []; replies = { products: { data: { id: 'new-product' }, error: null }, product_variants: { data: null, error: { message: 'denied' } } };
 const product = service.mapSupabaseToProduct(row, [{ ...variants[0], stock: 0 }]);
 const result = await service.addProductToSupabase(product);
 const insert = calls.find(c => c.table === 'product_variants' && c.method === 'insert');
 assert.equal(insert.args[0][0].stock, 0); assert.equal(result.success, false);
});
test('display price and discount refer to the same available variant', () => {
 const p = service.mapSupabaseToProduct(row, [{ ...variants[0], price: 50, old_price: 70, stock: 0 }, { ...variants[0], price: 100, old_price: null, stock: 2 }]);
 assert.equal(p.price, 100); assert.equal(p.oldPrice, undefined); assert.equal(p.discount, undefined);
});

test('review endpoint rejects cross-origin requests and missing server configuration', async () => {
 const { POST } = require('../app/api/reviews/route.ts');
 const { NextRequest } = require('next/server');
 const oldKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
 delete process.env.SUPABASE_SERVICE_ROLE_KEY;
 try {
  const cross = await POST(new NextRequest('http://localhost:3100/api/reviews', {method:'POST', headers:{origin:'https://example.org'}, body:'{}'}));
  assert.equal(cross.status, 403);
  const unavailable = await POST(new NextRequest('http://localhost:3100/api/reviews', {method:'POST', headers:{origin:'http://localhost:3100'}, body:'{}'}));
  assert.equal(unavailable.status, 503);
 } finally { if (oldKey !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = oldKey; }
});


test('explicit localhost testing supports production without trusting forwarded headers', async () => {
 const { POST } = require('../app/api/reviews/route.ts');
 const { NextRequest } = require('next/server');
 const names = ['NODE_ENV','VERCEL','SUPABASE_SERVICE_ROLE_KEY','NEXT_PUBLIC_SUPABASE_URL','REVIEW_RATE_LIMIT_SECRET','REVIEW_LOCAL_TESTING'];
 const previous = Object.fromEntries(names.map(n => [n,process.env[n]]));
 Object.assign(process.env,{NODE_ENV:'production',VERCEL:'0',SUPABASE_SERVICE_ROLE_KEY:'test-only',NEXT_PUBLIC_SUPABASE_URL:'https://example.supabase.co',REVIEW_RATE_LIMIT_SECRET:'test-only',REVIEW_LOCAL_TESTING:'true'});
 try {
  const request = origin => new NextRequest(origin+'/api/reviews',{method:'POST',headers:{origin,'x-forwarded-for':'127.0.0.1'},body:'{}'});
  assert.equal((await POST(request('http://localhost:3100'))).status,400);
  assert.equal((await POST(request('https://store.example'))).status,503);
  delete process.env.REVIEW_LOCAL_TESTING;
  assert.equal((await POST(request('http://localhost:3100'))).status,503);
 } finally { for (const n of names) { if(previous[n] === undefined) delete process.env[n]; else process.env[n]=previous[n]; } }
});

test('review photo validation rejects unsupported, disguised and oversized files', async () => {
 const { prepareReviewImage } = require('../lib/reviewImage.ts');
 await assert.rejects(prepareReviewImage(new File(['<svg/>'],'a.svg',{type:'image/svg+xml'})));
 await assert.rejects(prepareReviewImage(new File(['not an image'],'a.png',{type:'image/png'})));
 await assert.rejects(prepareReviewImage(new File([Buffer.alloc(3*1024*1024+1)],'a.jpg',{type:'image/jpeg'})));
});
test('review photo processing bounds dimensions and strips metadata', async () => {
 const sharp = require('sharp'); const { prepareReviewImage } = require('../lib/reviewImage.ts');
 const input = await sharp({create:{width:1600,height:800,channels:3,background:'#2299aa'}}).jpeg().withMetadata().toBuffer();
 const output = await prepareReviewImage(new File([input],'photo.jpg',{type:'image/jpeg'}));
 const meta = await sharp(output).metadata();
 assert.equal(meta.format,'webp'); assert.equal(meta.width,1200); assert.equal(meta.height,600); assert.equal(meta.exif,undefined);
});
