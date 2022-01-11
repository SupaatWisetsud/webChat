"use strict";

const mongoose = require('mongoose');

module.exports = function(){

    const db = mongoose.connect("mongodb://root@bananahomebrew.ddns.net:27017/webchat");

    require('../app/models/User.model');
    require('../app/models/Room.model');
    require('../app/models/Message.model');
    
    return db;
}