var LocalStrategy = require('passport-local').Strategy;
var OAuthStrategy = require('passport-oauth').OAuth2Strategy;
var Student = require('./../models/Student');

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

  passport.use('moxtra', new OAuthStrategy({
    authorizationURL: configAuth.moxtraAuth.authorizationURL,
    tokenURL: configAuth.moxtraAuth.tokenURL,
    clientID: configAuth.moxtraAuth.clientID,
    clientSecret: configAuth.moxtraAuth.clientSecret,
    callbackURL: configAuth.moxtraAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    request.get(configAuth.moxtraAuth.userURL + accessToken, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var parsed = JSON.parse(body);
        Student.findOne({ 'uniqueID' : parsed.data.id }, function(err, student) {
          if (err)
            return done(err)
          if (student) {
            return done(null, student);
          } else {
            var newStudent = new Student();
            newStudent.name = parsed.data.name;
            newStudent.uniqueID = parsed.data.id;
            newStudent.email = parsed.data.email;
            newStudent.token = accessToken;
            newStudent.save(function(err) {
              if (err)
                throw err;
              return done(null, newStudent);
            });
          }
        });
      }
    });
  }));

  // passport.use('local-signup', new LocalStrategy({
  //   usernameField: 'username',
  //   passwordField: 'password',
  //   passReqToCallback: true
  // },
  // function(req, username, password, next) {
  //   process.nextTick(function() {
  //     Student.findOne({ 'username' : username }, function(err, student) {
  //       if (err)
  //         return next(err);
  //       if (student) {
  //         return next(null, false, req.flash('signupMessage', 'That username is already taken.'));
  //       } else {
  //         var newStudent = new Student();
  //         newStudent.username = username;
  //         newStudent.password = newStudent.generateHash(password);
  //         newStudent.save(function(err) {
  //           if (err)
  //             throw err;
  //           return next(null, newStudent);
  //         });
  //       }
  //     });
  //   })
  // }));

  // passport.use('local-login', new LocalStrategy({
  //   usernameField: 'username',
  //   passwordField: 'password',
  //   passReqToCallback: true
  // },
  // function(req, username, password, done) {
  //   Student.findOne({ 'username' : username }, function(err, student) {
  //     if (err)
  //       return done(err);
  //     if (!student)
  //       return done(null, false, req.flash('loginMessage', 'No student found.'));
  //     if (!student.validPassword(password))
  //       return done(null, false, req.flash('loginMessage', 'Wrong password.'));
  //     return done(null, student);
  //   });
  // }));
};
