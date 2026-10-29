## 2024-05-18 - XSS in Task Rendering
**Vulnerability:** XSS vulnerability where task data rendered into HTML innerHTML strings could execute malicious scripts if application state (e.g. from a restored JSON backup) was manipulated. Also, task.sourceUrl could be injected with `javascript:` payloads in the `href` attribute.
**Learning:** Locally restored application state, such as from imported JSON files, should still be treated as untrusted user input since it can be easily manipulated before import.
**Prevention:** Use `escapeHtml` on all dynamic content injected into HTML and use a `sanitizeUrl` function to strictly enforce `http:` or `https:` schemes on all URLs used in `href` attributes.
