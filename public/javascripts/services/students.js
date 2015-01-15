app.factory('students', ['$http', function($http) {
  var u = {
    student: null
  };
  u.getAllCourses = function() {
    return $http.get('/students/' + student.username).success(function(data) {
      angular.copy(data, u.student.courses);
    })
  };
  u.enroll = function(course) {
    return $http.post('/students/' + student.username).success(function(data) {
      u.student.courses.push(course);
    })
  };
  return u;
}])
