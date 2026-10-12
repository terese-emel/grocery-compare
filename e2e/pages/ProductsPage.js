export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder("Try milk");
    this.addProductNameInput = page
      .getByLabel("Product name", { exact: true })
      .last();
  }

  async search(productName) {
    await this.searchInput.fill(productName);
    await this.page.getByRole("button", { name: "Search" }).click();
  }

  async addProduct({ name, shop, price, unit }) {
    await this.addProductNameInput.fill(name);
    await this.page.getByLabel("Shop Name").fill(shop);
    await this.page.getByLabel("Price").fill(String(price));
    await this.page.getByLabel("Unit").fill(unit);
    await this.page.getByRole("button", { name: "Add Product" }).click();
  }

  productCard(shop) {
    return this.page.locator(".product-card").filter({ hasText: shop });
  }

  async editProductPrice(shop, price) {
    const card = this.productCard(shop);
    await card.getByRole("button", { name: "Edit" }).click();
    await card.locator('input[type="number"]').fill(String(price));
    await card.getByRole("button", { name: "Save" }).click();
  }

  async deleteProduct(shop) {
    await this.productCard(shop).getByRole("button", { name: "Delete" }).click();
  }
}
