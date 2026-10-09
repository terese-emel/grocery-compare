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

## Architecture

```text
React frontend (5173)
        ↓ HTTP / fetch
Koa REST API (3000)
        ↓ Mongoose
MongoDB
```

Backend requests flow through routes, controllers, services, and models:

```text
route → controller → service → Product model → MongoDB
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
│   │   ├── unit/          # service tests with mocked models
│   │   ├── api/           # HTTP tests with mocked services
│   │   └── integration/   # HTTP tests with temporary MongoDB
│   ├── .env             # local database name; never commit secrets
│   ├── requests.http
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.local       # VITE_API_URL; never commit
│   └── package.json
├── frontend-basics/     # local plain HTML/CSS/JS exercises (ignored by Git)
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

## Learning path

The project is being developed step by step:

1. HTML, CSS, and browser JavaScript in `frontend-basics/`
2. REST APIs with Koa
3. MongoDB and Mongoose
4. React components, state, props, and effects
5. Frontend API integration
6. Testing, Docker, and deployment
