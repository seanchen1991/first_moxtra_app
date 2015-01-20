var request = require('request');
var CryptoJS = require('crypto-js');

var student = require('./getStudent.js');

var clientID = 'mpzVqzEzCIo';
var clientSecret = 'vvui5RuC9sU';
var grantType = 'http://www.moxtra.com/auth_uniqueid';
var uniqueID = student._id;
var timestamp = new Date().getTime();
var hash = CryptoJS.HmacSHA256(clientID + uniqueID + timestamp, clientSecret);
var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
var signature = hashInBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
var url = 'https://api.moxtra.com/oauth/token?client_id='+clientID+'&client_secret='+clientSecret+'&grant_type='+grantType+'&uniqueid='+uniqueID+'&timestamp='+timestamp+'&signature='+signature;

request.post(url, function(err, response, body) {
  if (!err && response.statusCode == 200) {
    console.log(body);
  }
})

