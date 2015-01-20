var request = require('request');

module.exports = function() {
  request('/login/data', function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var student = body;
      return student;
    }
  })
};

