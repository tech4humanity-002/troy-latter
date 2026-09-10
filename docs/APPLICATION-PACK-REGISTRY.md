# Application Pack Registry

This document is the source-of-truth map for the standalone job-application microsites in this repository.

The critical rule is isolation: application packages are static directories served alongside the main Troy Latter React site. Do not replace or restructure the `/` route to accommodate an application package.

## Deployment architecture

```text
GitHub
tech4humanity-002/troy-latter
main
  |
  +-- React portfolio site ----------------------> /
  |
  +-- LAB3 --------------------------------------> /LAB3/
  |
  +-- Infosys -----------------------------------> /Infosys/
  |
  +-- EY-Parthenon ------------------------------> /ey-parthenon/
```

`vite.config.ts` copies each static application directory into `dist/` during the production build.

`vercel.json` keeps application routes ahead of the root catch-all. The root catch-all must continue to serve the React portfolio only.

## Navigation standard

Every application landing page uses this primary order:

1. **Cover Letter**
2. **Executive CV**
3. **Main site**

The landing page may expose additional application-specific evidence in the body, such as a strategy matrix or infographic. Those are secondary evidence, not replacements for the three primary navigation destinations.

Footer navigation follows the same priority.

**Important: an application package is not limited to CV + cover letter.**

A package may contain additional pages, tools, evidence, matrices, infographics, case studies, role-specific analyses, validators, or other material that materially strengthens the application. The registry must document every live page rather than assuming a fixed three-file pattern.

When adding or discovering an application package, inspect the complete directory and record all HTML, JSON, assets and supporting files that are part of the live experience. Do not stop after finding `cv.html` and `cover-letter.html`.

## Application registry

### LAB3

**Public path**

```text
/LAB3/
```

**Files**

```text
LAB3/index.html
LAB3/cover-letter.html
LAB3/cv.html
```

**Primary links**

```text
/LAB3/cover-letter.html
/LAB3/cv.html
/
```

**Design system**

- High-contrast dark navy/black foundation.
- Bright cyan/blue accent treatment.
- Editorial, technical typography with large outcome-led headings.
- Glass/panel cards, restrained borders and high contrast.
- Application language is centred on whole-estate technology leadership, Microsoft/Azure depth and cross-cloud credibility.
- The application must remain recognisably LAB3-specific rather than becoming a generic Troy portfolio page.

**Current source check**

`LAB3/index.html` already follows the required navigation order: Cover Letter, Executive CV, Main site.

### Infosys

**Public path**

```text
/Infosys/
```

**Files**

```text
Infosys/index.html
Infosys/cover-letter.html
Infosys/cv.html
Infosys/Snr_Principal_Architect_AI (CV).html
```

**Primary links**

```text
/Infosys/cover-letter.html
/Infosys/cv.html
/
```

`/Infosys/cv.html` is the stable public CV route. The longer CV filename is retained as the underlying tailored document and must not be removed without checking inbound links.

**Design system**

- Infosys blue-led corporate treatment.
- Green accent used selectively.
- White space, restrained borders and enterprise-document presentation.
- Clean sans-serif typography with large architectural/AI positioning.
- Language centres on enterprise AI transformation, architecture, governance, cloud and executive advisory.

**Current source check**

`Infosys/index.html` was standardised to the required navigation order on 11 September 2026.

### EY-Parthenon

**Public path**

```text
/ey-parthenon/
```

Use this exact lowercase path. Do not create a second `EY-Parthenon/` directory merely to change capitalisation. Git and deployment paths must remain canonical and unambiguous.

**Files and live pages**

The EY-Parthenon package is an example of an **extended application package**. It contains more than the standard CV and cover letter and must be treated as such in future work:

```text
ey-parthenon/index.html
    -> application landing page

ey-parthenon/cover-letter.html
    -> primary application document

ey-parthenon/cv.html
    -> executive CV

ey-parthenon/strategy-matrix.html
    -> secondary strategy / role-alignment evidence

ey-parthenon/infographic.html
    -> secondary visual application evidence

ey-parthenon/build-manifest.json
    -> package manifest / validation metadata
```

**Primary links**

```text
/ey-parthenon/cover-letter.html
/ey-parthenon/cv.html
/
```

**Secondary evidence**

```text
/ey-parthenon/strategy-matrix.html
/ey-parthenon/infographic.html
```

The landing page may therefore contain more than three destinations. The rule is that the three primary destinations remain obvious, while additional evidence is preserved and documented rather than deleted, hidden or treated as an error.

**Design system**

- EY-Parthenon-inspired black, navy and yellow treatment.
- Dark navigation with strong yellow rule/accent.
- Executive strategy-document aesthetic.
- Serif display headings combined with restrained enterprise sans-serif body text.
- Strategy, commercial growth, transformation and CDD evidence are presented as the application narrative.
- Do not replace this with the LAB3 or Infosys visual language.

**Example rule for future applications**

EY-Parthenon demonstrates the expected discovery pattern:

1. Inspect the whole application directory.
2. Identify the landing page.
3. Identify primary documents.
4. Identify all additional evidence pages.
5. Identify manifests, validators and supporting assets.
6. Preserve those pages in the build and routing configuration.
7. Document every live route in this registry.

Do not infer that a package is complete because `cv.html` and `cover-letter.html` exist.

**Known failure and fix**

The EY-Parthenon package existed in Git history and in the current GitHub tree, but the production build configuration only copied `LAB3` and `Infosys` into `dist/`. This meant the EY-Parthenon directory was not reliably present in the Vercel build output.

The following protections are now in place:

- `vite.config.ts` copies `ey-parthenon` alongside `LAB3` and `Infosys`.
- `vercel.json` has an EY-Parthenon child-route rule before the root `/(.*)` catch-all.
- The EY-Parthenon landing navigation has been standardised to Cover Letter, Executive CV, Main site.
- The complete EY-Parthenon page set is explicitly documented above so future changes do not stop at CV + cover letter.

## Safe-change rules

### 1. Never modify `/` to fix an application pack

The React application owns `/`. A broken `/LAB3/`, `/Infosys/` or `/ey-parthenon/` route must be fixed in the static package, build copy step or Vercel routing configuration.

### 2. Never move an application directory casually

The directory name is part of the public URL contract. Before renaming a package, search GitHub for all references and check Vercel routing.

### 3. Preserve package-specific design

Do not apply one company's colours, typography or navigation styling to another company's application. Each package is a deliberately separate visual system.

### 4. Preserve the complete package

Do not delete or omit an application-specific page simply because it is not one of the three primary destinations. Extra evidence is part of the application when it is linked by the landing page or included in the package manifest.

### 5. Make the smallest safe change

For navigation or wording fixes, change the affected application file only. For deployment fixes, change only the build/routing configuration required to serve the existing files.

### 6. Verify source and deployment separately

A GitHub file existing does not prove that Vercel serves it. A Vercel 200 response does not prove it serves the intended file. Both source and deployment must be checked.

## Required route test set

After any build or routing change, test the complete package, not just its CV and cover letter:

```text
/
/LAB3/
/LAB3/cv.html
/LAB3/cover-letter.html
/Infosys/
/Infosys/cv.html
/Infosys/cover-letter.html
/ey-parthenon/
/ey-parthenon/cv.html
/ey-parthenon/cover-letter.html
/ey-parthenon/strategy-matrix.html
/ey-parthenon/infographic.html
```

If a package has additional live pages, add them to this test set immediately. Do not rely on the three-file baseline.

For each route verify:

- HTTP response is successful.
- Correct package renders.
- Navigation points to the correct package files.
- Main site returns to `/`.
- No application route is rewritten to the React home page.
- Company-specific visual treatment is intact.
- All package-specific evidence pages remain reachable.

## Change record - 11 September 2026

- Standardised Infosys navigation to Cover Letter, Executive CV, Main site.
- Standardised EY-Parthenon landing navigation to Cover Letter, Executive CV, Main site.
- Added EY-Parthenon to the Vite static-package copy list.
- Added EY-Parthenon child-route handling before the root Vercel catch-all.
- Preserved the React root site and existing LAB3/Infosys package paths.
- Confirmed EY-Parthenon files exist in the canonical repository under `ey-parthenon/`.
- Added an explicit extended-package rule using EY-Parthenon as the example so future application builds do not stop after CV + cover letter.

## Recovery principle

If a future application disappears from Vercel, first compare:

1. GitHub directory exists.
2. Complete directory contents have been inventoried.
3. `vite.config.ts` copies that directory.
4. `vercel.json` does not catch the child route with the root rewrite.
5. Vercel deployment uses the latest `main` commit.
6. Every live child URL is tested, including secondary evidence pages.

Do not rebuild or replace the main site as a workaround.
