'use strict';

angular.module('interviewQuestionsApp')
	.directive('insertQuestion',function (){
    return function($scope,element,attrs){
      if($scope.question){
        if($scope.this.question.type === 'JavaScript'){
          element.append("<pre class='prettyprint'>"+$scope.question.question+"</pre>");
          prettyPrint()
        }
        else{
          element.append("<div class='"+$scope.question.type+"prettyprint' >"+$scope.question.question+"</div>");
        }
      }
    };
  })
  .directive('insertCreator',function(){
    return function($scope,element,attrs){
      var creator = $scope.$parent.$parent.users[$scope.question.creator]
      if(creator){
         element.append('By: '+'<a href="'+creator['profile']+'">'+creator['displayName']+'</a>');
      }
    }
  })
  .directive('welcome',function(generalService){
    return function($scope,element,attrs){
      if (!$scope.user){
        element.append('<a href="/auth/facebook"><img src="../img/login-with-facebook.png" width="154" height="22"></a>')
      }  
      else{
        element.append('Welcome: ' + $scope.user.displayName)
      }   
    }
  })