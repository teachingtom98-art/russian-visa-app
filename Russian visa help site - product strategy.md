---
tags:
  - type/strategy
  - project/russian-visa-help-site
status: planning
updated: 2026-08-25
---

# Russian visa help site - product strategy

## Product vision

Build a free, independent web application that helps foreigners prepare for a Russian visa without automatically paying a lawyer or optional visa-assistance service.

The practical outcome for the user is:

> “I know which route probably applies, what I need, what remains unresolved, where the information came from and how to organise my files.”

Avoid the promise that the service will answer every question, eliminate all doubt or prevent every refusal. A more credible promise is:

> “Reduce uncertainty, prevent common preparation mistakes and show users what must still be verified with the relevant official authority.”

## Target audience

Primary audience:

- Foreign nationals preparing their own Russian visa application.
- Applicants who want free guidance rather than optional form-filling services.
- English-speaking applicants initially.
- People comfortable keeping documents locally on their own device.

Important subgroups:

- Standard tourist-visa applicants.
- Applicants eligible for a unified e-visa.
- Visitors with Russian family members.
- Students and workers whose routes require additional evidence.
- Families or groups preparing several related applications.

The product must not treat “all foreigners” as one audience. Requirements branch by nationality, former or Russian citizenship, passport type, legal residence, submission post, purpose, dates, entry count, age, children and travel route.

## Best product format

Start as a responsive web app or progressive web app.

### Advantages

- No installation barrier.
- Easy to update when rules change.
- Works on desktop while preparing documents and mobile while checking progress.
- Can process and bundle files locally.
- Can later be installed as a PWA for offline use.
- Easier to integrate with the wider expat and Russia-learning website.

### Disadvantages

- Browser storage and file-system capabilities vary.
- Local data can be lost when browser data is cleared.
- Secure cross-device sync is difficult without accounts and server infrastructure.
- File handling requires careful privacy and compatibility design.

Native mobile and desktop applications are not justified for the first release.

## Current concept: pros and cons

| Strength | Limitation or risk |
|---|---|
| Clear outcome: checklist plus organised bundle | A universal checklist cannot safely cover every applicant |
| Local-first document handling | Current browser-storage implementation is fragile |
| Tangible ZIP export | Export can create false confidence that the package is officially submission-ready |
| Contextual help beside tasks | Hard-coded guidance becomes stale quickly |
| Progress states reduce cognitive load | Uploading a file does not prove it is valid |
| Official links improve trust | “Official” wording can imply an affiliation that does not exist |
| Broader expat site offers distribution | Commercial or YouTube links can distract users mid-task |
| Free core product supports accessibility | Content ownership and expert review still have real operating costs |

## Recommended strategic shift

Move from:

> Choose a visa type → view a generic checklist → upload files → mark complete.

To:

> Answer eligibility questions → receive a likely route with caveats → use a versioned checklist → add and technically pre-check documents → resolve warnings → export.

## Recommended first market

Launch the functional workspace for **one visa route and one application jurisdiction**.

Two reasonable pilot options:

### Option A: UK ordinary tourist-visa preparation

Best if the existing audience is mainly British or UK-resident.

- Aligns with the prototype’s current British defaults.
- Has greater checklist and document-organisation value than e-visa preparation.
- Requires a prominent current FCDO warning.
- Must be reviewed against the UK Russian mission and authorised visa centre.
- Must not present the unified e-visa as available to British citizens under the current eligibility list.

### Option B: unified e-visa for one eligible nationality

Best if the priority is a simpler, centrally documented first workflow.

- Easier to define and test.
- Strong opportunity for a local photo and passport-image pre-check.
- Less document-bundling value because no invitation or hotel confirmation is normally required.
- Eligibility and checkpoint lists remain changeable and must be versioned.

Do not launch seven fully functional visa categories simultaneously.

## Recommended information architecture

### Public pages

- `/visa/` — landing page and route finder.
- `/visa/types/` — plain-language overview of visa routes.
- `/visa/types/[route]/` — route-specific guide.
- `/visa/updates/` — rule changes and review log.
- `/visa/official-sources/` — authorities, missions and visa centres.
- `/visa/photo/` — technical photo preparation tool.
- `/visa/help/` — problems, exceptions and official contacts.
- `/editorial-policy/` — sourcing and review method.
- `/privacy-security/` — local processing, retention and user controls.
- `/about/` — independent status and project mission.

### Application workspace

- Find my route.
- Eligibility result.
- Personalised plan.
- Document vault.
- Final review.
- Export.
- Before-travel checks.

## Recommended user flow

1. **Find my route**
   - Ask only questions that affect the outcome.
   - Explain why sensitive questions are necessary.

2. **Eligibility result**
   - Display likely outcome: visa-free, unified e-visa, ordinary visa or manual confirmation required.
   - Explain the reasoning, uncertainty and source.
   - Let the user correct answers.

3. **Personalised plan**
   - Group tasks into stages instead of one long list.
   - Estimate what the user can do now and what depends on another party.

4. **Task detail**
   - What it is.
   - Why it is required.
   - Who issues it.
   - How to prepare it.
   - Common mistakes.
   - Whether an original is required.
   - Official source and review date.

5. **Document vault**
   - Optional upload.
   - Local-only by default.
   - Statuses that separate presence from readiness.

6. **Final review and export**
   - Put unresolved warnings first.
   - Generate a manifest and organised ZIP.
   - Explain that exported files are for preparation and may not be the official submission channel.

7. **Before travel**
   - Recheck visa details, dates, checkpoints, migration registration and home-government travel advice.

## Status model

Do not use a single complete/incomplete field.

Recommended states:

- Not started
- Working on it
- Waiting for issuer or sponsor
- File added
- Format appears valid
- Needs attention
- User confirmed
- Verify with consulate

Track document presence, technical checks and user confirmation separately.

## Brand and trust strategy

- Put the independent-service notice beside the logo.
- Avoid government-style seals or claims of official status.
- Use “source-backed” instead of “official checklist.”
- Use “technical pre-check” instead of “compliant” or “approved.”
- Use “organised preparation package” instead of “ready for submission.”
- Display the source and last-reviewed date where the user makes a decision.
- Publish a corrections policy and visible change log.

## Free model and monetisation

Keep the core route finder, checklist, sources and local export free.

Possible later revenue:

- Optional qualified human review.
- Clearly labelled partner referrals.
- Insurance, language-school, university or travel-service referrals where appropriate.
- Premium family/group workspaces.
- Secure encrypted sync if users demonstrate demand.

Rules for commercial links:

- Keep them outside eligibility decisions.
- Label them as commercial or affiliate links.
- Do not rank a provider because it pays more.
- Keep editorial and commercial approval separate.
- Never imply that a paid provider can guarantee a visa.

## Success measures

- Percentage of users reaching a route result.
- Percentage understanding why that route applies.
- Checklist completion without support requests.
- Number of warnings resolved before export.
- File-validation errors caught before export.
- Users returning to resume an application.
- User-reported confidence without false certainty.
- Corrections or stale-rule reports.
- Zero unauthorised document disclosures.

Avoid using “visa approvals” as the main product metric because the service does not control official decisions.

---
**Related:** [[Russian visa help site - MOC]] · [[Russian visa help site - UX and design audit]] · [[Russian visa help site - roadmap]]
