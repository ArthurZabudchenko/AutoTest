import { Page, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SELECTORS, TIMEOUTS, TEST_CREDENTIALS } from "../config/constants";

/**
 * Performs the full login flow: navigates to the login page and submits
 * the default test credentials, then waits for the main menu to confirm
 * a successful login.
 */
export async function performLogin(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);

  await expect(page.locator(SELECTORS.mainMenu).first()).toBeVisible({
    timeout: TIMEOUTS.long,
  });
}
