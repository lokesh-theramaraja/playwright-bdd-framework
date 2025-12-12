const { expect } = require('@playwright/test');
const { Given, When, Then } = require('@cucumber/cucumber');
const LoginPage = require('../pages/login.page');

Given('I am on the Playwright website', async function () {
  await this.page.goto('https://playwright.dev/');
});

When('I click the "Get started" button', async function () {
  await this.page.getByRole('link', { name: 'Get started' }).click();
});

Then('I should be on the {string} page', async function (title) {
  await expect(this.page).toHaveTitle(title);
});

Given('I open the login page', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto('https://practice.expandtesting.com/login');
});

When('I login with username {string} and password {string}', async function (username, password) {
  await this.loginPage.login(username, password);
});

Then('I should see the dashboard', async function () {
  // simple check - adjust selector to your app
  const dashboardHeader = await this.page.textContent('h1');
  expect(dashboardHeader).toEqual('Secure Area page for Automation Testing Practice');
});