'use strict';

angular.module('interviewQuestionsApp')
	.directive('insertQuestion', function (){
    return function($scope,element,attrs){
      var question = $scope.$parent.$parent.questions[$scope.question]
      if (question){
        if(question.type === 'JavaScript'){
          element.append("<pre class='prettyprint'>"+question.text+"</pre>");
          prettyPrint()
        }
        else{
          element.append("<div class='"+$scope.question.type+"prettyprint' >"+question.text+"</div>");
        }
      }
    };
  })
  .directive('insertCreator', function(){
    return function($scope,element,attrs){
      var creatorId = $scope.questions[$scope.question].creator
      var creator = $scope.$parent.$parent.users[creatorId]
      if(creator){
         element.append('By: '+'<a href="'+creator['profile']+'">'+creator['displayName']+'</a>');
      }
    }
  })
  .directive('welcome',function (generalService){
    return function($scope,element,attrs){
      if (!$scope.user){
        element.append('<a href="/auth/facebook"><img src="../img/login-with-facebook.png" width="154" height="22"></a>')
      }  
      else{
        element.append('Welcome: ' + $scope.user.displayName)
      }   
    }
  })