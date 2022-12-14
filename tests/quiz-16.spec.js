var randomstring = require("randomstring");
const { test, expect } = require('@playwright/test');
const { uniqueNamesGenerator, names } = require('unique-names-generator');


test('Login - Negative', async ({ page }) => {

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

async function loginValid(page) {

  await page.goto('https://www.saucedemo.com/');

  //fill valid username & password
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');

  await page.locator('[data-test="login-button"]').click();

  await expect('[id="logout_sidebar_link"]').toBeDefined();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

}

test('Login - Positive', async ({ page }) => {

  await loginValid(page);

  await page.close();

});

test('Order Product - Positive', async ({ page }) => {

  const fname = uniqueNamesGenerator({dictionaries: [names]}); 
  const lname = uniqueNamesGenerator({dictionaries: [names]});
  const zcode = randomstring.generate({
    length: 5,
    charset: 'numeric'
  });

  await loginValid(page); // login
  
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click(); // add product to cart

  await expect('.shopping_cart_badge span').not.toBeNull()

  await page.locator('css=.shopping_cart_badge').click(); // click cart with 1 
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html'); //expect to change page

  await page.locator('[data-test="checkout"]').click(); // click checkout
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html'); //expect to change page
  
  //fill data (dynamic)
  await page.locator('[data-test="firstName"]').fill(fname);
  await page.locator('[data-test="lastName"]').fill(lname);
  await page.locator('[data-test="postalCode"]').fill(zcode);

  await page.locator('[data-test="continue"]').click(); //click continue
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html'); //expect to change page

  await page.locator('[data-test="finish"]').click(); //click finish
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html'); //expect to change page

  await expect(page.getByRole('heading', { name: 'THANK YOU FOR YOUR ORDER' })).toBeVisible();
  await expect(page.getByText(/Your order has been dispatched/)).toBeVisible()
  await expect(page.getByRole('img', { name: 'Pony Express' })).toBeVisible()

  await page.close()
})