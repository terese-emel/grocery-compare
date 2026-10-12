process.env.JWT_SECRET = "test-secret";

const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../../src/app");
const authService = require("../../src/services/authService");
const productService = require("../../src/services/productService");

jest.mock("../../src/services/authService");
jest.mock("../../src/services/productService");

describe("Cookie authentication and CSRF protection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authService.loginUser.mockResolvedValue({
      user: { id: "user-1", email: "test@example.com" },
      token: jwt.sign(
        { userId: "user-1", email: "test@example.com" },
        process.env.JWT_SECRET,
      ),
    });
    productService.createProduct.mockResolvedValue({
      _id: "product-1",
      name: "Milk",
      shop: "ICA",
      price: 10,
      unit: "1L",
      owner: "user-1",
    });
  });

  async function loginWithCookies() {
    const agent = request.agent(app.callback());
    const response = await agent
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    const csrfCookie = response.headers["set-cookie"].find((cookie) =>
      cookie.startsWith("csrf_token="),
    );
    const csrfToken = csrfCookie.split(";")[0].split("=")[1];

    return { agent, csrfToken };
  }

  test("allows a protected write with the auth cookie and CSRF header", async () => {
    const { agent, csrfToken } = await loginWithCookies();

    const response = await agent
      .post("/products")
      .set("X-CSRF-Token", csrfToken)
      .send({ name: "Milk", shop: "ICA", price: 10, unit: "1L" });

    expect(response.status).toBe(201);
    expect(productService.createProduct).toHaveBeenCalledWith({
      name: "Milk",
      shop: "ICA",
      price: 10,
      unit: "1L",
      owner: "user-1",
    });
  });

  test("rejects a protected write without a CSRF header", async () => {
    const { agent } = await loginWithCookies();

    const response = await agent
      .post("/products")
      .send({ name: "Milk", shop: "ICA", price: 10, unit: "1L" });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("INVALID_CSRF_TOKEN");
    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  test("logs out and clears access to protected routes", async () => {
    const { agent, csrfToken } = await loginWithCookies();

    const logoutResponse = await agent
      .post("/auth/logout")
      .set("X-CSRF-Token", csrfToken);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body).toEqual({
      message: "Logged out successfully",
    });
    expect(logoutResponse.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringMatching(/auth_token=;/)]),
    );

    const protectedResponse = await agent.get("/products");

    expect(protectedResponse.status).toBe(401);
    expect(protectedResponse.body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });
});
