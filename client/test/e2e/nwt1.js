module.exports = {
  'Login e2e Test Emissary' : function (browser) {
    browser
      .url('https://lucky13-dev.herokuapp.com/')
      .waitForElementVisible('body', 5000)
      .click("a[href='login.html']")
      .waitForElementVisible('#username', 5000)
			.setValue('#username', 'ucsd@ucsd.edu')
			.setValue('#password', 'ucsd')
			.click('#loginButton')
			.waitForElementVisible('#visitor-queue', 5000)
      .end();
  }
};