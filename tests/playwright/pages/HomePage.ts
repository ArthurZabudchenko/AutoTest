import { Page, Locator, expect } from "@playwright/test";
import { SELECTORS, TIMEOUTS } from "../config/constants";

export class HomePage {
  readonly page: Page;
  readonly menuItems: Locator;

  constructor(page: Page) {
    this.page = page;

    this.menuItems = page.locator(SELECTORS.mainMenu);
  }

  async open() {
    await this.page.goto("/", {
      waitUntil: "domcontentloaded",
    });
  }

  async verifyLoaded() {
    await expect(this.menuItems.first()).toBeVisible({ timeout: TIMEOUTS.long });
  }

  async openMenuByIndex(index: number) {
    const menuItem = this.menuItems.nth(index);
    await expect(menuItem).toBeVisible({ timeout: TIMEOUTS.long });
    await menuItem.click();
  }
}
