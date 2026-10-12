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
}
