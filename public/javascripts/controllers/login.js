app.controller('loginCtrl', ['$scope', 'students', function($scope, students) {
  $scope.login = function(student) {
    students.login(student);
  }
}])
