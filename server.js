process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var mongoose = require('./config/mongoose');
var express = require('./config/express');
var passport = require('./config/passport');

var db = mongoose();
var app = express();
var passport = passport();

var http = require('http').Server(app);

var server  = http.listen(80, function(){
    console.log(`Mode : ${process.env.NODE_ENV} `);
    console.log("Server running... || http://localhost ");
});

var io = require('./config/socket')(server);