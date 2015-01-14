var app = angular.module('firstMoxtraDemo', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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
    .state('user', {
      url: '/user',
      templateUrl: '/user.html',
      controller: 'UserCtrl',
      resolve: {
        userPromise: ['userCourses', function(userCourses) {
          return userCourses.getAll();
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

