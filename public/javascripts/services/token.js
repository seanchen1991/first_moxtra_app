app.factory('token', ['$http', 'students', function($http, students) {
  var token;
  var client_id = 'mpzVqzEzCIo';
  var client_secret = 'vvui5RuC9sU';
  var unique_id = students.student._id;
  var timestamp = new Date().getTime();
  var hash = CryptoJS.HmacSHA256(client_id + unique_id + timestamp, client_secret);
  var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  var signature = hashInBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');

  var getToken = function() {
    var params = {
      clientID: client_id,
      clientSecret: client_secret,
      uniqueID: unique_id,
      timestamp: timestamp,
      signature: signature, 
    };

    $http.post('https://api.moxtra.com/oauth/token', { params: params }).success(function(data) {
      token = data;
    });
  }();
  console.log(token);
  return token;
}])
