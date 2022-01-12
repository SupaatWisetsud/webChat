"use strict";

var dotenv = require('dotenv');
dotenv.config();

var mongoose = require('./config/mongoose');
var express = require('./config/express');
var passport = require('./config/passport');

mongoose();
var app = express();
passport();

var http = require('http').Server(app);

var server  = http.listen(2000, function(){
    console.log(`Mode : ${process.env.NODE_ENV} `);
    console.log(`🚀  Server running... || http://localhost:3000 `);
});

require('./config/socket')(server);
