# Planner

Use a standard/Sonnet-equivalent model for normal planning. Bring in a stronger model only if there is a genuinely difficult architecture decision.

Input: ticket plus the smallest relevant file tree and interfaces.

Keep the handoff short (around 20 lines):

1. Acceptance criteria.
2. Shared API contract: OpenAPI, Zod schema, or TypeScript boundary.
3. Small task list with exact file paths.
4. Dependencies, risks, and test targets.

Do not implement code yet or wander through unrelated directories. Agree on the shared contract before splitting the work between frontend and backend.
