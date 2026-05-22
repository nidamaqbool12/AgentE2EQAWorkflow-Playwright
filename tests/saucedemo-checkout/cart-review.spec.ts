import { test, expect } from '@playwright/test';
import { addProductsToCart, login, openCart } from './test-helpers';

test.describe('SauceDemo cart review', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('displays inventory after logging in', async ({ page }) => {
    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCountGreaterThan(0);
  });

  test('adds products to the cart and updates badge count', async ({ page }) => {
    await addProductsToCart(page, 2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('opens cart and validates product details', async ({ page }) => {
    await addProductsToCart(page, 2);
    await openCart(page);
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.inventory_item_name')).toHaveCount(2);
    await expect(page.locator('.inventory_item_price')).toHaveCount(2);
  });

  test('continues shopping from cart and preserves cart badge count', async ({ page }) => {
    await addProductsToCart(page, 1);
    await openCart(page);
    await page.click('[data-test="continue-shopping"]');
    await expect(page).toHaveURL('**/inventory.html');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('removes a product and updates the cart count', async ({ page }) => {
    await addProductsToCart(page, 2);
    await openCart(page);
    await page.locator('[data-test^="remove-"]').first().click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('shows item descriptions for cart products', async ({ page }) => {
    await addProductsToCart(page, 2);
    await openCart(page);
    await expect(page.locator('.inventory_item_desc')).toHaveCount(2);
  });

  test('shows correct cart badge when multiple items are added', async ({ page }) => {
    await addProductsToCart(page, 3);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('clears cart badge when cart is empty initially', async ({ page }) => {
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('shows product names and prices in the cart', async ({ page }) => {
    await addProductsToCart(page, 2);
    await openCart(page);
    await expect(page.locator('.inventory_item_name')).toHaveCount(2);
    await expect(page.locator('.inventory_item_price')).toHaveCount(2);
  });

  test('preserves cart contents after navigating back to inventory', async ({ page }) => {
    await addProductsToCart(page, 2);
    await openCart(page);
    await page.click('[data-test="continue-shopping"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('shows remove buttons for each cart item', async ({ page }) => {
    await addProductsToCart(page, 2);
    await openCart(page);
    await expect(page.locator('[data-test^="remove-"]')).toHaveCount(2);
  });

  test('keeps cart count accurate after removing and re-adding items', async ({ page }) => {
    await addProductsToCart(page, 2);
    await openCart(page);
    await page.locator('[data-test^="remove-"]').first().click();
    await page.click('[data-test="continue-shopping"]');
    await addProductsToCart(page, 2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });
});