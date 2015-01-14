app.factory('students', ['$http', function($http) {
  var u = {
    student: null
  };
  u.login = function(student) {
    return $http.get('/students/' + student.username).success(function(data) {
      u.student = data;
    })
  };
  u.logout = function() {
    u.student = null;
  };
  return u;
}])
