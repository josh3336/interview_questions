var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = "453905734722649"
var FACEBOOK_APP_SECRET = "4ee236cfd291190ce7c8aa3176007c20";



module.exports = function(app){
  console.log('passport exports');
  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  However, since this example does not
  //   have a database of user records, the complete Facebook profile is serialized
  //   and deserialized.
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // Use the FacebookStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and Facebook
  //   profile), and invoke a callback with a user object.
  passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/facebook/callback/"
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      console.log('wrrrrrrrrrrrrr')
      process.nextTick(function () {
       // To keep the example simple, the user's Facebook profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Facebook account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  ));

  // GET /auth/facebook
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Facebook authentication will involve
  //   redirecting the user to facebook.com.  After authorization, Facebook will
  //   redirect the user back to this application at /auth/facebook/callback



  // Simple route middleware to ensure user is authenticated.
  //   Use this route middleware on any resource that needs to be protected.  If
  //   the request is authenticated (typically via a persistent login session),
  //   the request will proceed.  Otherwise, the user will be redirected to the
  //   login page.
  app.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { 

      return next(); }
    res.redirect('/')
  }
}