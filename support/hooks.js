const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const playwright = require('playwright');
require('dotenv').config();

setDefaultTimeout(60 * 1000); // 60s timeout for steps

Before(async function (scenario) {
  const browserName = process.env.BROWSER || 'chromium';
  this.browser = await playwright[browserName].launch({ headless: false });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (scenario) {
  if (scenario.result && scenario.result.status === 'failed') {
    // capture screenshot, attach to report if attach available
    try {
      this.attach(`Browser: ${process.env.BROWSER || 'chromium'}`);
      const screenshot = await this.page.screenshot({ path: `reports/failure-${Date.now()}.png`, fullPage: true });
      if (this.attach) this.attach(screenshot, 'image/png');
    } catch (e) { /* ignore */ }
  }
  await this.page.close();
  await this.context.close();
  await this.browser.close();
});