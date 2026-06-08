import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByRole("textbox", { name: "Email Address" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.submitButton = page.getByRole("button", { name: "Log In" });
  }

  async open() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    // 🔥 ВАЖНО: НЕ ждём enabled (его может не быть)
    await expect(this.submitButton).toBeVisible({ timeout: 10000 });

    await this.submitButton.click();
  }
}
