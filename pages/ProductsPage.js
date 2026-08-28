// pages/ProductsPage.js
const { expect } = require('@playwright/test');

exports.ProductsPage = class ProductsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Make the locator explicit and specific
    this.titleSpan = page.locator('span.title');
    this.firstItemAddToCartButton = page.locator('#add-to-cart-sauce-labs-backpack');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async verifyOnPage() {
    // Explicitly wait for the element to be visible before asserting text
    await this.titleSpan.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.titleSpan).toHaveText('Products');
  }

  async addFirstItemToCart() {
    await this.firstItemAddToCartButton.click();
  }

  async verifyCartCount(expectedCount) {
    await expect(this.cartBadge).toHaveText(expectedCount);
  }
};