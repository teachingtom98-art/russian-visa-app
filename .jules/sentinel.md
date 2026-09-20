## 2024-05-24 - [DOM XSS and javascript: URI via Unsanitized State Injection]
**Vulnerability:**
The application had multiple points of Cross-Site Scripting (XSS) within `app.js`'s `renderTaskList` function. Variables loaded from `localStorage` or imported via JSON files, such as `task.title`, `task.hint`, `task.source`, `task.verifiedDate`, `task.guidance`, `task.standardName`, and `attachedFileInfo.size` were injected directly into `.innerHTML` templates without sufficient escaping. The previous `escapeHtml` function did not cast inputs to strings properly, causing it to fail or be bypassed for non-string types. Additionally, `task.sourceUrl` was unsafely injected into an `href` attribute, which could lead to `javascript:` URI execution if a malicious URL was provided.

**Learning:**
Even in a 100% client-side, zero-backend, local-first application, treating data originating from local storage or user-provided files (like JSON backup imports) as safe is a critical flaw. Imported states can act as an attack vector for DOM-based XSS when not sanitized prior to rendering.

**Prevention:**
1. Ensure `escapeHtml()` explicitly casts its input to a string, e.g., `String(str || '').replace(...)`, to ensure type resilience.
2. Uniformly apply `escapeHtml()` to all untrusted variables dynamically interpolated into HTML string templates.
3. Validate all user-controlled URLs before injecting them into `href` or `src` attributes, explicitly verifying that the URL scheme is either `http:` or `https:` and providing a safe fallback.
