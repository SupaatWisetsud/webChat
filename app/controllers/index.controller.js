var mongoose = require('mongoose');

var User = mongoose.model('User');
var Room = mongoose.model('Room');
var Message = mongoose.model('Message');


var getErrorMessage = function(err){

    let message = '';

    if(err.code){
        
        switch (err.code){
            case 11000:
            case 11001:
                message = "Username already exists";
                break;
            default : 
                message = "Something went wrong";
        }
    }else{
        for (var errName in err.errors){
            if(err.errors[errName].message){
                message = err.errors[errName].message;
            }
        }
    }
    return message;
}

exports.index = (req, res, next)=>{
    if(req.user){
        // console.log(req.user);
        Room.find({}, function(err,result){
            if(err) {
                var errorMessage = getErrorMessage(err);
                req.flash('error', errorMessage);
                res.redirect('/');
            }
            res.render('index', {
                roomName : result,
                title : 'Web Chat',
                messageError : req.flash('error') 
            });
        });
    }else{
        res.redirect('/signin');
    }
}

exports.viewSignup = (req, res, next)=>{
    if(!req.user){
        res.render('signup',{
            title : 'Sign Up',
            messageError : req.flash('error') 
        });
    }else{
        res.redirect('/');
    }
}
exports.viewSignin = (req, res, next)=>{
    if(!req.user){
        res.render('signin', {
            title : 'Sign In',
            messageError : req.flash('error')
        });
    }else{
        res.redirect('/');
    }
}

exports.signup = (req, res, next)=>{
    // console.log(req.file);
    
    // console.log(req.body);
    User.findOne({
        username : req.body.username
    }, (err, user)=>{
        if(err){
            var errorMessage = getErrorMessage(err);

            req.flash('error', errorMessage);
            return res.redirect('/signup')
        }
        if(!user){
            User.findOne({
                email : req.body.email
            }, (err, user)=>{
                if(err) {
                    var errorMessage = getErrorMessage(err);
                    req.flash('error', errorMessage);
                    return res.redirect('/signup')
                };
                if(!user){
                    let user = new User(req.body);

                    // console.log(req.file);
                    
                    if(req.file !== undefined){
                        user.profileImg =  req.file.path.split('public')[1];
                    }
                    
                    user.save(err=>{
                        
                        if(err) {
                            var errorMessage = getErrorMessage(err);
                            req.flash('error', errorMessage);
                            return res.redirect('/signup');
                        };
                        req.login(user, err=>{
                            if(err) {
                                var errorMessage = getErrorMessage(err);
                                req.flash('error', errorMessage);
                                return res.redirect('/');
                            };
                        });

                        res.redirect('/');
                    });

                }else{
                    req.flash('error', 'Email นี่มีคนใช้แล้ว');
                    res.redirect('/signup');
                }
            });
        }else{
            req.flash('error', 'Username นี่มีคนใช้แล้ว');
            res.redirect('/signup');
        }
    });
}

exports.room = (req, res, next) =>{
    if(req.user){
        // console.log(req.user);
        
        Room.findOne({
            _id : req.params.id
        }, (err, room)=>{
            
            if(err){
                var errorMessage = getErrorMessage(err);
                req.flash('error', errorMessage);
                res.redirect('/');
            };
            if(!room){
                return res.redirect('/');
            }
            else{
                Message.find({
                    room : req.params.id
                })
                .populate('room')
                .populate('user')
                .exec(function(err, message){
                    if(err) {
                        var errorMessage = getErrorMessage(err);
                        req.flash('error', errorMessage);
                        res.redirect('/');
                    }
                    else{
                        res.render('room', {
                            roomName : room.roomName,
                            roomId : req.params.id,
                            user : req.user._id,
                            message : message,
                            messageError : req.flash('error'),
                            title : room.roomName
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
}