import { expect, test } from "@playwright/test";
import { AuthPage } from "../../pages/AuthPage.js";
import { mockLogin, mockUnauthenticatedSession } from "../../fixtures/auth.js";

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
});

test("user can log in from the browser", async ({ page }) => {
  await mockLogin(page);
  const authPage = new AuthPage(page);
  await authPage.open();
  await authPage.login("e2e@example.test", "password123");

  await expect(page.getByText("Signed in as e2e@example.test")).toBeVisible();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
});
