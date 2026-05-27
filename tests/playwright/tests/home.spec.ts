import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home page tests', () => {

    test('Home page should open successfully', async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.open();
        await homePage.verifyPageLoaded();
    });

    test('Login button should be visible', async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.open();
        await homePage.verifyLoginButtonVisible();
    });

});