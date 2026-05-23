import { test, expect } from '@playwright/test';
import { addProductsToCart, fillCheckoutInformation, login, openCart, startCheckout } from './test-helpers';

test.describe('Checkout information validation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addProductsToCart(page, 2);
    await openCart(page);
    await startCheckout(page);
  });

  test('requires first name', async ({ page }) => {
    await fillCheckoutInformation(page, '', 'User', '12345');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('requires last name', async ({ page }) => {
    await fillCheckoutInformation(page, 'Test', '', '12345');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('requires postal code', async ({ page }) => {
    await fillCheckoutInformation(page, 'Test', 'User', '');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('accepts whitespace-padded values and advances', async ({ page }) => {
    await fillCheckoutInformation(page, '  Test  ', '  User  ', '  12345  ');
    await page.click('[data-test="continue"]');
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });
});
