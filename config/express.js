var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var compression = require('compression');
var flash = require('connect-flash');
var sass = require('node-sass-middleware');
var passport = require('passport');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var mkdirp = require('mkdirp');

var config = require('./config');

module.exports = function(){
    var app = express();

    //create folder
    mkdirp(path.join(__dirname, '../public/img/user'), function (err) {
        if (err) throw err;
    });

    //set storage
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(__dirname, '../public/img/user'));
        },
        filename: function (req, file, cb) {
          cb(null,   file.originalname.split('.')[0] +
                     crypto.randomBytes(16).toString('hex') +
                     '.'
                     +file.originalname.split('.')[1] 
            );
        }
    })

    //set confin multer
    var upload = multer({
        storage : storage
    });
    
    app.use(flash());

    app.use(session({
        name : 'sid',
        secret : config.sessionSecret,
        resave : false,
        saveUninitialized : true,
        cookie : {maxAge : 15*60*60*60}
    }));
    
    if(process.env.NODE_ENV === 'development'){
        app.use(logger('dev'));
    }else{
        app.use(compression());
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended : true
    }));
    


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
    }))

    app.use(express.static('./public'));

    return app;
}