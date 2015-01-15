app.controller('MainCtrl', ['$scope', 'courses', 'students', function($scope, courses, students) {
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
    students.enroll(course);
    courses.incrementEnrolled(course);
  };
}])
