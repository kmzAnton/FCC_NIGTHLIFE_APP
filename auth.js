var passport = require('passport');
var db = require('./db');
var LocalStrategy = require('passport-local').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var VkontakteStrategy = require('passport-vkontakte').Strategy;
var bcrypt = require('bcrypt');

var nightUser = require('./scheme/nightUsers.js');
var nightEvent = require('./scheme/events.js');

var mongoose = require('mongoose');
var db_m = require('./db_mongoose.js');


passport.use('local', new LocalStrategy(
  function(username, password, done){
    nightUser.findOne({username: username})
      .then(function(instance){
        if(instance){
          // console.log(instance);
          bcrypt.compare(password, instance.password, function(err, res){
            if(err){console.log(err)}
            else{
              if(res===false){console.log('Password is not the same');return done(null, false)}
              else{
                console.log('User '+instance.username+' has just logged in'); 
                return done(null, instance)    
              }
            }
          });
          
        }
        else{console.log('We could not find such a username'); return done(null, false)}
      })
  }
));


passport.use('local.one', new LocalStrategy({passReqToCallback: true},
  function(req, username, password, done){
    if(username){
        nightUser.find({username: username})
          .then(function(res){
            // console.log(res);
            if(res.length!==0){console.log('User already exists');return done(null, false);}
            else{
              bcrypt.hash(password, 10, function(err, hash){
                if(err) console.log(err);
                var newUser = new nightUser({
                  _id: new mongoose.Types.ObjectId(),
                  username: username,
                  password: hash,
                  email: req.body.email,
                  city: req.body.city,
                  regDate:new Date(),
                  regStrategy: 'local'
                });
                newUser.save(function(err){
                  if(err){console.log(err)}
                  else{
                    console.log('User has been saved');
                    return done(null, newUser);
                  }
                });
              });
            }
          });
    } else{console.log('wrong username');return done(null,false)}
  }
));

passport.use('github', new GithubStrategy(
  {clientID: process.env.GITHUB_CLIENT_ID,
   clientSecret: process.env.GITHUB_CLIENT_SECRET,
   callbackURL:process.env.PROJECT_URL
  },function(accsessToken, refreshToken, profile, done){
    // console.log(profile);
    nightUser.findOne({githubId: profile.id}).then(function(instance){
        if(instance){console.log('GitHub user '+instance.username+' is logged'); return done(null, instance)}
        else{
          console.log('New GitHub user');
          var newUser = new nightUser({
            _id: new mongoose.Types.ObjectId(),
            username: profile.username,   
            githubId: profile.id, 
            regDate:(new Date()).toString(),
            regStrategy: 'github'
          }); 
          newUser.save(function(err){
            if(err){console.log(err);return done(null, false)};
            console.log('New user is saved in MLab');
            return done(null, newUser);
          });
      }
    });
  }
));

passport.use('vkontakte', new VkontakteStrategy(
  {
    clientID: process.env.VK_CLIENT_ID,
    clientSecret: process.env.VK_CLIENT_SECRET, 
    callbackURL: process.env.VK_PROJECT_URL
  },
  function(accessToken, refreshToken, params, profile, done){
    nightUser.findOne({vkId: profile.id})
      .then(function(instance){
        var newUser = new nightUser({
          _id: new mongoose.Types.ObjectId(),
          username: profile.name.givenName,   
          vkId: profile.id, 
          regDate:(new Date()).toString(),
          regStrategy: 'vk'
        });
        if(instance){console.log('VK user'+profile.name.givenName+' is logged in'); return done(null, newUser)}
        else{
          console.log('New VK user');
          
          newUser.save(function(err){
            if(err){console.log(err); return done(null, false)}
            console.log('New VK user is saved in MLab');
            return done(null, newUser);
          });
        }
      })
  }
));


passport.serializeUser(function(user, done){
  user.userId = {username: user.username, id: user._id};
  done(null, user.userId);
});
passport.deserializeUser(function(username, done){
  // nightUser.findOne({_id:username.id}, function(err, user){
    // console.log(user);
    done(null, username);
  // });
});

module.exports = passport;
