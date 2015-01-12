angular.module('firstMoxtraDemo', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        coursePromise: ['courses', function(courses) {
          return courses.getAll();
        }]
      }
    })
    // .state('course', {
    //   url: '/course/{id}',
    //   templateUrl: '/course.html',
    //   controller: 'CourseCtrl'
    // });
  $urlRouterProvider.otherwise('home');
}])

.factory('courses', ['$http', function($http) {
  var o = {
    courses: []
  };
  o.create = function(course) {
    return $http.post('/courses', course).success(function(data) {
      o.courses.push(data);
    });
  };
  o.get = function(id) {
    return $http.get('/courses/' + id).then(function(res) {
      return res.data;
    });
  };
  o.getAll = function() {
    return $http.get('/courses').success(function(data) {
      angular.copy(data, o.courses);
    });
  };
  o.enroll = function(course) {
    return $http.put('/courses/' + course._id + '/enroll')
      .success(function(data) {
        course.enrolled++;
      });
  };
  return o;
}])

.controller('MainCtrl', ['$scope', 'courses', function($scope, courses) {
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

// .controller('CourseCtrl', ['$scope', 'courses', 'course', function($scope, courses, course) {
//   $scope.course = course;
// }])

.directive('tabs', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: function($scope) {
      var panes = $scope.panes = [];

      $scope.select = function(pane) {
        angular.forEach(panes, function(pane) {
          pane.selected = false;
        });
        pane.selected = true;
      };

      this.addPane = function(pane) {
        if (panes.length === 0) {
          $scope.select(pane);
        }
        panes.push(pane);
      };
    },
    templateUrl: 'partials/tabs.ejs'
  };
})

.directive('pane', function() {
  return {
    require: '^tabs',
    restrict: 'E',
    transclude: true,
    scope: {
      title: '@'
    },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addPane(scope);
    },
    templateUrl: 'partials/pane.ejs'
  };
});

