process.env.JWT_SECRET = "test-secret";

const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../src/app");
const Product = require("../../src/models/Product");

jest.setTimeout(120000);

let mongoServer;
const ownerId = new mongoose.Types.ObjectId();
const authToken = jwt.sign(
  { userId: ownerId.toString(), email: "test@example.com" },
  process.env.JWT_SECRET,
);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: { version: "7.0.14" },
  });
  await mongoose.connect(mongoServer.getUri());
}, 120000);

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
}, 120000);

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await Product.deleteMany({});
  }
});

describe("Product API integration", () => {
  test("GET /health reports a connected database", async () => {
    const response = await request(app.callback()).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      database: "connected",
    });
  });

  test("creates a product", async () => {
    const product = {
      name: "Milk",
      shop: "ICA",
      price: 10.9,
      unit: "1L",
    };

    const response = await request(app.callback())
      .post("/products")
      .set("Authorization", `Bearer ${authToken}`)
      .send(product);

    expect(response.status).toBe(201);
    expect(response.body.product).toMatchObject(product);

    const savedProduct = await Product.findOne({ name: "Milk" });
    expect(savedProduct).not.toBeNull();
    expect(savedProduct.name).toBe("Milk");
    expect(savedProduct.shop).toBe("ICA");
    expect(savedProduct.price).toBe(10.9);
    expect(savedProduct.unit).toBe("1L");
  });

  test("searches products by name", async () => {
    await Product.create([
      {
        name: "Milk",
        shop: "ICA",
        price: 10.9,
        unit: "1L",
        owner: ownerId,
      },
      {
        name: "Milk",
        shop: "Coop",
        price: 12.5,
        unit: "1L",
        owner: ownerId,
      },
    ]);

    const response = await request(app.callback())
      .get("/products?name=milk")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0].shop).toBe("ICA");
    expect(response.body.items[1].shop).toBe("Coop");
    expect(response.body).toMatchObject({
      page: 1,
      limit: 10,
      total: 2,
      pages: 1,
    });
  });
});
