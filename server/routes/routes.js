var request = require('request');
var CryptoJS = require('crypto-js');

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
  if (req.isAuthenticated()) {

    var clientID = 'mpzVqzEzCIo';
    var clientSecret = 'vvui5RuC9sU';
    var grantType = 'http://www.moxtra.com/auth_uniqueid';
    var uniqueID = req.user._id;
    var timestamp = new Date().getTime();
    var hash = CryptoJS.HmacSHA256(clientID + uniqueID + timestamp, clientSecret);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    var signature = hashInBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
    var url = 'https://api.moxtra.com/oauth/token?client_id='+clientID+'&client_secret='+clientSecret+'&grant_type='+grantType+'&uniqueid='+uniqueID+'&timestamp='+timestamp+'&signature='+signature;
    
    request.post(url, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        req.user.token = body;
      }
    })
    return next();
  }
  res.redirect('/');
}
