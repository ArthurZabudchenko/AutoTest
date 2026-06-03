import { Page, expect } from "@playwright/test";

export class OrganizationPage {
  constructor(private page: Page) {}

  async openMenu() {
    const menu = this.page.locator(".admin-main-screen-menu").nth(12);

    await expect(menu).toBeVisible({ timeout: 15000 });
    await menu.click();
  }

  async selectOrganization(orgId: string) {
    await this.page.getByPlaceholder("Org ID").fill(orgId);

    await this.page
      .getByRole("button", { name: "Search", exact: true })
      .click();

    const loginAsOrg = this.page.locator('[id$="-uiGrid-000F-cell"] a').first();

    await expect(loginAsOrg).toBeVisible({
      timeout: 30000,
    });

    await loginAsOrg.scrollIntoViewIfNeeded();
    await loginAsOrg.click();
  }
}
