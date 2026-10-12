# Grocery Compare

Grocery Compare is a full-stack learning project for comparing grocery prices across shops and finding the cheapest option.

## Current features

- Search products by name
- Sort matching products by price
- Find the cheapest product, including ties
- Create, update, and delete products through the API
- Validate required product fields and non-negative prices
- React frontend with loading and error states
- React controls for adding, editing, and deleting products
- MongoDB persistence through Mongoose
- JWT authentication and product ownership authorization
- User registration, login, session restoration, and logout
- OpenAPI documentation and Swagger UI
- Automated backend, frontend, and browser tests

## Application flow

```text
Browser
  ↓
React frontend
  ↓ fetch with JWT
Koa API
  ↓ routes → controllers → services → models
Mongoose
  ↓
MongoDB
```

Authentication flow:

```text
Register or login → JWT returned → token stored in browser
  ↓
Authenticated requests include Authorization: Bearer <token>
  ↓
Authentication middleware identifies the user
  ↓
Ownership checks protect product updates and deletions
```

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
| GET | `/products` | Get all products |
| GET | `/products?name=milk` | Search products by name |
| GET | `/products/cheapest?name=milk` | Get the cheapest matching product(s) |
| GET | `/products/:id` | Get one product by ID |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Replace a product's price |
| PATCH | `/products/:id` | Update a product's price |
| DELETE | `/products/:id` | Delete a product |
| GET | `/health` | Check API and database health |
| POST | `/auth/register` | Register a user and return a JWT |
| POST | `/auth/login` | Log in and return a JWT |
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

The backend reads MongoDB credentials from exported Zsh variables:

```bash
export MONGODB_USER='your_username'
export MONGODB_PASSWORD='your_password'
export MONGODB_HOST='your-cluster.mongodb.net'
```

Set the database name in `backend/.env`:

```env
MONGODB_DATABASE=grocery_compare
```

The backend also accepts `MONGODB_URI`, which is used by Docker Compose for the local MongoDB service.

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

Edit `.env` before starting the stack and replace the placeholder `JWT_SECRET`.

Open the containerized frontend at `http://localhost:8080`. Docker runs MongoDB on an internal network, the backend on port `3000`, and the frontend through Nginx on port `8080`.

The frontend API URL is supplied during the image build with the `VITE_API_URL` build argument. Rebuild the frontend image when changing the API URL.

Compose uses health checks to coordinate startup: MongoDB must respond to a ping before the backend starts, and the backend must report healthy before the frontend starts.
The root `.env` file is ignored by Git and supplies the local JWT signing secret. Never commit real secrets; use your deployment platform's secret manager in production.
The backend container runs as the non-root `node` user.

Check the service health with:

```bash
docker compose ps
```

Stop the containers with:

```bash
docker compose down
```

To test the API in VS Code, open `backend/requests.http` with the REST Client extension.

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
6. Docker and deployment
