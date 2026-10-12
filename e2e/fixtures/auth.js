import { expect } from "@playwright/test";
import { AuthPage } from "../pages/AuthPage.js";

export async function mockLogin(page) {
  return mockLoginAs(page, "e2e-user", "e2e@example.test");
}

export async function mockLoginAs(page, userId, email) {
  await page.route("**/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: { id: userId, email },
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

export async function loginAs(page, userId, email) {
  await mockLoginAs(page, userId, email);
  const authPage = new AuthPage(page);
  await authPage.open();
  await authPage.login(email, "password123");
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
