# Sentinel Journal

## Security Learning Log

**Vulnerability:** Cross-Site Scripting (XSS) via InnerHTML
**Impact:** Critical

**Context:**
The application relies heavily on dynamically generating HTML content using `innerHTML`. This generation included string interpolation of untrusted properties such as `task.guidance`, `task.title`, `task.hint`, `task.source`, `task.verifiedDate`, and `task.sourceUrl`.
Since these properties could be populated via imported JSON files (through the backup/restore feature), malicious actors could inject arbitrary HTML and JavaScript into these fields, which would then be executed in the victim's browser upon loading the malicious backup file.

**Fix Details:**
- Implemented strict HTML escaping using the existing `escapeHtml` function for all text-based fields before interpolation into the DOM.
- Implemented a new `sanitizeUrl` function to ensure that URLs injected into `href` attributes only use safe schemes (`http://` or `https://`). This mitigates the risk of `javascript:` or `data:` URL-based XSS attacks.

**Key Takeaways:**
1. **Never trust data sources:** Even when data ostensibly comes from a "local backup", if that backup can be easily manipulated (e.g. JSON file), it must be treated as untrusted input.
2. **Context-aware sanitization:** Text fields need HTML entity encoding, while URLs require scheme validation. A one-size-fits-all approach is often insufficient.
3. **Defense-in-depth:** When using `innerHTML`, extreme caution is required. Using safer alternatives like `textContent` or DOM manipulation functions (e.g. `document.createElement`) is preferable when dealing with complex, dynamic data, but if `innerHTML` is necessary, thorough and context-appropriate escaping is mandatory.
