const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');

test.describe('Cart workflow', () => {
  async function loginAndOpenCart(page) {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.STANDARD_USER, process.env.STANDARD_PASS);
    await productsPage.verifyOnPage();
    await productsPage.addFirstItemToCart();
    await productsPage.navigateToCart();
    await cartPage.verifyOnPage();

    return { cartPage, productsPage };
  }

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

  test('TC-CART-02: displays the added item with its details', async ({ page }) => {
    const { cartPage } = await loginAndOpenCart(page);

    const item = await cartPage.getItemByName('Sauce Labs Backpack');

    expect(item).toEqual({
      name: 'Sauce Labs Backpack',
      price: '$29.99',
      quantity: '1',
    });
  });

  test('TC-CART-03: removes an item and leaves the cart empty', async ({ page }) => {
    const { cartPage } = await loginAndOpenCart(page);

    await cartPage.removeItemByName('Sauce Labs Backpack');

    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(cartPage.cartItemCount).toHaveCount(0);
    expect(await cartPage.verifyCartIsEmpty()).toBe(true);
  });

  test('TC-CART-04: continues shopping from the cart', async ({ page }) => {
    const { cartPage } = await loginAndOpenCart(page);

    await cartPage.continueShopping();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC-CART-05: proceeds to checkout from the cart', async ({ page }) => {
    const { cartPage } = await loginAndOpenCart(page);

    await cartPage.checkout();

    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
  });
});