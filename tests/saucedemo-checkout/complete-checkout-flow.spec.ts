import { test, expect } from '@playwright/test';
import { addProductsToCart, continueToOverview, fillCheckoutInformation, finishOrder, login, openCart } from './test-helpers';

test('complete checkout flow end-to-end', async ({ page }) => {
  await login(page);
  await addProductsToCart(page, 2);
  await openCart(page);
  await page.click('[data-test="checkout"]');
  await fillCheckoutInformation(page, 'Flow', 'User', '12345');
  await continueToOverview(page);
  await expect(page.locator('.summary_info')).toBeVisible();
  await finishOrder(page);
  await expect(page.locator('.complete-header')).toBeVisible();
});
