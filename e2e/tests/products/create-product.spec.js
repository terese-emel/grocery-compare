import { expect, test } from "@playwright/test";
import { login, mockUnauthenticatedSession } from "../../fixtures/auth.js";
import { ProductsPage } from "../../pages/ProductsPage.js";

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
});

test("authenticated user can add a product", async ({ page }) => {
  await page.route("**/products", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Product created successfully",
          product: {
            _id: "product-2",
            name: "Bread",
            shop: "Coop",
            price: 25,
            unit: "500g",
            owner: "e2e-user",
          },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await login(page);
  await new ProductsPage(page).addProduct({
    name: "Bread",
    shop: "Coop",
    price: 25,
    unit: "500g",
  });

  await expect(page.getByText("Product added successfully!")).toBeVisible();
});
