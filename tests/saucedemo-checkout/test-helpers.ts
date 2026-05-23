import { Page, expect } from '@playwright/test';

const BASE = 'https://www.saucedemo.com';

export async function login(page: Page, username = 'standard_user', password = 'secret_sauce') {
  await page.goto(BASE);
  await expect(page).toHaveURL(/.*saucedemo\.com/);
  await page.fill('[data-test="username"]', username);
  await page.fill('[data-test="password"]', password);
  await page.click('[data-test="login-button"]');
  await expect(page).toHaveURL(/.*inventory\.html/);
}

export async function addProductsToCart(page: Page, count = 1) {
  const addButtons = page.locator('button[data-test^="add-to-cart-"]');
  const actualCount = await addButtons.count();
  expect(actualCount).toBeGreaterThanOrEqual(count);
  for (let i = 0; i < count; i++) {
    await addButtons.nth(i).click();
  }
}

export async function openCart(page: Page) {
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/.*cart\.html/);
}

export async function startCheckout(page: Page) {
  await page.click('[data-test="checkout"]');
  await expect(page).toHaveURL(/.*checkout-step-one\.html/);
}

export async function fillCheckoutInformation(page: Page, firstName: string, lastName: string, postalCode: string) {
  await page.fill('[data-test="firstName"]', firstName);
  await page.fill('[data-test="lastName"]', lastName);
  await page.fill('[data-test="postalCode"]', postalCode);
}

export async function continueToOverview(page: Page) {
  await page.click('[data-test="continue"]');
  await expect(page).toHaveURL(/.*checkout-step-two\.html/);
}

export async function finishOrder(page: Page) {
  await page.click('[data-test="finish"]');
  await expect(page).toHaveURL(/.*checkout-complete\.html/);
}
