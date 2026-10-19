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
const db = { from(table) { const q = { then(ok, fail) { const reply = replies[table]; return Promise.resolve((typeof reply === 'function' ? reply() : reply) || { data: [], error: null }).then(ok, fail); } }; for (const method of ['select','eq','in','order','update','insert','single','maybeSingle','range','abortSignal','retry']) q[method] = (...args) => { calls.push({ table, method, args }); return q; }; return q; }, storage: { from() { return { getPublicUrl(p) { return { data: { publicUrl: p } }; } }; } } };
const clientFile = path.join(root, 'lib/supabaseClient.ts');
require.cache[clientFile] = { id: clientFile, filename: clientFile, loaded: true, exports: { supabase: db, isSupabaseConfigured: () => true, STORAGE_BUCKET: 'product-images' } };
const service = require('../lib/supabaseService.ts');
const { reconcileCart } = require('../lib/cartValidation.ts');
const row = { id: 'product-1', slug: 'test-phone', name: 'Phone', category: 'iphones', active: true };
const variants = [{ id: 'variant-1', stock: 3, price: 100, storage: '128GB', color: 'Black' }];

test('Mini cutouts replace only existing uploads and keep original URLs for admin deletion', () => {
 const { originalProductImage } = require('../lib/productImageAssets.ts');
 const source = 'https://bxkuacptrywwdzacloko.supabase.co/storage/v1/object/public/product-images/fa15f5d0-2e29-4f27-8811-a958272b0fec/1792311150103_ChatGPT_Image_Oct_18__2026__01_42_14_PM-5.png';
 const cutout = '/products/mini-cutouts/iphone-13-mini-green.webp';
 assert.equal(service.resolveStorageImageUrl(source), cutout);
 assert.equal(service.resolveStorageImageUrl(cutout), cutout);
 assert.equal(originalProductImage(cutout), source);
 const futureUpload = source.replace('1792311150103_', 'new-upload_');
 assert.equal(service.resolveStorageImageUrl(futureUpload), futureUpload);
 assert.equal(originalProductImage(futureUpload), futureUpload);
 const mapped = service.mapSupabaseToProduct(row, variants, [{ id: 'image-1', storage_path: source, image_url: source, is_primary: true }]);
 assert.ok(mapped.images.includes(cutout));
});

test('accessory types normalize names, deduplicate choices and retain built-in labels', () => {
 const types = require('../lib/accessoryTypes.ts');
 assert.equal(types.normalizeAccessoryType('  Earbuds   & Headphones '), 'Earbuds & Headphones');
 assert.equal(types.normalizeAccessoryType('CHARGERS & CABLES'), 'chargers-cables');
 assert.equal(types.normalizeAccessoryType('all'), '');
 const options = types.getAccessoryTypes([
  { category: 'accessories', subcategory: 'Earbuds & Headphones' },
  { category: 'accessories', subcategory: 'earbuds & headphones' },
  { category: 'iphones', subcategory: 'used-iphones' },
 ]);
 assert.equal(options.filter(o => o.value.toLowerCase() === 'earbuds & headphones').length, 1);
 assert.ok(options.some(o => o.label === 'Chargers & Cables'));
 assert.ok(!options.some(o => o.value === 'used-iphones'));
});

test('custom accessory types survive creation, reload and editing through existing Supabase columns', async () => {
 calls = []; replies = { products: { data: { id: 'new-product' }, error: null }, product_variants: { data: [], error: null } };
 const product = { ...service.mapSupabaseToProduct(row, variants), id: '8b4cbe14-0f64-4b50-9274-b542d86c118d', category: 'accessories', series: 'accessories', subcategory: 'Earbuds & Headphones' };
 assert.equal((await service.addProductToSupabase(product)).success, true);
 const inserted = calls.find(c => c.table === 'products' && c.method === 'insert').args[0];
 assert.equal(inserted.series, 'accessory-type:Earbuds & Headphones');
 const loaded = service.mapSupabaseToProduct({ ...row, ...inserted }, variants);
 assert.equal(loaded.subcategory, 'Earbuds & Headphones');
 assert.equal(loaded.series, 'accessories');
 replies.products = { data: [row], error: null }; calls = [];
 assert.equal((await service.updateProductInSupabase({ ...product, subcategory: 'Power Banks' })).success, true);
 const updated = calls.find(c => c.table === 'products' && c.method === 'update').args[0];
 assert.equal(service.mapSupabaseToProduct({ ...row, ...updated }, variants).subcategory, 'Power Banks');
 calls = [];
 assert.equal((await service.updateProductInSupabase({ ...product, category: 'iphones', series: '15' })).success, true);
 assert.equal(calls.find(c => c.method === 'update').args[0].series, '15');
});

test('legacy accessory products keep their original type until explicitly changed', () => {
 const { products } = require('../data/products.ts');
 for (const product of products.filter(p => p.category === 'accessories')) {
  assert.equal(service.mapSupabaseToProduct({ ...row, slug: product.slug, category: 'accessories', series: 'accessories' }, variants).subcategory, product.subcategory);
 }
});
test('legacy products retain their condition and dual-condition products survive loading', () => {
 const { getProductConditions } = require('../data/products.ts');
 assert.deepEqual(getProductConditions(service.mapSupabaseToProduct({ ...row, condition: 'Used' }, variants)), ['Used']);
 const product = service.mapSupabaseToProduct({ ...row, condition: 'Used', available_conditions: ['Used', 'Brand New'] }, variants);
 assert.deepEqual(getProductConditions(product), ['Brand New', 'Used']);
 assert.equal(product.conditionBadge, 'Brand New & Used');
 assert.deepEqual(getProductConditions({ condition: 'Used', availableConditions: [] }), ['Used']);
});

test('create and edit persist both enabled conditions', async () => {
 calls = []; replies = { products: { data: { id: 'new-product' }, error: null }, product_variants: { data: [], error: null } };
 const product = service.mapSupabaseToProduct({ ...row, id: '8b4cbe14-0f64-4b50-9274-b542d86c118d', condition: 'Brand New', available_conditions: ['Brand New', 'Used'] }, variants);
 assert.equal((await service.addProductToSupabase(product)).success, true);
 assert.deepEqual(calls.find(c => c.table === 'products' && c.method === 'insert').args[0].available_conditions, ['Brand New', 'Used']);
 replies.products = { data: [row], error: null };
 assert.equal((await service.updateProductInSupabase(product)).success, true);
 assert.deepEqual(calls.find(c => c.table === 'products' && c.method === 'update').args[0].available_conditions, ['Brand New', 'Used']);
});

test('disabled conditions cannot remain orderable in the cart', () => {
 const product = service.mapSupabaseToProduct({ ...row, condition: 'Brand New', available_conditions: ['Brand New'] }, variants);
 const item = { productId: row.id, variantId: 'variant-1', condition: 'Used', quantity: 1, price: 100 };
 assert.equal(reconcileCart([item], [product])[0].stockStatus, 'Out of Stock');
 assert.equal(reconcileCart([{ ...item, condition: 'Brand New' }], [product])[0].stockStatus, 'In Stock');
});

test('cart lines use separate prices and stock for each condition', () => {
 const product = service.mapSupabaseToProduct({ ...row, available_conditions: ['Brand New', 'Used'] }, [
  { ...variants[0], condition: 'Brand New' },
  { ...variants[0], id: 'used-variant', condition: 'Used', price: 60, stock: 1 },
 ]);
 const item = { productId: row.id, variantId: 'variant-1', quantity: 2, price: 100 };
 const cart = reconcileCart([{ ...item, condition: 'Brand New' }, { ...item, variantId: 'used-variant', condition: 'Used' }], [product]);
 assert.deepEqual(cart.map(item => item.quantity), [2, 1]);
 assert.equal(cart.every(item => item.stockStatus === 'In Stock'), true);
 assert.deepEqual(cart.map(item => item.price), [100, 60]);
 const soldOut = reconcileCart([{ ...item, quantity: 3, condition: 'Brand New' }, { ...item, condition: 'Used' }], [product]);
 assert.equal(soldOut[1].stockStatus, 'Out of Stock');
});

test('legacy prices remain tied to the original condition and cannot be used for the other condition', () => {
 const { getConditionVariants } = require('../data/products.ts');
 const product = service.mapSupabaseToProduct({ ...row, condition: 'Used', available_conditions: ['Brand New', 'Used'] }, variants);
 assert.equal(product.variants[0].condition, 'Used');
 assert.equal(getConditionVariants(product, 'Brand New').length, 0);
 assert.equal(getConditionVariants(product, 'Used')[0].price, 100);
 const wrong = reconcileCart([{ productId: row.id, variantId: 'variant-1', condition: 'Brand New', price: 100, quantity: 1 }], [product]);
 assert.equal(wrong[0].stockStatus, 'Out of Stock');
});

test('accessories always normalize to Brand New even with legacy Used product settings', () => {
 const { getProductConditions, getConditionVariants } = require('../data/products.ts');
 const product = service.mapSupabaseToProduct({ ...row, category: 'accessories', condition: 'Used', available_conditions: ['Used'] }, variants);
 assert.deepEqual(getProductConditions(product), ['Brand New']);
 assert.equal(product.condition, 'Brand New');
 assert.equal(getConditionVariants(product, 'Used').length, 0);
 assert.equal(product.variants[0].condition, 'Brand New');
});

test('disabled-condition stock and prices do not affect displayed availability', () => {
 const product = service.mapSupabaseToProduct({ ...row, available_conditions: ['Brand New'] }, [
  { ...variants[0], condition: 'Brand New', price: 200, stock: 0 },
  { ...variants[0], id: 'used-variant', condition: 'Used', price: 70, stock: 5 },
 ]);
 assert.equal(product.stock, 'Out of Stock');
 assert.equal(product.price, 200);
});

test('filtered condition cards retain that condition price rather than the cheapest other condition', () => {
 const { productForCondition } = require('../data/products.ts');
 const product = service.mapSupabaseToProduct({ ...row, available_conditions: ['Brand New', 'Used'] }, [
  { ...variants[0], condition: 'Brand New', price: 200 },
  { ...variants[0], id: 'used-variant', condition: 'Used', price: 70 },
 ]);
 assert.equal(productForCondition(product, 'Brand New').price, 200);
 assert.equal(productForCondition(product, 'Used').price, 70);
 assert.equal(productForCondition({ ...product, variants: product.variants.slice(1) }, 'Brand New').price, 0);
});

test('variant writes persist condition and scope updates to the parent product', async () => {
 calls = []; replies = { product_variants: { data: [{ id: 'saved' }], error: null } };
 const productId = '8b4cbe14-0f64-4b50-9274-b542d86c118d';
 const variant = { ...variants[0], id: 'a0ba879f-e4bc-40df-b9f7-1de883267da1', condition: 'Used' };
 assert.equal((await service.updateVariantInSupabase(productId, variant)).success, true);
 assert.equal(calls.find(c => c.method === 'update').args[0].condition, 'Used');
 assert.ok(calls.some(c => c.method === 'eq' && c.args[0] === 'product_id' && c.args[1] === productId));
 calls = [];
 assert.equal((await service.updateVariantInSupabase(productId, { ...variant, id: 'new-variant', condition: 'Brand New' })).success, true);
 assert.equal(calls.find(c => c.method === 'insert').args[0].condition, 'Brand New');
});
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

test('a transient catalog read retries and returns actual database products', async () => {
 let attempts = 0;
 replies = { products: () => ++attempts === 1 ? { data: null, status: 503, error: { message: 'temporary' } } : { data: [row], status: 200, error: null }, product_variants: { data: [{ ...variants[0], product_id: row.id }], error: null } };
 const result = await service.loadProductsFromSupabase();
 assert.equal(attempts, 2);
 assert.equal(result.source, 'Supabase');
 assert.equal(result.products[0].id, row.id);
 assert.equal(result.products[0].price, 100);
});

test('exhausted inventory reads fail closed after two attempts', async () => {
 let attempts = 0;
 replies = { products: { data: [row], error: null }, product_variants: () => { attempts++; return { data: null, status: 504, error: { message: 'timeout' } }; } };
 const result = await service.loadProductsFromSupabase();
 assert.equal(attempts, 2);
 assert.equal(result.source, 'error');
 assert.deepEqual(result.products, []);
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


test('review validation works without IP headers or a cooldown secret', async () => {
 const { POST } = require('../app/api/reviews/route.ts');
 const { NextRequest } = require('next/server');
 const names = ['NODE_ENV','VERCEL','SUPABASE_SERVICE_ROLE_KEY','NEXT_PUBLIC_SUPABASE_URL','REVIEW_RATE_LIMIT_SECRET','REVIEW_LOCAL_TESTING'];
 const previous = Object.fromEntries(names.map(n => [n,process.env[n]]));
 Object.assign(process.env,{NODE_ENV:'production',VERCEL:'0',SUPABASE_SERVICE_ROLE_KEY:'test-only',NEXT_PUBLIC_SUPABASE_URL:'https://example.supabase.co',REVIEW_RATE_LIMIT_SECRET:'test-only',REVIEW_LOCAL_TESTING:'true'});
 try {
  const request = origin => new NextRequest(origin+'/api/reviews',{method:'POST',headers:{origin,'x-forwarded-for':'127.0.0.1'},body:'{}'});
  assert.equal((await POST(request('http://localhost:3100'))).status,400);
  assert.equal((await POST(request('https://store.example'))).status,400);
  delete process.env.REVIEW_LOCAL_TESTING;
  delete process.env.REVIEW_RATE_LIMIT_SECRET;
  assert.equal((await POST(request('http://localhost:3100'))).status,400);
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

test('accessory models remain separate cart lines while sharing real variant stock', () => {
 const {needsIphoneModel,getIphoneModels}=require('../lib/accessoryModels.ts');
 const phones=[{...row,id:'p12',category:'iphones',name:'iPhone 12',stock:'Out of Stock'},{...row,id:'p13',category:'iphones',name:'iPhone 13'}];
 const accessory={...service.mapSupabaseToProduct(row,variants),id:'case',slug:'magsafe-clear-case',name:'MagSafe Clear Case',category:'accessories',stock:'In Stock'};
 assert.ok(needsIphoneModel(accessory));
 assert.deepEqual(getIphoneModels(phones),['iPhone 12','iPhone 13']);
 const base={productId:'case',variantId:accessory.variants[0].id,condition:'Brand New',price:100,quantity:2,storage:'128GB',color:'Black'};
 const checked=reconcileCart([{...base,cartItemId:'case-12',iphoneModel:'iPhone 12'},{...base,cartItemId:'case-13',iphoneModel:'iPhone 13'}],[accessory,...phones]);
 assert.deepEqual(checked.map(i=>[i.iphoneModel,i.quantity]),[['iPhone 12',2],['iPhone 13',1]]);
 for(const iphoneModel of [undefined,'not-a-listed-model']) {
  assert.equal(reconcileCart([{...base,iphoneModel}],[accessory,...phones])[0].stockStatus,'Out of Stock');
 }
});
