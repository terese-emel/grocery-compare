import { expect, test } from "@playwright/test";
import { login, mockUnauthenticatedSession } from "../../fixtures/auth.js";
import { AuthPage } from "../../pages/AuthPage.js";

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
});

test("user can log out", async ({ page }) => {
  await login(page);
  await new AuthPage(page).logout();
});
