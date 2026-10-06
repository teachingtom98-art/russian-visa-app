const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');

const appJsCode = fs.readFileSync('app.js', 'utf8');

const sandbox = {
  document: {
    addEventListener: () => {},
    getElementById: () => ({ addEventListener: () => {}, style: {} }),
    querySelectorAll: () => ([]),
  },
  window: {
    addEventListener: () => {},
    URL: { createObjectURL: () => {}, revokeObjectURL: () => {} }
  },
  Blob: Blob,
  atob: atob,
  Uint8Array: Uint8Array,
  console: console,
};

vm.createContext(sandbox);
vm.runInContext(appJsCode, sandbox);

const dataUrlToBlob = sandbox.dataUrlToBlob;

test('dataUrlToBlob - valid text/plain data URL', async () => {
  const blob = dataUrlToBlob("data:text/plain;base64,SGVsbG8gV29ybGQ=");
  assert.strictEqual(blob.size, 11);
  assert.strictEqual(blob.type, 'text/plain');
  assert.strictEqual(await blob.text(), 'Hello World');
});

test('dataUrlToBlob - valid image/png data URL', () => {
  const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const blob = dataUrlToBlob(dataUrl);
  assert.ok(blob.size > 0);
  assert.strictEqual(blob.type, 'image/png');
});

test('dataUrlToBlob - empty MIME type', async () => {
  const blob = dataUrlToBlob("data:;base64,SGVsbG8=");
  assert.strictEqual(blob.size, 5);
  assert.strictEqual(blob.type, '');
  assert.strictEqual(await blob.text(), 'Hello');
});

test('dataUrlToBlob - missing MIME type defaults to application/octet-stream', async () => {
  const blob = dataUrlToBlob("data:base64,SGVsbG8=");
  assert.strictEqual(blob.size, 5);
  assert.strictEqual(blob.type, 'application/octet-stream');
  assert.strictEqual(await blob.text(), 'Hello');
});

test('dataUrlToBlob - invalid base64 fallback', async () => {
  const invalidData = "invalid-data-url-no-comma";
  const blob = dataUrlToBlob(invalidData);
  assert.strictEqual(blob.type, 'application/octet-stream');
  assert.strictEqual(await blob.text(), 'invalid-data-url-no-comma');
});
