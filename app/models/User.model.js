var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var userSchema = new Schema({
    username : {
        type : String,
        trim : true,
        required : "Username is required"
    },
    password : String,
    email : {
        type : String,
        trim : true
    },
    firstName : {
        type : String,
        trim : true,
        required : "First Name is required"
    },
    lastName : {
        type : String,
        trim : true,
        required : "Last Name is required"
    },
    phoneNumber : {
        type : String,
        trim : true
    },
    profileImg : {
        type : String,
        default : '/img/system/user.png'
    },
    salt : String,
    provider : String,
    providerId : String,
    providerData : {}
});

userSchema.statics.findUniq = function(req, userData, suffix, done, callback){
    let _this = this;

    userData.username += (suffix? suffix:'');

    this.findOne({
        username : userData.username,
        provider : userData.provider
    }, function(err, result){
        if(err) return done(err);
        if(result){
            _this.findOne({
                providerId : userData.providerId
            }, function(err, result){
                if(err) return done(err);
                if(result) return done(err, result);
                else{
                    _this.findUniq(req, userData, (suffix||'')+1,done, callback);
                }
            })
        }else{
            return callback(userData.username);
        }
    })
    
}

userSchema.pre('save',function(next){
    if(this.password){
        console.log('Hello');
        this.salt = new Buffer(crypto.randomBytes(16).toString('hex'), 'utf-8');
        this.password = this.hashPassword(this.password, this.salt);
    }
    next();
});


userSchema.methods.hashPassword = function(password, salt){
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

userSchema.methods.authPassword = function(password){
    return this.password === this.hashPassword(password, this.salt);
}

mongoose.model('User', userSchema);