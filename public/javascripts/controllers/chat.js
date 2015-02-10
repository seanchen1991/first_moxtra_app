app.controller('ChatCtrl', ['$scope', '$modal', function($scope, $modal) {

  $scope.join = function(course) {
    var chatInstance = $modal.open({
      templateUrl: 'chat.html',
      controller: 'ChatInstanceCtrl',
      windowClass: 'app-modal-window',
      size: 'lg',
      resolve: {
        chatPromise: ['courses', function(courses) {
          courses.join(course);
        }]
      }
    });
    chatInstance.result.then(
      function(result) {
        var a = result;
      },
      function(result) {
        var a = result;
      }
    );
  };
}])

.controller('ChatInstanceCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
  $scope.close = function() {
    $modalInstance.close('close');
  };
}])
