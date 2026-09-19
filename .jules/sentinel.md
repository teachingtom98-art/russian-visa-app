## 2024-05-18 - XSS Vulnerability in Local JSON State Import
**Vulnerability:** DOM-based Cross-Site Scripting (XSS) via `innerHTML` rendering of unsanitized task attributes (`title`, `hint`, `guidance`, `source`, `sourceUrl`, `verifiedDate`).
**Learning:** Even though the application uses local storage and local file imports (zero backend dependencies), importing a maliciously crafted JSON backup file directly into `innerHTML` allows script execution because local files are fundamentally untrusted input boundaries.
**Prevention:** Always sanitize data parsed from local file imports (e.g., using `escapeHtml()`) before DOM insertion, and enforce URL scheme validation (e.g., `http://` or `https://`) for `href` attributes to prevent `javascript:` URI-based execution.
