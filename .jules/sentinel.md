# 🛡️ Sentinel Journal

## Issue: High-Severity XSS in InnerHTML Rendering
**Date:** 2023-10-06
**Component:** `app.js` Task Rendering
**Root Cause:** The application directly interpolated user-controlled or file-imported task fields (such as `task.title`, `task.hint`, `task.source`, `task.guidance`) into `innerHTML` strings without proper escaping. Additionally, `task.sourceUrl` was vulnerable to `javascript:` URI attacks.

**Impact:** Since the application allows state importing from JSON, a malicious actor could craft a seemingly innocent backup JSON file containing XSS payloads. If a user was tricked into importing this file, arbitrary JavaScript could execute within the application's context, violating the intended local-first security boundary.

**Resolution:**
1. Created a `sanitizeUrl` function to ensure all user-provided URLs conform to `http:` or `https:` protocols, falling back to `#` or treating them as safe relative paths.
2. Wrapped all dynamic interpolation assignments to the task rendering string with `escapeHtml` or `escapeHtml(sanitizeUrl(...))` where appropriate.
3. Wrote an automated Python-based Playwright test (`test_xss.py`) that simulated loading a malicious JSON file and verified no execution of alert payloads or console log leaks occurred.
