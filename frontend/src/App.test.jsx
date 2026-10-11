import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { getCurrentUser } from "./services/authApi";

vi.mock("./services/authApi", () => ({
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
}));

function renderApp() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );
}

vi.mock("./services/productApi", () => ({
  searchProducts: vi.fn(),
  deleteProduct: vi.fn(),
  updateProduct: vi.fn(),
}));

describe("App authentication", () => {
  it("shows a loading state while restoring the session", () => {
    getCurrentUser.mockReturnValue(new Promise(() => {}));

    renderApp();

    expect(screen.getByText("Loading session...")).toBeInTheDocument();
  });

  it("shows the login form when no session exists", async () => {
    getCurrentUser.mockResolvedValue(null);

    renderApp();

    expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create a new account" })).toBeInTheDocument();
  });

  it("shows the authenticated application when a session exists", async () => {
    getCurrentUser.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
    });

    renderApp();

    expect(await screen.findByText("Signed in as test@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("checks the current user once on startup", async () => {
    getCurrentUser.mockResolvedValue(null);

    renderApp();

    await waitFor(() => {
      expect(getCurrentUser).toHaveBeenCalledTimes(1);
    });
  });
});
