# Swag Labs Playwright Automation Framework

A Playwright-based end-to-end test automation project for SauceDemo (Swag Labs). This project validates login behavior, user account coverage, and shopping cart flows using real browser automation in a CI-friendly setup.

## Overview

This framework was built to automate core application paths for SauceDemo and verify user behavior across all supported demo accounts. It covers:

- Successful login for valid users
- Invalid credential handling
- Locked-out account validation
- Empty field validation
- Product inventory verification
- Cart and checkout journey validation
- GitHub Actions CI execution

The project follows a Page Object Model (POM) structure to keep tests readable, scalable, and maintainable.

## Tech Stack

- JavaScript
- Playwright
- Node.js
- dotenv
- GitHub Actions
- GitHub for version control
- Notion for documentation and test case tracking

## Project Structure

```text
playwright-ci-blueprint/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── pages/
│   ├── LoginPage.js
│   ├── ProductsPage.js
│   └── CartPage.js
├── tests/
│   ├── e2e.spec.js
│   └── cart.spec.js
├── .env
├── .gitignore
├── playwright.config.js
├── package.json
├── README.md
├── playwright-report/
└── test-results/
```

## What Was Implemented

### Authentication Coverage
The project validates login flows for these SauceDemo users:

- standard_user
- problem_user
- performance_glitch_user
- error_user
- visual_user
- locked_out_user

### Test Coverage Includes
- Valid login redirects to the inventory page
- Invalid password shows an error message
- Empty username validation
- Empty password validation
- Both empty fields validation
- Password field type validation
- Locked-out account validation
- Successful inventory page render after login
- Product list validation across users

### Cart Workflow Coverage
- Add item to cart
- Verify cart badge count
- Open cart
- Confirm item in cart
- Remove item from cart
- Continue shopping
- Proceed to checkout

## Environment Configuration

The project uses a local `.env` file for environment definitions.

```env
BASE_URL=https://www.saucedemo.com
STANDARD_USER=standard_user
LOCKED_USER=locked_out_user
STANDARD_PASS=secret_sauce
VALID_USERS=standard_user,problem_user,performance_glitch_user,error_user,visual_user
```

### Notes
- `.env` is included in `.gitignore` to avoid committing local credentials.
- In GitHub Actions, the same values are passed using repository secrets and environment variables.
- The shared password is used across the valid SauceDemo demo accounts.

## GitHub Actions CI

The workflow in `.github/workflows/playwright.yml` is configured to:

- Install dependencies
- Set up Playwright browser dependencies
- Validate required environment variables
- Run the Playwright suite
- Upload the Playwright HTML report as an artifact

This ensures that tests run automatically on push and pull request events.

## Notion Documentation

I also used Notion for project documentation and test case tracking. It was used to document:

- project goals and scope
- account coverage matrix
- login scenario expectations
- edge-case behavior
- regression coverage
- testing notes and validation status

Notion served as a project documentation layer, while GitHub and Playwright handled code management and execution.

## Test Execution

Install dependencies:

```bash
npm install
```

Run the full suite:

```bash
npx playwright test
```

Run a targeted subset:

```bash
npx playwright test --grep "TC-AUTH-ALL|TC-AUTH-003"
```

Open the report:

```bash
npx playwright show-report
```

## Validation Status

The project was validated locally and passed successfully.

- 18 tests executed
- 18 tests passed

## Git Workflow

The project used a feature branch workflow for new work before merging to main.

Example flow:

```bash
git checkout -b feature/account-login-tests
git add .
git commit -m "Add account login coverage and cart tests"
git push -u origin feature/account-login-tests
```

This keeps changes isolated and ready for review via pull request.

## Best Practices Used

- Environment variables kept out of source control
- Real browser tests instead of mock-based validation
- Page Object Model for maintainability
- CI validation via GitHub Actions
- Data-driven account checks for multiple users
- Assertions based on real UI behavior

## Conclusion

This project demonstrates a complete Playwright automation framework for SauceDemo, covering authentication, inventory validation, account behavior, and cart workflows. It combines automated browser testing with GitHub Actions and Notion-based project documentation to provide a scalable and maintainable QA automation setup.

## License

This project is for educational and practice purposes within the automation workflow.
