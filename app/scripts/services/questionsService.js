'use strict';

angular.module('interviewQuestionsApp')
  .service('questionsService', function ($timeout,angularFire,categoriesService){
		var questionsUrl = 'https://interview-questions.firebaseio.com/questions';
		var questionsRef = new Firebase(questionsUrl);

		this.setModel = function(scope, model){
			angularFire(questionsRef, scope, model);
		};

		this.addItem = function(item,title){
			var questionObj = {}
			var id = questionsRef.push().name();
			item['id'] = id;
			questionsRef.child(id).set(item,function(){
				categoriesService.addItem(title,id)
			});
		};

		this.removeAll = function(item){
			questionsRef.remove();
		};

		this.deleteItem = function(id){
			var Ref = new Firebase(questionsUrl + '/' + id);
			Ref.remove();
		};
	});