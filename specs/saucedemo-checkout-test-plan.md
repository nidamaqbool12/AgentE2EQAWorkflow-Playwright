# SauceDemo Checkout Test Plan

## Application
- URL: https://www.saucedemo.com
- Test user: `standard_user`
- Password: `secret_sauce`

## Test Objectives
- Validate the complete checkout workflow from cart review through order confirmation.
- Verify required field validation, cancellation behavior, navigation flows, and order completion.
- Cover both happy path execution and negative validation scenarios.

## Coverage Summary
- AC1: Cart review content, cart badge updates, and checkout navigation
- AC2: Mandatory checkout fields, validation errors, and checkout page behavior
- AC3: Order overview summary, payment/shipping detail visibility, and navigation options
- AC4: Order completion confirmation, success message, and back-home navigation
- AC5: Invalid data handling, cancel paths, and whitespace/input edge cases

---

## Test Scenario 1: Login, Add Items, and Open Cart

### Description
Validate successful login, product selection, cart badge updates, and cart contents display.

### Preconditions
- User is on the SauceDemo login page.

### Test Steps
1. Navigate to `https://www.saucedemo.com`.
2. Enter username `standard_user` and password `secret_sauce`.
3. Click `Login`.
4. Confirm the inventory page loads.
5. Add two products to the cart.
6. Open the shopping cart page.

### Expected Results
- Login succeeds and inventory page is visible.
- Cart badge shows `2` after adding items.
- Cart page lists the selected items with name, description, and price.
- Product quantities are shown correctly.

---

## Test Scenario 2: Cart Review Page Validation

### Description
Verify cart review page details, remove action, continue shopping, and total information.

### Preconditions
- User is logged in and has items in the cart.

### Test Steps
1. Open the cart page.
2. Verify each cart item name, description, and price.
3. Confirm the cart badge value reflects the selected items.
4. Click `Continue Shopping` and confirm return to inventory.
5. Return to cart and remove one item.

### Expected Results
- Cart shows all selected items and correct pricing details.
- Continue shopping returns the user to inventory.
- Removing an item updates cart count and badge value.

---

## Test Scenario 3: Checkout Information Mandatory Field Validation

### Description
Validate that checkout information fields are mandatory and show errors when empty.

### Preconditions
- User is on the checkout information page with items in the cart.

### Test Steps
1. Leave First Name blank, enter valid Last Name and Postal Code, click `Continue`.
2. Leave Last Name blank, enter valid First Name and Postal Code, click `Continue`.
3. Leave Postal Code blank, enter valid First Name and Last Name, click `Continue`.

### Expected Results
- Each missing field produces a visible validation error.
- User remains on the checkout information page until all fields are filled.

---

## Test Scenario 4: Checkout Information Valid Submission

### Description
Verify valid checkout information advances to order overview.

### Preconditions
- User is on the checkout information page with valid cart items.

### Test Steps
1. Enter First Name `Test`, Last Name `User`, and Postal Code `12345`.
2. Click `Continue`.

### Expected Results
- Application navigates to Checkout Overview.
- Order overview page shows selected items, payment/shipping info, subtotal, tax, total.
- `Cancel` and `Finish` buttons are visible.

---

## Test Scenario 5: Checkout Overview Cancellation and Navigation

### Description
Verify canceling from checkout overview returns to cart and preserves contents.

### Preconditions
- User is on the checkout overview page.

### Test Steps
1. Click `Cancel` on the overview page.
2. Confirm the user returns to the cart page.

### Expected Results
- Cancel returns the user to the cart page.
- Cart contents remain intact.

---

## Test Scenario 6: Order Completion and Back Home Behavior

### Description
Verify successful checkout completion and ability to return to products.

### Preconditions
- User is on the checkout overview page.

### Test Steps
1. Click `Finish`.
2. Confirm the order confirmation page loads.
3. Click `Back Home`.

### Expected Results
- User is redirected to the order confirmation page.
- A success message appears.
- `Back Home` returns the user to the inventory page.
- The cart is cleared after order completion.

---

## Test Scenario 7: Invalid Checkout Data Handling

### Description
Verify invalid postal code and whitespace edge case handling on checkout information.

### Preconditions
- User is on the checkout information page.

### Test Steps
1. Enter invalid Postal Code `!@#$%` with valid first/last names and click `Continue`.
2. Enter whitespace-padded values for all fields and click `Continue`.

### Expected Results
- Invalid postal code triggers an error or prevents progression.
- Whitespace-padded fields are handled consistently based on actual app behavior.
- The user should only proceed if the checkout information is acceptable.

---

## Notes
- Include screenshots for cart review, checkout errors, overview, and confirmation states.
- Prefer stable selectors such as `data-test` attributes in the generated scripts.
- Ensure the suite supports Chromium, Firefox, and WebKit.
- If actual SauceDemo behavior differs from the acceptance criteria, document the discrepancy and align tests accordingly.
