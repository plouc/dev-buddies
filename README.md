Dev Buddies
===========

[![Build Status](https://secure.travis-ci.org/plouc/dev-buddies.png?branch=master)](http://travis-ci.org/plouc/dev-buddies)

Dev server
----------

There is an available nodejs based server, to start it, simply type

    node app.js

Build
-----

assets are minified, you can regenerate it using

    node build.js

Documentation
-------------

Documentation is located in public/doc and generated with jsdoc3
You can regenerate doc with this command

    ./node_modules/jsdoc/jsdoc -r --destination public/doc public/js