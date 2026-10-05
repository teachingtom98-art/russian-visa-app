
## 2026-10-05 - Insecure Deserialization leading to DOM XSS
**Vulnerability:** User-controlled state from JSON backup files was being directly interpolated into `innerHTML` strings during UI rendering (`renderTaskList` in `app.js`). Additionally, task source URLs were not being validated, allowing `javascript:` protocol execution.
**Learning:** Even client-side only (local-first) applications that import and parse state locally are vulnerable to DOM XSS if they don't treat imported local files as untrusted data. Insecure Deserialization applies to local JSON state as much as it does to backend responses.
**Prevention:** Always sanitize/escape string interpolations before inserting them into the DOM, and validate all URL strings using a strict schema allowlist (e.g., enforcing `http://` or `https://` only).
