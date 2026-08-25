---
tags:
  - type/audit
  - area/ux
  - project/russian-visa-help-site
status: active
updated: 2026-08-25
---

# Russian visa help site - UX and design audit

## Review scope

Reviewed the live prototype at [teachingtom98-art.github.io/russian-visa-app](https://teachingtom98-art.github.io/russian-visa-app/) on 25 August 2026.

Tested:

- Desktop at approximately 1280 × 495.
- Mobile at 390 × 844.
- Dark and light themes.
- Start-application dialog.
- Interactive walkthrough.
- Page structure and accessibility tree.
- Normal browser console output.

## Overall verdict

The live prototype has a strong visual foundation. It looks professional and coherent rather than like an unfinished experiment. Preserve the design system, card language, spacing discipline and folder-manifest concept.

The next design pass should focus on product hierarchy, mobile behaviour, trust and accessibility rather than a complete visual redesign.

## What already works

- Cohesive dark theme with restrained blue and green accents.
- Clean light theme.
- Strong page title and clear section hierarchy.
- Consistent card shapes, borders and internal spacing.
- Visa-card selected state is obvious.
- Folder tree communicates the export benefit quickly.
- Upload zones are visually consistent.
- Status badges combine text, colour and symbols.
- Two-column desktop layout is balanced.
- Application dialog looks polished and fits on mobile.
- External official links are grouped clearly.
- The live page produced no obvious site-origin JavaScript errors during normal loading.

## Desktop findings

### Strong points

- The hero and sidebar balance one another well.
- Seven visa cards remain scannable.
- The document package output is tangible and understandable.
- Checklist cards are readable despite the amount of information.

### Problems

- Four large actions compete before an application exists.
- Export is more prominent than eligibility.
- “Step by Step” does not match an opening dominated by document-manager controls.
- The package-output sidebar competes with the actual route decision.
- The checklist is extremely long.
- The expanded photo section visually overwhelms every other task.
- Official sources are grouped in the sidebar rather than attached to the claims they support.
- “Before You Submit” looks less developed than the rest of the page.

## Mobile findings

At a 390 × 844 viewport:

- Header height was approximately 123px.
- Document-bundler banner height was approximately 132px.
- These consume roughly 255px before breadcrumbs or the main heading.
- The theme control is clipped.
- The page overflows horizontally by approximately 20px.
- A horizontal scrollbar is visible.
- Each top action becomes a full-width button, creating a long block of controls.
- The full document is approximately 8,000px tall.
- The sidebar begins roughly 6,800px down the page.

Consequences:

- The user reaches the actual task too slowly.
- Trust, sources and storage information appear much too late.
- The oversized sticky header reduces the usable viewport.
- Controls feel like desktop UI wrapped onto mobile rather than a mobile-first flow.

### Recommended mobile header

- One row only.
- Compact logo/name on the left.
- Menu button on the right.
- Move Save, theme, tour and status into the menu or account/workspace panel.
- Make the bundler banner dismissible or remove it after first view.
- Prevent all horizontal overflow at 320px and above.
- Consider making only a compact progress/action bar sticky after an application begins.

## Above-the-fold hierarchy

Current actions:

- Start New Application
- Export Document Package
- Save Progress
- Restore Backup
- Quick Tour
- Header Save Progress

Recommended hierarchy before an application exists:

1. **Find my visa route** — primary.
2. **Resume an application** — secondary.
3. **How it works** — small text link.

After an application begins:

- Show current route and progress.
- Autosave metadata locally.
- Put manual backup in a workspace menu.
- Reveal export at final review or after at least one file is added.

## Visa selection

The seven-card grid is visually attractive but assumes the user already understands Russian visa categories.

Recommended replacement:

- Start with the eligibility questionnaire.
- Display one recommended route card after the questionnaire.
- Explain why it applies.
- Put alternatives under “Other possible routes.”
- Use “Manual official confirmation required” when the rules cannot safely determine an outcome.

## Default state

The live prototype opens with:

- Tom Barclay.
- British Citizen.
- Tourist visa selected.
- Two of six tasks complete.

The dialog defaults to John Smith.

This feels like another person’s saved application and creates a privacy concern even though it is demo data.

Recommendations:

- Start with an empty name field.
- Start all task states as not started.
- Do not select a visa until intake is complete.
- If demonstration data is useful, add an explicit “View example application” mode.
- Keep example and real workspaces completely separate.

## Checklist design

### Current strengths

- Clear task boundaries.
- Good use of concise hints and expandable advice.
- Upload area is directly attached to the relevant task.
- Status is visible.

### Recommended changes

- Group tasks into stages:
  - eligibility;
  - passport and identity;
  - invitation or purpose evidence;
  - application form;
  - photo;
  - appointment, biometrics and fees;
  - before travel.
- Add a stage progress indicator.
- Distinguish actions from documents.
- Show whether a physical original is still required.
- Replace “Cycle Status” with an explicit state control or task action.
- Remove “Mark All Completed.”
- Do not auto-complete after upload.
- Show technical checks separately from user confirmation.
- Keep long help collapsed by default.

## Passport-photo experience

The current photo guide is open by default and becomes the largest block in the checklist.

Problems:

- It dominates the route instead of supporting it.
- The current photograph is labelled as compliant even though it is 3:4 rather than 35:45.
- The image contains substantial torso/background and does not visually demonstrate the stated 70–80% face occupancy.
- Green “pass” badges imply that the shown photograph has actually passed those checks.

Recommended experience:

1. Keep the checklist photo task collapsed.
2. Open a dedicated photo-preparation tool.
3. Check file type, aspect ratio, dimensions, blur and approximate face occupancy locally.
4. Allow local crop and background guidance.
5. Return a result such as “technical checks passed” or “needs attention.”
6. State that official acceptance is not guaranteed.

Use a synthetic or properly licensed example that demonstrably matches the selected route’s rules.

## Start-application dialog

### Visual result

- Fits on mobile.
- Clear field grouping.
- Good primary/secondary action hierarchy.

### Accessibility failures confirmed in testing

- Focus remains on the Start button behind the open dialog.
- Focus is not moved into the dialog.
- Escape does not close it.
- Background scrolling is not locked.
- There is no demonstrated focus trap.
- Focus restoration cannot work reliably without an initial focus move.

Required behaviour:

- Move focus to the dialog heading or first meaningful input.
- Trap Tab and Shift+Tab inside the dialog.
- Close on Escape.
- Lock background scrolling.
- Make background content inert.
- Restore focus to the opening control when closed.
- Add useful `aria-describedby` text.

## Interactive tour

The tour is attractive, but the interface should not require a four-step explanation.

Mobile testing showed:

- The page scrolls into the visa-card section.
- The popover covers some of the context it explains.
- Keyboard focus remains on the original Quick Tour button behind the overlay.

Recommendations:

- Prefer contextual onboarding during the real workflow.
- Limit to one or two dismissible tips.
- Do not introduce Export before the user has a plan.
- Apply the same focus, Escape, inert-background and restoration behaviour as a modal.
- Respect reduced-motion preferences.

## Typography and contrast

- Main headings are strong and readable.
- Several descriptions, badges and folder filenames are too faint.
- Some meaningful text is around 10–13px.
- Muted text in dark mode risks insufficient contrast.

Recommendations:

- Use approximately 14px as the practical minimum for instructional text.
- Reserve smaller text for non-essential metadata.
- Test WCAG contrast in both themes.
- Increase contrast for folder filenames, helper copy and disabled-looking badges.
- Add consistent `:focus-visible` outlines for every interactive control.

## Copy changes

Replace:

- “Russian Visa Portal” → “Russia Visa Prep” or “Russian Visa Planner.”
- “Official Checklist” → “Source-backed preparation checklist.”
- “Ready for submission” → “Organised for your review and official submission process.”
- “Saved securely” → “Stored in this browser on this device.”
- “Complete” after upload → “File added.”
- “Compliant photo” → “Technical photo checks passed.”

## UX acceptance checklist

- No horizontal overflow at 320, 375, 390, 768 or 1024px.
- Primary action is route finding, not export.
- Empty first-run state.
- Sidebar trust content is available in context on mobile.
- Dialog and tour pass keyboard-only testing.
- Visible focus on every button, link, card, input and disclosure.
- Escape closes modal interfaces.
- Reduced-motion mode works.
- Minimum instructional text size and contrast pass accessibility review.
- Upload does not automatically equal complete.
- Photo guide does not claim official acceptance.
- One primary action per stage.

---
**Related:** [[Russian visa help site - MOC]] · [[Russian visa help site - product strategy]] · [[Russian visa help site - privacy and security]]
