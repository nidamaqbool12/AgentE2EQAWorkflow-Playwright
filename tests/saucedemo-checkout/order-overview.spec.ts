import { test, expect } from '@playwright/test';
import { addProductsToCart, continueToOverview, fillCheckoutInformation, login, startCheckout } from './test-helpers';

test.describe('SauceDemo order overview', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addProductsToCart(page, 3);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Test', 'User', '12345');
    await continueToOverview(page);
  });

  test('displays the checkout overview title', async ({ page }) => {
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
  });

  test('shows payment information details', async ({ page }) => {
    await expect(page.locator('.summary_info')).toContainText('Payment Information');
  });

  test('shows shipping information details', async ({ page }) => {
    await expect(page.locator('.summary_info')).toContainText('Shipping Information');
  });

  test('lists selected items in the overview', async ({ page }) => {
    await expect(page.locator('.cart_item')).toHaveCount(3);
  });

  test('shows subtotal, tax, and total labels', async ({ page }) => {
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  test('shows the finish and cancel buttons', async ({ page }) => {
    await expect(page.locator('[data-test="finish"]')).toBeVisible();
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
  });

  test('cancel from overview returns to inventory', async ({ page }) => {
    await page.click('[data-test="cancel"]');
    await expect(page).toHaveURL('**/inventory.html');
  });

  test('keeps the item count after navigating away and back', async ({ page }) => {
    await page.reload();
    await expect(page.locator('.cart_item')).toHaveCount(3);
  });

  test('shows item names and prices on overview page', async ({ page }) => {
    await expect(page.locator('.inventory_item_name')).toHaveCount(3);
    await expect(page.locator('.inventory_item_price')).toHaveCount(3);
  });

  test('displays the summary section with total values', async ({ page }) => {
    const summaryText = await page.locator('.summary_info').innerText();
    expect(summaryText).toMatch(/Item total:/);
    expect(summaryText).toMatch(/Tax:/);
    expect(summaryText).toMatch(/Total:/);
  });

  test('shows a valid payment method label', async ({ page }) => {
    await expect(page.locator('.summary_info')).toContainText('SauceCard #');
  });

  test('shows a valid shipping method label', async ({ page }) => {
    await expect(page.locator('.summary_info')).toContainText('Pony Express');
  });

  test('allows page reload while remaining on checkout overview', async ({ page }) => {
    await page.reload();
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
  });
});
