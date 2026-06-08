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
    const response = await this.page.goto(
      "https://176.trackensure.site/login",
    );
    if (!response) {
      throw new Error("Login page navigation returned no response");
    }
    if (!response.ok()) {
      throw new Error(
        `Login page returned HTTP ${response.status()} (${response.statusText()})`,
      );
    }
  }

  async login(email: string, password: string) {
    await expect(
      this.emailInput,
      "Email input should be visible on login page",
    ).toBeVisible({ timeout: 10000 });

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    await expect(
      this.submitButton,
      "Submit button should be visible after filling credentials",
    ).toBeVisible({ timeout: 10000 });

    await this.submitButton.click();
  }
}
