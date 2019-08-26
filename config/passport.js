var passport = require('passport');
var mongoose = require('mongoose');


module.exports = ()=>{
    
    var User = mongoose.model('User');

    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        User.findOne({
            _id : id
        }, '-password -salt', function(err, user){
            return done(err, user);
        });
    });

    require('./strategy/local')();
    require('./strategy/facebook')();
    require('./strategy/google')();
}