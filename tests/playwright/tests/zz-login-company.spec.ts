import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { OrganizationPage } from "../pages/OrganizationPage";

test("Login and select company", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const organizationPage = new OrganizationPage(page);

  await loginPage.open();
  await loginPage.login("5", "test");

  // verify login succeeded before proceeding to org selection
  await expect(
    page,
    "Should navigate away from login page after successful login",
  ).not.toHaveURL(/login/, { timeout: 10000 });

  await organizationPage.openMenu();
  await organizationPage.selectOrganization("32");

  await expect(
    page.getByRole("link", { name: "Home page" }),
    "Home page link should be visible after selecting organization",
  ).toBeVisible({ timeout: 10000 });
});
