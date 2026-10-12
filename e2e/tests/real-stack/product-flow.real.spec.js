import { expect, test } from "@playwright/test";
import { AuthPage } from "../../pages/AuthPage.js";
import { ProductsPage } from "../../pages/ProductsPage.js";

test("real Docker stack supports registration, product creation, and search", async ({
  page,
}) => {
  const uniqueEmail = `e2e-${Date.now()}@example.test`;
  const authPage = new AuthPage(page);

  await authPage.open();
  await authPage.openRegistration();
  await authPage.register(uniqueEmail, "password123");

  const productsPage = new ProductsPage(page);
  const productName = `Docker Test Milk ${Date.now()}`;

  await productsPage.addProduct({
    name: productName,
    shop: "Docker Coop",
    price: 14.5,
    unit: "1L",
  });

  await expect(page.getByText("Product added successfully!")).toBeVisible();

  await productsPage.search(productName);

  await expect(page.getByText(productName)).toBeVisible();
  await expect(page.getByText("Docker Coop")).toBeVisible();
  await expect(page.getByText("14.5 kr")).toBeVisible();
});
