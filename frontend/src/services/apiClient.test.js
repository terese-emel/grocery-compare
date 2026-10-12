import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest, ApiError } from "./apiClient";
import { getAuthToken, logout } from "./authApi";

vi.mock("./authApi", () => ({
  getAuthToken: vi.fn(),
  logout: vi.fn(),
}));

describe("apiRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("adds the token and returns successful JSON", async () => {
    getAuthToken.mockReturnValue("jwt-token");
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ products: [] }),
    });

    const result = await apiRequest("/products");

    expect(result).toEqual({ products: [] });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/products"),
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer jwt-token",
        },
      }),
    );
  });

  it("supports requests without a token", async () => {
    getAuthToken.mockReturnValue(null);
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ status: "ok" }),
    });

    await apiRequest("/health");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/health"),
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
  });

  it("throws the API error message", async () => {
    getAuthToken.mockReturnValue("jwt-token");
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({
        message: "Invalid product data",
        error: {
          code: "INVALID_REQUEST",
          message: "Invalid product data",
          requestId: "request-123",
        },
      }),
    });

    const request = apiRequest("/products");
    await expect(request).rejects.toThrow("Invalid product data");
    await expect(request).rejects.toBeInstanceOf(ApiError);
    await expect(request).rejects.toMatchObject({
      code: "INVALID_REQUEST",
      requestId: "request-123",
      status: 400,
    });
  });

  it("logs out when the token is rejected", async () => {
    getAuthToken.mockReturnValue("expired-token");
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ message: "Invalid or expired token" }),
    });

    await expect(apiRequest("/products")).rejects.toThrow(
      "Invalid or expired token",
    );

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
