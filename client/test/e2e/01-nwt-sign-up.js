// Nightwatch e2e Test - Testing Sign-Ups
// Only works once as sign-up info will then be in DB.

module.exports = {
  'Sign-Up e2e Test Emissary' : function (browser) {
    browser
      .url('https://lucky13-dev.herokuapp.com/#')
      .waitForElementVisible('body', 5000)
      .click("a[href='signup.html']")
      .waitForElementVisible('#form-company-name', 5000)
			.setValue('#form-company-name', 'temp8')
			.setValue('#form-email', 'temp8@ucsd.edu')
			.setValue('#form-phone', '1111111111')
			.click('#submit-company-btn')
			.waitForElementVisible('#form-employee-first', 5000)
			.setValue('#form-employee-first', 'temp8')
			.setValue('#form-employee-last', 'temp8')
			.setValue('#form-employee-email', 'temp8@ucsd.edu')
			.setValue('#form-employee-phone', '1111111111')
			.setValue('#form-password', 'Aa123123')
			.setValue('#form-repeat-password', 'Aa123123')
			.click('#submit-btn')
			.waitForElementVisible('#visitor-queue', 5000)
			.click('#logoutButton')
      .waitForElementVisible('body', 5000)
      .end();
  }
};