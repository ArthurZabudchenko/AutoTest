import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

test("login flow", async ({ page }) => {
  const login = new LoginPage(page);
  const home = new HomePage(page);

  // 1. СНАЧАЛА открываем главную
  await page.goto("https://176.trackensure.site/");

  // 2. идём на login
  await login.open();

  // 3. логинимся
  await login.login("5", "test");

  // 4. проверяем что попали в систему
  await home.verifyLoaded();
});
