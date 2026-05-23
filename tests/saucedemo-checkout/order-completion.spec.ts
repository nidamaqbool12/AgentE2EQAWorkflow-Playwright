import { test, expect } from '@playwright/test';
import { addProductsToCart, continueToOverview, fillCheckoutInformation, finishOrder, login, startCheckout } from './test-helpers';

test.describe('SauceDemo order completion', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Complete', 'User', '12345');
    await continueToOverview(page);
    await finishOrder(page);
  });

  test('shows the thank you header on confirmation', async ({ page }) => {
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('returns to inventory when back home is clicked and clears cart', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory\.html$/);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('shows order completion image and message', async ({ page }) => {
    await expect(page.locator('.pony_express')).toBeVisible();
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  });

  test('allows a second order after returning home', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await addProductsToCart(page, 1);
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await fillCheckoutInformation(page, 'Second', 'Order', '99999');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });
});
