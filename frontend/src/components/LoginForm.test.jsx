import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LoginForm from "./LoginForm";
import { login } from "../services/authApi";

vi.mock("../services/authApi", () => ({
  login: vi.fn(),
}));

describe("LoginForm", () => {
  it("renders the login fields", () => {
    render(<LoginForm onLogin={vi.fn()} />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("logs in and calls onLogin with the user", async () => {
    const user = { id: "user-1", email: "test@example.com" };
    const onLogin = vi.fn();
    login.mockResolvedValue({ user, token: "jwt-token" });

    render(<LoginForm onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@example.com", "password123");
      expect(onLogin).toHaveBeenCalledWith(user);
    });
  });

  it("shows the login error", async () => {
    login.mockRejectedValue(new Error("Invalid email or password"));

    render(<LoginForm onLogin={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid email or password",
    );
  });

  it("disables the button while logging in", async () => {
    let resolveLogin;
    login.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );

    render(<LoginForm onLogin={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByRole("button", { name: "Logging in..." })).toBeDisabled();

    resolveLogin({
      user: { id: "user-1", email: "test@example.com" },
      token: "jwt-token",
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Login" })).not.toBeDisabled();
    });
  });
});
