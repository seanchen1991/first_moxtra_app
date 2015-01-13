app.controller('UserCtrl', ['$scope', 'userCourses', function($scope, userCourses) {
  $scope.userCourses = userCourses.courses;
}])
