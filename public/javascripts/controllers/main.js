app.controller('MainCtrl', ['$scope', '$http', 'courses', function($scope, $http, courses) {
  
  $http.get('/login/data').success(function(data) {
    $scope.user = data;
  })

  $scope.courses = courses.courses;

  $scope.addCourse = function() {
    if (!$scope.title || $scope.title === '') return;
    courses.create({
      title: $scope.title,
      description: $scope.description,
      professor: $scope.professor
    });
    $scope.title = '';
    $scope.description = '';
    $scope.professor = '';
  };

  $scope.enroll = function(course) {
    courses.incrementEnrolled(course);
  };
}])
