'use strict';

angular.module('interviewQuestionsApp')
	.service('categoriesService',function (angularFire){
		var categoriesUrl = 'https://interview-questions.firebaseio.com/categories';
		var categoriesRef = new Firebase(categoriesUrl);
		this.setModel = function(scope, model){
			angularFire(categoriesRef, scope, model);
		};

		this.addItem = function(category,qid){
			categoriesRef.child(category).child(category).set(true);
			categoriesRef.child(category).child('id').set(category);
			categoriesRef.child(category).child('questions').child(qid).set(qid);
		};

		this.removeAll = function(model,item){
			categoriesRef.remove();
		};

		this.deleteItem = function(id){
			var Ref = new Firebase(categoriesUrl + '/' + id);
			Ref.remove();
		};
	});