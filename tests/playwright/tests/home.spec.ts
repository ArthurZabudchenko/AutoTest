import { test } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { performLogin } from "../utils/auth";

test("login flow", async ({ page }) => {
  await performLogin(page);

  const home = new HomePage(page);
  await home.verifyLoaded();
});
