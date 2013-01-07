var connect = require('connect')
  , http    = require('http')
  , port    = 3000;

var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(connect.directory('public'))
  .use(function(req, res){
    res.end('No static resource found\n');
  });

http.createServer(app).listen(port);

console.log('server started on port ' + port);