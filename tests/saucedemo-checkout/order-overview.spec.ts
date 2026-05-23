import { test, expect } from '@playwright/test';
import { addProductsToCart, continueToOverview, fillCheckoutInformation, login, startCheckout, openCart } from './test-helpers';

test.describe('Order overview', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addProductsToCart(page, 3);
    await openCart(page);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Test', 'User', '12345');
    await continueToOverview(page);
  });

  test('shows items and summary', async ({ page }) => {
    await expect(page.locator('.cart_item')).toHaveCount(3);
    await expect(page.locator('.summary_info')).toBeVisible();
  });

  test('cancel returns to inventory and preserves badge', async ({ page }) => {
    await page.click('[data-test="cancel"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });
});
