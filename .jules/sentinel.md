## 2026-10-01 - [XSS vulnerability in JSON state import]
**Vulnerability:** XSS vulnerability in JSON state import
**Learning:** The application allows importing state from JSON backups (restoring). Unsanitized values injected into DOM element templates in `renderTaskList` such as `task.title`, `task.hint`, `task.source`, and `task.guidance` were vulnerable to XSS. Also, `task.sourceUrl` was vulnerable to `javascript:` URL payloads via the `href` attribute.
**Prevention:** Sanitize untrusted data before appending them to the DOM. Use `escapeHtml()` function for text and `sanitizeUrl()` which enforces an `http://` or `https://` scheme for links.
