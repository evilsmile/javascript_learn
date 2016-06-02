// An example configuration file.
exports.config = {
  directConnect: true,

//  chromeDriver: './node_modules/protractor/selenium/chromedriver_2.21'

//	seleninumAddress: 'http://0.0.0.0:4444wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine',

  // Spec patterns are relative to the current working directory when
  // protractor is called.
  specs: ['../test/e2e/**/*_spec.js']

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
