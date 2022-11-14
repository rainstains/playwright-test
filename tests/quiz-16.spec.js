const { test, expect } = require('@playwright/test');

test('Login - Negative Test Case', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');

  //fill invalid username & password
  await page.locator('[data-test="username"]').fill('premium_user');
  await page.locator('[data-test="password"]').fill('open_sauce');

  await page.locator('[data-test="login-button"]').click();

  const errorDiv = page.locator('[data-test="error"]');

  await expect(errorDiv).toBeVisible()

  await expect(errorDiv).toContainText(/Epic sadface/);

  await page.close();

});


test('Login - Positive Test Case', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');

  //fill valid username & password
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');

  await page.locator('[data-test="login-button"]').click();

  await expect('[id="logout_sidebar_link"]').toBeDefined();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  await page.close();

});