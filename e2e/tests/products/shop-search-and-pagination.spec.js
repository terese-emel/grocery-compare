import { expect, test } from "@playwright/test";
import { login, mockUnauthenticatedSession } from "../../fixtures/auth.js";
import { ProductsPage } from "../../pages/ProductsPage.js";

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
});

test("authenticated user can search by shop without a product name", async ({ page }) => {
  await page.route("**/products*", async (route) => {
    const requestUrl = new URL(route.request().url());

    if (route.request().method() === "GET" && requestUrl.searchParams.get("shop") === "Coop") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              _id: "coop-product",
              name: "Bread",
              shop: "Coop",
              price: 25,
              unit: "500g",
              owner: "e2e-user",
            },
          ],
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        }),
      });
      return;
    }

    await route.continue();
  });

  await login(page);
  const productsPage = new ProductsPage(page);
  await productsPage.searchByShop("Coop");

  await expect(page.getByText("Bread")).toBeVisible();
  await expect(page.getByText("Coop")).toBeVisible();
});

test("authenticated user can move between product pages", async ({ page }) => {
  await page.route("**/products*", async (route) => {
    const requestUrl = new URL(route.request().url());

    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    const pageNumber = requestUrl.searchParams.get("page") || "1";
    const product = pageNumber === "2"
      ? { _id: "page-two", name: "Page Two Milk", shop: "ICA", price: 12, unit: "1L", owner: "e2e-user" }
      : { _id: "page-one", name: "Page One Milk", shop: "ICA", price: 10, unit: "1L", owner: "e2e-user" };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [product],
        page: Number(pageNumber),
        limit: 1,
        total: 2,
        pages: 2,
      }),
    });
  });

  await login(page);
  const productsPage = new ProductsPage(page);
  await productsPage.search("milk");

  await expect(page.getByText("Page One Milk")).toBeVisible();
  await productsPage.nextPage();

  await expect(page.getByText("Page Two Milk")).toBeVisible();
  await expect(page.getByText("Page 2 of 2")).toBeVisible();
});
