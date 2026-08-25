---
tags:
  - type/roadmap
  - project/russian-visa-help-site
status: proposed
updated: 2026-08-25
---

# Russian visa help site - roadmap

## Delivery principle

Do not expand to more visa categories until one route works accurately, safely and clearly from eligibility through export.

## Phase 0 - make the prototype safe to demonstrate

Suggested duration: 1–2 weeks.

### Content

- Correct the e-visa duration, validity, timing and eligibility information.
- Remove the statement that UK citizens are e-visa eligible.
- Review all universal insurance, fee, processing-time and document claims.
- Remove references to outdated authorities such as Rostourism where no longer correct.
- Replace “official checklist” and “ready for submission” language.
- Add source and review-date placeholders to every requirement.
- Add a prominent independent-service disclaimer.
- Add the appropriate home-government travel warning for the selected nationality.

### Visual and UX

- Remove or replace the current passport-photo exemplar.
- Start with empty applicant data and zero progress.
- Remove “Mark All Completed.”
- Stop automatic completion on upload.
- Make photo help collapsed by default.
- Simplify the hero to one primary action.
- Fix mobile horizontal overflow.
- Compact the mobile header and bundler banner.

### Accessibility

- Add visible focus styles.
- Fix modal focus management, Escape behaviour and background scrolling.
- Fix tour focus management or remove the tour.
- Add reduced-motion support.
- Increase small/low-contrast instructional text.

### Phase 0 exit criteria

- No known materially outdated headline claims.
- No false-compliance photo example.
- Empty first-run state.
- No horizontal scrolling at common mobile widths.
- Keyboard users can open, complete and close the dialog.
- Upload no longer means complete.

## Phase 1 - build the route finder and personalised plan

Suggested duration: 2–4 weeks.

### Scope decision

Choose one:

- UK ordinary tourist-visa preparation; or
- unified e-visa for one currently eligible nationality.

Document why the route and jurisdiction were chosen.

### Route finder

- Implement the minimum eligibility questions.
- Return visa-free, e-visa, ordinary visa or manual confirmation required.
- Explain why the result was produced.
- Link every decision to its source.
- Allow users to edit answers.
- Handle Russian citizenship and dual-national cases early.

### Rule system

- Move requirements out of hard-coded display copy into a versioned rule structure.
- Add applicability conditions.
- Add jurisdiction, source, effective date, verification date and review state.
- Store the rule version with the application.
- Build a stale-rule warning.

### Personalised checklist

- Group tasks into stages.
- Separate tasks from uploaded documents.
- Add the improved status model.
- Show original-versus-copy requirements.
- Put sources in context.
- Put unresolved conditions at the top.

### Phase 1 exit criteria

- Test cases produce the expected route result.
- No unsupported route is presented as certain.
- Every requirement has a source and review date.
- A saved application retains its rule version.
- Users can understand why the result applies.

## Phase 2 - build a safe local document vault

Suggested duration: 3–5 weeks.

### Storage

- Replace base64 `localStorage` documents with IndexedDB or OPFS blobs.
- Keep checklist metadata separate from files.
- Add storage quota and persistence error handling.
- Add delete-file, delete-application and clear-all-data actions.
- Show storage usage and last-saved time.

### File handling

- Define allowed formats and limits per task.
- Validate file signature, MIME type and size.
- Validate image dimensions and aspect ratio.
- Strip unnecessary image metadata where appropriate.
- Safely render previews.
- Do not run document contents.

### Backup and export

- Make state backup metadata-only by default.
- Remove duplicated base64 documents from the ZIP backup.
- Show a manifest before export.
- Use a neutral application reference in filenames.
- Add an explicit warning that the ZIP contains sensitive identity information.
- Clearly explain that export is not official submission.

### Application security

- Vendor dependencies locally.
- Add a strict CSP and related headers.
- Remove unsafe imported-data HTML rendering.
- Validate imported JSON against a schema.
- Version and migrate backups safely.
- Ensure sensitive data never enters logs or analytics.

### Phase 2 exit criteria

- Large realistic scans do not break saving.
- Clearing data removes metadata and files.
- Crafted/invalid backups are rejected safely.
- ZIP contains exactly the files shown in its manifest.
- No third-party script can read the workspace because none is loaded there.
- Privacy copy accurately describes deployed behaviour.

## Phase 3 - closed beta

Suggested duration: 2–4 weeks.

### Participants

- 5–8 representative applicants.
- At least one user relying mainly on mobile.
- Keyboard-only and screen-reader testers.
- A qualified subject-matter reviewer for the chosen route.

### Test scenarios

- New applicant who does not know the visa type.
- Ineligible e-visa nationality.
- Russian dual national.
- Child applicant.
- Passport near expiry.
- Missing blank pages.
- Belarus itinerary.
- Unsupported or uncertain case.
- Large PDF and image uploads.
- Browser quota/persistence failure.
- Rule changes after an application has been saved.
- Export with unresolved warnings.

### Measure

- Route-result comprehension.
- Time to create a plan.
- Tasks users misunderstand.
- Warnings resolved before export.
- Mobile abandonment points.
- Accessibility failures.
- Stale or disputed content reports.
- Storage and export failures.

### Phase 3 exit criteria

- Users can complete the core flow without a tutorial.
- No critical content or privacy issue remains open.
- Manual-confirmation cases are handled honestly.
- Mobile and keyboard workflows are usable.
- Editorial owner and update process are operating.

## Phase 4 - public MVP

- Publish the one validated route/jurisdiction.
- Publish editorial policy, privacy/security page and change log.
- Monitor official sources with human approval.
- Recheck rules before export.
- Provide a corrections contact.
- Track only privacy-safe product metrics.
- Keep document contents out of analytics.

## Later roadmap

### Product expansion

- Additional nationalities and application posts.
- Additional visa types after separate validation.
- Family and group workspaces.
- Multilingual content.
- Appointment and submission tracking.
- Before-travel and migration-registration checklist.
- Russia–Belarus route assistance.
- Visa-free and pre-entry routes.

### Document tools

- Local photo crop and aspect-ratio tool.
- Blur, background and approximate face-occupancy checks.
- Local OCR-assisted consistency checks.
- Name, passport number and date comparison across documents.
- Expiry and deadline reminders.
- Printable review report.
- Sanitised progress report that excludes documents.

### Editorial operations

- CMS with rule versioning.
- Page-diff monitoring.
- Manual conflict queue.
- Reviewer approval workflow.
- Public corrections and change history.
- Jurisdiction-specific content ownership.

### Optional commercial features

- Qualified human review.
- Premium encrypted sync.
- Family/group convenience features.
- Clearly labelled partner marketplace.

## Do not build yet

- Cloud passport storage.
- Automatic submission to Russian government portals.
- Face matching or identity verification.
- Public document-sharing links.
- AI processing through general third-party APIs.
- Seven visa categories at once.
- Affiliate recommendations inside eligibility decisions.
- “Guaranteed approval” or “officially compliant” scoring.

## Prioritised backlog

### P0 - launch blockers

- Correct e-visa rules and eligibility.
- Replace photo exemplar.
- Remove misleading claims.
- Empty first-run state.
- Stop upload auto-completion.
- Fix mobile overflow.
- Fix modal accessibility.
- Establish source ownership and review dates.
- Replace document `localStorage` before real uploads.
- Remove document-inclusive JSON from default ZIP.
- Add safe backup validation and rendering.
- Add delete controls and privacy notice.

### P1 - MVP quality

- Eligibility wizard.
- Versioned rule engine.
- Staged checklist.
- Local file validation.
- Export manifest and warnings.
- Contextual official sources.
- Stale-rule warning.
- Mobile-first header and navigation.
- Accessibility testing.

### P2 - expansion

- Photo preparation tool.
- Local OCR and consistency checks.
- Family/group plans.
- Multilingual content.
- Reminders.
- CMS and monitoring dashboard.
- Optional expert review.
- Partner marketplace.

## Definition of done for the MVP

The MVP is complete when a user in the chosen route/jurisdiction can:

1. Answer eligibility questions.
2. Understand the recommended route and caveats.
3. View a source-backed, versioned checklist.
4. Save progress locally.
5. Add documents without uploading them to the site operator.
6. See objective file checks and unresolved warnings.
7. Delete documents and the complete application.
8. Export a manifest and organised ZIP without hidden duplicates.
9. Recheck rules before export.
10. Complete the flow on mobile and with a keyboard.

---
**Related:** [[Russian visa help site - MOC]] · [[Russian visa help site - product strategy]] · [[Russian visa help site - UX and design audit]] · [[Russian visa help site - content governance]] · [[Russian visa help site - privacy and security]]
