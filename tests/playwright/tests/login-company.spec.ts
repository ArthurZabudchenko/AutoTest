import { test, expect } from "@playwright/test";

test("Login and select company", async ({ page }) => {
  await page.goto("https://176.trackensure.site/login");

  const email = page.getByRole("textbox", { name: "Email Address" });
  await expect(email).toBeVisible();
  await email.fill("5");

  const password = page.getByRole("textbox", { name: "Password" });
  await expect(password).toBeVisible();
  await password.fill("test");

  await page.getByRole("button", { name: "Log In" }).click();

  // 🔥 ЖДЁМ загрузку после логина
  await page.waitForLoadState("networkidle");

  // 🔥 лучше заменить этот селектор позже на data-testid
  const menu = page.locator(".admin-main-screen-menu").nth(12);
  await menu.waitFor({ state: "visible" });
  await menu.click();

  // Вводим Org ID
  await page.getByPlaceholder("Org ID").fill("32");

  // Поиск
  await page.getByRole("button", { name: "Search", exact: true }).click();

  // Ждём загрузку результатов
  await page.waitForLoadState("networkidle");

  // Кнопка Login As Organization
  const loginAsOrganization = page
    .locator('[id$="-uiGrid-000F-cell"] a')
    .first();

  await expect(loginAsOrganization).toBeVisible({ timeout: 15000 });

  await loginAsOrganization.scrollIntoViewIfNeeded();
  await loginAsOrganization.click();

  await expect(page.getByRole("link", { name: "Home page" })).toBeVisible();
});




