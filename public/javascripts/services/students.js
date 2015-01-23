app.factory('students', ['$http', function($http) {
  var u = {
    student: null
  };
  u.getStudent = function() {
    return $http.get('/login/data').then(function(res) {
      u.student = res.data;
    });
  };
  u.getToken = function() {
    return $http.get('/students/' + u.student.username + '/token').success(function(data) {
      u.student.token = data.access_token;
    })
  };
  u.enroll = function(course) {
    return $http.post('/students/' + u.student.username + '/enroll', course).success(function(data) {
      u.student.courses.push(data);
    });
  };
  return u;
}])
