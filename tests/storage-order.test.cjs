const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync(require.resolve('../lib/storageOrder.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exportsObject = {};
new Function('exports', source)(exportsObject);
const { sortStorages } = exportsObject;

test('storage capacities sort numerically across units without changing input', () => {
  const input = ['2TB', '512GB', '64GB', '1TB', '256GB', '128GB'];
  assert.deepEqual(sortStorages(input), ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB']);
  assert.equal(input[0], '2TB');
  assert.deepEqual(sortStorages(['1 tb', '512 GB', '1.5TB', '512MB']), ['512MB', '512 GB', '1 tb', '1.5TB']);
});

test('accessory labels keep their original order after numeric capacities', () => {
  assert.deepEqual(sortStorages(['Standard', 'MagSafe USB-C Case', '20W UK Pin (3-pin)']), ['Standard', 'MagSafe USB-C Case', '20W UK Pin (3-pin)']);
  assert.deepEqual(sortStorages(['Standard', '1TB', '256GB']), ['256GB', '1TB', 'Standard']);
});
