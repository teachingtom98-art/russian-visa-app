const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('node:vm');
const path = require('path');

const appJsCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

test('Sanitization Functions Test', () => {
  const context = {
    window: {
      location: { origin: 'http://localhost' }
    },
    URL: URL
  };
  vm.createContext(context);

  // We can just extract the functions to a new script for vm to avoid app.js execution errors
  // A simple way is to use regex matching curly braces

  function extractFunction(code, funcName) {
    const startIndex = code.indexOf(`function ${funcName}`);
    if (startIndex === -1) return null;
    let braceCount = 0;
    let i = code.indexOf('{', startIndex);
    if (i === -1) return null;

    braceCount++;
    i++;
    while (i < code.length && braceCount > 0) {
      if (code[i] === '{') braceCount++;
      else if (code[i] === '}') braceCount--;
      i++;
    }
    return code.substring(startIndex, i);
  }

  const escapeHtmlCode = extractFunction(appJsCode, 'escapeHtml');
  const sanitizeUrlCode = extractFunction(appJsCode, 'sanitizeUrl');

  assert.ok(escapeHtmlCode, 'escapeHtml function should exist');
  assert.ok(sanitizeUrlCode, 'sanitizeUrl function should exist');

  const functionsCode = `
    ${escapeHtmlCode}
    ${sanitizeUrlCode}
  `;

  vm.runInContext(functionsCode, context);

  const escapeHtml = vm.runInContext('escapeHtml', context);
  const sanitizeUrl = vm.runInContext('sanitizeUrl', context);

  // Test escapeHtml
  assert.strictEqual(escapeHtml('<script>alert("XSS")</script>'), '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
  assert.strictEqual(escapeHtml('1 & 2 > 0'), '1 &amp; 2 &gt; 0');
  assert.strictEqual(escapeHtml(null), '');
  assert.strictEqual(escapeHtml(undefined), '');

  // Test sanitizeUrl
  assert.strictEqual(sanitizeUrl('javascript:alert(1)'), '#');
  assert.strictEqual(sanitizeUrl('data:text/html,<script>alert(1)</script>'), '#');
  assert.strictEqual(sanitizeUrl('http://example.com'), 'http://example.com/');
  assert.strictEqual(sanitizeUrl('https://secure.com/path?q=1'), 'https://secure.com/path?q=1');
  assert.strictEqual(sanitizeUrl('/about'), 'http://localhost/about');
  assert.strictEqual(sanitizeUrl(''), '#');
});
