app.controller('MainCtrl', ['$scope', '$http', 'courses', 'students', function($scope, $http, courses, students) {
  
  $http.get('/login/data').success(function(data) {
    $scope.user = data;
  })

  students.student = $scope.user;
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
