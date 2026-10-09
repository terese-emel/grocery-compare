const request = require("supertest");
const app = require("../../src/app");
const productService = require("../../src/services/productService");

jest.mock("../../src/services/productService");

describe("Product API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  test("GET /products requires a product name", async () => {
    const response = await request(app.callback()).get("/products");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Product name is required",
    });
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
    expect(response.body).toEqual({ message: "Missing required fields" });
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
});
