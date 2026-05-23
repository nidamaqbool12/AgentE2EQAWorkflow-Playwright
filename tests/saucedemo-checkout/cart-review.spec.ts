import { test, expect } from '@playwright/test';
import { addProductsToCart, login, openCart } from './test-helpers';

test.describe('Cart review', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('adds products and updates cart badge', async ({ page }) => {
    await addProductsToCart(page, 2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await openCart(page);
    await expect(page.locator('.cart_item')).toHaveCount(2);
  });

  test('continue shopping and remove item', async ({ page }) => {
    await addProductsToCart(page, 2);
    await openCart(page);
    await page.click('[data-test="continue-shopping"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
    await addProductsToCart(page, 1);
    await openCart(page);
    await page.locator('[data-test^="remove-"]').first().click();
    await expect(page.locator('.cart_item')).toHaveCount(2);
  });
});
