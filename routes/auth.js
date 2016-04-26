var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var constants = require('../config/constants');
var User = require('../models/user')
/* Passport */

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


/* GET users listing. */
router.get('/google',	
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.profile.emails.read'] }));



passport.use(new GoogleStrategy({
    clientID: constants.GOOGLE_CLIENT_ID,
    clientSecret: constants.GOOGLE_CLIENT_SECRET,
    callbackURL: constants.BASE+"/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  	profile.signupStyle = "google";
  	process.nextTick(function() {
		return done(null, profile);
	})
  }
));

passport.use(new FacebookStrategy({
    clientID: constants.FACEBOOK_CLIENT_ID,
    clientSecret: constants.FACEBOOK_CLIENT_SECRET,
    callbackURL: constants.BASE+"/auth/facebook/callback",
    enableProof: false,
    profileFields: ['id','name','email','gender']
  },
  function(accessToken, refreshToken, profile, done) {
    profile.signupStyle = "facebook";
	process.nextTick(function() {
		return done(null, profile);
	})
  }
));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
   	var newUser = {
      oauthId: req.user.id, 
      first_name: req.user.name.givenName,
      last_name: req.user.name.familyName,
      email: req.user.emails[0].value,
      picture: req.user.photos[0].value.replace("sz=50","sz=200"),
      signupStyle: "google"
    }
    console.log(newUser); 
    User.findOrCreate(newUser, function(err, newUser) {
      if (err) return console.log(err);
      res.send(newUser);
    });
  });


router.get('/facebook',
 passport.authenticate('facebook',
	{scope:['public_profile','email']}),
	 function(req, res) {
	 	
});

router.get('/facebook/callback',
 passport.authenticate('facebook', {failureRedirect:'/', scope:['email']}), function(req, res) {
  var newUser = {
    oauthId: req.user._json.id, 
    first_name: req.user._json.first_name,
    last_name: req.user._json.last_name,
    email: req.user._json.email,
    picture: "http://graph.facebook.com/"+req.user.id+"/picture?width=200&height=200",
    signupStyle: "facebook"
  }
  console.log(newUser); 
  User.findOrCreate(newUser, function(err, newUser) {
    if (err) return console.log(err);
    res.send(newUser);
  });
});

module.exports = router;
