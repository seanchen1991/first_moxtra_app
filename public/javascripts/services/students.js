app.factory('students', ['$http', function($http) {
  var u = {
    student: null
  };
  u.getStudent = function() {
    return $http.get('/login/data').then(function(res) {
      u.student = res.data;
    });
  };
  u.enroll = function(course) {
    return $http.post('/students/' + u.student.username).success(function(data) {
      u.student.courses.push(course);
    });
  };
  return u;
}])
