const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/User");
const authService = require("../../src/services/authService");

jest.mock("../../src/models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1d";
    jwt.sign.mockReturnValue("signed-token");
  });

  test("registers a normalized email and returns a token", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
    User.create.mockResolvedValue({
      _id: "user-1",
      email: "test@example.com",
    });

    const result = await authService.registerUser(
      "  TEST@EXAMPLE.COM ",
      "password123",
    );

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
    expect(User.create).toHaveBeenCalledWith({
      email: "test@example.com",
      passwordHash: "hashed-password",
    });
    expect(result).toEqual({
      user: { id: "user-1", email: "test@example.com" },
      token: "signed-token",
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: "user-1", email: "test@example.com" },
      "test-secret",
      { expiresIn: "1d" },
    );
  });

  test("rejects duplicate registration emails", async () => {
    User.findOne.mockResolvedValue({ email: "test@example.com" });

    await expect(
      authService.registerUser("test@example.com", "password123"),
    ).rejects.toMatchObject({
      message: "Email is already registered",
      status: 409,
    });
    expect(User.create).not.toHaveBeenCalled();
  });

  test("logs in with a valid password", async () => {
    const user = {
      _id: "user-1",
      email: "test@example.com",
      passwordHash: "hashed-password",
    };
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);

    await expect(
      authService.loginUser("TEST@EXAMPLE.COM", "password123"),
    ).resolves.toEqual({
      user: { id: "user-1", email: "test@example.com" },
      token: "signed-token",
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashed-password",
    );
  });

  test("rejects an unknown user or invalid password", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      authService.loginUser("missing@example.com", "password123"),
    ).rejects.toMatchObject({
      message: "Invalid email or password",
      status: 401,
    });

    User.findOne.mockResolvedValue({ passwordHash: "hashed-password" });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.loginUser("test@example.com", "wrong-password"),
    ).rejects.toMatchObject({
      message: "Invalid email or password",
      status: 401,
    });
  });
});
