import { expect } from "@playwright/test";
import { AuthPage } from "../pages/AuthPage.js";

export async function mockLogin(page) {
  await page.route("**/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: { id: "e2e-user", email: "e2e@example.test" },
        token: "e2e-token",
      }),
    });
  });
}

export async function login(page) {
  await mockLogin(page);
  const authPage = new AuthPage(page);
  await authPage.open();
  await authPage.login("e2e@example.test", "password123");
}

export function mockUnauthenticatedSession(page) {
  return page.route("**/auth/me", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "Authentication required" }),
    });
  });
}
