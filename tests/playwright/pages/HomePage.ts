import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  readonly menuItems: Locator;

  constructor(page: Page) {
    this.page = page;

    this.menuItems = page.locator(".admin-main-screen-menu");
  }

  async open() {
    await this.page.goto("/", {
      waitUntil: "domcontentloaded",
    });
  }

  async verifyLoaded() {
    // проверяем что мы реально в приложении после редиректа/логина
    await expect(this.menuItems.first()).toBeVisible({ timeout: 15000 });
  }

  async openMenuByIndex(index: number) {
    const menuItem = this.menuItems.nth(index);
    await expect(menuItem).toBeVisible({ timeout: 15000 });
    await menuItem.click();
  }
}
