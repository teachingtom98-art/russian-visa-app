## 2023-10-24 - [Title] 🛡️ Sentinel: XSS Vulnerability in DOM Rendering
**Vulnerability:** Untrusted user input (JSON state imports) was interpolated directly into DOM elements via `innerHTML` without sanitization.
**Learning:** Directly injecting unescaped object properties (e.g., `task.title`, `task.guidance`) into template literals mapped to `innerHTML` creates DOM-based XSS risks. Furthermore, a simple escape logic like `(str || '').replace(...)` can fail if unexpected data types like integers are parsed. Using explicit typecasting (`String(str ?? '').replace(...)`) makes the parser more robust.
**Prevention:** Apply `escapeHtml` for all text fields and `sanitizeUrl` (enforcing `http://` or `https://` schemas) for all dynamically inserted link attributes when using `innerHTML`.
