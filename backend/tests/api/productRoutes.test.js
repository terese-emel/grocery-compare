const request = require("supertest");
const app = require("../../src/app");
const productService = require("../../src/services/productService");

jest.mock("../../src/services/productService");

describe("Product API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("GET /health returns the API health status", async () => {
    const response = await request(app.callback()).get("/health");

    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("database");
  });

  test("GET /products?name=milk returns matching products", async () => {
    productService.getProducts.mockResolvedValue([
      { _id: "1", name: "Milk", shop: "ICA", price: 10.9, unit: "1L" },
    ]);

    const response = await request(app.callback()).get("/products?name=milk");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(productService.getProducts).toHaveBeenCalledWith("milk");
  });

  test("GET /products returns all products when no name is provided", async () => {
    productService.getProducts.mockResolvedValue([]);

    const response = await request(app.callback()).get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(productService.getProducts).toHaveBeenCalledWith(undefined);
  });

  test("GET /products/cheapest returns the cheapest products", async () => {
    productService.getCheapestProduct.mockResolvedValue([
      { name: "Milk", shop: "ICA", price: 10.9 },
      { name: "Milk", shop: "Coop", price: 10.9 },
    ]);

    const response = await request(app.callback()).get(
      "/products/cheapest?name=milk",
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(productService.getCheapestProduct).toHaveBeenCalledWith("milk");
  });

  test("POST /products rejects incomplete data", async () => {
    const response = await request(app.callback())
      .post("/products")
      .send({ name: "Milk", shop: "ICA", price: 10.9 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid product data" });
    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  test("POST /products creates a product", async () => {
    const product = {
      name: "Milk",
      shop: "ICA",
      price: 10.9,
      unit: "1L",
    };
    productService.createProduct.mockResolvedValue({ _id: "1", ...product });

    const response = await request(app.callback())
      .post("/products")
      .send(product);

    expect(response.status).toBe(201);
    expect(response.body.product).toMatchObject(product);
    expect(productService.createProduct).toHaveBeenCalledWith(product);
  });

  test("POST /products rejects an invalid price", async () => {
    const response = await request(app.callback()).post("/products").send({
      name: "Milk",
      shop: "ICA",
      price: "not-a-number",
      unit: "1L",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid product data");
  });

  test("POST /products rejects a missing unit", async () => {
    const response = await request(app.callback()).post("/products").send({
      name: "Milk",
      shop: "ICA",
      price: 10.9,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid product data");
  });
  test("POST /products rejects an empty name", async () => {
    const response = await request(app.callback()).post("/products").send({
      name: "",
      shop: "ICA",
      price: 10.9,
      unit: "1L",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid product data");
  });
});
