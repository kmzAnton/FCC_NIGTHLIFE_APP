var mongodb = require('mongodb').MongoClient;
var dotenv = require('dotenv');
var MONGO_URI = process.env.MONGO_URI;

var dbase; 

module.exports = {

  connect: function(callback){
    mongodb.connect(MONGO_URI, function(err, db){
      dbase.db('fccurlshort');
      return callback(err);
    });
  },
  getDb: function(){
    return dbase;
  }

};