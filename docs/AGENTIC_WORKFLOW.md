# Agentic Full-Stack Development Workflow

This workflow turns a feature request into a small, reviewable vertical slice. It is designed for Grocery Compare and supports React, JavaScript/TypeScript, Node.js, API, database, and end-to-end work.

## Operating rules

1. Keep the working tree runnable after each stage.
2. Prefer the smallest vertical slice that proves the requirement.
3. Never invent product behavior, API contracts, or security exceptions. Mark assumptions and ask when they affect scope or data safety.
4. Preserve existing conventions unless the change explicitly requires a migration.
5. Do not expose secrets, tokens, personal data, or unrestricted database output in code, logs, tests, or prompts.
6. Every changed behavior needs a success-path test and at least one meaningful failure-path test.
7. The agent may edit code and tests, but a human owns product decisions, credentials, migrations, and final merge approval.
8. Use MCP servers selectively: prefer local repository tools for source code, tests, and git; invoke an MCP server only when it provides data or an action unavailable locally.

## Workflow at a glance

```text
Requirement
    -> Understand and de-risk
    -> Implementation plan
    -> Small code change
    -> Tests and quality gates
    -> Pull-request review
    -> Human approval and merge
```

## 1. Read and break down the requirement

The agent first produces a requirement brief before writing code.

### Requirement brief

```md
## Goal
One sentence describing the user or business outcome.

## Actors and entry points
- Who uses it?
- Which React screen, API route, job, or database flow is involved?

## Acceptance criteria
- [ ] Observable success behavior
- [ ] Validation and empty-state behavior
- [ ] Authentication, authorization, and security behavior
- [ ] Error behavior and recovery
- [ ] Performance or accessibility constraints

## Scope boundaries
- In scope:
- Out of scope:

## Assumptions and open questions
- Assumption:
- Question requiring human/product input:

## Risk map
- Data/schema risk:
- Security/privacy risk:
- Compatibility risk:
- Operational risk:
```

The agent should inspect the relevant existing route, service, component, API client, model, and nearby tests before proposing changes. It should identify the current contract rather than infer one from filenames.

## 2. Suggest an implementation plan

The plan should be ordered by dependency and describe files, contracts, and verification.

```md
## Implementation plan

1. Contract: define request/response or component-state changes.
2. Backend: update validation, route/controller/service/model as needed.
3. Frontend: update API boundary, state, UI, loading, empty, and error states.
4. Tests: add focused unit/API/component tests and an E2E test when the user flow crosses the stack.
5. Documentation: update OpenAPI, README, or operational notes if behavior changes.
6. Verification: run targeted tests, lint, build, and relevant CI-equivalent checks.

## Files expected to change
- `path/to/file`: reason

## Risks and rollback
- Risk:
- Rollback or compatibility strategy:
```

For this repository, use the existing boundaries: React feature modules and shared services in `frontend/src`, Koa routes/controllers/services/models in `backend/src`, and Playwright page objects/tests in `e2e`.

## 3. Draft React, TypeScript, or Node.js code

Implement in small slices. Each slice should be easy to review and should keep the public contract explicit.

### Coding checklist

- Reuse the existing API client, error format, validation, and authentication flow.
- Keep HTTP concerns in controllers/routes and business rules in services.
- Keep React rendering separate from data-fetching and mutation logic where the project already does so.
- Type boundary data explicitly when introducing TypeScript; do not hide unsafe values behind `any`.
- Handle loading, empty, success, and error states intentionally.
- Validate untrusted input at the boundary and authorize ownership-sensitive operations.
- Avoid unrelated refactors, generated files, dependency upgrades, and formatting churn.

### Agent implementation response

```md
## Implemented
- What changed and why.
- API or UI contract changes.
- Security and failure behavior.

## Not implemented
- Explicitly out-of-scope items.

## Verification so far
- Commands run:
- Results:
```

## 4. Write or update tests

Choose the narrowest test level that proves each acceptance criterion, then add broader coverage only where integration risk warrants it.

| Concern | Preferred test location | Example |
| --- | --- | --- |
| Pure business rule | `backend/tests/unit` | cheapest-price or validation rule |
| HTTP contract and auth | `backend/tests/api` | status, body, headers, authorization |
| Persistence and ownership | `backend/tests/integration` | Mongo-backed behavior |
| React behavior | `frontend/src/**/*.test.jsx` or `.tsx` | states, interaction, error rendering |
| Full user journey | `e2e/tests` | register/login/search/create/update |

### Test matrix

```md
| Acceptance criterion | Test | Level | Status |
|---|---|---|---|
| Happy path | ... | unit/API/component/E2E | added |
| Invalid input | ... | API/component | added |
| Unauthenticated or unauthorized access | ... | API/E2E | added |
| Empty or unavailable dependency | ... | component/integration | added |
```

Run targeted checks first, then the relevant project gates:

```bash
cd backend && npm test && npm run lint
cd ../frontend && npm run test:run && npm run lint && npm run build
cd ../e2e && npm test
```

Only report a check as passing when its command completed successfully. If an environment dependency prevents a check, report it separately from product failures.

## 5. Review the pull request and identify issues

Review the diff as a separate pass. Do not assume that passing tests means the change is correct.

### Review order

1. Requirement coverage: does the behavior satisfy every acceptance criterion?
2. Correctness: inspect edge cases, error paths, race conditions, and data transformations.
3. Security: authentication, authorization, CSRF, input validation, leakage, and logging.
4. Compatibility: API/OpenAPI contract, existing clients, migrations, and deployment configuration.
5. Test quality: meaningful assertions, failure paths, deterministic tests, and missing coverage.
6. Operability: useful errors, health/metrics impact, timeout behavior, and rollback.
7. Maintainability: boundaries, naming, duplication, and unnecessary scope.

### Review output

```md
## Review summary
Approve / Request changes / Needs human decision

## Findings

### [P0/P1/P2/P3] Short issue title
- File and line:
- Problem:
- Why it matters:
- Suggested fix:

## Missing coverage
- ...

## Verified
- ...

## Human decisions required
- ...
```

Severity guide: P0 blocks release or risks serious security/data loss; P1 is a major correctness or security issue; P2 is a normal fix before merge; P3 is a low-risk improvement.

## MCP integration and cost control

MCP servers are an extension point, not the default path for every step. Keep the normal development loop local and use MCP only for external context or explicitly requested external actions.

### Default budget policy

- Start with zero MCP calls and zero external searches.
- Use local inspection and local tests first.
- Allow at most one discovery call per MCP server per task and reuse its result.
- Prefer one bounded batch call over multiple narrow calls; request summaries and only the fields needed for the decision.
- Do not call another server when the current result is sufficient.
- Stop when the acceptance criteria and verification checks are satisfied; do not spend calls on optional enrichment.
- Escalate from local tools to one MCP call, then to a broader search or another server only when blocked, uncertain on a high-risk fact, or explicitly requested.

The goal is to spend tokens and external calls only where they reduce implementation risk. A valid run may use no MCP servers at all.

### Model and context routing

Choose the lowest-cost model that can complete the task correctly. Do not load the full repository or full conversation for a small lookup.

| Task | Model tier | Context | MCP behavior |
| --- | --- | --- | --- |
| Fetch one Jira/issue ticket, status, title, or assignee | Lowest-cost / fast | Ticket ID and requested fields only | One bounded read call |
| Summarize a ticket or document | Low-cost | Retrieved content only | One read call, no repository scan |
| Explain a small code snippet or locate a file | Low-cost | Relevant file or search results | No MCP unless external context is required |
| Plan a cross-layer feature | Standard | Relevant repository files and tests | Use external MCP only for missing requirements |
| Implement and test a feature | Standard or stronger | Targeted files, contracts, and tests | Minimal external calls |
| Security-sensitive or complex PR review | Strongest appropriate | Focused diff plus relevant tests/configuration | Verify only high-risk external facts |

For a simple Jira fetch, the agent should: identify the ticket key, call the Jira MCP server once with only the needed fields, return a concise result, and stop. It must not start a planning workflow, inspect the repository, call multiple models, or retrieve comments/attachments unless requested.

### Tool-routing policy

| Need | Preferred tool | MCP use |
| --- | --- | --- |
| Read or edit repository files | Local filesystem and patch tools | Do not use MCP |
| Run tests, lint, builds, or git diff | Local command execution | Do not use MCP |
| Inspect a connected document, issue, PR, email, or deployment | Relevant MCP server | Use only the smallest query |
| Create or update an external artifact | Relevant MCP server | Require explicit user scope and confirm irreversible actions |
| Search external documentation or current information | Search/documentation MCP | Query only the exact missing fact |

### Cost-efficient execution rules

- Discover available MCP tools once per task and reuse the selected server/tool; do not repeatedly rediscover capabilities.
- Prefer one focused call with structured fields over many broad calls. Request summaries, selected fields, and bounded result counts.
- Batch independent read-only queries in one tool round when the server supports it.
- Run independent local inspections in parallel, then make one implementation decision from the combined results.
- Keep a compact task context: record file paths, test commands, contracts, and decisions instead of repeatedly rereading full outputs.
- Do not send repository contents to an external MCP server when local inspection is sufficient.
- Do not invoke an MCP server merely to restate information already available in the working tree.
- After a successful mutation, stop querying unless verification is required by the request.
- Escalate to a richer or more expensive model/server only when the cheaper path is blocked or the risk warrants it.

### MCP request template

```md
## MCP request justification
- Missing external capability:
- Selected server/tool:
- Minimal data requested:
- Read-only or mutating:
- Expected result:
- Follow-up call required: yes/no
```

The agent should report which MCP calls were used, why they were necessary, and any external mutations performed. If no MCP server adds value, continue locally and state that no external call was needed.

## Reusable agent prompt

Paste this prompt with a requirement and repository context:

```text
Act as a senior full-stack engineer working in this repository.

First inspect the relevant code, tests, package scripts, and documentation. Do not edit files yet. Break the requirement into a requirement brief with acceptance criteria, scope, assumptions, risks, and open questions. Then propose a dependency-ordered implementation plan with expected files and a test matrix.

After the plan, implement the smallest vertical slice. Follow existing React, Node.js, API, validation, authentication, and testing conventions. Add or update tests for success and failure paths. Do not make unrelated refactors or dependency changes.

Run targeted tests and the relevant lint/build checks. Finally, review the resulting diff as if it were a pull request and report findings by severity with file/line references, missing coverage, verification results, and any human decisions required.

Requirement:
<paste requirement here>
```

## Definition of done

- The requirement is mapped to observable acceptance criteria.
- The plan names affected boundaries and risks.
- Code is scoped, secure, and consistent with the repository.
- Success and failure behavior are tested at appropriate levels.
- Targeted checks and relevant CI-equivalent checks pass, or failures are clearly explained.
- A separate PR review identifies findings and remaining decisions.
- A human reviews the diff and approves merge.
