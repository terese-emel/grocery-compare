import { expect, test } from "@playwright/test";
import { mockUnauthenticatedSession } from "../../fixtures/auth.js";
import { AuthPage } from "../../pages/AuthPage.js";

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
});

test("user can register from the browser", async ({ page }) => {
  await page.route("**/auth/register", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        user: { id: "new-user", email: "new@example.test" },
        token: "new-user-token",
      }),
    });
  });

  const authPage = new AuthPage(page);
  await authPage.open();
  await authPage.openRegistration();
  await authPage.register("new@example.test", "password123");
});
