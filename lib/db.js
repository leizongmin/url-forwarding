'use strict';

/**
 * 数据库
 */

var redis = require('redis');
var config = require('../config');


var db = redis.createClient(config.redis.port, config.redis.host);
db.select(config.redis.db);

db.on('error', function (err) {
  console.error(err.stack);
});

module.exports = db;
