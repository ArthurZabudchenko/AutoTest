import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  readonly menuItems: Locator;

  constructor(page: Page) {
    this.page = page;

    this.menuItems = page.locator(".admin-main-screen-menu");
  }

  async open() {
    const response = await this.page.goto("/", {
      waitUntil: "domcontentloaded",
    });
    if (!response) {
      throw new Error("Home page navigation returned no response");
    }
    if (!response.ok()) {
      throw new Error(
        `Home page returned HTTP ${response.status()} (${response.statusText()})`,
      );
    }
  }

  async verifyLoaded() {
    await expect(
      this.menuItems.first(),
      "Main menu should be visible after navigation",
    ).toBeVisible({ timeout: 15000 });
  }

  async openMenuByIndex(index: number) {
    const count = await this.menuItems.count();
    if (index < 0 || index >= count) {
      throw new Error(
        `Menu index ${index} out of bounds: expected 0..${count - 1} (found ${count} menu items)`,
      );
    }

    const menuItem = this.menuItems.nth(index);
    await expect(
      menuItem,
      `Menu item at index ${index} should be visible`,
    ).toBeVisible({ timeout: 15000 });
    await menuItem.click();
  }
}
