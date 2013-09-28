'use strict';

angular.module('interviewQuestionsApp')
	.service('usersService',function (angularFire){
		var usersUrl = 'https://interview-questions.firebaseio.com/users';
		var usersRef = new Firebase(usersUrl);

		this.setModel = function(scope, model){
			angularFire(usersRef, scope, model);
		};

		this.addItem = function(model,item){
			usersRef.push(item);
		};

		this.removeAll = function(model,item){
			usersRef.remove();
		};

		this.addQVoted = function(userid,qid)
			var Ref = new Firebase(usersUrl + '/' + userid '/qvoted');
			Ref.push({qid:true})

		this.addAVoted = function(userid,aid)
			var Ref = new Firebase(usersUrl + '/' + qid '/avoted');
			Ref.push({qid:true})

		this.deleteItem = function(id){
			var Ref = new Firebase(usersUrl + '/' + id);
			Ref.remove();
		};
	});