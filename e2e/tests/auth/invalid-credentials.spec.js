import { expect, test } from "@playwright/test";
import { mockUnauthenticatedSession } from "../../fixtures/auth.js";
import { AuthPage } from "../../pages/AuthPage.js";

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
});

test("invalid login credentials show an error", async ({ page }) => {
  await page.route("**/auth/login", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "Invalid email or password" }),
    });
  });

  const authPage = new AuthPage(page);
  await authPage.open();
  await authPage.loginExpectingError(
    "wrong@example.test",
    "wrong-password",
    "Invalid email or password",
  );
});

test("registration errors are shown to the user", async ({ page }) => {
  await page.route("**/auth/register", async (route) => {
    await route.fulfill({
      status: 409,
      contentType: "application/json",
      body: JSON.stringify({ message: "Email is already registered" }),
    });
  });

  const authPage = new AuthPage(page);
  await authPage.open();
  await authPage.openRegistration();
  await authPage.registerExpectingError(
    "existing@example.test",
    "password123",
    "Email is already registered",
  );
});
