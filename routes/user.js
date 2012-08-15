'use strict';

/**
 * 用户注册相关
 */

var dns = require('dns');
var config = require('../config');
var utils = require('../lib/utils');


// 首页
exports.dashboard = function (req, res, next) {
  res.render('dashboard');
};

// 注册帐号
exports.signup = function (req, res, next) {
  var domain = req.body.domain;
  var password = req.body.password;
  if (!domain || !password) return res.render('singup', {error: '请输入域名和密码！'});
  domain = domain.trim().toLowerCase();
  var txt = utils.encryptPassword(password);
  // 先检查该域名是否已注册
  var encryptChildDomain = config.encryptChildDomain + '.' + domain;
  dns.resolveTxt(encryptChildDomain, function (err, txts) {
    res.locals.hasRegistered = err ? false : true;
    res.render('singup', {domain: encryptChildDomain, txt: txt});
  });
};

// 登录
exports.signin = function (req, res, next) {
  var domain = req.body.domain;
  var password = req.body.password;
  if (!domain || !password) return res.render('singup', {error: '请输入域名和密码！'});
  domain = domain.trim().toLowerCase();
  // 获取密码
  var encryptChildDomain = config.encryptChildDomain + '.' + domain;
  dns.resolveTxt(encryptChildDomain, function (err, txts) {
    if (err) return res.render('signin', {error: '请先注册！'});
    var hasValidated = false;
    for (var i in txts) {
      if (utils.validatePassword(password, txts[i])) {
        hasValidated = true;
        break;
      }
    }
    if (!hasValidated) return res.render('signin', {error: '密码错误！'});
    req.session.domain = domain;
    res.redirect('/dashboard');
  });  
};

// 注销
exports.signout = function (req, res, next) {
  delete req.session.domain;
  res.redirect('/');
};
