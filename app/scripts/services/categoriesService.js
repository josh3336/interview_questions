'use strict';

angular.module('interviewQuestionsApp')
	.service('categoriesService',function (angularFire){
		var categoriesUrl = 'https://interview-questions.firebaseio.com/categories';
		var categoriesRef = new Firebase(categoriesUrl);

		this.setModel = function(scope, model){
			angularFire(categoriesRef, scope, model);
		};

		this.addItem = function(model,item){
			categoriesRef.push(item);
		};

		this.removeAll = function(model,item){
			categoriesRef.remove();
		};

		this.deleteItem = function(id){
			var Ref = new Firebase(categoriesUrl + '/' + id);
			Ref.remove();
		};
	});