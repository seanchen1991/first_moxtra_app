var request = require('request-promise');
var CryptoJS = require('crypto-js');
var Student = require('./../models/Student');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }));

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
};

function isLoggedIn(req, res, next) {
  var student = Student.findById(req.user._id);
  var clientID = 'mpzVqzEzCIo';
  var clientSecret = 'vvui5RuC9sU';
  var grantType = 'http://www.moxtra.com/auth_uniqueid';
  var uniqueID = student._id;
  var timestamp = new Date().getTime();
  var hash = CryptoJS.HmacSHA256(clientID + uniqueID + timestamp, clientSecret);
  var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  var signature = hashInBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  var url = 'https://api.moxtra.com/oauth/token?client_id='+clientID+'&client_secret='+clientSecret+'&grant_type='+grantType+'&uniqueid='+uniqueID+'&timestamp='+timestamp+'&signature='+signature;
  
  if (req.isAuthenticated()) {
    if (student.token === undefined) {
      request.post(url, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var parsed = JSON.parse(body);
        student.token = parsed.access_token;
      }
    }).then(student.save(function(err) {
      if (err) throw err;
    }))
    .catch(console.error); 
    }
    return next();
  }
  res.redirect('/');
}

