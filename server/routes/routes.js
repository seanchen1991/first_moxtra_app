var request = require('request-promise');
var CryptoJS = require('crypto-js');
var Student = require('./../models/Student');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/auth/moxtra', passport.authenticate('moxtra'));

  app.get('/auth/moxtra/callback', passport.authenticate('moxtra', {
    successRedirect : '/profile',
    failureRedirect : '/',
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
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) 
    return next();
  res.redirect('/');
}

  // app.get('/login', function(req, res) {
  //   res.render('login.ejs', { message: req.flash('loginMessage') });
  // });

  // app.post('/login', passport.authenticate('local-login', {
  //   successRedirect : '/profile',
  //   failureRedirect : '/login',
  //   failureFlash : true
  // }));

  // app.get('/signup', function(req, res) {
  //   res.render('signup.ejs', { message: req.flash('signupMessage') });
  // });

  // app.post('/signup', passport.authenticate('local-signup', {
  //   successRedirect : '/profile',
  //   failureRedirect : '/signup',
  //   failureFlash : true
  // }));
