## 2024-05-18 - [HIGH] XSS Vulnerability in JSON State Import
**Vulnerability:** Found a stored Cross-Site Scripting (XSS) vulnerability where importing malicious JSON backups injects arbitrary HTML into the DOM due to unsanitized `task` properties in `renderTaskList()`.
**Learning:** Local-first apps that use IndexedDB or JSON imports must treat imported state as untrusted user input, not safe application configuration.
**Prevention:** Always use `escapeHtml` for all untrusted string interpolations inserted into the DOM, and validate URL schemes (e.g., `sanitizeUrl`) before using them in anchor tags.
