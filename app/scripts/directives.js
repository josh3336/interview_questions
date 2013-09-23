'use strict';

angular.module('interviewQuestionsApp')
	.directive('insertQuestion',function(){
    return function($scope,element,attrs){
      if($scope.this.question.type === 'JavaScript'){
        element.append("<pre class='prettyprint'>"+$scope.question.question+"</pre>");
        prettyPrint()
      }
      else{
        element.append("<div class='"+$scope.question.type+"prettyprint' >"+$scope.question.question+"</div>");
      }
    };
  });