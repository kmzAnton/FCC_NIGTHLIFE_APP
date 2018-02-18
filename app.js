
module.exports = function(data, db){
  
  var express = require('express');
  var app = express();
  var routes_main = require('./routes/main_page')(data);
  var routes_log = require('./routes/login')(data);
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var passport = require('./auth');
  var session = require('express-session');
  var db = require('./db');
  
  app.use(express.static('public'));
  app.set('view engine', 'ejs');
  app.use(cookieParser());
  app.use(require('body-parser').urlencoded({extended: true}));
  app.use(session({
    secret: 'ABCDE',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(bodyParser());
  
  
  app.get('/', function(req,res){res.redirect('/main_page')})
  
  app.get('/login', routes_log.login);
  app.get('/logout', routes_log.logout);
  app.get('/auth/github/callback', 
          passport.authenticate('github', {failureRedirect: '/signup_fail'}),
          routes_main.main_page,
         );
  app.get('/auth/vkontakte/callback',
         passport.authenticate('vkontakte',{failureRedirect: '/signup_fail'}),
         routes_main.main_page  
         );
  app.post('/login_local', 
       passport.authenticate('local', {failureRedirect:'/login_local_fail'}), 
       routes_main.main_page);
  app.post('/signup', 
       passport.authenticate('local.one', {failureRedirect:'/signup_fail'}), 
       routes_main.main_page);
  
  
  app.get('/login_local_fail', routes_log.login_local_fail);
  app.get('/signup_fail', routes_log.signup_fail);
  
  
  
  app.get('/main_page', routes_main.main_page);
  
  app.post('/search', routes_main.search);
  
  app.post('/vote', routes_main.vote);
  
  
  
  
  return app;
};