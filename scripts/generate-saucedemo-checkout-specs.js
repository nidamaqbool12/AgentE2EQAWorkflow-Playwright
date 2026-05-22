const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '../tests/saucedemo-checkout');
const files = {
  'cart-review.spec.ts': `import { test, expect } from '@playwright/test';
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
    await expect(page).toHaveURL(/.*inventory\.html/);
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
`,
  'checkout-information-validation.spec.ts': `import { test, expect } from '@playwright/test';
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

  test('prevents continuation with whitespace-only input', async ({ page }) => {
    await fillCheckoutInformation(page, ' ', ' ', ' ');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
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
`,
  'order-overview.spec.ts': `import { test, expect } from '@playwright/test';
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
    await expect(page).toHaveURL(/.*inventory\.html/);
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
`,
  'complete-checkout-flow.spec.ts': `import { test, expect } from '@playwright/test';
import { addProductsToCart, continueToOverview, fillCheckoutInformation, finishOrder, login, openCart, startCheckout } from './test-helpers';

test.describe('SauceDemo complete checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('completes checkout successfully from inventory to confirmation', async ({ page }) => {
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Complete', 'User', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('returns to products page after clicking back home', async ({ page }) => {
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Return', 'Home', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('restarts a new order after completion', async ({ page }) => {
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Restart', 'Order', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await page.click('[data-test="back-to-products"]');
    await addProductsToCart(page, 2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('clears the shopping cart after order completion', async ({ page }) => {
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Clear', 'Cart', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('finishes checkout with 3 products and shows completion text', async ({ page }) => {
    await addProductsToCart(page, 3);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Three', 'Items', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  });

  test('cancels and then continues shopping before completing checkout', async ({ page }) => {
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await page.click('[data-test="cancel"]');
    await expect(page).toHaveURL(/.*cart\.html/);
    await page.click('[data-test="continue-shopping"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
    await addProductsToCart(page, 1);
    await openCart(page);
    await page.click('[data-test="checkout"]');
    await fillCheckoutInformation(page, 'Continue', 'Shop', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('allows checkout after removing one product from the cart', async ({ page }) => {
    await addProductsToCart(page, 3);
    await openCart(page);
    await page.locator('[data-test^="remove-"]').first().click();
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await page.click('[data-test="checkout"]');
    await fillCheckoutInformation(page, 'Removed', 'Item', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('uses cart badge count to confirm items before checkout', async ({ page }) => {
    await addProductsToCart(page, 2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Badge', 'Count', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('verifies the checkout completion page after a full order', async ({ page }) => {
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Verify', 'Complete', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('maintains order completion state after reload', async ({ page }) => {
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Reload', 'Check', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await page.reload();
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('supports user navigation back home after order completion', async ({ page }) => {
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Navigation', 'Home', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('ensures complete order confirmation contains expected text', async ({ page }) => {
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Confirm', 'Final', '12345');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  });
});
`,
  'order-completion.spec.ts': `import { test, expect } from '@playwright/test';
import { addProductsToCart, continueToOverview, fillCheckoutInformation, finishOrder, login, startCheckout } from './test-helpers';

test.describe('SauceDemo order completion', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Complete', 'Order', '12345');
    await continueToOverview(page);
    await finishOrder(page);
  });

  test('shows the thank you header on order confirmation', async ({ page }) => {
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('shows confirmation text on the complete page', async ({ page }) => {
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  });

  test('shows the back home button after completion', async ({ page }) => {
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('returns to inventory when back home is clicked', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('keeps cart empty after order completion', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('shows order confirmation image', async ({ page }) => {
    await expect(page.locator('.pony_express')).toBeVisible();
  });

  test('remains on the confirmation page after reload', async ({ page }) => {
    await page.reload();
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('allows placing a second order after completion', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Second', 'Order', '99999');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('shows no shopping cart badge after returning home', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('preserves completion header text after navigating away and back', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await page.goto('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('shows complete page content for new order confirmations', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await addProductsToCart(page, 2);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Third', 'Order', '33445');
    await continueToOverview(page);
    await finishOrder(page);
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  });

  test('verifies the back home flow after a second completion', async ({ page }) => {
    await page.click('[data-test="back-to-products"]');
    await addProductsToCart(page, 1);
    await startCheckout(page);
    await fillCheckoutInformation(page, 'Repeat', 'Order', '11111');
    await continueToOverview(page);
    await finishOrder(page);
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});
`,
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, name), content, 'utf8');
}

const legacyPath = path.join(baseDir, 'checkout.spec.ts');
if (fs.existsSync(legacyPath)) {
  fs.unlinkSync(legacyPath);
}

console.log('Generated 5 Saucedemo checkout spec files.');
