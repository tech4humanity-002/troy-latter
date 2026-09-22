# CV pack harness

Drop application material into a folder under `cv-packs/`. No code or route changes are required.

## Zero-touch convention

Use any role/application slug as the folder name:

```
cv-packs/
  wns-lead-technical-consultant/
    cv.docx
    cover-letter.docx
    skills-matrix.pdf
```

Supported source formats: `.docx`, `.pdf`, `.txt`, `.md`.

The harness automatically classifies filenames:

- `cv`, `resume`, `curriculum` → CV
- `cover-letter`, `coverletter`, `cover` → Cover Letter
- `skills-matrix`, `skills-profile`, `skills` → Skills Matrix
- `application`, `response`, `selection-criteria` → Application
- `portfolio`, `case-study` → Portfolio
- anything else → Document

Optional `manifest.json` can override the title, description, role, company and individual artifact types.

```json
{
  "title": "WNS Lead Technical Consultant",
  "role": "Lead Technical Consultant",
  "company": "WNS",
  "description": "Application pack",
  "artifacts": {
    "cv.docx": { "type": "cv", "title": "Targeted CV" }
  }
}
```

## Generated destinations

Every folder gets:

- its own page: `/cv/<slug>/`
- an automatic card on: `/cv/`
- extracted machine-readable content at `/cv-packs/<slug>/content.json`
- downloadable copies of the original source files

Run:

```bash
npm run cv:packs
npm run build
```

The release harness runs CV discovery automatically, so normal releases do not require a separate CV publishing step.
