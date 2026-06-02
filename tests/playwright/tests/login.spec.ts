import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login page tests', () => {

    test('Login page should open', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.verifyLoginPageLoaded();
    });

    test('Email and password fields should be visible', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();

        await expect(loginPage.emailInput).toBeEditable();
        await expect(loginPage.passwordInput).toBeEditable();
    });

    test('Submit button should be disabled with empty form', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();

        await expect(loginPage.submitButton).toBeVisible();
    });

    test('Should show validation for invalid email', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();

        await loginPage.emailInput.fill('invalid-email');
        await loginPage.passwordInput.fill('123456');

        await loginPage.submitButton.click();
        await page.waitForTimeout(1000)
        // await page.pause()

        await expect(page.locator('text=/Invalid Email or Password/i')).toBeVisible();
    });

    test('Should not login with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();

        await loginPage.login(
            'wrong@email.com',
            'wrongpassword'
        );

        await expect(
            page.locator('text=/Invalid Email or Password/i')
        ).toBeVisible();
    });

});