'use strict';

/**
 * 用户注册相关
 */

var dns = require('dns');
var config = require('../config');
var utils = require('../lib/utils');
var db = require('../lib/db');


var getRecordKey = function (domain) {
  return config.redis.prefix + 'record:' + domain;
}

// 添加URL记录
exports.add = function (req, res, next) {
  var childdomain = req.body.childdomain;
  var url = req.body.url;
  if (!childdomain || !url) return res.render('dashboard', {error: '请输入子域名和要转发的URL'});
  childdomain = childdomain.trim().toLowerCase();
  url = url.trim();
  var code = req.body.code;
  if (code != '301' && code != '302') code = '301';
  var domain = childdomain + '.' + req.session.domain;
  var key = getRecordKey(domain);
  db.set(key, code + ' ' + url, function (err) {
    if (err) return res.render('dashboard', {error: '未知错误：' + err});
    res.render('dashboard');
  });
};

// 记录列表
exports.list = function (env, callback) {
  var prefix = config.redis.prefix + 'record:';
  db.keys(prefix + '*.' + env.domain, function (err, keys) {
    if (err) return callback(err);
    if (!Array.isArray(keys) || keys.length < 1) return callback(null, []);
    db.mget(keys, function (err, urls) {
      var ret = [];
      keys.forEach(function (k, i) {
        var url = urls[i];
        if (!url) return;
        var domain = k.substr(prefix.length);
        var _url = url.split(/\s+/ig);
        ret.push({
          domain:   domain,
          url:      _url[1],
          code:     _url[0]
        });
      });
      return callback(null, ret);
    });
  });
};
