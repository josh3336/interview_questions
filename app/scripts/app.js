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
  })
  .run(function (generalService){
    generalService;
  });