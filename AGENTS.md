# AI Agent Instructions for Russian Visa Planner

This document provides essential context and rules for AI agents (like Jules) working on the Russian Visa Planner & Preparation Workspace.

## Architecture Summary
* **Client-Side Only (Local-First):** The application is a Single Page Application (SPA) built using vanilla HTML5, CSS3, and JavaScript (ES6+).
* **Zero Backend Dependency:** There is no backend server. All document and state storage is handled entirely within the user's browser using `localStorage` (for session metadata) and `IndexedDB` (for binary file storage).
* **Dependencies:** The only external dependency is `JSZip` for creating the ZIP bundles, loaded via CDN (`https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js`).

## Build, Test, and Lint Commands
Because this is a vanilla static web application, it doesn't currently utilize a `package.json` with formal build or test scripts.

* **Development Server:** To run the application, you must start a local static HTTP server from the root directory.
  * *Python 3:* `python3 -m http.server 8000`
  * *Node.js:* `npx serve .`
* **Linting:** Standard JavaScript and CSS linters (e.g., ESLint, Prettier) are recommended for formatting, but no formal configuration is present in the repository. Please ensure any code changes follow the existing stylistic conventions (e.g., camelCase for JavaScript variables).

## Rules and Conventions for Future AI Agents

1. **Maintain the "Local-First" Philosophy**: Never introduce features that transmit user data, files, or state to an external server or API. The core value proposition of this application is privacy. All data must reside on the user's local device.
2. **Vanilla Web Technologies Preference**: Do not introduce frameworks like React, Vue, or Svelte without explicit user instruction. The architecture relies on vanilla DOM manipulation.
3. **No Build Step Requirement**: Keep the application capable of running directly from the filesystem or via a simple static file server. Avoid introducing Webpack, Vite, or similar bundlers unless requested.
4. **CSS Styling**: The application uses native CSS variables (`var(--variable-name)`) to manage the `[data-theme="dark"]` and `[data-theme="light"]` implementation. Add new variables to both themes in `styles.css` if introducing new UI components.
5. **State Management:** `app.js` uses a global `currentSession` object. Always call `saveSessionToStorage()` when modifying this state to ensure data persistence across reloads.
6. **File Handling:** Continue to use the wrapper functions `idbStoreFile`, `idbGetFile`, and `idbDeleteFile` when working with document uploads and storage.
7. **Accessibility (a11y)**: Maintain existing `aria-*` labels and roles when adding new markup. Ensure any modals or interactive elements are keyboard accessible (e.g., pressing `Escape` to close modals, `Enter`/`Space` to select cards).