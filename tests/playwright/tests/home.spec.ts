import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

const TEST_EMAIL = process.env.TEST_EMAIL ?? "";
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? "";

test("login flow", async ({ page }) => {
  const login = new LoginPage(page);
  const home = new HomePage(page);

  // 1. открываем главную (uses baseURL from config)
  await page.goto("/");

  // 2. идём на login
  await login.open();

  // 3. логинимся
  await login.login(TEST_EMAIL, TEST_PASSWORD);

  // 4. проверяем что попали в систему
  await home.verifyLoaded();
});
