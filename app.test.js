const test = require('node:test');
const assert = require('node:assert');
const vm = require('node:vm');
const fs = require('fs');
const path = require('path');

// Read app.js code
const code = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

// Set up VM context to run app.js in a mock browser environment
const context = vm.createContext({
  URL: URL,
  window: {
    location: {
      href: 'http://localhost'
    },
    addEventListener: () => {},
    showDirectoryPicker: async () => {}
  },
  document: {
    addEventListener: () => {},
    documentElement: {
      setAttribute: () => {},
      getAttribute: () => {}
    },
    getElementById: () => ({}),
    querySelectorAll: () => []
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  indexedDB: {
    open: () => ({
      onupgradeneeded: null,
      onsuccess: null,
      onerror: null
    })
  },
  console: console
});

// Execute the code in the context to get access to functions
vm.runInContext(code, context);

test('sanitizeUrl allows valid http and https URLs', () => {
  const sanitizeUrl = context.sanitizeUrl;
  assert.strictEqual(sanitizeUrl('http://example.com'), 'http://example.com/');
  assert.strictEqual(sanitizeUrl('https://example.com/path'), 'https://example.com/path');
});

test('sanitizeUrl falls back for invalid URLs or javascript protocols', () => {
  const sanitizeUrl = context.sanitizeUrl;
  assert.strictEqual(sanitizeUrl('javascript:alert("XSS")'), '#');
  assert.strictEqual(sanitizeUrl('data:text/html,<script>alert(1)</script>'), '#');
  assert.strictEqual(sanitizeUrl(''), '#');
});

test('escapeHtml properly escapes HTML special characters', () => {
  const escapeHtml = context.escapeHtml;
  assert.strictEqual(escapeHtml('<script>alert("XSS & things")\'</script>'), '&lt;script&gt;alert(&quot;XSS &amp; things&quot;)&#39;&lt;/script&gt;');
});
