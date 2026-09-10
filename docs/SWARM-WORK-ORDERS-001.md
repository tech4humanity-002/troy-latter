# SWARM Work Orders 001

## Operating contract

Every worker execution follows:

`INPUT -> TASK -> ACTION -> OUTPUT -> EVIDENCE -> VERIFICATION -> RECEIPT`

A worker receives a skill and a work order. Worker identity/personality is not part of the contract.

No credit for observation alone. A useful result changes a queue, artifact, provider state, decision, or verified next action.

If blocked, record `BLOCKED` and the exact dependency. Never manufacture completion.

## Definition of done

A work order is `REAL` only when its stated output exists and the required evidence is recorded. `PARTIAL` means useful work exists but the completion contract is incomplete. `BLOCKED` means the dependency is explicit and reproducible. `FAILED` means execution was attempted and did not achieve the intended result.

Every event must record worker, work order, event type, timestamp, current action, finding, action, output, artifact/reference, verification, status and relevant cost/LLM-call data.

## 1. LLM DRAIN

### Mission
Exhaustively process available LLM conversation exports and selected documents, repeatedly. Recover unfinished work, code, assets, decisions, claims, opportunities, risks and cross-chat connections.

### Steps
1. Inventory every available source and preserve source identity.
2. Process conversations/documents in resumable batches.
3. Extract actions, unfinished items, code, assets, decisions, risks, opportunities and unusually positive claims such as canonical/new market/novel/leading.
4. Link related items across different dates, tools and conversations.
5. Score usefulness, urgency, reuse and completion gap.
6. Route actionable items into the appropriate workstream.
7. Preserve uncertain findings for later review rather than discarding them.
8. Emit a receipt for every completed batch.

### Done when
Every processed source has an inventory record; every actionable item has a source reference and route; unfinished work is queued or explicitly closed; extracted code/assets are referenced; cross-chat links are recorded; batch counts reconcile; receipt verifies the run.

### First priority
Use the existing Super Drain methodology and workbook structures. Preserve occurrences, do not silently deduplicate, and treat historical completion claims as evidence to reconcile until current runtime proof exists.

## 2. MARKETING

### Mission
Produce and distribute campaigns, not brainstorm campaigns.

### Steps
1. Select a real campaign objective.
2. Build audience/message/offer and success metric.
3. Produce final copy.
4. Produce or commission the required image/creative asset.
5. Package channel-specific variants.
6. Publish/send to an authorised destination where credentials and approval permit.
7. Capture destination, timestamp and delivery evidence.
8. Measure response where available.

### Done when
A complete campaign package exists and has either reached a real destination with proof or is BLOCKED with the exact missing permission/input. Draft-only output is PARTIAL.

## 3. RESEARCH

### Mission
Turn large internal and external source volumes into useful decisions.

### Steps
1. Maintain a source queue and avoid repeated reading of unchanged material.
2. Retrieve primary/credible sources first.
3. Extract findings, evidence, contradictions and uncertainty.
4. Cross-connect findings across research areas and historical chats.
5. Rank by relevance, novelty, confidence and actionability.
6. Produce concise decision briefs and route resulting work.

### Done when
Each batch has source evidence, retained findings, cross-source connections, uncertainty notes and concrete next actions. A link collection alone is not completion.

## 4. TAX

### Mission
Create a traceable research and evidence pack for tax review.

### Steps
1. Inventory available records and prior calculations.
2. Retrieve authoritative ATO/legislative material relevant to each question.
3. Reconcile figures and assumptions.
4. Identify missing evidence and unresolved treatment questions.
5. Prepare calculations and source references.
6. Separate factual evidence from interpretation and professional-review points.

### Done when
The evidence pack reconciles, every material claim has a source, calculations are reproducible, assumptions are visible and unresolved professional-review questions are explicit. Do not present unreviewed conclusions as tax advice.

## 5. GITHUB ISSUES

### Mission
Convert useful issues into verified fixes or explicit escalation.

### Steps
1. Inventory and prioritise issues.
2. Inspect repository and record source commit.
3. Determine whether the issue is valid, duplicate, stale, blocked or actionable.
4. Reproduce/inspect the problem.
5. Create an agent branch for authorised changes.
6. Make the smallest valid change.
7. Run relevant tests and inspect CI.
8. Open a draft PR by default.
9. Close only when provider state and evidence support closure; otherwise record PR_READY or BLOCKED.

### Done when
Handled issues have a verified final state and evidence. Fixes include source commit, changed files, tests, resulting commit/PR and provider verification. Never push directly to main or merge without required approval.

## 6. GITHUB CLEANUP + CI/CD

### Mission
Reduce estate drift and restore reliable delivery.

### Steps
1. Inventory repositories, branches, workflows and deployment configurations.
2. Find failed workflows, stale branches, duplicate/broken files, dead routes and deployment mismatches.
3. Classify each finding.
4. Fix bounded low-risk defects on branches.
5. Validate builds, routes and workflow results.
6. Record destructive/security-sensitive findings for human approval.

### Done when
The estate has a current finding register and every addressed finding has commit + test/workflow + verification evidence.

## 7. CVs + JOBS

### Mission
Find good roles and produce authentic application packages.

### Steps
1. Search relevant roles.
2. Score fit against the actual job description.
3. Map each claim to verified career evidence.
4. Tailor CV and application materials.
5. Add supporting pages/evidence where they materially improve the application.
6. Validate links, routes and visual rendering.
7. Track application/submission state and follow-up.

### Done when
Each target role has a source, fit score, tailored package, evidence mapping and current application state. No fabricated experience, metrics or credentials.

## 8. ESTATE: GITHUB / VERCEL / LOVABLE / S3

### Mission
Establish one current operational truth for the connected estate.

### Steps
1. Inventory repositories/projects/deployments/assets.
2. Map canonical routes and duplicate/stale routes.
3. Test public paths and important functions.
4. Identify broken links, 404s, stale deployments, missing assets and mismatched source/deployment state.
5. Create bounded repair tasks.
6. Verify against the live destination and source commit.

### Done when
Every inspected component is ACTIVE, STALE, BROKEN or UNKNOWN with evidence. Critical paths have verified repairs or explicit blockers.

## 9. AWS SSM / S3 / LAMBDA

### Mission
Create an operational AWS foundation, not merely resources.

### Steps
1. Inventory existing account/resources before changing anything.
2. Define least-privilege roles and execution boundaries.
3. Configure SSM access/management where authorised.
4. Configure S3 storage, encryption, lifecycle and evidence paths.
5. Configure Lambda with logs, timeout, retry and failure handling.
6. Execute real smoke tests.
7. Inspect CloudWatch/log output and record evidence.

### Done when
Required resources exist, IAM is bounded, logs are observable, test invocation succeeds, outputs are verified and the evidence trail identifies the exact resource/configuration.

## 10. CONTROL ROOM / REPORTING

### Mission
Provide live operational truth for the entire work system.

### Required views
- active work orders
- worker activity
- event stream
- current action
- finding/action/output
- artifacts and provider references
- completed/partial/blocked/failed
- elapsed time
- LLM calls and cost
- throughput by workstream
- evidence debt
- first-five-minute activity

### Done when
A new worker run becomes visible at event level within seconds, not a delayed summary. The dashboard can show what happened in the first five minutes, what changed, what is blocked and what proves completion.

## Mac / Drive sweep dependency

The file-store tunnel and Mac are an execution surface, not a vague dependency. The known ingestion model covers three source surfaces: Mac Desktop, MyDrive `0001A`, and T4H shared content. The active folder spine is currently `000A`–`000E`; `000F`–`000L` are reserved. Do not delete or archive source material merely because it was found.

The Mac worker should operate behind the existing bridge/tunnel or as a queue worker, with authenticated requests, allowlisted operations, idempotency, request logs and timeouts.

## Live telemetry rule

Within the first five minutes of any production run the control room must show actual event records for START, TASK_FOUND, INPUT_READ, FINDING, ACTION, OUTPUT, VERIFICATION and RESULT, or an explicit BLOCKED event.

No retrospective success narrative substitutes for event evidence.
