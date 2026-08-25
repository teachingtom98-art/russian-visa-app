---
tags:
  - type/standard
  - area/content-governance
  - project/russian-visa-help-site
status: required-before-launch
updated: 2026-08-25
---

# Russian visa help site - content governance

> [!warning] Time-sensitive information
> Visa rules and travel advice can change at short notice. The factual baseline in this note was reviewed on 25 August 2026 and must not be treated as permanently current.

## Core content principle

The product should be an **evidence-linked preparation assistant**, not a universal approved checklist.

Every rule must answer:

- Who does it apply to?
- In which jurisdiction or application post?
- For which visa route and purpose?
- When did it take effect?
- Which official source supports it?
- When was it last manually checked?
- Is the rule confirmed, post-specific, stale or disputed?

## Known prototype corrections

### Unified e-visa

The prototype currently says:

- 16-day stay.
- 55 eligible nationalities.
- British citizens are eligible.
- Insurance is for the entire 16-day stay.

The central MFA e-visa portal currently states:

- Single-entry visa.
- Valid for 120 days from issue.
- Maximum permitted stay of 30 days from entry.
- Arrival and departure both count as days.
- Application may be submitted 86 to 4 days before expected entry.
- Normal processing is no more than 4 calendar days; corrections restart processing.
- Eligibility is limited to the current approved nationality list.
- The current list does not include the United Kingdom.
- Permitted purposes include private and business visits, tourism and specified events/contacts.
- It is not the correct route for work, study or transit.
- The passport must be machine-readable, issued by the country of nationality and normally valid at least six months from application.
- Each child requires a separate e-visa.
- Medical insurance valid in Russia is required for the full stay unless a nationality has a reciprocity exemption.

Official source: [MFA unified e-visa instructions](https://evisa.kdmid.ru/Home/Instruction)

### Ordinary visas

Central MFA guidance provides a baseline, but exact documents can vary by visa category, nationality and the selected embassy, consulate or authorised visa centre.

Do not publish universal statements about:

- fees;
- exact number of photos;
- biometrics;
- appointment requirements;
- processing times;
- express service;
- insurance thresholds;
- invitation formats; or
- submission channels

without tying the statement to the applicant’s jurisdiction and a current source.

Sources:

- [MFA ordinary visa guidance](https://www.kdmid.ru/cons/visas/)
- [Official ordinary visa application form](https://visa.kdmid.ru/)
- [Country and passport entry matrix](https://www.kdmid.ru/cons/visas/conditions-of-entry-foreign-citizens-in-russian-federation/)

### Other route conditions

- Russian citizens, including dual nationals, generally need to enter and leave Russia as Russian citizens.
- A valid existing Russian visa can make a new e-visa unnecessary.
- Minor children may require separate applications.
- Russia–Belarus routes need specific checkpoint and mutual-recognition handling.
- Visa-free travellers can have separate pre-entry requirements and must not be pushed through a visa checklist.
- Migration registration is generally required after arrival; accommodation providers may complete it in some cases.
- Previous refusals, overstays, removals or unusual immigration histories should route to official manual confirmation.

## Required intake questions

Ask in this order:

1. Current nationality or nationalities.
2. Former nationality and whether the applicant is or was a Russian citizen.
3. Passport-issuing country and passport type.
4. Whether the passport is machine-readable and contains a full date of birth.
5. Passport expiry and available blank pages.
6. Country of legal residence.
7. Intended embassy, consulate or visa centre.
8. Purpose of visit.
9. Planned entry and exit dates.
10. Required number of entries.
11. Intended entry and exit checkpoints and transport mode.
12. Any Belarus transit or itinerary.
13. Existing valid Russian visa.
14. Applicant age and accompanying children.
15. Russian close relative, host, sponsor or invitation.
16. Insurance and possible nationality exemption.
17. Previous refusal, overstay, removal or other unusual history.

Possible outcomes:

- Visa-free route.
- Unified e-visa.
- Ordinary visa.
- Manual official confirmation required.

## Source hierarchy

Use sources in this order:

1. In-force legislation and Government resolutions.
2. Live central MFA and Consular Department services.
3. Applicant’s selected Russian mission or authorised visa centre for operational requirements.
4. Applicant’s home-government travel advice for safety and consular warnings.

Do not automatically publish a change merely because a monitored page changed. Official pages can conflict, lag or render dynamic lists inconsistently.

## Rule data model

Each rule should include:

```yaml
rule_id: evisa.max_stay
route: unified-evisa
title: Maximum permitted stay
plain_language: Up to 30 days from entry within the visa validity period.
applies_when:
  nationality_in: current_evisa_country_list
  purpose_in:
    - tourism
    - private
    - business
jurisdiction: central-mfa
source_url: https://evisa.kdmid.ru/Home/Instruction
source_owner: Russian MFA Consular Department
effective_from: 2025-08-23
effective_to:
last_verified: 2026-08-25
review_due: 2026-09-25
reviewer: named-editor
review_status: confirmed
confidence_note:
```

Additional useful fields:

- source snapshot or hash;
- rule version;
- replacement rule ID;
- post-specific override;
- known conflict;
- user-facing caveat;
- whether manual confirmation is required;
- whether the rule is legally controlling or operational guidance.

## Versioning behaviour

- Pin each saved application to the rule version used to generate it.
- Do not silently rewrite an old checklist.
- On reopen, compare its rules with the current version.
- Display “Rules changed since you started” when relevant.
- Explain which tasks changed.
- Recheck critical rules again before export.
- Preserve an audit trail of the source and review date shown to the user.

## Editorial workflow

1. Page-diff monitor identifies a possible change.
2. Editor checks the controlling source and any post-specific source.
3. Conflicts enter a manual review queue.
4. Reviewer approves the plain-language interpretation.
5. Rule receives an effective date, version and change note.
6. Update is published.
7. Affected saved plans receive a non-alarming warning.
8. Public change log is updated.

No documented public official API was identified during the review. Assume monitoring will require page diffs plus human approval.

## Checklist-item content template

Each task should display:

- Requirement name.
- Applicability summary.
- Why it is needed.
- Who issues or completes it.
- Whether a copy or original is needed.
- File or photo technical requirements.
- Common mistakes.
- What the site can check.
- What the site cannot check.
- Official source.
- Jurisdiction or post.
- Last reviewed date.
- Current status.

## Content language standards

Use:

- “Likely route.”
- “Based on the answers provided.”
- “Technical check passed.”
- “File added.”
- “Verify with the selected mission or visa centre.”
- “Requirements may change.”
- “Independent preparation guide.”

Avoid:

- “Official checklist.”
- “Guaranteed.”
- “Approved.”
- “Visa-ready.”
- “Eliminates all doubt.”
- “Cannot be rejected.”
- “Ready for submission” without qualification.
- “Secure” without defining the safeguards.

## Travel advice layer

Display safety advice from the applicant’s own government separately from Russian visa eligibility.

For British applicants, the FCDO currently advises against all travel to Russia and warns about limited consular support and possible insurance consequences.

Source: [FCDO Russia travel advice](https://www.gov.uk/foreign-travel-advice/russia)

This notice should be prominent after nationality selection and before the user invests time or money. It should not be buried in a general links sidebar.

## Corrections and transparency

Publish:

- Last reviewed date.
- Named editorial owner or team.
- Source hierarchy.
- Corrections contact.
- Change log.
- Known limitations.
- Disclaimer that the service is independent and does not control visa decisions.
- Commercial-link policy.

---
**Related:** [[Russian visa help site - MOC]] · [[Russian visa help site - product strategy]] · [[Russian visa help site - privacy and security]]
