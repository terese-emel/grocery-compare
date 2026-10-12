import { expect, test } from "@playwright/test";
import { loginAs, mockUnauthenticatedSession } from "../../fixtures/auth.js";
import { ProductsPage } from "../../pages/ProductsPage.js";

const product = {
  _id: "owned-product",
  name: "Milk",
  shop: "ICA",
  price: 10.9,
  unit: "1L",
  owner: "owner-user",
};

async function mockProductSearch(page) {
  await page.route("**/products?name=milk", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([product]),
    });
  });
}

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
  await mockProductSearch(page);
});

test("owner can edit and delete their product", async ({ page }) => {
  await page.route("**/products/owned-product", async (route) => {
    if (route.request().method() === "PUT") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          product: { ...product, price: 12.5 },
        }),
      });
      return;
    }

    if (route.request().method() === "DELETE") {
      await route.fulfill({ status: 200, body: JSON.stringify({}) });
    }
  });

  await loginAs(page, "owner-user", "owner@example.test");
  const productsPage = new ProductsPage(page);
  await productsPage.search("milk");

  const card = productsPage.productCard("ICA");
  await expect(card.getByRole("button", { name: "Edit" })).toBeVisible();
  await expect(card.getByRole("button", { name: "Delete" })).toBeVisible();

  await productsPage.editProductPrice("ICA", 12.5);
  await productsPage.deleteProduct("ICA");
});

test("non-owner cannot manage another user's product", async ({ page }) => {
  await loginAs(page, "different-user", "different@example.test");
  const productsPage = new ProductsPage(page);
  await productsPage.search("milk");

  const card = productsPage.productCard("ICA");
  await expect(card.getByRole("button", { name: "Edit" })).toHaveCount(0);
  await expect(card.getByRole("button", { name: "Delete" })).toHaveCount(0);
});
