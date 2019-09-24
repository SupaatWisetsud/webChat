"use strict";
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const config = require('../config');

module.exports = function(){

    const User = mongoose.model('User');

    passport.use('google', new googleStrategy({
        clientID : config.google.clientID,
        clientSecret : config.google.clientSecret,
        callbackURL : config.google.callbackURL,
        passReqToCallback : true
    }, function(req, accessToken, refreshToken, profile, done){

        // console.log(profile);
        
        let providerData = profile._json;
        
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;

        let userData = {
            username : profile.displayName,
            firstName : profile.name.givenName,
            lastName : profile.name.familyName,
            provider : profile.provider,
            profileImg : profile.photos[0].value,
            providerId : profile.id,
            providerData : providerData
        }

        User.findUniq(req, userData, null, done, function(avalible){

            userData.username = avalible;

            let user = new User(userData);

            user.save(function(err){
                return done(err, user);
            });
        });

    }));

}