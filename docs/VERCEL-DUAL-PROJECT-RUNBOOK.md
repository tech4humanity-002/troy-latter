# Troy Latter: GitHub + Dual Vercel Runbook

## Purpose

This repository is the source of truth for the Troy Latter personal site and its application pages. Keep the site architecture and deployment relationships documented here so future work does not require rediscovery.

## Canonical site architecture

```text
troy-latter.vercel.app/
        |
        +-- MAIN TROY LATTER SITE
        |
        +-- /LAB3/
        |     +-- index.html
        |     +-- cv.html
        |     +-- cover-letter.html
        |
        +-- /Infosys/
              +-- index.html
              +-- Snr_Principal_Architect_AI (CV).html
              +-- cover-letter.html
```

The application pages are part of the same deployed site. They must not replace `/` with an application selector or separate portfolio hub.

## GitHub source

Repository: `tech4humanity-002/troy-latter`

Default branch: `main`

Root application: Vite/React (`src/`, `src/main.tsx`, `src/pages/Index.tsx`)

Static application packages: `LAB3/` and `Infosys/`

`vite.config.ts` contains the build step that copies both static application directories into `dist/`.

## Vercel projects

There are two Vercel contexts that have been encountered for this site and they must be treated as separate deployment targets until verified:

1. The primary/canonical Troy Latter Vercel project under the Holo-Org account/project space.
2. A duplicate/alternate Troy Latter deployment under the aisweetspots account/project space, previously observed with aliases including `troy-latter-psi-iota.vercel.app` and `troy-latter-psi-aisweetspots.vercel.app`.

Do not assume that a Vercel URL belongs to the intended project merely because its name looks right. Verify the project and deployment explicitly.

## How to inspect both Vercels

### Rule 1: GitHub is the source of code truth

Check `tech4humanity-002/troy-latter` on branch `main` first.

Record the latest commit SHA before changing deployment configuration.

### Rule 2: Vercel is the deployment truth

For each Vercel project, record:

- Vercel account/team/owner
- project name
- connected GitHub repository
- production branch
- production domain/aliases
- latest production deployment
- deployment commit SHA
- deployment state

A deployment is not considered verified until its deployed commit can be matched to GitHub `main`.

### Rule 3: Test both project URLs, not just the dashboard

For every known Vercel alias, test at minimum:

```text
/
/LAB3/
/LAB3/index.html
/Infosys/
/Infosys/index.html
```

Also test the important application assets/pages:

```text
/LAB3/cv.html
/LAB3/cover-letter.html
/Infosys/Snr_Principal_Architect_AI%20(CV).html
/Infosys/cover-letter.html
```

Record HTTP status and whether the page renders correctly. A URL returning 200 is not sufficient if it renders the wrong application.

## Current routing/build requirements

`vite.config.ts` must retain the static copy operation for:

```text
LAB3 -> dist/LAB3
Infosys -> dist/Infosys
```

`vercel.json` must not turn the root route into an application hub. The React site owns `/`.

The application landing routes should remain:

```text
/LAB3/
/Infosys/
```

Lowercase `/infosys` may redirect to `/Infosys/` for convenience.

## Brand rule

Application packages must look like applications for the target company, not generic Troy portfolio pages.

- LAB3: high-contrast black/white treatment with bright lime accent, bold technical/editorial typography, outcome-led language, and LAB3's Fear Less Achieve More positioning.
- Infosys: Infosys blue-led corporate treatment, restrained green/orange accents where useful, generous white space, people/enterprise/technology feel, and Navigate your next positioning.

Use company brand language and visual cues without pretending to reproduce proprietary design systems or logos that are not actually available in the repository.

## Deployment verification checklist

Before declaring a change complete:

- [ ] GitHub commit exists on `main`.
- [ ] Vercel production deployment exists for that commit.
- [ ] Primary Vercel project is identified.
- [ ] Alternate/second Vercel project is identified if still active.
- [ ] Production domain is mapped to the intended project.
- [ ] `/` loads the real Troy Latter React site.
- [ ] `/LAB3/` loads the LAB3 application page.
- [ ] `/Infosys/` loads the Infosys application page.
- [ ] CV links work.
- [ ] Cover-letter links work.
- [ ] Main-site navigation works from both application pages.
- [ ] No 404s on direct entry routes.
- [ ] Visual check completed for desktop and mobile.
- [ ] Deployment commit SHA matches GitHub.

## Evidence standard

Use these status labels:

- **REAL**: verified by an actual GitHub/Vercel result or live HTTP test.
- **PARTIAL**: some deployment or route evidence exists, but the full chain is not verified.
- **BLOCKED**: access or tooling prevents verification.
- **DEGRADED**: the route works but visual/function quality is not acceptable.

No receipt = not REAL.

## Known failure mode to avoid

Do not create a new application selector at `/` just because application pages are difficult to route. The correct solution is to preserve the existing React root and copy/serve `LAB3/` and `Infosys/` as static directories from the same build.

Do not claim that two Vercel projects are equivalent because both deploy the same repository. Their project ownership, domains, deployment commit and production status still need to be checked.

## Next-time procedure

1. Fetch GitHub `main` and confirm current commit.
2. Identify both Vercel projects and their owners.
3. Match each production deployment to a GitHub commit.
4. Test the root and every application route.
5. Fix routing/build problems in GitHub, not by replacing the root site.
6. Apply target-company visual styling to the complete application package, not just its index page.
7. Redeploy and repeat the route tests.
8. Report only verified outcomes.
