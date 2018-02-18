var data = require('../data/data.js');


module.exports = function(data){
  var functions = {};
  function Info(){
    this.title = '';
    this.error_msg = '';
  };
  function User(){
    this.username= '';
    this.id='';
    this.city='';
    this.email='';
  };
  
  
  functions.login = function(req,res){
    var user = new User(), info = new Info();
    info.title = 'Login page'
    if(req.user!==undefined){
      user.username = req.session.passport.user.username;
    }
    res.render('login', {info: info, user: user});
  };

  
  functions.logout = function(req,res){
    var user = new User(), info = new Info();
    req.logOut();
    req.session.destroy();
    info.title = 'Login page';
    if(req.session!==undefined){
      user.username = req.session.passport.user.id;
    }
    res.render('login', {info:info, user: user});
  }

  
  functions.signup_fail = function(req,res){
    var user = new User(), info = new Info();
    info.title = 'Signup Failure';
    info.error_msg = 'Such a username already exists';
    res.render('login', {info:info, user: user});
  }

  
  functions.login_local_fail = function(req,res){
    var user = new User(), info = new Info();
    info.title = 'Login Failure';
    info.error_msg = 'Please check username and password';
    user.username = req.user.username;
    res.render('login', {info:info, user: user});
  }

  
  return functions;
}