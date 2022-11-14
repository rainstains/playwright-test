const { test, expect } = require('@playwright/test');

test('Login - Negative Test Case', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');

  await page.locator('[data-test="username"]').fill('premium_user');
  await page.locator('[data-test="password"]').fill('open_sauce');

  await page.locator('[data-test="login-button"]').click();

  const errorDiv = page.locator('[data-test="error"]');

  await expect(errorDiv).toBeVisible()

  await expect(errorDiv).toContainText(/Epic sadface/);

  page.close();

});
