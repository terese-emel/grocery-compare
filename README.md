# Grocery Compare

Grocery Compare is a full-stack application for searching grocery products, comparing prices across shops, and identifying the cheapest option.

## Live demo

- [Open the application](https://grocery-compare-lf85.onrender.com)
- [API health check](https://grocery-compare-backend.onrender.com/health)

The demo uses React and Vite for the frontend, a Node.js/Koa API, MongoDB Atlas for product and user data, and Render for hosting.

The API also exposes `/live` for process liveness and `/ready` for database readiness.

## Features

- User registration and login with HTTP-only cookie authentication
- CSRF protection, CORS, rate limiting, security headers, and structured errors
- Product search with name and shop filters
- Pagination and cheapest-price comparison, including ties
- Product creation, price updates, and deletion with ownership authorization
- Zod validation for request bodies and query parameters
- OpenAPI documentation with Swagger UI
- Automated unit, API, integration, frontend, and Playwright tests

## Architecture

```text
React + Vite frontend
        │ fetch with credentials and CSRF headers
        ▼
Node.js + Koa API
        │ middleware → routes → controllers → services
        └── Mongoose → MongoDB
```

The layered structure keeps HTTP concerns in controllers, business logic in services, and persistence in database models. This makes the application easier to test and extend.

## Project structure

```text
grocery-compare/
├── backend/
│   ├── src/
│   │   ├── controllers/ middleware/ models/ routes/
│   │   ├── services/ validation/ utils/
│   │   └── index.js
│   └── tests/              # unit, API, and integration tests
├── frontend/
│   └── src/                # React components, pages, services, and styles
├── e2e/                    # Playwright tests and Page Objects
├── docker-compose.yml
└── README.md
```

## Local setup

Requirements: Node.js, npm, and Docker Desktop for the containerized setup.

Create local environment files from the examples:

```bash
cp backend/.env.example backend/.env
cp .env.example .env
```

Set local values in `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/grocery_compare
JWT_SECRET=replace_with_a_long_local_secret
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Set the frontend API URL in `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

Never commit environment files or credentials.

## Run locally

Run the backend and frontend in separate terminals:

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

Open `http://localhost:5173`.

Or run the complete local stack with Docker:

```bash
docker compose up --build
```

Open `http://localhost:8080`. Stop the stack with:

```bash
docker compose down
```

## Monitoring

The Docker stack includes Prometheus and Grafana for local API monitoring.

```text
Prometheus: http://localhost:9090
Grafana:    http://localhost:3002
Metrics:    http://localhost:3000/metrics
Readiness:  http://localhost:3000/ready
Liveness:   http://localhost:3000/live
```

Prometheus scrapes backend request, response-time, error, and Node.js runtime metrics. Grafana provides the `Grocery Compare API` dashboard and server-error alert. Grafana data sources and dashboards are provisioned from `monitoring/grafana/` so the local monitoring setup can be recreated from the repository.

## API documentation

With the backend running, open:

```text
http://localhost:3000/docs
```

The OpenAPI specification is stored in `backend/docs/openapi.yaml`. Example requests are in `backend/requests.http`.

## Testing

Backend tests:

```bash
cd backend
npm test
npm run lint
```

Frontend tests and production build:

```bash
cd frontend
npm run test:run
npm run lint
npm run build
```

Playwright tests:

```bash
cd e2e
npm install
npx playwright install chromium
npm test
```

Playwright uses Page Object Models and covers authentication, product search, product creation, validation, and ownership behavior. GitHub Actions runs backend, frontend, OpenAPI, coverage, and Playwright checks on repository changes.
