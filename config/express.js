"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('morgan');
const compression = require('compression');
const flash = require('connect-flash');
const sass = require('node-sass-middleware');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { existsSync , mkdirSync } = require('fs');
const config = require('./config');

module.exports = function(){

    const app = express();

    existsSync(path.join(__dirname, '../public/img/user')) || mkdirSync(path.join(__dirname, '../public/img/user'));

    //set storage
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(__dirname, '../public/img/user'));
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname.split('.')[0] + crypto.randomBytes(16).toString('hex') + '.' + file.originalname.split('.')[1]);
        }
    });

    //set confin multer
    var upload = multer({storage : storage});
    
    app.use(flash());

    app.use(session({
        name : 'sid',
        secret : config.sessionSecret,
        resave : false,
        saveUninitialized : true,
        cookie : {maxAge : 15*60*60*60}
    }));
    
    if(process.env.NODE_ENV === 'development')  app.use(logger('dev'));
    else app.use(compression());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));

    app.use(passport.initialize());
    app.use(passport.session());

    require('../app/routes/index.routes')(app, upload);

    app.set('views', './app/views');
    app.set('view engine', 'jade');

    app.use(sass({
        src : './sass',
        dest : './public/css',
        outputStyle : 'compressed',
        prefix : '/css',
        debug : config.debug
    }));

    app.use(express.static('./public'));

    return app;
}