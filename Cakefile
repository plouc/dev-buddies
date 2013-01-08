exec = require('child_process').exec
task 'test', 'run all tests suites', ->
  console.log 'Running front-end tests'
  phantom_bin = "PHANTOMJS_BIN=#{__dirname}/node_modules/phantomjs/lib/phantom/bin/phantomjs"
  testacular = "#{__dirname}/node_modules/testacular/bin/testacular"
  browsers = if process.env.TRAVIS then 'PhantomJS,Firefox' else 'PhantomJS,Firefox,Safari'
  options = "--single-run --browsers=#{browsers}"
  exec "#{phantom_bin} #{testacular} start #{__dirname}/tests/testacular.conf.js #{options}", (err, stdout, stderr) ->
    console.error err if err
    console.log stdout
