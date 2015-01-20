app.controller('MainCtrl', ['$scope', 'courses', 'students', 'token', function($scope, courses, students, token) {
  $scope.courses = courses.courses;
  $scope.student = students.student;
  $scope.token = token.token;

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

  $scope.join = function(course) {
    console.log($scope.token);
    // make POST request to moxtra API to authenticate user, passing in student's unique_id
    // API returns with access token
    // use access token to join Moxtra Chat
  };

  $scope.enroll = function(course) {
    courses.incrementEnrolled(course);
    students.enroll(course);
  };
}])
