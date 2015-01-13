var LocalStrategy = require('passport-local').Strategy;
var Student = require('./../models/Student');

module.exports = function(passport) {
  passport.serializeUser(function(student, done) {
    done(null, student.id);
  });

  passport.deserializeUser(function(id, done) {
    Student.findById(id, function(err, student) {
      done(err, student);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      Student.findOne({ 'local.email' : email }, function(err, student) {
        if (err)
          return done(err);
        if (student) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          var newStudent = new Student();
          newStudent.local.email = email;
          newStudent.local.password = newStudent.generateHash(password);
          newStudent.save(function(err) {
            if (err)
              throw err;
            return done(null, newStudent);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    Student.findOne({ 'local.email': email }, function(err, student) {
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
