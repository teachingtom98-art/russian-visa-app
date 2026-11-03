## 2024-05-18 - XSS via Malicious JSON State Import in Local-First Apps
**Vulnerability:** XSS vulnerability discovered in the local state JSON import functionality. Untrusted properties from the imported JSON (`task.title`, `task.hint`, `task.guidance`, `task.source`, `task.sourceUrl`, `task.verifiedDate`, `task.standardName`, and `attachedFileInfo.size`) were being injected directly into the DOM using `innerHTML` without proper sanitization. Additionally, `escapeHtml` was brittle against non-string inputs (like booleans or numbers parsed from JSON) causing application crashes due to `replace is not a function`.
**Learning:** Local-first applications often use JSON imports to restore state. Even if the application has no backend and data resides entirely on the client, malicious actors could craft a malicious JSON backup file and trick users into importing it. Trusting imported state is a critical mistake. Furthermore, sanitization functions must be robust against non-string types, especially when dealing with parsed JSON.
**Prevention:**
1. Always treat imported JSON data as untrusted input.
2. Apply strict escaping (e.g., `escapeHtml`) to any imported properties before injecting them into the DOM via `innerHTML`.
3. Validate and sanitize URLs explicitly (e.g., enforcing `http:` or `https:`) to prevent `javascript:` URI attacks.
4. Ensure helper functions like `escapeHtml` cast inputs natively to strings (e.g., `String(val ?? '')`) so they don't break when encountering numbers or booleans from JSON objects.
