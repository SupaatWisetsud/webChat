"use strict";

const mongoose = require('mongoose');

const mongoConfig = {
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    port: process.env.MONGO_PORT,
    db: process.env.MONGO_DATABASE,
    host: process.env.MONGO_HOST
}

const url = `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/`;

module.exports = function(){

    mongoose.connect(url, {
        dbName: mongoConfig.db
    }, error => {
        if (error) {
            console.error(error);
        } else {
            console.log('Connection mongo db successful.');
        }
    })
    require('../app/models/User.model');
    require('../app/models/Room.model');
    require('../app/models/Message.model');

}
