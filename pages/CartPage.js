const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
    
    // Page title and header
    this.pageTitle = page.locator('.title');
    
    // Cart items container
    this.cartItems = page.locator('.cart_item');
    this.cartItemCount = page.locator('.shopping_cart_badge');
    
    // Individual cart item locators (for each item in cart)
    this.itemQuantity = page.locator('[class*="cart_quantity"]');
    this.itemDescription = page.locator('.inventory_item_name');
    this.itemPrice = page.locator('.inventory_item_price');
    this.removeButton = page.locator('[id*="remove"]');
    
    // Specific quantity field
    this.quantityInput = page.locator('input[class*="quantity"]');
    
    // Cart summary section
    this.cartSummary = page.locator('.summary_info');
    this.subtotal = page.locator('[class*="subtotal"]');
    this.tax = page.locator('[class*="tax"]');
    this.total = page.locator('[class*="total"]');
    
    // Action buttons
    this.continueShoppingButton = page.getByRole('button', { name: /continue shopping/i });
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });
  }

  /**
   * Navigate to cart page
   */
  async goto() {
    await this.page.goto('/cart.html');
  }

  /**
   * Verify user is on cart page
   */
  async verifyOnPage() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  /**
   * Get number of items in cart
   */
  async getCartItemCount() {
    const count = await this.cartItemCount.textContent();
    return parseInt(count) || 0;
  }

  /**
   * Get all items currently in cart
   */
  async getCartItems() {
    const items = await this.cartItems.all();
    const cartItems = [];

    for (const item of items) {
      const name = await item.locator('.inventory_item_name').textContent();
      const price = await item.locator('.inventory_item_price').textContent();
      const quantity = await item.locator('[class*="quantity"]').textContent();

      cartItems.push({
        name: name?.trim() || '',
        price: price?.trim() || '',
        quantity: quantity?.trim() || '1'
      });
    }

    return cartItems;
  }

  /**
   * Get specific item from cart by name
   */
  async getItemByName(itemName) {
    const item = this.cartItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: itemName })
    }).first();

    const name = await item.locator('.inventory_item_name').textContent();
    const price = await item.locator('.inventory_item_price').textContent();
    const quantity = await item.locator('[class*="quantity"]').textContent();

    return {
      name: name?.trim() || '',
      price: price?.trim() || '',
      quantity: quantity?.trim() || '1'
    };
  }

  /**
   * Verify item exists in cart
   */
  async verifyItemInCart(itemName) {
    const item = await this.getItemByName(itemName);
    return item.name !== '';
  }

  /**
   * Remove item from cart by name
   */
  async removeItemByName(itemName) {
    const item = this.cartItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: itemName })
    }).first();

    await item.locator('[id*="remove"]').click();
  }

  /**
   * Remove item from cart by index
   */
  async removeItemByIndex(index) {
    const items = await this.cartItems.all();
    if (index < items.length) {
      await items[index].locator('[id*="remove"]').click();
    }
  }

  /**
   * Update item quantity
   */
  async updateQuantity(itemName, quantity) {
    const item = this.cartItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: itemName })
    }).first();

    const quantityInput = item.locator('input[class*="quantity"]');
    await quantityInput.clear();
    await quantityInput.fill(quantity.toString());
  }

  /**
   * Get cart subtotal
   */
  async getSubtotal() {
    const subtotalText = await this.subtotal.textContent();
    return this.parsePrice(subtotalText);
  }

  /**
   * Get cart tax
   */
  async getTax() {
    const taxText = await this.tax.textContent();
    return this.parsePrice(taxText);
  }

  /**
   * Get cart total
   */
  async getTotal() {
    const totalText = await this.total.textContent();
    return this.parsePrice(totalText);
  }

  /**
   * Verify cart is empty
   */
  async verifyCartIsEmpty() {
    const items = await this.cartItems.count();
    return items === 0;
  }

  /**
   * Verify cart has specific number of items
   */
  async verifyCartItemCount(expectedCount) {
    const items = await this.cartItems.count();
    await expect(items).toBe(expectedCount);
  }

  /**
   * Continue shopping (go back to products page)
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  /**
   * Proceed to checkout
   */
  async checkout() {
    await this.checkoutButton.click();
  }

  /**
   * Helper method to parse price from text
   */
  parsePrice(priceText) {
    if (!priceText) return 0;
    const match = priceText.match(/\$[\d.]+/);
    return match ? parseFloat(match[0].replace('$', '')) : 0;
  }
}

module.exports = { CartPage };
