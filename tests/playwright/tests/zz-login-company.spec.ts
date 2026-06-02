import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { OrganizationPage } from "../pages/OrganizationPage";

test("Login and select company", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const organizationPage = new OrganizationPage(page);

  await loginPage.open();
  await loginPage.login("5", "test");

  await organizationPage.openMenu();
  await organizationPage.selectOrganization("32");

  await expect(page.getByRole("link", { name: "Home page" })).toBeVisible();
});
