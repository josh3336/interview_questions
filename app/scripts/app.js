'use strict';

angular.module('interviewQuestionsApp', ['firebase','ui.bootstrap','ngCookies'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
 

// angular.module('interviewQuestionsApp', ['firebase','ngCookies'])
//   .directive('onElement', function(){
//     return function(scope,element){
//       console.log(element);
//     };
//   });
