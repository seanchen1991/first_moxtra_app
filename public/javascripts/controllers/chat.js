app.controller('ChatCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
  
  $scope.items = ['item1', 'item2', 'item3'];

  $scope.join = function() {
    var chatInstance = $modal.open({
      templateUrl: 'chat.html',
      controller: 'ChatInstanceCtrl',
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });

    chatInstance.result.then(function(selectedItem) {
      $scope.selected = selectedItem;
    }, function() {
      $log.info('Chat dismissed at: ' + new Date());
    });
  }
}])

.controller('ChatInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
  
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function() {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

}])
