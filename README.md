# Grocery Compare

Grocery Compare is a full-stack learning project for comparing grocery prices across different shops and finding better prices for everyday products.

## Current Features

The backend currently supports:

- View all products
- Find a product by ID
- Filter products by name
- Filter products by shop
- Add a new product
- Update a product price
- Delete a product

## API Endpoints

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | `/products`             | Get all products        |
| GET    | `/products/:id`         | Get a product by ID     |
| GET    | `/products?name=milk`   | Filter products by name |
| GET    | `/products?shop=Willys` | Filter products by shop |
| POST   | `/products`             | Create a product        |
| PATCH  | `/products/:id`         | Update a product        |
| DELETE | `/products/:id`         | Delete a product        |

## Tech Stack

### Backend

- Node.js
- Koa
- JavaScript
- REST API

### Planned

- TypeScript
- MongoDB
- Mongoose
- React
- Vite
- Automated testing
- Docker
- GitHub Actions

## Project Structure

```text
backend/
├── src/
│   ├── controllers/
│   │   └── productController.js
│   ├── data/
│   │   └── products.js
│   ├── routes/
│   │   └── productRoutes.js
│   └── index.js
├── requests.http
└── package.json
```

## Running the Backend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:3000
```

Example:

```text
http://localhost:3000/products
```

## Project Goal

The goal is to build a full-stack application where users can compare the price of the same grocery product across different shops and identify the cheapest option.

The project is also being used to learn full-stack development step by step, starting with backend development and progressing to databases, frontend development, testing, and deployment.
