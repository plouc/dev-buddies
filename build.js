var compressor = require('node-minify');

console.log('Starting build...');

new compressor.minify({
    type: "yui-js"
  , fileIn: [
      "public/js/vendors/jquery-1.8.3.js"
    , "public/js/vendors/underscore.js"

    , "public/js/Storage.js"

    , "public/js/Profile.js"

    , "public/js/Provider/ProviderResult.js"
    , "public/js/Provider/provider.js"
    , "public/js/Provider/GithubProvider.js"
    , "public/js/Provider/StackOverflowProvider.js"

    , "public/js/Renderer/SearchRenderer.js"
    , "public/js/Renderer/GithubRenderer.js"
    , "public/js/Renderer/StackOverflowRenderer.js"
    , "public/js/Renderer/BuddiesRenderer.js"

    , "public/js/App.js"
    , "public/js/main.js"
  ]
  , fileOut: "public/js/dev-buddies.pack.js"
  , callback: function(error, e){
      if (error) {
          console.log('JS minifier error', error);
      }
      console.log('...built');
  }
});


//process.exit(0);