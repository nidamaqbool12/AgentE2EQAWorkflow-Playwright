import { test, expect } from '@playwright/test';
import { addProductsToCart, continueToOverview, fillCheckoutInformation, finishOrder, login, openCart, startCheckout } from './test-helpers';

test.describe('Order completion', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addProductsToCart(page, 2);
    await openCart(page);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Complete', 'User', '12345');
    await continueToOverview(page);
    await finishOrder(page);
  });

  test('shows confirmation and clears cart on back home', async ({ page }) => {
    await expect(page.locator('.complete-header')).toBeVisible();
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
