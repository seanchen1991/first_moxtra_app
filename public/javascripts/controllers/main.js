app.controller('MainCtrl', ['$scope', 'courses', 'students', function($scope, courses, students) {
  
  $scope.courses = courses.courses;
  $scope.student = students.student;

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
    students.enroll(course);
  };

  $scope.join = function(course) {
    courses.join(course);
  };
}])
