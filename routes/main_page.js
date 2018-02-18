var data = require('../data/data.js');
var yelp = require('../yelp-fusion.js');
var nightUser =require('../scheme/nightUsers.js');
var event = require('../scheme/events.js');
var localStorage = require('localStorage');


module.exports = function(data){
  var functions={};
  function User(req){
    if(req.user !== undefined){this.username = req.session.passport.user.username;}
      else{this.username = '';}
    if(req.user !== undefined){this.id = req.session.passport.user.id;}
      else{this.id = '';}
    this.city = '';
    this.email='';
  };
  function Info(){
    this.title = '';
    this.error_msg = '';
  };
  
  function userDefined(user, info, res, req){
    nightUser.findOne({_id:user.id})
      .then(instance=>{
        if(instance.lastSearch!==null){
          var city = instance.lastSearch;
          yelp({location: city, term: 'Nightlife'}).then(function(yelpResult){
            var yelpData = [];
            event.find().then(function(dbResponse){
              if(dbResponse.length!=0){
                  yelpData = yelpResult.jsonBody.businesses.map(yelpElem=>{
                    yelpElem.votes = 0;
                    yelpElem.isGoing = false;
                    dbResponse.forEach(function(dbItem){
                      if(yelpElem.id == dbItem.eventId){
                        yelpElem.votes = dbItem.attenders.length;
                        if(dbItem.attenders.includes(req.user.id)){
                          yelpElem.isGoing = true;
                        }
                      }
                    });
                    return yelpElem;
                  })
              }else{
                yelpData = yelpResult.jsonBody.businesses;
              }
              res.render('main_page', {user:user, info:info, yelpData: yelpData});
            });
          });
        } else{res.render('main_page',{user: user, info:info, yelpData:null});}
      });
    }  
  
  function userNotDefined(user, info, res, city){
    yelp({location: city, term: 'Nightlife'})
        .then(function(yelpResult){
            var yelpData = [];
            event.find().then(function(dbResponse){
              if(dbResponse.length!=0){
                  yelpData = yelpResult.jsonBody.businesses.map(yelpElem=>{
                    yelpElem.votes = 0;
                    dbResponse.forEach(function(dbItem){
                      if(yelpElem.id == dbItem.eventId){
                        yelpElem.votes = dbItem.attenders.length;
                      }
                    });
                    return yelpElem;
                  });
                  res.render('main_page', {user:user, info:info, yelpData: yelpData});
              }else{
                yelpData = yelpResult.jsonBody.businesses;
                res.render('main_page', {user:user, info:info, yelpData: yelpData});
              }
            });
          });
  }
  
  
  
  functions.main_page = function(req,res){
    var info = new Info(), user = new User(req);
    info.title='Activities search';
    
    if(user.id!==''){
      userDefined(user, info, res, req);
    }else{ res.render('main_page',{user: user, info:info, yelpData:null}); }
    
  };
  
  
  functions.search = function(req,res){
    var info = new Info(), user = new User(req);
    info.title='Activities search';
    var city = req.body.searchReq;

    if(user.id!==''){
      nightUser.update({_id: user.id},{$set:{lastSearch: city}}, function(err){if(err)console.log(err)});
    }
    if(user.id!==''){  userDefined(user, info, res, req);  }
    else{  userNotDefined(user, info, res, city);  }
  };
  
  
  functions.vote = function(req,res){
    var username = req.body.username;
    var splited = req.body.eventData.split('+++');
    var eventName = splited[0];
    var eventId = splited[1];
    
    event.findOne({eventId: splited[1]}, function(err, resp){
      if(err){console.log(err); res.end()}
      else{
        if(resp){
          if(resp.attenders.indexOf(req.user.id)!==-1){
            event.update({eventId: splited[1]}, {$pull: {attenders : req.user.id}}, function(){
              console.log('User ID is removed from Attenders array'); res.end('userPulled');
            });
          }else{
            event.update({eventId: splited[1]}, {$push:{attenders: req.user.id}}, function(){
              console.log('User ID is added to Attenders array'); res.end('userPushed');
            });
          }
        }else{
          var newEvent = new event({
            eventName: eventName,
            eventId: eventId,
            attenders: [req.user.id],
            regDate: (new Date()).toString()
          });
          newEvent.save(function(err){
            if(err){console.log(err); res.end();}
            else{console.log('New event is saved!!!');res.end('newEvent');}
          });
        }
      }
    });
  };
  
  
  return functions;
};