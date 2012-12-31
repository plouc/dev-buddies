var connect = require('connect'),
    http    = require('http'),
    sass    = require('node-sass');

var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(connect.directory('public'))
  .use(sass.middleware({
    src:  'public',
    dest: 'public',
    debug: true
  }))
  .use(function(req, res){
    res.end('Hello from Connect!\n');
  });

http.createServer(app).listen(3000);

console.log('server started');