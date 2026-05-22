import { test, expect } from '@playwright/test';
import { addProductsToCart, continueToOverview, fillCheckoutInformation, finishOrder, login, openCart, startCheckout } from './test-helpers';

test.describe('SauceDemo complete checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('completes checkout successfully from inventory to confirmation', async ({ page }) => {
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Complete', 'User', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('returns to products page after clicking back home', async ({ page }) => {
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Return', 'Home', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('restarts a new order after completion', async ({ page }) => {
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Restart', 'Order', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await page.click('[data-test="back-to-products"]');
    await addProductsToCart(page, 2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('clears the shopping cart after order completion', async ({ page }) => {
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Clear', 'Cart', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('finishes checkout with 3 products and shows completion text', async ({ page }) => {
    await addProductsToCart(page, 3);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Three', 'Items', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  });

  test('cancels and then continues shopping before completing checkout', async ({ page }) => {
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await page.click('[data-test="cancel"]');
    await expect(page).toHaveURL(/.*cart\.html/);
    await page.click('[data-test="continue-shopping"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
    await addProductsToCart(page, 1);
    await openCart(page);
    await page.click('[data-test="checkout"]');
    await fillCheckoutInformation(page, 'Continue', 'Shop', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('allows checkout after removing one product from the cart', async ({ page }) => {
    await addProductsToCart(page, 3);
    await openCart(page);
    await page.locator('[data-test^="remove-"]').first().click();
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await page.click('[data-test="checkout"]');
    await fillCheckoutInformation(page, 'Removed', 'Item', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('uses cart badge count to confirm items before checkout', async ({ page }) => {
    await addProductsToCart(page, 2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Badge', 'Count', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('verifies the checkout completion page after a full order', async ({ page }) => {
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Verify', 'Complete', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('maintains order completion state after reload', async ({ page }) => {
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Reload', 'Check', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await page.reload();
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('supports user navigation back home after order completion', async ({ page }) => {
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Navigation', 'Home', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('ensures complete order confirmation contains expected text', async ({ page }) => {
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Confirm', 'Final', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  });
});
