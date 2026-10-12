import { expect, test } from "@playwright/test";
import { login, mockUnauthenticatedSession } from "../../fixtures/auth.js";
import { ProductsPage } from "../../pages/ProductsPage.js";

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
});

test("authenticated user can search for products", async ({ page }) => {
  await page.route("**/products*", async (route) => {
    if (route.request().method() !== "GET" || !route.request().url().includes("name=milk")) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [
          {
            _id: "product-1",
            name: "Milk",
            shop: "ICA",
            price: 10.9,
            unit: "1L",
            owner: "e2e-user",
          },
        ],
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      }),
    });
  });

  await login(page);
  await new ProductsPage(page).search("milk");

  await expect(page.getByText("ICA")).toBeVisible();
  await expect(page.getByText("10.9 kr")).toBeVisible();
});
