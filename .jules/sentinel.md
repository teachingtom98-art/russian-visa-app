## 2024-10-27 - Stored XSS via JSON Backup Import
**Vulnerability:** Untrusted data imported via JSON backups was written directly to the DOM using `innerHTML` without proper escaping in `app.js`. Also `javascript:` URLs were allowed in `sourceUrl`.
**Learning:** Local-first apps that rely heavily on JSON backups (rather than databases) are highly susceptible to Stored XSS if they don't treat imported backups as untrusted input.
**Prevention:** Always use `escapeHtml` when rendering user-supplied or imported JSON values to `innerHTML`, and implement URL sanitization (e.g. enforcing http/https) for any dynamically rendered `href` attributes.
