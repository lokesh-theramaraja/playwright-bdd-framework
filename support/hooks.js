const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const playwright = require('playwright');
const fs = require('fs');
require('dotenv').config();

setDefaultTimeout(30 * 1000); // 60s timeout for steps

Before(async function (scenario) {
  const browserName = process.env.BROWSER || 'chromium';
  const headless = process.env.HEADLESS || true;
  this.browser = await playwright[browserName].launch({ headless: headless });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (scenario) {
  if (scenario.result && String(scenario.result.status).toLowerCase() === 'failed') {
    // capture screenshot, attach to report if attach available
    try {
      const buffer = await this.page.screenshot();
      this.attach(buffer, 'image/png');
    } catch (e) {
      console.error('Error capturing screenshot on failure:', e);
    }
  }
  // close resources if they exist
  try { if (this.page) await this.page.close(); } catch(e){}
  try { if (this.context) await this.context.close(); } catch(e){}
  try { if (this.browser) await this.browser.close(); } catch(e){}
});