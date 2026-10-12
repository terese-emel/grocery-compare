process.env.JWT_SECRET = "test-secret";

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../src/app");
const Product = require("../../src/models/Product");
const User = require("../../src/models/User");

jest.setTimeout(120000);

let mongoServer;
let owner;
let otherUser;
let ownerToken;
let otherUserToken;

function createToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
  );
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: { version: "7.0.14" },
  });

  await mongoose.connect(mongoServer.getUri());
}, 120000);

beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});

  owner = await User.create({
    email: "owner@example.com",
    passwordHash: "already-hashed-for-test",
  });

  otherUser = await User.create({
    email: "other@example.com",
    passwordHash: "already-hashed-for-test",
  });

  ownerToken = createToken(owner);
  otherUserToken = createToken(otherUser);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
}, 120000);

describe("Product ownership", () => {
  test("the owner can update a product", async () => {
    const product = await Product.create({
      name: "Milk",
      shop: "ICA",
      price: 10.9,
      unit: "1L",
      owner: owner._id,
    });

    const response = await request(app.callback())
      .patch(`/products/${product._id}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ price: 12.5 });

    expect(response.status).toBe(200);
    expect(response.body.product.price).toBe(12.5);
  });

  test("another user cannot update the product", async () => {
    const product = await Product.create({
      name: "Milk",
      shop: "ICA",
      price: 10.9,
      unit: "1L",
      owner: owner._id,
    });

    const response = await request(app.callback())
      .patch(`/products/${product._id}`)
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({ price: 1 });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      message: "Product not found or you do not have permission to modify it",
      error: {
        code: "PRODUCT_NOT_FOUND_OR_UNAUTHORIZED",
        message: "Product not found or you do not have permission to modify it",
      },
    });

    const unchangedProduct = await Product.findById(product._id);
    expect(unchangedProduct.price).toBe(10.9);
  });

  test("the owner can delete a product", async () => {
    const product = await Product.create({
      name: "Milk",
      shop: "ICA",
      price: 10.9,
      unit: "1L",
      owner: owner._id,
    });

    const response = await request(app.callback())
      .delete(`/products/${product._id}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(response.status).toBe(200);
    expect(await Product.findById(product._id)).toBeNull();
  });

  test("another user cannot delete the product", async () => {
    const product = await Product.create({
      name: "Milk",
      shop: "ICA",
      price: 10.9,
      unit: "1L",
      owner: owner._id,
    });

    const response = await request(app.callback())
      .delete(`/products/${product._id}`)
      .set("Authorization", `Bearer ${otherUserToken}`);

    expect(response.status).toBe(404);
    expect(await Product.findById(product._id)).not.toBeNull();
  });
});
