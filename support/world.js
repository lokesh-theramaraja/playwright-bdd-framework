import { setWorldConstructor } from '@cucumber/cucumber';

class CustomWorld {
  constructor({ attach }) {
    // will be set in hooks before each scenario
    this.browser = null;
    this.context = null;
    this.page = null;
    this.attach = attach;
  }
}

setWorldConstructor(CustomWorld);