import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

const TEST_EMAIL = process.env.TEST_EMAIL ?? "";
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? "";

test.describe("Login scenarios", () => {
  // =========================
  // ✅ VALID LOGIN
  // =========================
  test("should login successfully with valid credentials", async ({ page }) => {
    const login = new LoginPage(page);

    // 👉 открыть страницу логина
    await login.open();

    // 👉 выполнить логин
    await login.login(TEST_EMAIL, TEST_PASSWORD);

    // 🔥 проверка 1: мы ушли со страницы login
    await expect(page).not.toHaveURL(/login/, { timeout: 10000 });

    // 🔥 проверка 2: появился UI системы (главный индикатор входа)
    await expect(page.locator(".admin-main-screen-menu").first()).toBeVisible({
      timeout: 15000,
    });
  });

  // =========================
  // ❌ INVALID LOGIN CASES
  // =========================
  const invalidCases = [
    { email: "", password: "", name: "empty fields" },
    { email: TEST_EMAIL, password: "", name: "empty password" },
    { email: "", password: TEST_PASSWORD, name: "empty email" },
    { email: "999", password: TEST_PASSWORD, name: "invalid email" },
    { email: TEST_EMAIL, password: "wrong", name: "wrong password" },
    { email: ` ${TEST_EMAIL} `, password: TEST_PASSWORD, name: "email with spaces" },
    { email: `${TEST_EMAIL}!!!`, password: TEST_PASSWORD, name: "special chars email" },
  ];

  for (const tc of invalidCases) {
    test(`should not login - ${tc.name}`, async ({ page }) => {
      const login = new LoginPage(page);

      await login.open();

      await login.emailInput.fill(tc.email);
      await login.passwordInput.fill(tc.password);

      await login.submitButton.click();

      // 🔥 проверка: остаёмся на login странице
      await expect(page).toHaveURL(/login/, { timeout: 5000 });

      // 🔥 проверка: кнопка логина всё ещё есть
      await expect(login.submitButton).toBeVisible();
    });
  }

  // =========================
  // 🧠 EMPTY FORM VALIDATION
  // =========================
  test("should show validation errors on empty submission", async ({
    page,
  }) => {
    const login = new LoginPage(page);

    await login.open();

    await login.submitButton.click();

    // 🔥 правильная проверка ошибок REQUIRED
    await expect(
      page.locator("text=This field is required.").first(),
    ).toBeVisible({ timeout: 5000 });
  });

  // =========================
  // 🔐 SECURITY CHECK
  // =========================
  test("should handle malicious input safely", async ({ page }) => {
    const login = new LoginPage(page);

    await login.open();

    await login.emailInput.fill(`${TEST_EMAIL}' OR 1=1`);
    await login.passwordInput.fill("<script>alert(1)</script>");

    await login.submitButton.click();

    // 🔥 проверка: ошибка логина
    await expect(page.locator("text=/Invalid Email or Password/i")).toBeVisible(
      { timeout: 5000 },
    );
  });
});
