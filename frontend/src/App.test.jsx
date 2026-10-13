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

import { searchProducts } from "./services/productApi";

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

describe("product search validation", () => {
  it("allows searching by shop without a product name", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", email: "test@example.com" });
    searchProducts.mockResolvedValue({ items: [], page: 1, limit: 10, total: 0, pages: 0 });

    renderApp();

    const shopInput = await screen.findByLabelText("Shop name");
    await import("@testing-library/user-event").then(async ({ default: userEvent }) => {
      const user = userEvent.setup();
      await user.type(shopInput, "Coop");
      await user.click(screen.getByRole("button", { name: "Search" }));
    });

    expect(searchProducts).toHaveBeenCalledWith(
      expect.objectContaining({ name: "", shop: "Coop", page: 1 }),
    );
    expect(searchProducts.mock.calls[0][0].signal).toBeInstanceOf(AbortSignal);
  });
});
