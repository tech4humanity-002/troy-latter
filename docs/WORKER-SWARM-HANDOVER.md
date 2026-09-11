# T4H Worker Swarm Handover

**Updated:** 11 September 2026
**Repository:** `tech4humanity-002/troy-latter`
**Durable control location:** GitHub
**Purpose:** operational handover for the worker swarm, portfolio scheduling, evidence, failure handling and truthfulness.

## 1. Non-negotiable operating model

The portfolio does **not** require three permanent workers per job.

- **Worker 1:** attempts the next uncompleted action.
- **Worker 2:** consumes Worker 1's recorded handoff, verifies the work, fixes it or completes the next action.
- **Shared Sweeper:** only used when the same action remains unresolved after two worker attempts. The Sweeper is shared across the portfolio and moves between groups of two.
- Maximum normal allocation per job: **2 active workers**.
- A third worker is an escalation role, never a permanent seat.
- When Worker 2 completes an action, the job does not stop. It immediately becomes eligible for its next queued action.
- The system is intended to continue around the clock without requiring a human to repeatedly restart the process.

This model is consistent with durable handoff systems where state is explicit, auditable and resumable rather than held only in conversation context. The important principle is not the number of agents but the durable task, handoff and evidence state.

## 2. The ten current portfolio workstreams

These are the current control representation. Do not silently add, remove or rename workstreams because a worker happens to have another idea.

| # | Workstream | Purpose | Important known assets / locations | Current truth |
|---|---|---|---|---|
| 1 | **LLM Drain / Super Drain** | Exhaustively recover unfinished work, code, assets, decisions and connections from available conversations/documents | Live deployment: `https://super-drain.vercel.app/`; use the Drain workbook/sheets and the file names/locations already provided by the user | Real worker execution observed; last known result PARTIAL; do not require Drain output to be stored in Supabase |
| 2 | **GitHub Issues** | Triage, reproduce and boundedly remediate real repository issues | `tech4humanity-002/troy-latter` and other authorised repos | Work must be tied to an issue, source commit, changed files, tests and provider verification |
| 3 | **Estate: GitHub / Vercel / Lovable / S3** | Establish current truth across repositories, deployments, source and public routes | GitHub repo plus application/deployment estate | Must verify source and live deployment separately; never infer a live state from a database row |
| 4 | **Research** | Turn internal/external sources into useful findings, connections and actions | Research files, source records and research outputs | Must preserve source evidence and route actionable findings |
| 5 | **Mac + Google Drive / Filestore** | Sweep and recover source material without destructive handling | Mac Desktop, MyDrive `0001A`, T4H shared content; active spine `000A`-`000E`; `000F`-`000L` reserved | Execution surface, not merely a database dependency; preserve source identity and resumability |
| 6 | **AWS SSM / S3 / Lambda** | Establish and verify bounded AWS operational foundations | AWS resources, SSM, S3, Lambda and CloudWatch evidence | Must inventory before change and perform real smoke tests |
| 7 | **GitHub Cleanup + CI/CD** | Repair estate drift, failed workflows, stale branches, dead routes and delivery problems | GitHub Actions, repo configs, Vercel/source relationships | Must use source commit + workflow/build/route evidence |
| 8 | **Control Room / Reporting** | Provide live operational truth across the portfolio | Worker events, control workbook, dashboards | Must show actual events, not retrospective summaries |
| 9 | **CVs + Jobs / Applications** | Find, tailor, build and validate authentic applications | Job-specific folders/sheets, CVs, cover letters, landing pages, supporting pages and deployments | Each application is a package, not just a CV and cover letter |
| 10 | **Marketing** | Produce and distribute real campaigns and assets | Marketing sheets, brochures, campaign assets and destinations | Real execution has occurred; recent output/proof recording was incomplete |

The work-order definitions are also preserved in `docs/SWARM-WORK-ORDERS-001.md`.

## 3. Job/application package rule

Where a workstream is a job application, the package can include:

```text
JOB
├── job specification
├── company/research
├── CV
├── cover letter
├── landing page
├── supporting web pages
├── supporting evidence / matrix / infographic where useful
├── company-specific visual identity
├── responsive/mobile presentation
├── links/navigation
├── GitHub package
├── deployment
└── final link/function audit
```

Known application estate includes `LAB3`, `Infosys` and `ey-parthenon` under the `troy-latter` repository. The application-pack registry is the source of truth for package structure and route verification.

Do not genericise company-specific work. Preserve the target company's visual identity where that is part of the brief.

## 4. 24/7 scheduling and spacing

The scheduler must behave like an operating system, not a list of ten jobs that are manually started once.

### Required behaviour

1. **Queue continuously.** Every workstream has a current action or an explicit `WAITING`, `BLOCKED`, `COMPLETE` or `REVIEW` state.
2. **Use `next_due_at`.** Work becomes eligible when due rather than being started on a fixed wall-clock batch only.
3. **Stagger work.** Do not start all ten workstreams on the same minute. Spread starts across the clock so provider calls, LLM calls, GitHub API calls and filesystem operations do not collide.
4. **Use jitter.** Add small deterministic/randomised spacing around recurring runs to avoid a thundering herd after a scheduler restart.
5. **Use leases.** A worker must claim a job/action before execution and release/renew the lease explicitly.
6. **Use heartbeats.** Long-running actions must periodically prove they are alive. A dead worker must not hold a job forever.
7. **Immediate handoff.** Worker 1 should not wait for the next global scheduler tick before handing its completed/partial action to Worker 2.
8. **Immediate continuation.** When Worker 2 finishes, the next action can be scheduled without waiting for a human prompt.
9. **Shared Sweeper queue.** Escalated actions are ordered by value/urgency and worked by one shared Sweeper, not by permanently reserving a third worker per job.
10. **Fairness.** A high-priority job must not starve the rest of the portfolio. Use priority plus age/last-run information.
11. **Backoff.** Provider failures, rate limits and transient errors must increase the next retry interval rather than hammering the dependency.
12. **Circuit breaking.** Repeated provider failure should pause that dependency while other independent work continues.
13. **Resume from checkpoint.** A restarted worker resumes from the last recorded action/checkpoint, not from the beginning of the conversation.
14. **Daily reconciliation.** The control room reconciles queue, leases, worker events, artifacts and proof around the clock.

### Suggested cadence pattern

This is a scheduling pattern, not a claim that every interval is already deployed:

- **Every 5 minutes:** scheduler/lease/event health check.
- **Every 10 minutes:** active work selection and overdue lease recovery.
- **Every 15 minutes:** eligible workstream dispatch with spacing/jitter.
- **Every 30 minutes:** portfolio fairness sweep and evidence-debt scan.
- **Every 60 minutes:** deeper estate/control-room reconciliation.
- **Every 4 hours:** source inventory / deployment / repository drift scan where appropriate.
- **Daily:** full portfolio reconciliation and stale/unknown state review.

The actual interval for a particular workstream should be driven by its job type, external rate limits and unfinished queue, not by a universal timer.

## 5. Scheduling by job type

Different work should not be scheduled identically.

| Job type | Scheduling characteristic | Failure-control hint |
|---|---|---|
| **Drain / ingestion** | Continuous batches with resumable cursors | Small batches, preserve source IDs, checkpoint after every batch |
| **LLM analysis** | Queue-driven with bounded concurrency | Structured output validation, token/time limits, retry only transient errors |
| **Research** | Scheduled discovery plus event-driven follow-up | Cache unchanged sources, record source hash/date, do not reread everything |
| **GitHub issue fixing** | Event/queue driven | One bounded issue at a time per repo/area, branch before change, test before PR |
| **GitHub CI/CD** | Triggered by repository/workflow state | Never assume green, inspect actual run and commit |
| **Estate audit** | Periodic plus immediate after deployment | Test canonical live routes and source/deployment mapping |
| **Vercel/static applications** | Event-driven after commit/deploy plus periodic route audit | Test every declared route, assets and navigation, not just homepage |
| **Mac/Drive sweep** | Long-running resumable queue | Idempotency, source preservation, cursor/checkpoint, no destructive operation by default |
| **AWS** | Controlled infrastructure jobs | Inventory first, least privilege, smoke test and CloudWatch evidence |
| **Marketing** | Campaign schedule + approval gates | Distinguish draft, approved, published and measured states |
| **CV/job applications** | Opportunity/event driven | JD snapshot, evidence map, package audit, link/deployment test |
| **Control room** | Continuous telemetry | Event-level records within minutes, not retrospective summaries |
| **Sweeper** | Priority queue | Only accepts actions with two recorded failed/unfinished attempts and evidence |

## 6. Hints for non-failure

The workers should be engineered to make failure recoverable rather than pretending failure does not occur.

### Before acting

- Read the current job sheet and latest handoff.
- Read the last successful checkpoint.
- Check whether another worker already owns the action.
- Check whether the intended artifact already exists.
- Check the real provider/repository/deployment before changing anything.
- Define the smallest useful action that can be verified.

### While acting

- Prefer idempotent operations.
- Use bounded timeouts.
- Record inputs and outputs.
- Keep provider calls small and retryable.
- Validate LLM output against a schema before treating it as structured data.
- Never overwrite a source artifact when a new version can be created safely.
- For GitHub, branch before authorised changes and test before proposing closure.
- For deployments, test the public destination, not only local/source state.
- For files, preserve original source identity and location.
- For external APIs, distinguish authentication failure, rate limiting, timeout, provider error and bad request.
- For partial work, record exactly where to resume.

### After acting

- Verify the output independently where practical.
- Record artifact and proof references.
- Record the next exact action.
- Write the handoff before releasing the job.
- Do not call an action complete because the model produced plausible prose.

## 7. The truth / no-make-believe rule

This is a hard control rule because previous operating behaviour repeatedly blurred plans, claims and reality.

**The system must never say that something happened when it only intended, proposed or imagined that it happened.**

Unacceptable examples include:

- "Worker 1 is assigned" when no live assignment/lease exists.
- "Worker 2 picked it up" when there is no linked handoff and action record.
- "The job is blocked" because a Supabase status says `BLOCKED`, without checking the actual dependency.
- "The site is fixed" without testing the live route.
- "The code is deployed" without verifying the deployment.
- "The CV is done" when the required package pages/assets/links are incomplete.
- "The marketing campaign ran" when only copy was generated.
- "Drain processed everything" when only one batch was executed.
- "Supabase contains the result" when the actual work product belongs in Drain, GitHub, Vercel, Drive or another natural location.
- "The worker pool is running" when only a theoretical allocation exists.

When evidence is missing, the correct language is `UNKNOWN`, `PARTIAL`, `BLOCKED`, `FAILED` or `NOT VERIFIED`.

## 8. Coding-quality rule

The worker must not hide weak coding behind confident prose.

When code is changed:

1. inspect the existing code and surrounding files;
2. understand the actual framework/build/deployment path;
3. make the smallest correct change;
4. run the relevant build/test/lint or equivalent verification;
5. inspect the generated/live result;
6. record the changed files and verification;
7. if the change cannot be safely verified, mark it PARTIAL/BLOCKED rather than claiming success.

A generated code snippet is not a completed implementation. A local file is not a deployment. A successful API write is not proof that the user-visible behaviour works.

## 9. GitHub reality

The primary known repository is:

- `tech4humanity-002/troy-latter`
- branch: `main`

Important durable documents include:

- `docs/WORKER-SWARM-HANDOVER.md`
- `docs/SWARM-WORK-ORDERS-001.md`
- `docs/APPLICATION-PACK-REGISTRY.md`
- `docs/VERCEL-DUAL-PROJECT-RUNBOOK.md`

Application paths known in the repository include:

- `/LAB3/`
- `/Infosys/`
- `/ey-parthenon/`

Do not invent another repository/path because a previous worker failed to find the real one. Search the repository and inspect the actual tree.

For GitHub work, the evidence chain should normally contain repository, branch, source commit, changed files, test/workflow result and final provider state.

## 10. Vercel / public deployment reality

Known public Drain deployment:

`https://super-drain.vercel.app/`

This URL is a real execution/deployment surface and must be checked directly when Drain work is being verified.

For application/deployment work, source and live deployment are separate facts. A correct GitHub file does not prove that Vercel is serving it. A Vercel deployment does not prove that the repository contains the intended source.

For every important public route, verify:

- HTTP response
- expected page/content
- assets
- navigation
- target links
- mobile/responsive behaviour where relevant
- deployment/source relationship

## 11. Supabase reality

Known live runtime:

- project: `pflisxkcxbzboxwidywf`
- function: `t4h-world-autonomous-swarm-live2`
- runtime: `t4h-world-runtime-swarm-v4`
- function JWT verification is disabled for the function endpoint and the runtime uses its internal service-role path

Known runtime/control table names observed in the live estate include:

- `t4h_world_work_sources`
- `t4h_world_worker_leases`

Do **not** invent additional table names or claim that an event/artifact table exists without inspecting the actual schema.

Supabase is the control/telemetry layer where appropriate. It is **not the mandatory storage location for every work product**.

Examples:

- Drain output can remain in Drain/files/deployment and be referenced from the workbook.
- GitHub work belongs in GitHub.
- Application assets belong in their application/repository/deployment locations.
- Marketing deliverables belong in their natural asset/distribution locations.
- Drive/file work belongs in the relevant file estate.
- AWS work belongs in AWS plus its evidence record.

The control system records where the work lives and what proves it.

## 12. Known runtime evidence and issues

### Verified/observed

- A live Supabase worker/orchestrator exists.
- The `live2` runtime has executed parallel signal lanes.
- A recent run had 8 candidates, 8 starts, 6 completed and 2 degraded.
- Drain has produced an actual execution sequence: `START -> TASK_FOUND -> ACTION -> OUTPUT -> VERIFICATION -> RESULT PARTIAL`.
- Marketing has produced real execution events but recent proof/output recording was incomplete.

### Known issues that must not be hidden

1. **Drain proof debt:** real work occurred but the relevant event did not have complete artifact/proof references.
2. **Marketing proof debt:** execution occurred but recent outputs lacked complete artifact/proof references.
3. **OpenRouter lane degradation:** recent run returned `not_json` and invalid work proof.
4. **Google Backend lane degradation:** recent run returned a missing-action proof problem even though readback verified.
5. **GitHub live-swarm workflow failure:** known workflow run failed because required runtime secrets were absent in that workflow environment. This is a trigger/workflow configuration failure, not proof that GitHub itself is unusable.
6. **False blockage inference:** several work orders had database `BLOCKED` states that were not sufficient evidence of actual provider blockage.
7. **Worker allocation gap:** a theoretical 2-worker model was described before live per-job assignment evidence existed.
8. **Worker 2 handoff gap:** the rule was defined, but it must not be claimed as operational for a job until the linked handoff/action records exist.
9. **Supabase overreach:** previous reasoning treated Supabase as if it had to contain every work product. That is wrong.
10. **Scheduling gap:** parallel signal-lane execution does not prove that the ten portfolio workstreams are continuously scheduled around the clock.
11. **Evidence gap:** completion without a durable artifact/proof reference is not completion.
12. **Coding-quality gap:** generated or described code must not be treated as working implementation without build/test/live verification.

## 13. Unacceptable operating behaviours

The following are explicitly prohibited:

- telling the user work is happening when no execution evidence exists;
- making up workers, assignments, leases, queues or handoffs;
- describing a plan as if it were a completed action;
- claiming a deployment without checking it;
- claiming a route works without testing it;
- claiming a GitHub fix without inspecting the repository and resulting state;
- claiming Supabase has data without reading the relevant table/record;
- inventing table names, file names, paths, repository names or URLs;
- calling something blocked from a stale database status alone;
- hiding failed code behind a successful-sounding narrative;
- stopping after one worker attempt when the agreed second-worker path has not run;
- creating a permanent third worker instead of using the shared Sweeper;
- making a giant generic workbook that loses job-specific operational detail;
- forcing Drain or other natural work products into Supabase merely to make the control system look complete;
- asking the user to repeat information already recorded in the workbook, repository or job-specific assets;
- producing a link to an artifact that does not actually exist;
- substituting explanation for execution when execution is requested.

## 14. Mandatory action record

Every worker action must record:

1. Job/workstream
2. Action ID
3. Worker ID
4. Attempt number
5. Start time
6. Completion time
7. Exact action
8. Result
9. Status
10. Artifact/output reference
11. Proof/evidence reference
12. Outstanding action
13. Handoff recipient
14. Human review requirement where applicable
15. Provider/API/repository target where relevant
16. Error class where relevant
17. Retry/backoff decision where relevant

A worker that cannot produce an evidence reference must explicitly record why.

## 15. Master workbook and job-specific sheets

The workbook is the master control surface. It should include, at minimum:

- `00 CONTROL`
- `01 JOBS`
- `02 JOB ASSETS`
- `03 ACTION LOG`
- `04 SWEEPER QUEUE`
- `05 PROOF REGISTER`
- `06 KNOWN ISSUES`
- `07 UNACCEPTABLE`
- `08 LOCATIONS`

The workbook must also point to the separate operational material for Drain, applications, marketing, research, GitHub and other substantial workstreams.

The master workbook must not become a dumping ground for all work product. It is the index, control and evidence register.

## 16. Completion states

Use these meanings consistently:

- **REAL:** intended output exists and required evidence verifies it.
- **PARTIAL:** useful work exists but the completion contract is incomplete.
- **BLOCKED:** a reproducible dependency prevents progress and is recorded explicitly.
- **FAILED:** execution was attempted and did not achieve the intended result.
- **UNKNOWN:** current state has not yet been verified.
- **REVIEW:** work exists but requires human decision/approval before closure.
- **COMPLETE:** use only when the workstream's stated definition of done is satisfied and evidence is recorded.

## 17. Live telemetry requirement

Within the first five minutes of a production run, the control system should show actual event records for:

`START -> TASK_FOUND -> INPUT_READ -> FINDING -> ACTION -> OUTPUT -> VERIFICATION -> RESULT`

or an explicit `BLOCKED`/`FAILED` event.

No retrospective success narrative substitutes for event evidence.

## 18. Next execution protocol

For every workstream:

1. Load the job-specific sheet and latest action state.
2. Load the latest worker handoff/checkpoint.
3. Claim the next action with a lease.
4. Worker 1 executes the smallest useful verifiable action.
5. Record the result, artifact/proof and exact next action.
6. Hand off to Worker 2 immediately.
7. Worker 2 verifies/fixes/completes the recorded next action.
8. If unresolved after two attempts, create a Sweeper queue item with both attempts and evidence.
9. Sweeper works the highest-value eligible escalation.
10. Requeue the job's next action so work continues around the clock.
11. Reconcile evidence and provider state before marking complete.

The system should always be able to answer, for any job: **what is the next action, who owns it, when is it due, what happened last, where is the work, and what proves it?**

## 19. Final rule

**Reality beats narrative. Evidence beats confidence. The next action beats a status label.**

If the system does not know, it must say it does not know.
If a worker failed, record the failure and continue where safe.
If an action can be retried, retry it with bounded backoff.
If it needs a second worker, hand it over.
If two attempts fail, use the shared Sweeper.
If the work is real, show where it is and what proves it.

Do not make believe.
