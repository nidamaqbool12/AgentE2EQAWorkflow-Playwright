import { test, expect } from '@playwright/test';
import { addProductsToCart, continueToOverview, fillCheckoutInformation, finishOrder, login, startCheckout } from './test-helpers';

test.describe('SauceDemo order completion', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Complete', 'Order', '12345');
    await continueToOverview(page);
    await finishOrder(page);
  });

  test('shows the thank you header on order confirmation', async ({ page }) => {
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('shows confirmation text on the complete page', async ({ page }) => {
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  });

  test('shows the back home button after completion', async ({ page }) => {
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('returns to inventory when back home is clicked', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('keeps cart empty after order completion', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('shows order confirmation image', async ({ page }) => {
    await expect(page.locator('.pony_express')).toBeVisible();
  });

  test('remains on the confirmation page after reload', async ({ page }) => {
    await page.reload();
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('allows placing a second order after completion', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Second', 'Order', '99999');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('shows no shopping cart badge after returning home', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('preserves completion header text after navigating away and back', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await page.goto('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('shows complete page content for new order confirmations', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Third', 'Order', '33445');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  });

  test('verifies the back home flow after a second completion', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Repeat', 'Order', '11111');
    await continueToOverview(page);
    await finishOrder(page);
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});
