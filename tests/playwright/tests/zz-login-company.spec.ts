import { test, expect } from "@playwright/test";
import { OrganizationPage } from "../pages/OrganizationPage";
import { performLogin } from "../utils/auth";

test("Login and select company", async ({ page }) => {
  await performLogin(page);

  const organizationPage = new OrganizationPage(page);
  await organizationPage.openMenu();
  await organizationPage.selectOrganization("32");

  await expect(page.getByRole("link", { name: "Home page" })).toBeVisible();
});
