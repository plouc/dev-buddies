var compressor = require('node-minify');

console.log('Starting build...');

new compressor.minify({
    type: "yui-js"
  , fileIn: [
      "public/js/vendors/jquery-1.8.3.js"
    , "public/js/vendors/underscore.js"

    , "public/js/storage.js"

    , "public/js/provider.js"

    , "public/js/providers/provider.result.js"
    , "public/js/providers/provider.js"
    , "public/js/providers/github.js"
    , "public/js/providers/stack-overflow.js"

    , "public/js/renderers/search.js"
    , "public/js/renderers/github.js"
    , "public/js/renderers/stack-overflow.js"
    , "public/js/renderers/buddies.js"

    , "public/js/app.js"
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