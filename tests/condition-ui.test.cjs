const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) { return resolve.call(this, name.startsWith('@/') ? path.join(root, name.slice(2)) : name, ...args); };
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText, file);
let product;
const context = () => ({
 getProductBySlug: () => product, getRelatedProducts: () => [], getProductPrimaryImage: () => '/logo.png', getProductColorImage: () => '', customImages: {}, isLiveDatabase: true,
 updateVariant: async () => ({ success: true }), addVariant: async () => true, deleteVariant: async () => ({ success: true }),
});
const load = Module._load;
Module._load = function(name, parent, ...args) {
 if (name === '@/context/ProductContext') return { useProducts: context };
 if (name === '@/context/CartContext') return { useCart: () => ({ addItem() {} }) };
 if (name === '@/context/WishlistContext') return { useWishlist: () => ({ isWishlisted: () => false, toggleWishlist() {} }) };
 if (name === 'next/link') return ({ children, ...props }) => React.createElement('a', props, children);
 return load.call(this, name, parent, ...args);
};
const { products } = require('../data/products.ts');
const { ProductDetailClient } = require('../app/product/[slug]/ProductDetailClient.tsx');
const { ConditionVariantManager } = require('../components/admin/ConditionVariantManager.tsx');
const { formatCurrency } = require('../lib/formatCurrency.ts');
const makePhone = () => ({ ...products.find(p => p.category === 'iphones'), images: ['/logo.png'], id: 'fixture-phone', condition: 'Brand New', availableConditions: ['Brand New','Used'], storageOptions: ['128GB'], colors: [{ name: 'Black', hex: '#000000' }], stock: 'In Stock', variants: [
 { id: 'new', condition: 'Brand New', storage: '128GB', color: 'Black', price: 200000, stock: 3, sku: 'NEW-SKU' },
 { id: 'used', condition: 'Used', storage: '128GB', color: 'Black', price: 125000, stock: 1, sku: 'USED-SKU' },
] });

test('customer detail renders the selected condition price, stock and WhatsApp order', () => {
 product = makePhone();
 for (const [condition, price, sku, stock] of [['Brand New',200000,'NEW-SKU',3],['Used',125000,'USED-SKU',1]]) {
  const html = renderToStaticMarkup(React.createElement(ProductDetailClient, { product, related: [], initialCondition: condition }));
  assert.ok(html.includes(formatCurrency(price)));
  assert.ok(html.includes(sku));
  assert.ok(html.includes(`In Stock (${stock} available)`));
  assert.ok(html.includes(encodeURIComponent(formatCurrency(price))));
 }
});
test('a missing condition price cannot borrow another condition price', () => {
 product = makePhone(); product.variants = product.variants.slice(1);
 const html = renderToStaticMarkup(React.createElement(ProductDetailClient, { product, related: [], initialCondition: 'Brand New' }));
 assert.ok(html.includes('Price not available'));
 assert.ok(!html.includes(formatCurrency(125000)));
 assert.ok(html.includes('Out of Stock'));
});
test('admin manager separates phone conditions and keeps accessories in one Brand New section', () => {
 product = makePhone();
 let html = renderToStaticMarkup(React.createElement(ConditionVariantManager, { product, notify() {} }));
 assert.ok(html.includes('aria-label="Brand New variants"'));
 assert.ok(html.includes('aria-label="Used variants"'));
 assert.ok(html.includes('NEW-SKU') && html.includes('USED-SKU'));
 product = { ...product, category: 'accessories', condition: 'Brand New', availableConditions: ['Brand New'], variants: [product.variants[0]] };
 html = renderToStaticMarkup(React.createElement(ConditionVariantManager, { product, notify() {} }));
 assert.ok(html.includes('aria-label="Brand New variants"'));
 assert.ok(!html.includes('aria-label="Used variants"'));
 assert.ok(html.includes('Accessories are always Brand New.'));
});
