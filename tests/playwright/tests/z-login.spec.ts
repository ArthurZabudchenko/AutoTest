import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import {
  SELECTORS,
  TIMEOUTS,
  TEST_CREDENTIALS,
} from "../config/constants";

test.describe("Login scenarios", () => {
  // =========================
  // VALID LOGIN
  // =========================
  test("should login successfully with valid credentials", async ({ page }) => {
    const login = new LoginPage(page);

    await login.open();
    await login.login(TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);

    await expect(page).not.toHaveURL(/login/, { timeout: TIMEOUTS.medium });

    await expect(page.locator(SELECTORS.mainMenu).first()).toBeVisible({
      timeout: TIMEOUTS.long,
    });
  });

  // =========================
  // INVALID LOGIN CASES
  // =========================
  const invalidCases = [
    { email: "", password: "", name: "empty fields" },
    { email: TEST_CREDENTIALS.email, password: "", name: "empty password" },
    { email: "", password: TEST_CREDENTIALS.password, name: "empty email" },
    { email: "999", password: TEST_CREDENTIALS.password, name: "invalid email" },
    { email: TEST_CREDENTIALS.email, password: "wrong", name: "wrong password" },
    { email: ` ${TEST_CREDENTIALS.email} `, password: TEST_CREDENTIALS.password, name: "email with spaces" },
    { email: `${TEST_CREDENTIALS.email}!!!`, password: TEST_CREDENTIALS.password, name: "special chars email" },
  ];

  for (const tc of invalidCases) {
    test(`should not login - ${tc.name}`, async ({ page }) => {
      const login = new LoginPage(page);

      await login.open();

      await login.emailInput.fill(tc.email);
      await login.passwordInput.fill(tc.password);

      await login.submitButton.click();

      await expect(page).toHaveURL(/login/, { timeout: TIMEOUTS.short });
      await expect(login.submitButton).toBeVisible();
    });
  }

  // =========================
  // EMPTY FORM VALIDATION
  // =========================
  test("should show validation errors on empty submission", async ({
    page,
  }) => {
    const login = new LoginPage(page);

    await login.open();
    await login.submitButton.click();

    await expect(
      page.locator("text=This field is required.").first(),
    ).toBeVisible({ timeout: TIMEOUTS.short });
  });

  // =========================
  // SECURITY CHECK
  // =========================
  test("should handle malicious input safely", async ({ page }) => {
    const login = new LoginPage(page);

    await login.open();

    await login.emailInput.fill("5' OR 1=1");
    await login.passwordInput.fill("<script>alert(1)</script>");

    await login.submitButton.click();

    await expect(page.locator("text=/Invalid Email or Password/i")).toBeVisible(
      { timeout: TIMEOUTS.short },
    );
  });
});
