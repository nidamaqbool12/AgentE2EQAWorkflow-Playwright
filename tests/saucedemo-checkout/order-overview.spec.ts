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

  test('displays the checkout overview title and summary', async ({ page }) => {
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
    await expect(page.locator('.summary_info')).toBeVisible();
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  test('lists all selected items and pricing details on overview', async ({ page }) => {
    await expect(page.locator('.cart_item')).toHaveCount(3);
    await expect(page.locator('.inventory_item_name')).toHaveCount(3);
    await expect(page.locator('.inventory_item_price')).toHaveCount(3);
  });

  test('shows cancel and finish buttons on order overview', async ({ page }) => {
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
    await expect(page.locator('[data-test="finish"]')).toBeVisible();
  });

  test('cancel from overview returns to inventory and preserves the cart badge', async ({ page }) => {
    await page.click('[data-test="cancel"]');
    await expect(page).toHaveURL(/.*inventory\.html$/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('reload retains the order overview page', async ({ page }) => {
    await page.reload();
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
  });
});
