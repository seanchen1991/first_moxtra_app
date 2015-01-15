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
    // .state('user', {
    //   url: '/user',
    //   templateUrl: '/user.html',
    //   controller: 'MainCtrl',
    //   resolve: {
    //     userPromise: ['students', function(students) {
    //       return students.getAllCourses();
    //     }]
    //   }
    // })
    // .state('course', {
    //   url: '/course/{id}',
    //   templateUrl: '/course.html',
    //   controller: 'CourseCtrl'
    // });
  $urlRouterProvider.otherwise('home');
}])

