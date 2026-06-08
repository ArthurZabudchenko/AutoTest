import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

test("login flow", async ({ page }) => {
  const login = new LoginPage(page);
  const home = new HomePage(page);

  // 1. open home page and verify it responds
  const response = await page.goto("https://176.trackensure.site/");
  if (!response) {
    throw new Error("Initial navigation returned no response");
  }
  if (!response.ok()) {
    throw new Error(
      `Initial navigation returned HTTP ${response.status()} (${response.statusText()})`,
    );
  }

  // 2. go to login
  await login.open();

  // 3. login
  await login.login("5", "test");

  // 4. verify login succeeded before checking home page
  await expect(
    page,
    "Should navigate away from login page after successful login",
  ).not.toHaveURL(/login/, { timeout: 10000 });

  // 5. verify home page loaded
  await home.verifyLoaded();
});
