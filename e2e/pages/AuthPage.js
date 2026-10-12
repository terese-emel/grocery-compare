import { expect } from "@playwright/test";

export class AuthPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
  }

  async open() {
    await this.page.goto("/");
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.page.getByRole("button", { name: "Login" }).click();
    await expect(this.page.getByText(`Signed in as ${email}`)).toBeVisible();
  }

  async loginExpectingError(email, password, message) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.page.getByRole("button", { name: "Login" }).click();
    await expect(this.page.getByRole("alert")).toHaveText(message);
  }

  async openRegistration() {
    await this.page.getByRole("button", { name: "Create a new account" }).click();
  }

  async register(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.page.getByRole("button", { name: "Register" }).click();
    await expect(this.page.getByText(`Signed in as ${email}`)).toBeVisible();
  }

  async registerExpectingError(email, password, message) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.page.getByRole("button", { name: "Register" }).click();
    await expect(this.page.getByRole("alert")).toHaveText(message);
  }

  async logout() {
    await this.page.getByRole("button", { name: "Logout" }).click();
    await expect(this.page.getByRole("heading", { name: "Login" })).toBeVisible();
  }
}
