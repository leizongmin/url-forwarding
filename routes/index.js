'use strict';

/*
 * 注册路由
 */

module.exports = function (app) {
  
  app.use(function (req, res, next) {
    if (req.pathname.substr(0, 8) === '/public/') return next();
    if (req.pathname !== '/' && !req.session.domain) return res.redirect('/');
    next();
  });
  
  // 网站首页
  app.get('/', function (req, res, next) {
    if (!req.session.domain) return res.render('index', {layout: false});
    res.redirect('/dashboard');
  });
  
  var User = require('./user');
  app.get('/dashboard', User.dashboard);
  app.post('/signup', User.signup);
  
};
