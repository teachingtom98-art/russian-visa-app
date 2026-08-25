---
tags:
  - type/standard
  - area/privacy
  - area/security
  - project/russian-visa-help-site
status: required-before-launch
updated: 2026-08-25
---

# Russian visa help site - privacy and security

## Security objective

Allow users to prepare and organise high-consequence identity documents without those documents leaving their device unless they deliberately export or submit them elsewhere.

Local-first processing is the recommended MVP architecture.

## Data handled by the product

Potential data includes:

- Full legal name.
- Nationality and residence.
- Passport number, image and expiry.
- Facial photograph.
- Travel plans and accommodation.
- Invitations and family relationships.
- Insurance documents.
- Employment and university information.
- Payment receipts.
- HIV or other medical certificates for some work or study routes.

Passport scans are high-consequence identity data. Medical certificates are health data. A normal digital photograph is personal data but is not automatically special-category biometric data; it becomes biometric data in the special-category sense when specific technical processing is used for unique identification or authentication.

## Current prototype risks

### Full documents in `localStorage`

Uploaded files are converted to base64 data URLs and stored inside the application session in `localStorage`.

Problems:

- Browser quotas are small and inconsistent.
- Base64 increases file size.
- A large scan can cause saving to fail.
- Storage is not encrypted by the application.
- Any script executing in the page origin can potentially read it.
- Users may misunderstand “browser memory” as temporary.

Recommendation:

- Store metadata separately.
- Store document blobs in IndexedDB or OPFS.
- Catch quota and persistence errors.
- Explain where data lives and how it can be deleted.

### Remote third-party JavaScript

JSZip currently loads from a CDN while passport documents and local storage are available to the page.

Recommendation:

- Vendor essential dependencies locally.
- Pin and review dependency versions.
- Use a restrictive Content Security Policy.
- Avoid analytics, tag managers, chat widgets and advertising scripts in the document workspace.
- If an external script is unavoidable, use integrity metadata where supported and document the risk.

### Backup duplication

The exported ZIP contains each uploaded file and a JSON backup containing the same files as base64.

Consequences:

- Sensitive data is duplicated.
- ZIP size increases significantly.
- Users may not understand that the JSON is a complete copy of their documents.
- Sharing the “state file” also shares passport and medical data.

Recommendation:

- Default JSON backup should contain metadata and task state only.
- Make document-inclusive backup a separate explicit action.
- Encrypt any portable document backup with a user-held passphrase.
- Explain recovery limitations before export.

### Unsafe backup restore

Imported JSON is parsed without a strict schema and dynamic task content is rendered through HTML strings.

Risks:

- Crafted backup files can inject markup or script.
- Oversized files can consume memory.
- Unexpected task objects can corrupt the application state.

Recommendation:

- Validate against a versioned JSON schema.
- Enforce a conservative file-size limit.
- Reject unexpected keys and unsupported versions.
- Render user/imported values with safe DOM APIs such as `textContent`.
- Never trust filenames, MIME types or imported data URLs.

### Upload validation

The file input suggests allowed extensions, but drag-and-drop can supply other content and extension is not a reliable type check.

Recommendation:

- Allow-list formats per task.
- Enforce size limits.
- Check MIME type and file signature.
- Decode and re-encode images locally where appropriate.
- Strip unnecessary image metadata.
- Validate pixel dimensions and aspect ratio.
- Do not execute or preview active document content.
- Never send documents to public malware-scanning services.

### Personal information in filenames

The applicant’s full name is included in folders and files.

Recommendation:

- Default to a neutral application reference.
- Let users opt into a name-based convention.
- Explain that filenames may be visible when files are shared.

### No deletion or retention controls

The prototype lacks an obvious “delete application” or “clear local documents” workflow.

Recommendation:

- Add delete-one-document.
- Add delete-application.
- Add clear-all-local-data.
- Explain what deletion affects.
- Show the last-saved date and storage amount.
- Consider optional local expiry reminders rather than silent indefinite retention.

## Recommended local-first architecture

### Data flow

1. User answers route questions.
2. Rule engine creates a checklist.
3. Metadata is saved locally.
4. Optional documents are stored as blobs in IndexedDB or OPFS.
5. Technical checks run locally, preferably in a worker.
6. No document contents enter analytics, logs or error reports.
7. ZIP is generated locally.
8. User explicitly downloads or saves it.
9. The site does not submit the visa or transmit documents to Russia.

### Storage separation

- Checklist metadata store.
- Document blob store.
- Rule-version store.
- User preferences store.
- Never include raw documents in ordinary logs or application telemetry.

### Browser-security controls

- Strong Content Security Policy.
- No inline event handlers in the production version.
- No dynamic HTML for imported values.
- `frame-ancestors` protection.
- Strict referrer policy.
- Permissions Policy disabling unneeded sensors and APIs.
- Trusted dependency update process.
- Automated dependency and static security scanning.
- Clear fallback when File System Access API is unavailable.

## User-facing privacy explanation

Place this before the first upload:

> Files are processed and stored in this browser on this device. They are not uploaded to our server. Browser storage is not the same as encrypted cloud storage. Anyone with access to this browser profile may be able to access the saved application. You can remove individual files or delete all locally saved data at any time.

Adjust the wording only after verifying the deployed architecture.

Do not say “100% secure” or “saved securely.”

## Export warnings

Before download:

- State that the ZIP contains identity documents.
- Recommend storing it in an encrypted or access-controlled location.
- Warn before including health documents.
- List every file included.
- Exclude raw documents from the state backup by default.
- Do not email the bundle automatically.
- Do not generate public or predictable sharing URLs.

## Cloud storage: later only

Do not introduce accounts and cloud document storage in the MVP unless there is a compelling validated need.

Before cloud storage:

- Complete a DPIA.
- Identify lawful bases and any Article 9 condition required for health or biometric processing.
- Publish a privacy notice.
- Define a short retention schedule.
- Provide self-service deletion.
- Encrypt in transit and at rest.
- Use strong tenant isolation.
- Use least privilege and audited staff access.
- Keep files outside the public web root.
- Use short-lived authenticated download links.
- Add incident response and breach procedures.
- Review processors and international transfers.
- Ensure documents never enter support, analytics or model-training systems without specific lawful justification and consent where required.

## AI and OCR features

Later OCR can identify inconsistencies in names, passport numbers and dates, but it creates additional risk.

Preferred approach:

- Run OCR locally where practical.
- Minimise retained extracted text.
- Clearly explain what is being extracted.
- Let the user confirm all fields.
- Do not auto-submit extracted data to an official form.
- Never send passport or medical files to a general public AI endpoint by default.
- Do not use face matching or identity authentication without a separate legal and security assessment.

Photo-quality checks such as aspect ratio, face occupancy, background uniformity and blur are different from identifying the person, but still deserve a documented privacy assessment.

## Threat scenarios to design against

- Shared computer reveals a previous applicant’s documents.
- Browser extension or third-party script reads local data.
- Crafted JSON backup injects code.
- Oversized upload breaks persistence.
- Mislabelled executable file is accepted as an image or document.
- Export silently includes duplicate medical or passport data.
- Full legal name is exposed through filenames.
- User believes deletion occurred when backups remain.
- Cloud support staff can access documents unnecessarily.
- Analytics captures filenames, answers or extracted passport fields.

## Launch security checklist

- Documents are not stored in `localStorage`.
- No third-party JavaScript runs in the document workspace.
- Imported state has strict schema validation.
- All dynamic text is safely rendered.
- File type, signature and size checks exist.
- Images are safely decoded.
- Delete controls are prominent and tested.
- Metadata-only backup is the default.
- Export manifest is shown before download.
- CSP and other security headers are deployed.
- Privacy notice matches real behaviour.
- No sensitive data appears in logs or analytics.
- Keyboard and browser failure states are tested.
- A security review is completed before public document uploads.

## Relevant guidance

- [ICO data minimisation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/)
- [ICO storage limitation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/storage-limitation/)
- [ICO encryption guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/security/encryption/encryption-and-data-protection/)
- [ICO DPIA guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/when-do-we-need-to-do-a-dpia/)
- [ICO biometric recognition guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/biometric-data-guidance-biometric-recognition/biometric-recognition/)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

This note is product-risk guidance, not a definitive legal opinion.

---
**Related:** [[Russian visa help site - MOC]] · [[Russian visa help site - content governance]] · [[Russian visa help site - roadmap]]
