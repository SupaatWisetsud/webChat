var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(){
    passport.use('local', new localStrategy(function(username, password, done){
        User.findOne({
            username : username
        }, (err, user)=>{
            if(err) return done(err);
            if(!user || !user.authPassword(password)){
                return done(null, false, {
                    message : "Username หรือ Passwrod ของท่านไม่ถูกต้อง"
                });
            }else{
                return done(null, user);
            }
        });
    }));
}