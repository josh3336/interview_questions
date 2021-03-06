'use strict';

angular.module('interviewQuestionsApp')
	.service('answersService',function (angularFire){
		var answersUrl = 'https://interview-questions.firebaseio.com/answers';
		var answersRef = new Firebase(answersUrl);

		this.setModel = function(scope, model){
			angularFire(answersRef, scope, model);
		};

		this.addItem = function(item){
			debugger;
			var id = answersRef.push().name();
			item['id'] = id;
			answersRef.child(id).set(item);	
			return id;	
		};

		this.removeAll = function(item){
			answersRef.remove();
		};

		this.deleteItem = function(id){
			var Ref = new Firebase(answersUrl + '/' + id);
			Ref.remove();
		};
	});