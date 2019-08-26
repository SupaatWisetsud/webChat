var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');

var config = require('../config');

module.exports = function(){

    var User = mongoose.model('User');

    passport.use('facebook', new facebookStrategy({
        clientID : config.facebook.clientID,
        clientSecret : config.facebook.clientSecret,
        callbackURL : config.facebook.callbackURL,
        profileFields : ['id', 'name', 'email', 'displayName', 'picture.type(large)'],
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
            email : profile.emails[0].value,
            provider : profile.provider,
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