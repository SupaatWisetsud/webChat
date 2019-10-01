module.exports = {
    debug : true,
    mongoUrl : 'mongodb://localhost:27017/webchat',
    facebook : {
        clientID : '869913373394455',
        clientSecret : '9a6fd6403351d1eb49c69a4a1190cbae',
        callbackURL : 'http://localhost:3000/oauth/facebook/callback'
    },
    google : {
        clientID : '111365099484-d5le2fuh9cgu5lgmar7g1oe0ol42jei7.apps.googleusercontent.com',
        clientSecret : 'FVOTqt--6rOh3wPL4f8AoZl-',
        callbackURL : 'http://localhost:3000/oauth/google/callback'
    }
}