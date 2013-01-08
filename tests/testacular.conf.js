// Testacular configuration
// Generated on Mon Jan 07 2013 23:28:04 GMT+0100 (CET)


// base path, that will be used to resolve files and exclude
basePath = '../';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'public/js/vendors/underscore.js',
  'public/js/vendors/jquery-1.8.3.js',
  'public/js/App.js',
  'public/js/Storage.js',
  'public/js/Controller/SettingsController.js',
  'public/js/Provider/ProviderResult.js',
  'public/js/Provider/Provider.js',
  'public/js/Provider/GithubProvider.js',
  'public/js/Provider/StackOverflowProvider.js',
  'public/js/Renderer/GithubRenderer.js',
  'public/js/Renderer/StackOverflowRenderer.js',
  'tests/specs/*.spec.js'
];


// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = [
  'progress'
];


// web server port
port = 3100;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = [
  'PhantomJS',
  'Chrome',
  'Firefox',
  'Safari'
];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
