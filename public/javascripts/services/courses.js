app.factory('courses', ['$http', function($http) {
  var o = {
    courses: []
  };
  o.create = function(course) {
    return $http.post('/courses', course).success(function(data) {
      o.courses.push(data);
    });
  };
  o.get = function(id) {
    return $http.get('/courses/' + id).then(function(res) {
      return res.data;
    });
  };
  o.getAll = function() {
    return $http.get('/courses').success(function(data) {
      angular.copy(data, o.courses);
    });
  };
  o.enroll = function(course) {
    return $http.put('/courses/' + course._id + '/enroll')
      .success(function(data) {
        course.enrolled++;
      });
  };
  return o;
}])