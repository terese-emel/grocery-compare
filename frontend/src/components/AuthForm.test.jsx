import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthForm from "./AuthForm";
import { login, register } from "../services/authApi";

vi.mock("../services/authApi", () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

describe("AuthForm", () => {
  it("logs in successfully", async () => {
    const user = { id: "user-1", email: "test@example.com" };
    const onSuccess = vi.fn();
    login.mockResolvedValue({ user, token: "login-token" });

    render(<AuthForm mode="login" onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@example.com", "password123");
      expect(onSuccess).toHaveBeenCalledWith(user);
    });
  });

  it("registers successfully", async () => {
    const user = { id: "user-2", email: "new@example.com" };
    const onSuccess = vi.fn();
    register.mockResolvedValue({ user, token: "registration-token" });

    render(<AuthForm mode="register" onSuccess={onSuccess} />);

    expect(screen.getByRole("heading", { name: "Create account" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith("new@example.com", "password123");
      expect(onSuccess).toHaveBeenCalledWith(user);
    });
  });

  it("shows authentication errors", async () => {
    login.mockRejectedValue(new Error("Invalid email or password"));

    render(<AuthForm mode="login" onSuccess={vi.fn()} />);

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

  it("disables the submit button while submitting", async () => {
    let resolveLogin;
    login.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );

    render(<AuthForm mode="login" onSuccess={vi.fn()} />);

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
      token: "login-token",
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Login" })).not.toBeDisabled();
    });
  });
});
