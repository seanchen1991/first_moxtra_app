var request = require('request');
var moxtraData = require('./../config/auth');
var CryptoJS = require('crypto-js');
var Student = require('./../models/Student');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }));
};

function isLoggedIn(req, res, next) {
  var student = req.user[0];
  var timestamp = new Date().getTime();
  var hash = CryptoJS.HmacSHA256(moxtraData.moxtraAuth.clientID + student.uniqueID + timestamp, moxtraData.moxtraAuth.clientSecret);
  var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  var signature = hashInBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  var url = 'https://api.moxtra.com/oauth/token?client_id=' + moxtraData.moxtraAuth.clientID + 
            '&client_secret=' + moxtraData.moxtraAuth.clientSecret +
            '&grant_type=' + moxtraData.moxtraAuth.grantType +
            '&uniqueid=' + student.uniqueID +
            '&timestamp=' + timestamp +
            '&signature=' + signature + 
            '&firstname=' + student.firstname +
            '&lastname=' + student.lastname;
  if (req.isAuthenticated()) {
    request.post(url, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var parsed = JSON.parse(body);
        console.log("isLoggedIn parsed body: ", parsed);
        student.token = parsed.access_token;  
        student.save(function(err) {
          if (err)
            return next(err);
        });
      }
    });
    return next(null, student);
  }
  res.redirect('/');
}
