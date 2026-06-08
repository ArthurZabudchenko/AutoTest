import { Page, expect } from "@playwright/test";
import { SELECTORS, TIMEOUTS } from "../config/constants";

export class OrganizationPage {
  constructor(private page: Page) {}

  async openMenu() {
    const menu = this.page.locator(SELECTORS.mainMenu).nth(12);

    await expect(menu).toBeVisible({ timeout: TIMEOUTS.long });
    await menu.click();
  }

  async selectOrganization(orgId: string) {
    await this.page.getByPlaceholder("Org ID").fill(orgId);

    await this.page
      .getByRole("button", { name: "Search", exact: true })
      .click();

    const loginAsOrg = this.page.locator('[id$="-uiGrid-000F-cell"] a').first();

    await expect(loginAsOrg).toBeVisible({
      timeout: TIMEOUTS.extraLong,
    });

    await loginAsOrg.scrollIntoViewIfNeeded();
    await loginAsOrg.click();
  }
}
