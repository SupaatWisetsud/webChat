var mongoose = require('mongoose');

var config = require('./config');

module.exports = function(){

    var db = mongoose.connect(config.mongoUrl);

    require('../app/models/User.model');
    require('../app/models/Room.model');
    require('../app/models/Message.model');
    
    return db;
}