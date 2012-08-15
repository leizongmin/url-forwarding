'use strict';

/*
 * 注册路由
 */

var config = require('../config');

module.exports = function (app) {
  
  // 验证登录
  var checkLogin = function (req, res, next) {
    if (!req.session.domain) return res.redirect('/');
    res.locals.domain = req.session.domain;
    res.locals.cname = config.host;
    res.locals.myUrls = Url.list;
    next();
  };

  // 网站首页
  app.get('/', function (req, res, next) {
    if (!req.session.domain) return res.render('index');
    res.redirect('/dashboard');
  });
  
  var User = require('./user');
  app.get('/dashboard', checkLogin, User.dashboard);
  app.post('/signup', User.signup);
  app.post('/signin', User.signin);
  app.get('/signout', User.signout);
  
  var Url = require('./url');
  app.post('/url/add', checkLogin, Url.add);

};
