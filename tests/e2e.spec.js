const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');

test.describe('SauceDemo E2E Regression Suite', () => {

  test('TC-AUTH-01: Successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    // Using environment variables securely
    await loginPage.login(process.env.STANDARD_USER, process.env.STANDARD_PASS);

  });

  test('TC-CART-01: Add item to cart and verify cart count', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.STANDARD_USER, process.env.STANDARD_PASS);

    await productsPage.verifyOnPage();
    await productsPage.addFirstItemToCart();
    await productsPage.verifyCartCount('1');
    await productsPage.navigateToCart();
    await cartPage.verifyItemInCart('Sauce Labs Backpack');
  });

  test('TC-AUTH-008: valid users can log in', async ({ page }) => {
    const validUsers = [
      'standard_user',
      'problem_user',
      'performance_glitch_user',
      'error_user',
      'visual_user'
    ];

    for (const username of validUsers) {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(username, process.env.STANDARD_PASS);

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(page.locator('.title')).toHaveText('Products');
      await expect(page.locator('.inventory_list')).toBeVisible();

      await page.goto('/');
    }
  });

  test('TC-AUTH-008: Login - Username field accepts standard_user from fixture list', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.STANDARD_USER, process.env.STANDARD_PASS);

    // Verify successful login by checking for a specific element on the products page
    const productsPage = new ProductsPage(page);
    await productsPage.verifyOnPage();
  });

  test('TC-AUTH-02: Negative login test - locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.LOCKED_USER, process.env.STANDARD_PASS);

    await test.expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });

});