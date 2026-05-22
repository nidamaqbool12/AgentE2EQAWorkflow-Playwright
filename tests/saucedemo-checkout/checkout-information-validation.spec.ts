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
  });

  test('requires last name before continuing', async ({ page }) => {
    await fillCheckoutInformation(page, 'Test', '', '12345');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');
  });

  test('requires postal code before continuing', async ({ page }) => {
    await fillCheckoutInformation(page, 'Test', 'User', '');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
  });

  test('allows non-empty postal code values to continue', async ({ page }) => {
    await fillCheckoutInformation(page, 'Test', 'User', '!@#$%');
    await page.click('[data-test="continue"]');
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('shows all checkout information fields', async ({ page }) => {
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('keeps entered values after a validation error', async ({ page }) => {
    await fillCheckoutInformation(page, '', 'User', '12345');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('User');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('12345');
  });

  test('clears the error message after correcting the missing field', async ({ page }) => {
    await fillCheckoutInformation(page, '', 'User', '12345');
    await page.click('[data-test="continue"]');
    await page.fill('[data-test="firstName"]', 'Test');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveCount(0);
  });

  test('cancel button returns to cart from checkout information', async ({ page }) => {
    await page.click('[data-test="cancel"]');
    await expect(page).toHaveURL(/.*cart\.html/);
  });

  test('validates the order of checkout form fields', async ({ page }) => {
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('accepts input with leading/trailing whitespace', async ({ page }) => {
    await fillCheckoutInformation(page, '  Test  ', '  User  ', '  12345  ');
    await page.click('[data-test="continue"]');
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('continues to overview after valid information entry', async ({ page }) => {
    await fillCheckoutInformation(page, 'Valid', 'User', '55555');
    await page.click('[data-test="continue"]');
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('shows a cancel option on checkout information page', async ({ page }) => {
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
  });

  test('renders the checkout information page on valid cart state', async ({ page }) => {
    await expect(page.locator('.checkout_info')).toBeVisible();
  });
});
