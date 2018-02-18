module.exports = function(searchReq){

  var yelp = require('yelp-fusion');
  var yelpData = {};

  var client = yelp.client(process.env.YELP_API_KEY);

  return client.search(searchReq).then(function(instance){
    return instance;
  });
}