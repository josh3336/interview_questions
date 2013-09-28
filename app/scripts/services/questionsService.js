'use strict';

angular.module('interviewQuestionsApp')
  .service('questionsService', function (angularFire){
		var questionsUrl = 'https://interview-questions.firebaseio.com/questions';
		var questionsRef = new Firebase(questionsUrl);

		this.setModel = function(scope, model){
			angularFire(questionsRef, scope, model);
		};

		this.addItem = function(model,item){
			questionsRef.push(item);
		};

		this.removeAll = function(model,item){
			questionsRef.remove();
		};

		this.deleteItem = function(id){
			var Ref = new Firebase(questionsUrl + '/' + id);
			Ref.remove();
		};
	});