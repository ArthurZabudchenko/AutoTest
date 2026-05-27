import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginButton = page.locator('body > header > div > div > a.login-btn');
    }

    async open() {
        await this.page.goto('https://beta.trendyeld.com/');
    }

    async verifyPageLoaded() {
        await expect(this.page).toHaveURL('https://beta.trendyeld.com/');
    }

    async verifyLoginButtonVisible() {
        await expect(this.loginButton).toBeVisible();
    }
}