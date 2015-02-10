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
        }],
        studentPromise: ['students', function(students) {
          return students.getStudent();
        }]
      }
    })
  $urlRouterProvider.otherwise('home');
}])

