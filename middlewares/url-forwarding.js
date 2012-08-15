'use strict';

/**
 * URL转发中间件
 */

var config = require('../config');
var db = require('../lib/db');


module.exports = function (req, res, next) {

  var host = req.headers.host.split(':')[0].toLowerCase();
  if (host == config.host) return next();

  var key = config.redis.prefix + 'record:' + host;
  db.get(key, function (err, data) {
    if (err) return next();
    if (!data) return next();
    data = data.split(/\s+/ig);
    var code = data[0];
    var url = data[1] + req.url;
    res.redirect(code, url);
    console.log('Forwarding ' + host + ' ' + code + ' ' + url);
  });

};
