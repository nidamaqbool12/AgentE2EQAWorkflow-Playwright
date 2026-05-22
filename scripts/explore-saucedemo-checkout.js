const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const outputDir = path.resolve(__dirname, '../test-results');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  try {
    await page.goto('https://www.saucedemo.com');
    await page.screenshot({ path: path.join(outputDir, '01-login-page.png') });
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await page.waitForURL('**/inventory.html', { timeout: 10000 });
    await page.screenshot({ path: path.join(outputDir, '02-products-page.png') });
    results.push({ step: 'Login', status: 'passed', url: page.url() });

    const addButtons = await page.$$('[data-test^="add-to-cart"]');
    if (addButtons.length >= 2) {
      await addButtons[0].click();
      await addButtons[1].click();
    } else {
      throw new Error('Expected at least 2 add-to-cart buttons');
    }
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');
    await page.screenshot({ path: path.join(outputDir, '03-cart-page.png') });
    results.push({ step: 'Cart review', status: 'passed', itemsAdded: 2 });

    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');
    await page.screenshot({ path: path.join(outputDir, '04-checkout-information-page.png') });
    results.push({ step: 'Navigate to checkout information', status: 'passed' });

    // checkout validation checks
    const validationErrors = [];
    await page.click('[data-test="continue"]');
    const errorText1 = await page.locator('[data-test="error"]').innerText();
    validationErrors.push({ missing: 'all', error: errorText1 });
    await page.fill('[data-test="firstName"]', 'Test');
    await page.click('[data-test="continue"]');
    const errorText2 = await page.locator('[data-test="error"]').innerText();
    validationErrors.push({ missing: 'lastName', error: errorText2 });
    await page.fill('[data-test="lastName"]', 'User');
    await page.click('[data-test="continue"]');
    const errorText3 = await page.locator('[data-test="error"]').innerText();
    validationErrors.push({ missing: 'postalCode', error: errorText3 });
    await page.screenshot({ path: path.join(outputDir, '05-checkout-validation-errors.png') });
    results.push({ step: 'Checkout field validation', status: 'passed', validationErrors });

    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await page.waitForURL('**/checkout-step-two.html');
    await page.screenshot({ path: path.join(outputDir, '06-checkout-overview-page.png') });
    results.push({ step: 'Checkout overview', status: 'passed' });

    const summaryText = await page.locator('.summary_info').innerText();
    const taxText = await page.locator('.summary_tax_label').innerText();
    const totalText = await page.locator('.summary_total_label').innerText();
    results.push({ step: 'Summary and totals', status: 'passed', summaryText, taxText, totalText });

    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');
    await page.screenshot({ path: path.join(outputDir, '07-order-confirmation-page.png') });
    const confirmation = await page.locator('.complete-header').innerText();
    results.push({ step: 'Order completion', status: 'passed', confirmation });

    fs.writeFileSync(path.join(outputDir, 'exploratory-results.json'), JSON.stringify({ results }, null, 2));
  } catch (error) {
    results.push({ step: 'exploratory test', status: 'failed', message: error.message });
    fs.writeFileSync(path.join(outputDir, 'exploratory-results.json'), JSON.stringify({ results }, null, 2));
    throw error;
  } finally {
    await browser.close();
  }
})();
