# CV and Cover Letter Application Packs

## Purpose

This repository contains standalone application packs for specific roles. Each pack is a self-contained set of HTML pages designed to be served directly from its directory and deployed through Vercel.

The important rule is simple: **do not invent paths, duplicate the company name, or change the established role title when editing an application pack.** Locate the existing directory and edit the existing files in place.

## Current application packs

### LAB3

Directory:

`LAB3/`

Files:

- `LAB3/index.html` - application landing page
- `LAB3/cv.html` - Executive CV
- `LAB3/cover-letter.html` - Cover Letter

Current role:

`Principal Technologist`

The landing page is deliberately positioned around the LAB3 Principal Technologist application and links directly to the CV and cover letter. The CV and landing page use LAB3-oriented visual treatment. The cover letter uses the established clean document layout. 

### Infosys

Directory:

`Infosys/`

Files:

- `Infosys/index.html` - application landing page
- `Infosys/cv.html` - lightweight CV route/entry point
- `Infosys/Snr_Principal_Architect_AI (CV).html` - full tailored Executive CV
- `Infosys/cover-letter.html` - Cover Letter

Current role:

`Senior / Principal Architect (AI)`

The Infosys landing page uses Infosys-oriented blue and green branding. The full tailored CV is the `Snr_Principal_Architect_AI (CV).html` file, while `cover-letter.html` is the standalone letter.

## Cover letter header standard

The top of every application cover letter should follow this structure:

```text
[ROLE TITLE] | [COMPANY]

Sydney, Australia · 0424 882 136 · troy.latter@gmail.com · linkedin.com/in/theinnovater

11 September 2026

Talent Acquisition Team

Dear Hiring Team,
```

### Rules

1. **Role and company appear together once at the top.**
2. Do not repeat the company beneath `Talent Acquisition Team`.
3. Do not add a `RE:` line.
4. Do not use `Application for...` as a second subject line.
5. Use `Dear Hiring Team,` rather than repeating the company in the salutation.
6. Preserve the exact role title already established in the application pack. Do not ask the user to supply it again and do not invent a replacement title.
7. Keep the contact line immediately below the role/company heading.
8. Keep the date below the contact line.
9. Keep the recipient block short and consistent.
10. Use the existing visual language of the individual application rather than replacing the page with a generic template.

## The two corrected cover letters

The LAB3 cover letter now begins with:

`Principal Technologist | LAB3`

The Infosys cover letter now begins with:

`Senior / Principal Architect (AI) | Infosys`

Both now use:

`Talent Acquisition Team`

followed by:

`Dear Hiring Team,`

with no duplicated company line and no `RE:` application line.

## Editing workflow

Before changing an application:

1. Search the repository for the company or role.
2. Confirm the actual directory and filenames from GitHub.
3. Fetch the existing file before editing it.
4. Make the smallest safe change required.
5. Preserve the existing HTML, navigation, styling and application-specific branding unless the requested change requires otherwise.
6. Commit the change to the existing file rather than creating guessed replacement paths.
7. Fetch the file again after the commit and verify the resulting content.
8. Only then report the change as complete.

## Vercel / GitHub relationship

The GitHub repository is the source of truth for these application pages. Vercel is the deployment layer. A Vercel URL should therefore be traced back to the actual repository and directory before making a change.

Known application directory routes are:

- `LAB3/`
- `Infosys/`

The expected standalone page pattern is:

`/<application>/index.html`

`/<application>/cv.html`

`/<application>/cover-letter.html`

Where an application contains a specifically named full CV, that filename must be retained rather than replaced with an invented route.

## Change record - 11 September 2026

Corrected the two existing cover-letter headers directly in GitHub:

- `LAB3/cover-letter.html`
- `Infosys/cover-letter.html`

No new application directories were created. No role titles were invented. No CV content was rewritten as part of this header correction.

This document exists so the same repository/path/header mistake does not need to be rediscovered next time.
