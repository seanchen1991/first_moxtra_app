var LocalStrategy = require('passport-local').Strategy;
var OAuthStrategy = require('passport-oauth').OAuth2Strategy;
var Student = require('./../models/Student');
var ShortID = require('shortid');

var request = require('request');
var configAuth = require('./auth');

module.exports = function(passport) {
  passport.serializeUser(function(student, done) {
    done(null, student.uniqueID);
  });

  passport.deserializeUser(function(id, done) {
    Student.find({ uniqueID: id }, function(err, student) {
      done(err, student);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, next) {
    process.nextTick(function() {
      Student.findOne({ 'email' : email }, function(err, student) {
        if (err)
          return next(err);
        if (student)
          return next(null, false, req.flash('signupMessage', 'That email already exists in our records.'));
        if (req.body.password !== req.body.confirm) {
          return next(null, false, req.flash('signupMessage', 'Passwords do not match.'));
        } else {
          var newStudent = new Student();
          newStudent.firstname = req.body.first_name;
          newStudent.lastname = req.body.last_name;
          newStudent.email = email;
          newStudent.password = newStudent.generateHash(password);
          newStudent.uniqueID = ShortID.generate();
          newStudent.save(function(err) {
            if (err)
              throw err;
            return next(null, newStudent);
          });
        }
      });
    })
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    Student.findOne({ 'email' : email }, function(err, student) {
      if (err)
        return done(err);
      if (!student)
        return done(null, false, req.flash('loginMessage', 'No student found.'));
      if (!student.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      return done(null, student);
    });
  }));
};
