import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { OrganizationPage } from "../pages/OrganizationPage";

const TEST_EMAIL = process.env.TEST_EMAIL ?? "";
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? "";
const TEST_ORG_ID = process.env.TEST_ORG_ID ?? "";

test("Login and select company", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const organizationPage = new OrganizationPage(page);

  await loginPage.open();
  await loginPage.login(TEST_EMAIL, TEST_PASSWORD);

  await organizationPage.openMenu();
  await organizationPage.selectOrganization(TEST_ORG_ID);

  await expect(page.getByRole("link", { name: "Home page" })).toBeVisible();
});
