const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');

const validUsers = (process.env.VALID_USERS || '')
  .split(',')
  .map((username) => username.trim())
  .filter(Boolean);

if (validUsers.length === 0) {
  throw new Error('VALID_USERS must contain the comma-separated list of valid SauceDemo usernames.');
}

if (new Set(validUsers).size !== validUsers.length) {
  throw new Error('VALID_USERS contains duplicate usernames.');
}

test.describe('SauceDemo E2E Regression Suite', () => {

  for (const username of validUsers) {
    test(`TC-AUTH-ALL: ${username} can log in and sees the inventory`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login(username, process.env.STANDARD_PASS);

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(page.locator('.title')).toHaveText('Products');
      await expect(page.locator('.inventory_item')).toHaveCount(6);
      await expect(page.locator('.inventory_item_name')).toHaveText(Array(6).fill(/\S+/));
      await expect(page.locator('.inventory_item_price')).toHaveText(
        Array(6).fill(/^\$\d+\.\d{1,2}$/)
      );
      await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Backpack');
      await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
      await expect(page.locator('.product_sort_container')).toBeVisible();
      await expect(page.locator('.inventory_item button')).toHaveCount(6);
      await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    });
  }

  test('TC-AUTH-001: Login - Valid credentials redirect to inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.STANDARD_USER, process.env.STANDARD_PASS);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC-AUTH-002: Login - Invalid password shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.STANDARD_USER, 'invalid_password');

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service'
    );
  });

  test('TC-AUTH-003: Login - Locked out user sees locked-out message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.LOCKED_USER, process.env.STANDARD_PASS);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
    await expect(page).not.toHaveURL(/\/inventory\.html$/);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('TC-AUTH-004: Login - Empty username shows required validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', process.env.STANDARD_PASS);

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('TC-AUTH-005: Login - Empty password shows required validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.STANDARD_USER, '');

    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('TC-AUTH-006: Login - Both fields empty shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('TC-AUTH-007: Login - Password masked (type=password)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC-AUTH-008: Login - Username field accepts standard_user from fixture list', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.STANDARD_USER, process.env.STANDARD_PASS);

    await productsPage.verifyOnPage();
  });

});