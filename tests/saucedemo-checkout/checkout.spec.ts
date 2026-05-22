import { test, expect } from '@playwright/test';

const APP_URL = 'https://www.saucedemo.com';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

async function login(page) {
  await page.goto(APP_URL);
  await page.waitForSelector('[data-test="username"]', { state: 'visible' });
  await page.fill('[data-test="username"]', USERNAME);
  await page.fill('[data-test="password"]', PASSWORD);
  await page.click('[data-test="login-button"]');
  await page.waitForURL('**/inventory.html');
}

async function addFirstTwoProductsToCart(page) {
  const addButtons = page.locator('button[data-test^="add-to-cart-"]');
  const availableCount = await addButtons.count();
  expect(availableCount).toBeGreaterThanOrEqual(2);
  await expect(addButtons.nth(0)).toBeVisible();
  await expect(addButtons.nth(1)).toBeVisible();
  await addButtons.nth(0).click();
  await addButtons.nth(1).click();
}

test.describe('SauceDemo checkout workflow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should allow login, add items, review cart, and complete checkout', async ({ page }) => {
    await addFirstTwoProductsToCart(page);
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');

    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    await expect(cartItems.first().locator('.inventory_item_name')).toBeVisible();
    await expect(cartItems.first().locator('.inventory_item_price')).toBeVisible();
    await expect(page.locator('.cart_list')).toBeVisible();

    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');

    await page.fill('[data-test="firstName"]', 'Test');
    await page.fill('[data-test="lastName"]', 'User');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await page.waitForURL('**/checkout-step-two.html');

    await expect(page.locator('.summary_info')).toContainText('Payment Information');
    await expect(page.locator('.summary_info')).toContainText('Shipping Information');
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();

    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('should validate required checkout information fields', async ({ page }) => {
    await addFirstTwoProductsToCart(page);
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');

    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');

    await page.fill('[data-test="firstName"]', 'Test');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');

    await page.fill('[data-test="lastName"]', 'User');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
  });

  test('should accept non-empty postal code values and continue to checkout overview', async ({ page }) => {
    await addFirstTwoProductsToCart(page);
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');

    await page.fill('[data-test="firstName"]', 'Test');
    await page.fill('[data-test="lastName"]', 'User');
    await page.fill('[data-test="postalCode"]', '!@#$%');
    await page.click('[data-test="continue"]');

    await expect(page.locator('[data-test="error"]')).toHaveCount(0);
    await page.waitForURL('**/checkout-step-two.html');
  });

  test('should allow cancelling checkout and returning to cart or inventory as expected', async ({ page }) => {
    await addFirstTwoProductsToCart(page);
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');

    await page.click('[data-test="cancel"]');
    await page.waitForURL('**/cart.html');
    await expect(page.locator('.cart_item')).toHaveCount(2);

    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'Test');
    await page.fill('[data-test="lastName"]', 'User');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await page.waitForURL('**/checkout-step-two.html');
    await page.click('[data-test="cancel"]');
    await page.waitForURL('**/inventory.html');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });
});
