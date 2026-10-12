import { expect, test } from "@playwright/test";
import { login, mockUnauthenticatedSession } from "../../fixtures/auth.js";
import { ProductsPage } from "../../pages/ProductsPage.js";

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
});

test("authenticated user can search for products", async ({ page }) => {
  await page.route("**/products?name=milk", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          _id: "product-1",
          name: "Milk",
          shop: "ICA",
          price: 10.9,
          unit: "1L",
          owner: "e2e-user",
        },
      ]),
    });
  });

  await login(page);
  await new ProductsPage(page).search("milk");

  await expect(page.getByText("ICA")).toBeVisible();
  await expect(page.getByText("10.9 kr")).toBeVisible();
});
