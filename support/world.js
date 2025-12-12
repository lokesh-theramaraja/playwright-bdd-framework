const { setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld {
  constructor() {
    // will be set in hooks before each scenario
    this.browser = null;
    this.context = null;
    this.page = null;
    this.attach = null; // cucumber attach function (set in hooks)
  }
}

setWorldConstructor(CustomWorld);