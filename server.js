var http=require('http');
var app = require('./app.js')(data, db);
var data = require('./data/data.js');
var db = require('./db');



http.createServer(app).listen(process.env.PORT);