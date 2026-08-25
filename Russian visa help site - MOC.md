---
tags:
  - type/moc
  - project/russian-visa-help-site
status: planning
updated: 2026-08-25
---

# Russian visa help site

Project hub for the free Russian visa preparation website and document-checklist application.

**Live prototype:** [teachingtom98-art.github.io/russian-visa-app](https://teachingtom98-art.github.io/russian-visa-app/)

## North star

Create a trustworthy, independent preparation workspace that helps foreign applicants:

- identify the visa route that probably applies to them;
- understand each requirement in plain language;
- avoid common errors and inconsistencies;
- track progress without paying a third-party adviser;
- organise documents locally into a useful export package; and
- verify every important rule against the relevant official source.

The product should **reduce uncertainty**, not promise to eliminate every doubt or guarantee acceptance. Visa decisions remain discretionary and requirements can vary by nationality, passport, residence, application post and personal circumstances.

## Strategic recommendation

Position the product as a **personalised visa-preparation workspace**, not a universal checklist or an unofficial submission portal.

The strongest product sequence is:

1. Find my route.
2. Explain why that route applies.
3. Generate a versioned personalised checklist.
4. Prepare and technically pre-check files locally.
5. Review unresolved warnings.
6. Export a manifest and organised document bundle.
7. Recheck important rules before submission and travel.

## Public-beta blockers

- Correct the outdated unified e-visa information.
- Do not offer the e-visa route to British-passport holders unless the official eligibility list changes.
- Remove or replace the current passport-photo exemplar.
- Stop using claims such as “official checklist,” “securely stored” and “ready for submission.”
- Do not mark a requirement complete merely because a file was uploaded.
- Replace file storage in `localStorage` with IndexedDB or OPFS.
- Remove document data from the default JSON backup inside the ZIP.
- Add schema validation and safe rendering for imported backups.
- Add deletion, retention and privacy controls before accepting real documents.
- Fix mobile horizontal overflow, header height and dialog keyboard behaviour.

## Project notes

- [[Russian visa help site - product strategy]]
- [[Russian visa help site - UX and design audit]]
- [[Russian visa help site - content governance]]
- [[Russian visa help site - privacy and security]]
- [[Russian visa help site - roadmap]]

## Working principles

- Independent, but evidence-linked.
- Local-first and data-minimising.
- Personalised rather than universal.
- Clear about uncertainty and exceptions.
- Sources and verification dates beside the rule they support.
- Human approval before publishing monitored regulatory changes.
- Free core guidance; commercial recommendations kept separate.
- Objective technical pre-checks, never false “approval” claims.
- Mobile-first for applicants using the tool while travelling or gathering documents.

## Suggested product name

Prefer a name that cannot be confused with a government service:

- Russia Visa Prep
- Russian Visa Planner
- Russia Visa Checklist
- Russia Visa Preparation Workspace

Recommended descriptor:

> Independent visa preparation guide and local document organiser — not a government service.

## Legacy/source notes

- [[Russian visa app - MOC]]
- [[Russian visa checklist app]]
- [[Prompt engineering]]

---
**Related:** [[Russian visa help site - product strategy]] · [[Russian visa help site - roadmap]]
