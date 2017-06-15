// Nightwatch e2e Test - Testing Logging In
// Make sure login info is inside DB.

module.exports = {
  'Login e2e Test Emissary' : function (browser) {
    browser
      .url('https://lucky13-dev.herokuapp.com/')
      .waitForElementVisible('body', 5000)
      .click("a[href='login.html']")
      .waitForElementVisible('#username', 5000)
			.setValue('#username', 'ah@ucsd.edu')
			.setValue('#password', 'Aa123123')
			.click('#loginButton')
			.waitForElementVisible('#visitor-queue', 5000)
			//.click('#logoutButton')
      .end();
  }
};