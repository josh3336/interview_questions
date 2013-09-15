'use strict';

angular.module('interviewQuestionsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.questions=['wtf','alright'];

    $scope.submit= function(){
      $scope.questions.push(this.quest)
      console.log(this.quest)
    }

  });
