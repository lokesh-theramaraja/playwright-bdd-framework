
# Playwright + Cucumber (JS) BDD Test Automation Framework

A lightweight, scalable end-to-end (E2E) test automation framework built using Playwright, Cucumber (Gherkin BDD), and JavaScript. Supports multi-browser execution, page object model, hooks, custom world, parallel runs, and CI integration.

## Features
- BDD Gherkin syntax (Given/When/Then)
- Playwright automation (Chromium, Firefox, WebKit)
- Page Object Model (POM)
- Before/After hooks with shared browser context
- Parallel cross-browser execution
- JSON, HTML, and JUnit reporting support
- CI-friendly (GitHub Actions, Jenkins, GitLab)
- Fast, reliable, modern web automation

## Project Structure
```
playwright-cucumber-js/
├── features/
│   └── login.feature
├── steps/
│   └── login.steps.js
├── pages/
│   └── login.page.js
├── support/
│   ├── hooks.js
│   ├── world.js
│   └── cucumber.js
├── reports/
├── package.json
└── README.md
```

## Installation
```bash
npm install
npm run install:browsers
```

Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests
### Default run
```bash
npm test
```

## Run Tests on Different Browsers
```bash
BROWSER=chromium npm test
BROWSER=firefox npm test
BROWSER=webkit npm test
```

## Run All Browsers Sequentially
```bash
npm run test:all
```

## Parallel Execution
```bash
BROWSER=chromium npm test &
BROWSER=firefox npm test &
BROWSER=webkit npm test
```

## Writing Tests (BDD Gherkin)
Example: `features/login.feature`
```gherkin
Feature: Login
  Scenario: Successful login
    Given I open the login page
    When I login with username "alice" and password "password123"
    Then I should see the dashboard
```

## Step Definitions
Example: `steps/login.steps.js`
```js
const { Given, When, Then } = require('@cucumber/cucumber');
const LoginPage = require('../pages/login.page');
const assert = require('assert');

Given('I open the login page', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto('https://example.com/login');
});

When('I login with username {string} and password {string}', async function (username, password) {
  await this.loginPage.login(username, password);
});

Then('I should see the dashboard', async function () {
  await this.page.waitForSelector('#dashboard');
  assert.strictEqual(await this.page.isVisible('#dashboard'), true);
});
```

## Page Object Example
Example: `pages/login.page.js`
```js
class LoginPage {
  constructor(page) {
    this.page = page;
  }
  async goto(url) {
    await this.page.goto(url);
  }
  async login(username, password) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}
module.exports = LoginPage;
```

## Hooks and World Setup
### support/world.js
```js
const { setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }
}
setWorldConstructor(CustomWorld);
```

### support/hooks.js
```js
const { Before, After } = require('@cucumber/cucumber');
const playwright = require('playwright');

Before(async function () {
  const browserName = process.env.BROWSER || 'chromium';
  this.browser = await playwright[browserName].launch({ headless: true });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  await this.page.close();
  await this.context.close();
  await this.browser.close();
});
```

## Reporting
Cucumber JSON output is configured in `support/cucumber.js`:
```js
module.exports = {
  default: "--require ./support/world.js --require ./support/hooks.js --require ./steps/**/*.js --format json:./reports/report.json --publish-quiet"
};
```

## CI Integration (GitHub Actions)
```yaml
name: E2E Tests
jobs:
  playwright-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - name: Run Tests
        run: BROWSER=${{ matrix.browser }} npm test
```

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| `this.page undefined` | Hooks/World not loaded | Ensure correct cucumber config |
| Flaky selectors | Timing issues | Use waitForSelector |
| Browser fails to launch | Missing deps | Run `npx playwright install --with-deps` |

## Summary
This framework provides:
- Modern Playwright automation
- Clean BDD structure
- Multi-browser support
- CI-ready architecture
- Extensible foundation
