## 2024-05-18 - Prevent XSS in Loaded State
**Vulnerability:** XSS vulnerability during JSON state imports in `app.js` because user-supplied state properties (like `task.title`, `task.hint`, `task.sourceUrl`, etc) were blindly injected into `innerHTML` without sanitization.
**Learning:** Even if data is only saved/loaded locally (via browser localStorage or File API), malicious state JSON files can be crafted and imported by the user (or sent to them by an attacker) resulting in XSS. A local-first application must treat all imported state files as untrusted.
**Prevention:** Apply `escapeHtml()` to all untrusted strings being rendered via innerHTML, and validate all URLs (e.g. `sanitizeUrl` enforcing `http:` or `https:`) to prevent `javascript:` execution.
