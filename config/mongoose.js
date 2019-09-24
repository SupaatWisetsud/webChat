"use strict";

const mongoose = require('mongoose');

const config = require('./config');

module.exports = function(){

    const db = mongoose.connect(config.mongoUrl);

    require('../app/models/User.model');
    require('../app/models/Room.model');
    require('../app/models/Message.model');
    
    return db;
}