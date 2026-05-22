import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const APP_URL = 'https://www.saucedemo.com';
export const USERNAME = 'standard_user';
export const PASSWORD = 'secret_sauce';

const productButtonLocator = 'button[data-test^="add-to-cart-"]';

export async function login(page: Page) {
  await page.goto(APP_URL);
  await page.waitForSelector('[data-test="username"]', { state: 'visible' });
  await page.fill('[data-test="username"]', USERNAME);
  await page.fill('[data-test="password"]', PASSWORD);
  await page.click('[data-test="login-button"]');
  await page.waitForURL(/.*inventory\.html$/);
}

export async function addProductsToCart(page: Page, count = 2) {
  const addButtons = page.locator(productButtonLocator);
  const totalButtons = await addButtons.count();
  expect(totalButtons).toBeGreaterThanOrEqual(2);
  for (let index = 0; index < count; index++) {
    await expect(addButtons.nth(index)).toBeVisible();
    await addButtons.nth(index).click();
  }
}

export async function openCart(page: Page) {
  await page.click('.shopping_cart_link');
  await page.waitForURL(/.*cart\.html$/);
}

export async function startCheckout(page: Page) {
  await openCart(page);
  await page.click('[data-test="checkout"]');
  await page.waitForURL(/.*checkout-step-one\.html$/);
}

export async function fillCheckoutInformation(page: Page, firstName = 'Test', lastName = 'User', postalCode = '12345') {
  await expect(page.locator('[data-test="firstName"]')).toBeVisible();
  await page.fill('[data-test="firstName"]', firstName);
  await page.fill('[data-test="lastName"]', lastName);
  await page.fill('[data-test="postalCode"]', postalCode);
}

export async function continueToOverview(page: Page) {
  await page.click('[data-test="continue"]');
  await page.waitForURL(/.*checkout-step-two\.html$/);
}

export async function finishOrder(page: Page) {
  await page.click('[data-test="finish"]');
  await page.waitForURL(/.*checkout-complete\.html$/);
}

export async function verifyCartContents(page: Page, expectedCount: number) {
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(expectedCount);
  await expect(cartItems.first().locator('.inventory_item_name')).toBeVisible();
  await expect(cartItems.first().locator('.inventory_item_price')).toBeVisible();
}

export async function getCurrentCartBadgeValue(page: Page) {
  const badge = page.locator('.shopping_cart_badge');
  if (await badge.count() === 0) {
    return '0';
  }
  return await badge.innerText();
}
