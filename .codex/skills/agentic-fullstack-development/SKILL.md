---
name: agentic-fullstack-development
description: Plan, implement, test, and review React, TypeScript, JavaScript, or Node.js full-stack changes as small, safe, reviewable vertical slices.
---

# Agentic Full-Stack Development

Use this skill when a user asks to build or change a full-stack feature and expects a workflow covering requirements, implementation, tests, and pull-request review.

## Workflow

1. Inspect the relevant repository structure, package scripts, existing implementation, tests, and CI before editing.
2. Write a concise requirement brief: goal, actors, acceptance criteria, scope boundaries, assumptions, open questions, and risks. Do not invent product behavior that affects scope, security, or data safety.
3. Propose a dependency-ordered implementation plan naming the affected files, contracts, test levels, and verification commands.
4. Implement the smallest vertical slice using existing boundaries and conventions. Keep HTTP concerns in routes/controllers, business rules in services, persistence in models, and UI concerns in React components/features. Reuse existing API, validation, authentication, and error-handling patterns.
5. Add or update tests for each acceptance criterion, including meaningful failure-path coverage. Prefer unit tests for pure rules, API tests for contracts/auth/validation, integration tests for persistence/ownership, component tests for UI states, and E2E tests for cross-stack journeys.
6. Run targeted tests first, then relevant lint/build/CI-equivalent checks. Report environment limitations separately from product failures.
7. Review the final diff independently as a pull request. Check requirement coverage, correctness, security, compatibility, test quality, operability, maintainability, unrelated scope, and missing coverage. Report findings with severity and file/line references.

## MCP cost-efficiency

Use MCP servers only when they provide external context or an external action unavailable through local tools. Prefer local filesystem, patch, shell, test, lint, build, and git operations for repository work.

Default to zero MCP calls. Use a cheap-first escalation path: local files and commands, then one bounded MCP query if needed, then broader or additional MCP calls only when blocked or when a high-risk fact must be verified. Set a small call budget before starting, reuse results, batch independent reads, and stop once acceptance criteria and verification checks are complete. A successful task can legitimately use no MCP servers.

Use the lowest-cost capable model and the smallest sufficient context. A simple Jira lookup should use the low-cost/fast tier, make one bounded Jira MCP read for the ticket key and requested fields, return a concise answer, and stop. Do not load repository context, retrieve unrelated comments, invoke a stronger model, or begin implementation unless the user asks for it. Use standard models for implementation and stronger models only when complexity, ambiguity, or review risk justifies them.

- Discover MCP capabilities once and reuse the selected tool.
- Use bounded, structured queries and request only needed fields or summaries.
- Batch independent read-only MCP queries where supported; parallelize independent local inspections.
- Avoid sending source code externally when local inspection is sufficient.
- Do not repeat calls for information already present in the working tree or captured task context.
- Require explicit scope before mutating external systems and verify only when necessary.
- Report MCP calls, their purpose, and external mutations in the final response.

## Project-specific conventions

For Grocery Compare, use `frontend/src` for React features and shared services, `backend/src` for Koa routes/controllers/services/models/validation, `backend/tests` for backend coverage, and `e2e` for Playwright journeys. Update the OpenAPI document when an API contract changes.

For the cost-efficient role workflow, read `docs/FEATURE_WORKFLOW.md` and only the relevant role prompt under `.codex/agents/`. Use the planner to establish the shared contract before parallel frontend/backend work; use the lookup role for small retrieval tasks.

## Safety and scope

- Keep the working tree runnable after each change.
- Never commit or expose secrets, tokens, personal data, or unrestricted database output.
- Preserve authentication, authorization, CSRF, input validation, and ownership checks.
- Avoid unrelated refactors, dependency upgrades, formatting churn, or destructive commands.
- A human owns product decisions, credentials, migrations, and final merge approval.

## Final response

Summarize the requirement, plan, implemented files, tests/checks run, review findings, remaining risks, and any human decisions required. Only claim a check passed when its command completed successfully.
