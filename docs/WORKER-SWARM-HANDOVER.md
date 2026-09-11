# T4H Worker Swarm Handover

**Updated:** 11 September 2026 10:48 AEST
**Repository:** `tech4humanity-002/troy-latter`
**Durable control location:** GitHub

## Operating rule

The portfolio does **not** require three permanent workers per job.

- **Worker 1:** attempts the next uncompleted action.
- **Worker 2:** consumes Worker 1's recorded handoff/action items, verifies the work, fixes it or completes the next action.
- **Shared Sweeper:** only used when the same action remains unresolved after two worker attempts. The Sweeper is shared across the portfolio and can move between many job groups.
- Maximum normal allocation per job: **2 active workers**.
- A third worker is an escalation role, not a permanent seat.

## Mandatory recording

Every worker action must leave a record containing:

1. Job/workstream
2. Action ID
3. Worker ID
4. Attempt number
5. Start and completion time
6. Exact action performed
7. Result
8. Status
9. Artifact/output reference
10. Proof/evidence reference
11. Outstanding action
12. Handoff recipient
13. Human review requirement, where applicable

A task is **not complete** merely because a worker says it completed. Completion requires verifiable evidence.

## Handoff rule

Worker 2 must read Worker 1's recorded output and outstanding action items before doing new work on the same job. It must continue from the recorded state rather than restart the job.

After two unsuccessful attempts on the same action, the action moves to the shared Sweeper Queue with both attempts and their evidence attached.

## Job-specific operating sheets

The master control workbook must not flatten the portfolio into one generic sheet. Each substantial workstream retains its own operational sheet and artefacts.

Examples:

- **Drain:** dedicated Drain sheet, including drain actions, unfinished work, assignments, evidence and worker handoffs.
- **Job applications:** each job has its own CV/application sheet and links to its CV, cover letter, company research, landing page, supporting pages, visual assets, deployment and final audit.
- **Marketing:** dedicated Marketing sheet covering brochures, campaigns, assets, distribution and proof.
- **Research:** dedicated research sheet covering sources, findings, actions and evidence.
- **GitHub:** repositories, issues, PRs, Actions, deployment state and proof.
- **Sweeper:** one shared portfolio queue for actions escalated after two attempts.

The master workbook provides the cross-portfolio index and control layer. It does not replace these job-specific sheets.

## Current verified execution state

The live Supabase estate contains real worker/orchestrator infrastructure and records. The Drain worker produced a real execution sequence at approximately 10:11 AEST:

`START -> TASK_FOUND -> ACTION -> OUTPUT -> VERIFICATION -> RESULT PARTIAL`

The Drain result is **PARTIAL**, not complete. Its current event records have `artifact_ref` and `proof_ref` unset. Therefore the next worker must pick up the recorded outstanding work and establish actual output/proof rather than treating the first execution as complete.

The Marketing orchestrator also has real execution records, but recent results are `RESULT BLOCKED` with no artifact/proof references. This is an evidence-recording/output problem, not proof that the whole marketing workstream is impossible.

The broader live2 autonomous swarm recently ran 8 signal lanes in parallel: 6 REAL and 2 DEGRADED. That proves the runtime can execute parallel worker lanes, but it is **not** evidence that the ten-job application portfolio has been fully scheduled. Do not represent it as such.

## Current runtime location

- Supabase project: `pflisxkcxbzboxwidywf`
- Live worker/orchestrator: `t4h-world-autonomous-swarm-live2`
- Runtime target: `t4h-world-runtime-swarm-v4`
- GitHub control repository: `tech4humanity-002/troy-latter`

## Important truth rule

Never infer a blocker from a database status alone. Verify the actual GitHub repository, deployment, application, function, file or external dependency before declaring a job blocked.

Never claim a worker has been assigned to a job unless the assignment exists in the live execution/control records.

Never claim an action is complete without a recorded proof/evidence reference.

## Next execution

1. Take the first job in the user's selected ten-job order.
2. Read its job-specific sheet/artefacts and existing action records.
3. Worker 1 performs the next smallest useful action and records it.
4. Worker 2 consumes that handoff and verifies/fixes the result.
5. If the same action still fails after two attempts, put it into the shared Sweeper Queue.
6. Sweeper works the highest-value unresolved item, then moves to the next group.
7. Continue until the job's definition of done is evidenced.

This handover is the durable instruction. Do not substitute a theoretical worker allocation for live evidence.