import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { getCurrentUser } from "./services/authApi";

vi.mock("./services/authApi", () => ({
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
}));

vi.mock("./services/productApi", () => ({
  searchProducts: vi.fn(),
  deleteProduct: vi.fn(),
  updateProduct: vi.fn(),
}));

describe("App authentication", () => {
  it("shows a loading state while restoring the session", () => {
    getCurrentUser.mockReturnValue(new Promise(() => {}));

    render(<App />);

    expect(screen.getByText("Loading session...")).toBeInTheDocument();
  });

  it("shows the login form when no session exists", async () => {
    getCurrentUser.mockResolvedValue(null);

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create a new account" })).toBeInTheDocument();
  });

  it("shows the authenticated application when a session exists", async () => {
    getCurrentUser.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
    });

    render(<App />);

    expect(await screen.findByText("Signed in as test@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("checks the current user once on startup", async () => {
    getCurrentUser.mockResolvedValue(null);

    render(<App />);

    await waitFor(() => {
      expect(getCurrentUser).toHaveBeenCalledTimes(1);
    });
  });
});
