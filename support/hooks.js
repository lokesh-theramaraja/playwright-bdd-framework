import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import playwright from 'playwright';
import fs from 'fs';
import 'dotenv/config';


setDefaultTimeout(30 * 1000); // 30s timeout for steps

Before(async function (scenario) {
  const browserName = process.env.BROWSER || 'chromium';
  const headless = process.env.HEADLESS === 'true'; // Convert to boolean
  this.browser = await playwright[browserName].launch({ headless: headless });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  // Assign the attach function from the Cucumber World object
  this.attach = this.attach;

  console.log(`\n--- Executing scenario: ${scenario.pickle.name} ---`);
});

After(async function (scenario) {
  if (scenario.result && String(scenario.result.status).toLowerCase() === 'failed') {
    // capture screenshot, attach to report if attach available
    if (this.page) {
      try {
        const buffer = await this.page.screenshot();
        this.attach(buffer, 'image/png');
      } catch (e) {
        console.error('Error capturing screenshot on failure:', e);
      }
    }
  }
  // close resources if they exist
  if (this.page) await this.page.close();
  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();
});