app.controller('MainCtrl', ['$scope', 'courses', function($scope, courses) {
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

  $scope.incrementEnrolled = function(course) {
    courses.enroll(course);
  };
}])
