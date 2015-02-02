var LocalStrategy = require('passport-local').Strategy;
var OAuthStrategy = require('passport-oauth').OAuth2Strategy;
var Student = require('./../models/Student');

var request = require('request-promise');
var configAuth = require('./auth');

module.exports = function(passport) {
  passport.serializeUser(function(student, done) {
    done(null, student.uniqueID);
  });

  passport.deserializeUser(function(id, done) {
    Student.findById(id, function(err, student) {
      done(err, student);
    });
  });

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

  passport.use('moxtra', new OAuthStrategy({
    authorizationURL: 'https://api.moxtra.com/oauth/authorize',
    tokenURL: 'https://api.moxtra.com/oauth/token',
    clientID: configAuth.moxtraAuth.clientID,
    clientSecret: configAuth.moxtraAuth.clientSecret,
    callbackURL: configAuth.moxtraAuth.callbackURL
  },
  function(accessToken, done) {
    console.log("Access token: ", accessToken);
    var url = 'https://api.moxtra.com/me?access_token=' + accessToken;
    request.get(url, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        console.log("Response body: ", body);
      }
    });
      // Student.findOne({ 'uniqueID' : body.id }, function(err, student) {
      //   if (err)
      //     return done(err)
      //   if (student) {
      //     return done(null, student);
      //   } else {
      //     var newStudent = new Student();
      //     newStudent.name = body.name;
      //     newStudent.uniqueID = body.id;
      //     newStudent.email = body.email;
      //     newStudent.save(function(err) {
      //       if (err)
      //         throw err;
      //       return done(null, newStudent);
      //     });
      //   }
      // });
  }));
};
