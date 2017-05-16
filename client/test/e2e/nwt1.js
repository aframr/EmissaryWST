module.exports = {
  'Sign-Up e2e Test WST' : function (browser) {
    browser
      .url('https://lucky13-dev.herokuapp.com/')
      .waitForElementVisible('body', 1000)
      .click("a[href='signup.html']")
      .waitForElementVisible('#sign-up-body', 1000)
			.setValue('#form-company-name', 'UCSD CSE112')
			.setValue('#form-email', 'cse112@ucsd.edu');
			.setValue('#form-phone', '14089111111');
			.click('#submit-company-btn')
			.waitForElementVisible('#form-employee-first', 1000);
			.setValue('#form-employee-first', 'Thomas');
			.setValue('#form-employee-last', 'Powell');
			.setValue('#form-employee-email', 'cse112@ucsd.edu');
			.setValue('#form-employee-phone', '14089111111');
			.setValue('#form-password', 'cse112');
			.setValue('#form-repeat-password', 'cse112');
			.click('#submit-btn')
      .pause(1000)
      .waitForElementVisible('.page-body gray loaded', 1000);
      .end();
  }
};