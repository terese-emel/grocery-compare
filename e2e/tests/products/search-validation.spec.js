import { expect, test } from "@playwright/test";
import { login, mockUnauthenticatedSession } from "../../fixtures/auth.js";
import { ProductsPage } from "../../pages/ProductsPage.js";

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
});

test("searching with one character shows validation", async ({ page }) => {
  await login(page);
  await new ProductsPage(page).search("m");

  await expect(
    page.getByText("Please enter at least 2 characters."),
  ).toBeVisible();
});
