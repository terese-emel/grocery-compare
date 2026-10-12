process.env.JWT_SECRET = "test-secret";

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const authService = require("../../src/services/authService");

jest.mock("../../src/services/authService");

describe("Authentication API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /auth/register creates a user", async () => {
    authService.registerUser.mockResolvedValue({
      user: {
        id: "user-1",
        email: "test@example.com",
      },
      token: "registration-token",
    });

    const response = await request(app.callback())
      .post("/auth/register")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user: {
        id: "user-1",
        email: "test@example.com",
      },
      token: "registration-token",
    });
    expect(authService.registerUser).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
    );
  });

  test("POST /auth/register rejects a short password", async () => {
    const response = await request(app.callback())
      .post("/auth/register")
      .send({
        email: "test@example.com",
        password: "short",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Password must contain at least 8 characters",
    });
    expect(authService.registerUser).not.toHaveBeenCalled();
  });

  test("POST /auth/login returns a token", async () => {
    authService.loginUser.mockResolvedValue({
      user: {
        id: "user-1",
        email: "test@example.com",
      },
      token: "login-token",
    });

    const response = await request(app.callback())
      .post("/auth/login")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("login-token");
    expect(authService.loginUser).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
    );
  });

  test("POST /auth/login rejects missing credentials", async () => {
    const response = await request(app.callback())
      .post("/auth/login")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Email and password are required",
    });
    expect(authService.loginUser).not.toHaveBeenCalled();
  });

  test("protected product routes reject missing authentication", async () => {
    const response = await request(app.callback()).get("/products");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Authentication required",
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication required",
      },
    });
    expect(response.body.error.requestId).toBe(response.headers["x-request-id"]);
  });

  test("GET /auth/me returns the authenticated user", async () => {
    const token = jwt.sign(
      { userId: "user-1", email: "test@example.com" },
      process.env.JWT_SECRET,
    );

    const response = await request(app.callback())
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: {
        id: "user-1",
        email: "test@example.com",
      },
    });
  });

  test("GET /auth/me rejects a missing token", async () => {
    const response = await request(app.callback()).get("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Authentication required",
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication required",
      },
    });
    expect(response.body.error.requestId).toBe(response.headers["x-request-id"]);
  });

  test("returns a request ID header", async () => {
    const response = await request(app.callback()).get("/health");

    expect(response.headers["x-request-id"]).toBeDefined();
  });

  test("preserves a supplied request ID", async () => {
    const response = await request(app.callback())
      .get("/health")
      .set("X-Request-Id", "test-request-123");

    expect(response.headers["x-request-id"]).toBe("test-request-123");
  });
});
