import { test, expect } from '@playwright/test';
import { addProductsToCart, login, openCart } from './test-helpers';

test.describe('SauceDemo cart review', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('adds products to the cart and updates the badge', async ({ page }) => {
    await addProductsToCart(page, 2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await openCart(page);
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.inventory_item_name')).toHaveCount(2);
    await expect(page.locator('.inventory_item_price')).toHaveCount(2);
  });

  test('shows cart item details and allows continue shopping', async ({ page }) => {
    await addProductsToCart(page, 2);
    await openCart(page);

    await expect(page.locator('.inventory_item_name')).toHaveCount(2);
    await expect(page.locator('.inventory_item_desc')).toHaveCount(2);
    await expect(page.locator('.inventory_item_price')).toHaveCount(2);

    await page.click('[data-test="continue-shopping"]');
    await expect(page).toHaveURL(/.*inventory\.html$/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('removes a product from cart and updates count', async ({ page }) => {
    await addProductsToCart(page, 2);
    await openCart(page);

    await page.locator('[data-test^="remove-"]').first().click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('keeps cart badge empty when no items are added', async ({ page }) => {
    await openCart(page);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });
});
