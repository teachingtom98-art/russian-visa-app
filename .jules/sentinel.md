## 2026-09-18 - XSS via Unsanitized JSON Import to innerHTML

**Vulnerability:** A critical Stored/DOM XSS vulnerability where state properties (like title, hint, source, guidance, verifiedDate, and sourceUrl) imported from a local JSON backup file were inserted directly into the DOM using `innerHTML` without proper HTML escaping and URL sanitization.

**Learning:** Even though the application uses a local-first architecture and relies on browser storage, importing untrusted local JSON backup files and inserting their properties directly into `innerHTML` allows arbitrary script execution. This is a critical security gap in local-first apps because users can be tricked into importing malicious backup files. The vulnerability existed because data read from IndexedDB/localStorage/JSON backups was implicitly trusted by the rendering engine. Also, the `escapeHtml` function needed to handle edge cases like casting missing arguments or null objects to strings.

**Prevention:**
1. Always treat imported local JSON state as completely untrusted user input.
2. Use `escapeHtml()` on all string fields prior to DOM insertion.
3. Validate URL schemes (enforce `http://` or `https://` only) using a URL sanitizer before setting `href` attributes to prevent `javascript:` payload execution.
