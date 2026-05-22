# SCRUM-101 Checkout Test Report

## Executive Summary
- **User story:** SCRUM-101 - E-commerce Checkout Process
- **Application:** https://www.saucedemo.com
- **Test user:** `standard_user` / `secret_sauce`
- **Total test cases planned:** 7
- **Manual exploratory cases executed:** 7
- **Automated test cases executed:** 4
- **Final automated result:** 4 passed
- **Initial automation failures:** 3 failing tests in `tests/saucedemo-checkout/checkout.spec.ts`
- **Resolution:** Healed locator and flow assertions, then re-ran successfully.

## Manual Test Results
### Summary
Manual exploratory testing verified the complete checkout flow on SauceDemo including:
- Successful login and product selection
- Cart review and checkout navigation
- Required field validation on the checkout form
- Order overview display of item details, payment/shipping info, and totals
- Order completion confirmation
- Cancel behavior from checkout steps
- Handling of invalid checkout inputs

### Observations and Evidence
- **Screenshots captured**:
  - `test-results/01-login-page.png`
  - `test-results/02-products-page.png`
  - `test-results/03-cart-page.png`
  - `test-results/04-checkout-information-page.png`
  - `test-results/05-checkout-validation-errors.png`
  - `test-results/06-checkout-overview-page.png`
  - `test-results/07-order-confirmation-page.png`
- **Exploratory findings**:
  - Login succeeds with standard user credentials.
  - Checkout form validation requires all fields; the application shows explicit first name / last name / postal code errors.
  - Invalid postal code input is accepted by SauceDemo as long as the field is non-empty.
  - Checkout overview properly displays item details, subtotal, tax, total, and Cancel/Finish controls.
  - Cancel from the order overview returns the user to the inventory page, while cancel from checkout information returns to the cart.

## Automated Test Results
### Initial Execution
- The generated automation suite initially failed due to two issues:
  1. `addFirstTwoProductsToCart()` assumed exactly 2 add-to-cart buttons; SauceDemo has 6 inventory buttons.
  2. One test assumed invalid postal code input would produce an error, but SauceDemo accepts any non-empty postal code.
  3. One cancel flow test expected return to cart from the overview page, while SauceDemo actually navigates back to inventory.

### Healing Activities Performed
- Updated selector/assertion logic in `tests/saucedemo-checkout/checkout.spec.ts`:
  - Allowed `button[data-test^="add-to-cart-"]` to match the full inventory.
  - Asserted at least two selectable add-to-cart buttons are visible before clicking.
  - Changed the invalid postal code test to reflect actual site behavior for non-empty values.
  - Corrected the checkout overview cancel flow to expect `inventory.html` and verified the cart badge remains `2`.

### Final Results
- Final executed suite: `npx playwright test tests/saucedemo-checkout/checkout.spec.ts --project=chromium`
- Final result: **4 passed**
- No remaining automation failures.

## Defects Log
- **Defect ID:** DEF-001
  - **Severity:** Medium
  - **Title:** Automation assumption mismatch for checkout validation behavior
  - **Description:** The SauceDemo checkout page accepts non-empty postal code values, while the initial automation test assumed text format validation.
  - **Steps to Reproduce:** Run `tests/saucedemo-checkout/checkout.spec.ts` with invalid postal code value `!@#$%`.
  - **Expected:** Validation error appears.
  - **Actual:** Checkout proceeds to the overview page.
  - **Status:** Resolved by updating the test to match application behavior.

- **Defect ID:** DEF-002
  - **Severity:** Low
  - **Title:** Inventory add-to-cart count assertion too strict
  - **Description:** The original automation helper expected exactly 2 add-to-cart buttons, but SauceDemo inventory provides 6.
  - **Steps to Reproduce:** Run the checkout suite on SauceDemo.
  - **Expected:** Helper should work with 2 or more available product buttons.
  - **Actual:** Test failed with count mismatch.
  - **Status:** Resolved by updating the helper to assert at least 2 buttons exist.

## Test Coverage Analysis
- **Covered acceptance criteria:**
  - AC1: Cart Review
  - AC2: Checkout Information Entry
  - AC3: Order Overview
  - AC4: Order Completion
  - AC5: Error Handling (required-field validation)
- **Coverage from manual tests:** Full story coverage including UI validation, navigation flow, and error states.
- **Coverage from automated tests:** Core happy path, required field validation, invalid postal code handling, and cancel navigation.
- **Gaps / recommendations:**
  - Add automation for cart removal and quantity change.
  - Add automation for additional negative scenarios, such as empty cart behavior and shipping address edge cases.
  - Expand cross-browser test execution to Firefox and WebKit.

## Summary and Recommendations
- The checkout workflow is stable for the main purchase flow and required-field validation.
- No critical issues remain in the current automation scope.
- Recommended next steps:
  1. Expand the suite across Firefox and WebKit.
  2. Add explicit mobile viewport checks for responsive checkout behavior.
  3. Create tests for cart cancellation, item removal, and empty-cart guardrails.
