import { test, expect } from '@playwright/test';
import { addProductsToCart, fillCheckoutInformation, login, startCheckout } from './test-helpers';

test.describe('SauceDemo checkout information validation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addProductsToCart(page, 2);
    await startCheckout(page);
  });

  test('requires first name before continuing', async ({ page }) => {
    await fillCheckoutInformation(page, '', 'User', '12345');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
    await expect(page).toHaveURL(/.*checkout-step-one\.html$/);
  });

  test('requires last name before continuing', async ({ page }) => {
    await fillCheckoutInformation(page, 'Test', '', '12345');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');
    await expect(page).toHaveURL(/.*checkout-step-one\.html$/);
  });

  test('requires postal code before continuing', async ({ page }) => {
    await fillCheckoutInformation(page, 'Test', 'User', '');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
    await expect(page).toHaveURL(/.*checkout-step-one\.html$/);
  });

  test('accepts whitespace-padded checkout values and advances', async ({ page }) => {
    await fillCheckoutInformation(page, '  Test  ', '  User  ', '  12345  ');
    await page.click('[data-test="continue"]');
    await expect(page).toHaveURL(/.*checkout-step-two\.html$/);
  });

  test('accepts special characters in postal code and advances if non-empty', async ({ page }) => {
    await fillCheckoutInformation(page, 'Test', 'User', '!@#$%');
    await page.click('[data-test="continue"]');
    await expect(page).toHaveURL(/.*checkout-step-two\.html$/);
  });

  test('cancel button returns to cart from checkout information', async ({ page }) => {
    await page.click('[data-test="cancel"]');
    await expect(page).toHaveURL(/.*cart\.html$/);
  });
});
