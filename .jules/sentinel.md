## 2024-11-06 - [Fix DOM XSS in JSON import]
**Vulnerability:** DOM XSS via unescaped JSON state properties dynamically injected into `innerHTML`.
**Learning:** Local-first architecture (e.g. restoring state from uploaded JSON) is vulnerable to XSS when fields (like `task.title`, `task.sourceUrl`, etc.) are rendered directly without proper sanitization.
**Prevention:** Always sanitize state variables (e.g. `escapeHtml`, `sanitizeUrl`) prior to string interpolation into `innerHTML`, especially for data restored from untrusted sources like file imports.
