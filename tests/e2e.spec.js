const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');

test.describe('SauceDemo E2E Regression Suite', () => {

  test('Successful login and add item to cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.goto();
    // Using environment variables securely
    await loginPage.login(process.env.STANDARD_USER, process.env.STANDARD_PASS);

    await productsPage.verifyOnPage();
    await productsPage.addFirstItemToCart();
    await productsPage.verifyCartCount('1');
  });

  test('Negative login test - locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.LOCKED_USER, process.env.STANDARD_PASS);

    await test.expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });

});