var compressor = require('node-minify');

console.log('Starting build...');

new compressor.minify({
  type: 'uglifyjs',
  tempPath: './',
  fileIn: [
    'public/js/vendors/underscore.js',
    'public/js/vendors/jquery-1.8.3.js',
    'public/js/vendors/angular.js',
    'public/js/Storage.js',
    'public/js/App.js',
    'public/js/Profile.js',
    'public/js/BuddyCollectionFormatter.js',
    'public/js/DevBuddiesModule.js',
    'public/js/Provider/Provider.js',
    'public/js/Provider/ProviderResult.js',
    'public/js/Provider/GithubProvider.js',
    'public/js/Provider/StackOverflowProvider.js',
    'public/js/Renderer/StackOverflowRenderer.js',
    'public/js/Controller/AppController.js',
    'public/js/Controller/HomeController.js',
    'public/js/Controller/SearchController.js',
    'public/js/Controller/BuddiesController.js',
    'public/js/Controller/BuddyController.js',
    'public/js/Controller/GithubProfileController.js',
    'public/js/Controller/SettingsController.js'
  ],
  fileOut: 'public/js/dev-buddies.pack.js',
  callback: function (error, e) {
    'use strict';

    if (error) {
        console.log('JS minifier error', error);
    }
    console.log('...built');
  }
});


//process.exit(0);