# Grocery Compare agent context

## Stack

- Frontend: React + Vite in `frontend/`
- Backend: Node.js + Koa in `backend/`
- Persistence: MongoDB + Mongoose
- E2E: Playwright in `e2e/`
- API contract: `backend/docs/openapi.yaml`

## Commands

- Backend: `cd backend && npm test`, `npm run lint`
- Frontend: `cd frontend && npm run test:run`, `npm run lint`, `npm run build`
- E2E: `cd e2e && npm test`

## A few habits to keep us aligned

- Start with the files named in the task and follow direct dependencies only when needed.
- Keep routes/controllers, services, models, validation, and React features separated.
- Update the API contract when an endpoint changes.
- Add success and failure-path tests for changed behavior.
- Never expose secrets or commit environment files.
- Prefer local scripts and small MCP calls. Use the cheapest model that can do the job well.

Detailed workflow guidance is in `docs/AGENTIC_WORKFLOW.md` and role prompts are in `.codex/agents/`.
