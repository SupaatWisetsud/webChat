var passport =require('passport');

var index = require('../controllers/index.controller');


module.exports = (app, upload)=>{
    
    app.route('/')
        .get(index.index);

    app.route('/room/:id')
        .get(index.room);

    app.route('/signup')
        .get(index.viewSignup)
        .post(upload.single('profileImg'), index.signup);

    app.get('/signin', index.viewSignin);

    app.post('/signin', passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect : '/signin',
        failureFlash : true
    }));

    app.get('/logout', (req, res, next)=>{
        req.logout();
        res.redirect('/');
    });

    //oauth facebook
    app.get('/oauth/facebook', passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/signin',
        scope : ['email']
    }));

    app.get('/oauth/facebook/callback', passport.authenticate('facebook',{
        failureRedirect : '/',
        successRedirect : '/signin',
        failureFlash : true
    }));

    //oauth google
    app.get('/oauth/google', passport.authenticate('google', {
        successRedirect : '/',
        failureRedirect : '/signin',
        scope : ['profile']
    }));

    app.get('/oauth/google/callback', passport.authenticate('google',{
        failureRedirect : '/',
        successRedirect : '/signin',
        failureFlash : true,
    }));

}
