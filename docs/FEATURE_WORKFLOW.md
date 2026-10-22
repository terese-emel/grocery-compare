# Cost-efficient feature workflow

Use this as a lightweight rhythm for each feature:

1. Give the planner the ticket and only the file paths that matter.
2. Let the planner write the shared API contract and a small task list.
3. Let the frontend and backend work in parallel from that contract when it is useful.
4. Let scripts handle type checks, lint, tests, builds, and E2E checks. Show agents failures and short summaries, not long successful logs.
5. Ask the test writer to fill only the gaps that remain.
6. Give the reviewer a fresh context with the acceptance criteria and diff.
7. Keep the final approval with a human.

## Cost controls

- Keep `CLAUDE.md` and prompts short; bring in detailed guidance only when it is relevant.
- Give every role exact paths and a bounded output limit.
- Use the lowest-cost capable model: lookup/test mechanics first, standard reasoning for implementation, stronger reasoning only for architecture or difficult bugs.
- Use scripts for deterministic checks and summaries.
- Pass contracts and diffs between roles instead of sharing the whole repository.
- Start the next feature with a fresh context after approval so old assumptions do not linger.
- Record approximate model tier, MCP calls, and token usage per feature when available.
