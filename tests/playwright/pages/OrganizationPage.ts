import { Page, expect } from "@playwright/test";

export class OrganizationPage {
  private static readonly ORGANIZATIONS_MENU_INDEX = 12;

  constructor(private page: Page) {}

  async openMenu() {
    const allMenuItems = this.page.locator(".admin-main-screen-menu");
    const count = await allMenuItems.count();
    if (OrganizationPage.ORGANIZATIONS_MENU_INDEX >= count) {
      throw new Error(
        `Organizations menu index ${OrganizationPage.ORGANIZATIONS_MENU_INDEX} out of bounds: only ${count} menu items found`,
      );
    }

    const menu = allMenuItems.nth(OrganizationPage.ORGANIZATIONS_MENU_INDEX);
    await expect(
      menu,
      "Organizations menu item should be visible",
    ).toBeVisible({ timeout: 15000 });
    await menu.click();
  }

  async selectOrganization(orgId: string) {
    const orgIdInput = this.page.getByPlaceholder("Org ID");
    await expect(
      orgIdInput,
      "Org ID search input should be visible",
    ).toBeVisible({ timeout: 10000 });
    await orgIdInput.fill(orgId);

    const searchButton = this.page.getByRole("button", {
      name: "Search",
      exact: true,
    });
    await expect(
      searchButton,
      "Search button should be visible",
    ).toBeVisible({ timeout: 10000 });
    await searchButton.click();

    const loginAsOrg = this.page
      .locator('[id$="-uiGrid-000F-cell"] a')
      .first();

    await expect(
      loginAsOrg,
      `Organization link for org ID '${orgId}' should appear in search results`,
    ).toBeVisible({
      timeout: 30000,
    });

    await loginAsOrg.scrollIntoViewIfNeeded();
    await loginAsOrg.click();
  }
}
