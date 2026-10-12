# Grocery Compare

Grocery Compare is a full-stack learning project for comparing grocery prices across shops and finding the cheapest option.

## Current features

- Search products by name
- Sort matching products by price
- Find the cheapest product, including ties
- Create, update, and delete products through the API
- Validate required product fields and non-negative prices
- Reusable Zod validation middleware for request bodies and query parameters
- Paginated product search with name and shop filters
- MongoDB indexes for search, price sorting, and ownership checks
- React frontend with loading and error states
- React controls for adding, editing, and deleting products
- MongoDB persistence through Mongoose
- JWT authentication and product ownership authorization
- HTTP-only cookie authentication with session restoration and logout
- Structured API errors with stable error codes and request IDs
- OpenAPI documentation and Swagger UI
- Automated backend, frontend, and browser tests

## Application flow

```text
Browser
  ↓
React frontend
  ↓ fetch with credentials: include
Koa API
  ↓ request ID and error handling middleware
  ↓ Zod validation middleware
  ↓ routes → controllers → services → models
Mongoose
  ↓
MongoDB
```

## Architecture decisions

The project uses a layered full-stack architecture:

```text
React UI
  ↓
Frontend services and auth context
  ↓ HTTP requests with credentials and CSRF headers
Koa routes
  ↓
Middleware: request IDs, security headers, CORS, rate limiting, CSRF, auth
  ↓
Controllers: HTTP status codes and response shapes
  ↓
Services: business rules and database queries
  ↓
Mongoose models
  ↓
MongoDB
```

### Why this architecture?

- **React and Vite** provide a fast component-based frontend with a simple development and production build workflow.
- **Koa** keeps the backend middleware pipeline explicit and lightweight, which makes authentication, validation, errors, and request tracing easy to reason about.
- **Controllers and services are separated** so HTTP concerns stay in controllers while business logic remains reusable and testable.
- **Mongoose** provides schema definitions, validation, indexes, and MongoDB integration without hiding the data model.
- **MongoDB** fits the product document shape and supports filtering, sorting, ownership, and pagination.
- **Zod** validates request bodies and query parameters at the API boundary before data reaches controllers or services.
- **HTTP-only cookies** protect authentication tokens from direct JavaScript access. CSRF tokens protect state-changing browser requests.
- **OpenAPI and Swagger UI** make the API contract discoverable and validate documentation changes in CI.
- **Docker Compose** provides a repeatable local environment with frontend, backend, and MongoDB services.
- **Unit, API, integration, and E2E tests** provide coverage at different levels: isolated logic, HTTP behavior, database behavior, and real browser-to-container behavior.

### Testing architecture

```text
Frontend component and service tests
  ↓ Vitest + React Testing Library
Backend unit and API tests
  ↓ Jest + Supertest
Backend integration tests
  ↓ Jest + MongoDB Memory Server
Mocked browser tests
  ↓ Playwright
Real-stack browser test
  ↓ Playwright → Nginx → Koa → MongoDB containers
```

The mocked browser suite is fast and deterministic. The real-stack suite verifies that the deployed container boundaries, cookies, CORS configuration, API calls, and database persistence work together.

Authentication flow:

```text
Register or login → backend sets an HTTP-only auth cookie
  ↓
Browser automatically includes the cookie with API requests
  ↓
Authentication middleware identifies the user
  ↓
Ownership checks protect product updates and deletions
```

Cookie authentication also uses CSRF protection:

```text
Backend sets csrf_token cookie
  ↓
Frontend reads the non-HTTP-only CSRF cookie
  ↓
State-changing requests send X-CSRF-Token
  ↓
Backend compares the cookie and header values
```

The CSRF header is required for authenticated `POST`, `PUT`, `PATCH`, and
`DELETE` requests. Safe `GET` requests do not require it.

Docker flow:

```text
docker compose
  ├── MongoDB
  ├── Koa backend
  └── Nginx frontend
```

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/products` | Get paginated products |
| GET | `/products?name=milk` | Search products by name |
| GET | `/products?shop=Coop` | Search products by shop |
| GET | `/products?name=milk&shop=Coop&page=1&limit=10` | Filter and paginate products |
| GET | `/products/cheapest?name=milk` | Get the cheapest matching product(s) |
| GET | `/products/:id` | Get one product by ID |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Replace a product's price |
| PATCH | `/products/:id` | Update a product's price |
| DELETE | `/products/:id` | Delete a product |
| GET | `/health` | Check API and database health |
| POST | `/auth/register` | Register a user and set an HTTP-only auth cookie |
| POST | `/auth/login` | Log in and set an HTTP-only auth cookie |
| POST | `/auth/logout` | Clear the auth cookie |
| GET | `/auth/me` | Return the authenticated user |

Example product:

```json
{
  "name": "Arla Milk 1L",
  "shop": "ICA",
  "price": 10.9,
  "unit": "1L"
}
```

## Project structure

```text
grocery-compare/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validation/
│   │   └── index.js
│   ├── tests/
│   │   ├── unit/
│   │   ├── api/
│   │   └── integration/
│   ├── .env
│   ├── requests.http
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.local
│   └── package.json
├── docker-compose.yml
├── e2e/
│   ├── fixtures/
│   ├── pages/
│   ├── tests/
│   │   ├── auth/
│   │   └── products/
│   ├── playwright.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## Configuration

The local backend uses MongoDB configuration from `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/grocery_compare
JWT_SECRET=replace_with_a_long_local_secret
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
PORT=3000
```

For a local backend, copy the example configuration:

```bash
cp backend/.env.example backend/.env
```

The frontend uses `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

Never commit credentials or files containing secrets.

## Running the project

Start the backend in one terminal:

```bash
cd backend
npm install
npm run dev
```

Start the React frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend at `http://localhost:5173`. The API runs at `http://localhost:3000`.

Run the complete application with Docker:

```bash
cp .env.example .env
docker compose up --build
```

Open the containerized frontend at `http://localhost:8080`. Docker runs MongoDB on an internal network, the backend on port `3000`, and the frontend through Nginx on port `8080`.

The frontend API URL is supplied during the image build with the `VITE_API_URL` build argument. Rebuild the frontend image when changing the API URL.

Compose uses health checks to coordinate startup: MongoDB must respond to a ping before the backend starts, and the backend must report healthy before the frontend starts.
The root `.env` file is ignored by Git and supplies the local JWT signing secret. Never commit real secrets.
The backend container runs as the non-root `node` user.

Seed local pagination data with:

```bash
cd backend
npm run seed:pagination
```

This creates 25 products for `pagination-demo@example.com`, which produces three
pages with the default page size of 10. The script only removes products owned by
that demo user.

Check the service health with:

```bash
docker compose ps
```

Stop the containers with:

```bash
docker compose down
```

To test the API in VS Code, open `backend/requests.http` with the REST Client extension.

Run the mocked browser tests:

```bash
cd e2e
npm test
```

Run the real Docker-stack browser test after the Compose services are running:

```bash
docker compose up --build --detach
cd e2e
npm run test:real
docker compose down
```

The real-stack test registers a temporary user, creates a product in MongoDB,
and searches for it through the containerized frontend and backend.

Run unit tests:

```bash
cd backend
npm run test:unit
```

Unit tests test service logic without HTTP or MongoDB.

Run API tests:

```bash
npm run test:api
```

API tests exercise Koa routes and controllers with mocked services.

Run integration tests:

```bash
cd backend
npm run test:integration
```

Integration tests use a temporary in-memory MongoDB instance and do not modify your real database.

Run all backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm run test:run
```

Frontend tests use Vitest and React Testing Library.

Run end-to-end browser tests:

```bash
cd e2e
npm install
npx playwright install chromium
npm test
```

Playwright starts the frontend on port `4173` and uses mocked API responses. The E2E suite uses Page Object Model classes and covers registration, login, logout, validation errors, product search, product creation, and ownership authorization.

Run the browser tests with the visible browser:

```bash
npm run test:headed
```

View the latest Playwright report:

```bash
npm run report
```

GitHub Actions runs backend tests, frontend tests, OpenAPI validation, Playwright tests, Docker smoke tests, and Trivy container scans on pushes and pull requests.

## Learning path

The project is being developed step by step:

1. REST APIs with Koa
2. MongoDB and Mongoose
3. React components, state, props, and effects
4. Frontend API integration
5. Test automation with Jest, Vitest, React Testing Library, and Playwright
6. Docker and local environment configuration
