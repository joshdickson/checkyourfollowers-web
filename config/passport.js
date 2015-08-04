// passport.js

var TwitterStrategy = require('passport-twitter').Strategy;
var User       		= require('../database/user');

var consumerKey     = process.env.TWITTER_CONSUMER_KEY;
var consumerSecret  = process.env.TWITTER_CONSUMER_SECRET;
var callbackURL     = process.env.TWITTER_CALLBACK_URL;


module.exports = function(passport) {

    // serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Twitter
    passport.use(new TwitterStrategy({
        consumerKey     : consumerKey,
        consumerSecret  : consumerSecret,
        callbackURL     : callbackURL
    },

    function(token, tokenSecret, profile, done) {

        process.nextTick(function() {

            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (user) {

                    return done(null, user); // user found, return that user

                } else {
                    // if there is no user, create them
                    var newUser                 = new User();

                    // set all of the user data that we need
                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.tokenSecret = tokenSecret;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    newUser.dateCreated         = new Date();

                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });


        });

    }));

};
