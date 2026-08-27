const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');

test.describe('SauceDemo shopping flow', () => {
  test('logs in, sorts products, and adds a product to the cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // 2. Validate transition to Products Page
    await productsPage.verifyOnPage();

    // 3. Perform action: Add item to cart and verify badge counter updates
    await productsPage.addFirstItemToCart();
    await productsPage.verifyCartCount('1');
  });

  test('Negative login test - locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    // Assert error message triggers properly
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });
});
