
## 2026-10-25 - Prevent XSS in local JSON imports
**Vulnerability:** Found an XSS vulnerability where restoring session progress from a JSON file directly injected user-controlled fields (like `task.title`, `task.hint`, `task.source`, `task.sourceUrl`, and `task.guidance`) into `.innerHTML` and URL attributes (`href`).
**Learning:** Local-first applications often use imported state from JSON files. Even though this isn't a traditional server-client model, malicious users can trick victims into importing seemingly benign JSON files ("state files"), achieving XSS execution on their machine.
**Prevention:** All untrusted user fields originating from imported JSON state must be strictly escaped (e.g. `escapeHtml`) before entering the DOM and URLs sanitized against javascript scheme execution (e.g. `sanitizeUrl(url)`) when updating the UI.
