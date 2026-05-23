import { test, expect } from '@playwright/test';
import { addProductsToCart, continueToOverview, fillCheckoutInformation, finishOrder, login, openCart } from './test-helpers';

test.describe('SauceDemo complete checkout flow', () => {
  test('completes checkout from inventory through order confirmation', async ({ page }) => {
    await login(page);
    await addProductsToCart(page, 2);
    await openCart(page);
    await page.click('[data-test="checkout"]');
    await fillCheckoutInformation(page, 'Flow', 'User', '12345');
    await continueToOverview(page);
    await expect(page.locator('.summary_info')).toBeVisible();
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory\.html$/);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
