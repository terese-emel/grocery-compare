import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentUser, logout } from "./authApi";

describe("authApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("restores the session using the authentication cookie", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      }),
    });

    await expect(getCurrentUser()).resolves.toEqual({
      id: "user-1",
      email: "test@example.com",
    });

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/auth/me", {
      credentials: "include",
    });
  });

  it("sends the CSRF token when logging out", async () => {
    document.cookie = "csrf_token=test-csrf-token";
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true });

    await logout();

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRF-Token": "test-csrf-token" },
    });
  });
});
