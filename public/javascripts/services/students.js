app.factory('students', ['$http', function($http) {
  var u = {
    student: null
  };
  u.getStudent = function() {
    return $http.get('/login/data').success(function(data) {
      u.student = data;
    });
  };
  u.enroll = function(course) {
    return $http.post('/students/' + u.student.uniqueID + '/enroll', course).success(function(data) {
      u.student.courses.push(data);
    });
  };
  return u;
}])
