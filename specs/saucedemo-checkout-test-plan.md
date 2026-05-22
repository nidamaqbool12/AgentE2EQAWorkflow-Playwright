# SauceDemo Checkout Test Plan

## Application
- URL: https://www.saucedemo.com
- Test user: `standard_user`
- Password: `secret_sauce`

## Test Objectives
- Validate the full e-commerce checkout workflow for a logged-in customer.
- Verify cart review, checkout information entry, order overview, order completion, and validation/error handling.
- Ensure navigation behavior and order confirmation are correct.

## Test Coverage
- Happy path checkout flow
- Required field validation
- Cancel and navigation behavior
- Order summary and pricing calculations
- Successful order completion and back-home navigation

---

## Test Scenario 1: Login and Add Items to Cart

### Description
Verify user can log in and add products to the cart.

### Preconditions
- User is on the SauceDemo login page.

### Test Steps
1. Open `https://www.saucedemo.com`.
2. Enter username `standard_user`.
3. Enter password `secret_sauce`.
4. Click `Login`.
5. Confirm landing on the products page.
6. Add two products to the cart.
7. Open the shopping cart.

### Expected Results
- Login succeeds and the products page is displayed.
- Cart badge updates to show the added items.
- Cart page shows the selected items with name, description, price, and quantity.
- Total price is displayed on the cart page.

---

## Test Scenario 2: Cart Review and Checkout Navigation

### Description
Verify cart contents and the ability to proceed to checkout.

### Preconditions
- User is logged in and has items in the cart.

### Test Steps
1. From the cart page, verify each item name, description, and price.
2. Confirm the cart total shows correct item count.
3. Click `Checkout`.

### Expected Results
- Cart review page displays all item details.
- The page shows correct subtotal or total calculations.
- Clicking `Checkout` navigates to the checkout information page.

---

## Test Scenario 3: Checkout Information Required Fields

### Description
Verify the checkout information page requires all fields.

### Preconditions
- User is on the checkout information page.

### Test Steps
1. Leave First Name blank, enter valid Last Name and Zip Code, click `Continue`.
2. Leave Last Name blank, enter valid First Name and Zip Code, click `Continue`.
3. Leave Postal Code blank, enter valid First Name and Last Name, click `Continue`.

### Expected Results
- Each invalid submission shows a visible error message for the missing field.
- The user remains on the checkout information page until all fields are valid.

---

## Test Scenario 4: Successful Checkout Information Submission

### Description
Verify valid checkout information advances to the order overview page.

### Preconditions
- User is on the checkout information page with cart items present.

### Test Steps
1. Enter First Name `Test`.
2. Enter Last Name `User`.
3. Enter Postal Code `12345`.
4. Click `Continue`.

### Expected Results
- The application navigates to the checkout overview page.
- Order overview displays all selected items.
- Payment information and shipping information are visible.
- Subtotal, tax, and total values are displayed.
- Buttons for `Cancel` and `Finish` are visible.

---

## Test Scenario 5: Checkout Overview and Order Completion

### Description
Verify the order completion workflow and order confirmation.

### Preconditions
- User is on the checkout overview page.

### Test Steps
1. Click `Finish`.

### Expected Results
- User is redirected to the order confirmation page.
- A success message confirming the order is visible.
- A `Back Home` button is present.
- The order confirmation page indicates the order was placed.

---

## Test Scenario 6: Cancel Checkout and Navigation Behavior

### Description
Verify users can cancel checkout and return to the cart.

### Preconditions
- User is on the checkout information or overview page.

### Test Steps
1. If on checkout information page, click `Cancel` and confirm return to cart.
2. If on checkout overview page, click `Cancel` and confirm return to cart.

### Expected Results
- Clicking `Cancel` returns the user to the cart page.
- Cart contents remain unchanged.

---

## Test Scenario 7: Invalid Checkout Data Handling

### Description
Verify invalid input is handled correctly on the checkout information page.

### Preconditions
- User is on the checkout information page.

### Test Steps
1. Enter invalid characters into Postal Code, e.g. `!@#$%`, with valid first and last names.
2. Click `Continue`.

### Expected Results
- Validation error appears indicating invalid postal code format, or the form prevents submission.
- The user cannot proceed until the data is corrected.

---

## Notes
- Manual exploratory testing should capture screenshots at the cart review, checkout form errors, order overview, and order confirmation states.
- Automated tests should run across Chromium, Firefox, and WebKit.
- If UI selectors change, prefer stable IDs, data-test attributes, or role-based selectors.
