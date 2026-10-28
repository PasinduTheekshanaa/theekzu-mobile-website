const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync(require.resolve('../lib/scrollLock.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const mod = { exports: {} };
new Function('exports', source)(mod.exports);
const { acquireScrollLock } = mod.exports;

test('overlapping overlays keep the page locked until the last closes and restore prior styles', () => {
  global.document = { documentElement: { style: { overflow: 'auto' } }, body: { style: { overflow: '' } } };
  const menu = acquireScrollLock();
  const search = acquireScrollLock();
  menu();
  assert.equal(document.documentElement.style.overflow, 'hidden');
  assert.equal(document.body.style.overflow, 'hidden');
  menu(); // A duplicate cleanup cannot release another overlay's lock.
  assert.equal(document.body.style.overflow, 'hidden');
  search();
  assert.equal(document.documentElement.style.overflow, 'auto');
  assert.equal(document.body.style.overflow, '');
  const cart = acquireScrollLock();
  cart();
  assert.equal(document.body.style.overflow, '');
  delete global.document;
});
