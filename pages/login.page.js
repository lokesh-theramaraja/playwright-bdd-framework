class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = 'input[name="username"]';
    this.passwordInput = 'input[name="password"]';
    this.submitBtn = 'button[type="submit"]';
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.submitBtn);
  }

  async getError() {
    return await this.page.textContent('.error');
  }
}

module.exports = LoginPage;