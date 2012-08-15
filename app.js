
/**
 * URL转发服务
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var RedisStore = require('connect-redis')(express);
var expressLiquid = require('express-liquid');
var config = require('./config');
var urlForwarding = require('./middlewares/url-forwarding');

var app = express();

app.configure(function () {
  if (config.env) app.set('env', config.env);
  app.set('port', process.env.PORT || config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', expressLiquid());
  app.locals.layout = true;
  app.use(urlForwarding);
  app.use(express.favicon());
  app.use(express.logger(config.logger));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.secret.cookie));
  app.use(express.session({
    secret: config.secret.cookie,
    store:  new RedisStore({
      host:   config.redis.host,
      port:   config.redis.port,
      ttl:    config.redis.sessionTtl,
      db:     config.redis.db,
      prefix: config.redis.prefix + 'SESS:'
    }),
  }));
  app.use(app.router);
  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());
});
app.configure('development', function () {
  app.disable('view cache');
});
app.configure('production', function () {
  app.enable('view cache');
});

// 注册路由
require('./routes')(app);

http.createServer(app).listen(app.get('port'), function () {
  console.log("URL-forwarding server listening on port " + app.get('port'));
});


process.on('uncaughtException', function (err) {
  console.error('Caught exception: ' + err);
});
