const { expect } = require('@playwright/test');

exports.ProductsPage = class ProductsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.titleSpan = page.locator('.title');
    this.firstItemAddToCartButton = page.locator('#add-to-cart-sauce-labs-backpack');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async verifyOnPage() {
    await expect(this.titleSpan).toHaveText('Products');
  }

  async addFirstItemToCart() {
    await this.firstItemAddToCartButton.click();
  }

  async verifyCartCount(expectedCount) {
    await expect(this.cartBadge).toHaveText(expectedCount);
  }
};