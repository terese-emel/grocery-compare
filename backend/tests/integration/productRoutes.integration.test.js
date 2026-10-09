const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../src/app");
const Product = require("../../src/models/Product");

jest.setTimeout(120000);

let mongoServer;

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
  test("creates a product", async () => {
    const product = {
      name: "Milk",
      shop: "ICA",
      price: 10.9,
      unit: "1L",
    };

    const response = await request(app.callback())
      .post("/products")
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
      },
      {
        name: "Milk",
        shop: "Coop",
        price: 12.5,
        unit: "1L",
      },
    ]);

    const response = await request(app.callback()).get("/products?name=milk");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].shop).toBe("ICA");
    expect(response.body[1].shop).toBe("Coop");
  });
});
