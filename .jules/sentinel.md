## 2023-10-24 - [HIGH] Stored XSS via JSON Import Data
**Vulnerability:** Untrusted values originating from an imported JSON backup were rendered into the DOM inside `renderTaskList` without escaping, enabling XSS (`<script>`, `<img src=x onerror=...>`, etc.).
**Learning:** Even client-side, local-first apps parsing custom files must assume file content is untrusted and treat it as a potential attack vector, especially for complex UI logic wrapping user input directly in template literals.
**Prevention:** Ensured all properties displayed from `.json` objects in template literals go through an updated `escapeHtml` function that casts parameters to `String`. Additionally, used `validateUrl` wrapper to limit `href` tags to `http` or `https` schemes, avoiding `javascript:` protocols.
