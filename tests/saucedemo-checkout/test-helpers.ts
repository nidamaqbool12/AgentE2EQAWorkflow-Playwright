import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const APP_URL = 'https://www.saucedemo.com';
export const USERNAME = 'standard_user';
export const PASSWORD = 'secret_sauce';

export async function login(page: Page) {
  await page.goto(APP_URL);
  await expect(page.locator('[data-test="username"]')).toBeVisible();
  await page.fill('[data-test="username"]', USERNAME);
  await page.fill('[data-test="password"]', PASSWORD);
  await page.click('[data-test="login-button"]');
  await expect(page).toHaveURL(/.*inventory\.html$/);
}

export async function addProductsToCart(page: Page, count = 2) {
  const addButtons = page.locator('button[data-test^="add-to-cart-"]');
  const actualCount = await addButtons.count();
  expect(actualCount).toBeGreaterThanOrEqual(count);

  for (let index = 0; index < count; index += 1) {
    await expect(addButtons.nth(index)).toBeVisible();
    await addButtons.nth(index).click();
  }
}

export async function openCart(page: Page) {
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/.*cart\.html$/);
  await expect(page.locator('.cart_list')).toBeVisible();
}

export async function startCheckout(page: Page) {
  await openCart(page);
  await page.click('[data-test="checkout"]');
  await expect(page).toHaveURL(/.*checkout-step-one\.html$/);
}

export async function fillCheckoutInformation(page: Page, firstName = 'Test', lastName = 'User', postalCode = '12345') {
  await expect(page.locator('[data-test="firstName"]')).toBeVisible();
  await page.fill('[data-test="firstName"]', firstName);
  await page.fill('[data-test="lastName"]', lastName);
  await page.fill('[data-test="postalCode"]', postalCode);
}

export async function continueToOverview(page: Page) {
  await page.click('[data-test="continue"]');
  await expect(page).toHaveURL(/.*checkout-step-two\.html$/);
}

export async function finishOrder(page: Page) {
  await page.click('[data-test="finish"]');
  await expect(page).toHaveURL(/.*checkout-complete\.html$/);
}
