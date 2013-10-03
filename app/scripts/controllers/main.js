'use strict';

angular.module('interviewQuestionsApp')
  .controller('MainCtrl', function ($timeout,$rootScope, $scope, generalService, angularFire, $http, $location, questionsService, usersService, answersService, categoriesService) {

    $scope.categories = {};
    $scope.show = false;
    $scope.buttonstate= false;
    $scope.buttonid = -1;
    $scope.questionsVoted ={};
    $scope.answersVoted = {};
    $scope.categorySelected = undefined;
    $scope.user = generalService.user;
    $scope.usersok = {};
    $scope.users = {};
    $scope.questions = {};
    $scope.testing = false;
    $scope.answers = {};

    $scope.$watch('users',function(){
      if (generalService.user && !jQuery.isEmptyObject($scope.users)){
        if(!$scope.users[generalService.user.id]){
          $scope.users[generalService.user.id] = generalService.user;
        }
        $scope.user = $scope.users[generalService.user.id]
      }
    });

    usersService.setModel($scope, 'users');
    questionsService.setModel($scope, 'questions');
    answersService.setModel($scope, 'answers');
    categoriesService.setModel($scope, 'categories');

    $scope.$watch('categories',function(){
      if(generalService.categoriesStrings.length !== $scope.categories.length  && jQuery.isEmptyObject($scope.categories) != true){
        generalService.categoriesStrings = [];
        for (var key in $scope.categories){
            generalService.categoriesStrings.push(key);
        }
      }
    },true);


    $scope.$watch('users',function(){
      if ($scope.users != undefined){
        generalService.users = $scope.users;
      }
    },true);

    $scope.orderQScore = function(item){
      return $scope.questions[item].score;
    };

    $scope.orderAScore = function(item){
      if($scope.answers[item]){
        return $scope.answers[item].score;
      }
    };

    $scope.questionsArray = function() {
      var key;
      var array = [];
      for(key in this.category.questions) {
        array.push(this.category.questions[key]);
      }
      return array
    };

    $scope.answersArray = function() {
      var key;
      var array = [];
      for(key in $scope.questions[this.question].answers) {
        array.push($scope.questions[this.question].answers[key]);

      }
      return array
    };

    $scope.addScore = function(){
      $scope.questions[this.question].score;
    }
    $scope.submit = function(){
      var quest, indexof, question, qid;
      this.quest = this.quest.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
      this.quest = this.quest.replace(/ /g, '&nbsp;')
      this.quest = this.quest.replace(/\n/g, "<br />")

      var title = generalService.selected;
      quest = this.quest[0].toUpperCase()+this.quest.slice(1);
      question = {"text":quest,"answers" : {'1':'1'},"score" : 0, "creator" : generalService.user.id, "type" : this.type}
      qid = questionsService.addItem(question,title);

    };



    $scope.answerSubmit = function(){
      var answer, answerObj, aid, result;
      result = $scope.loggedIn()
      if(!result){
        return
      }

      answer = generalService.linkify(this.answer);
      // answer = answer.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
      // answer = answer.replace(/ /g, '&nbsp;')
      answer = answer.replace(/\n/g, "<br />")
      answerObj = {'text':answer, 'score':0, 'creator':generalService.user.id}
      aid = answersService.addItem(answerObj)
      if(!this.questions[this.question].answers){
        this.questions[this.question].answers = {};
      }
      this.questions[this.question].answers[aid] = aid

      //delete generic answer
      delete $scope.questions[this.question].answers['default']
      this.answer = '';
    };

    $scope.removeQues = function(){
      questionsService.deleteItem(this.question);
      delete this.category.questions[this.question]
      if (Object.keys(this.category.questions).length === 0){
        delete this.categories[this.category.id];
      }
    };

    $scope.removeAns = function(){
      var index;
      answersService.deleteItem(this.answer)
      delete this.answers[this.answer]
      delete $scope.questions[this.question].answers[this.answer]
    };



    $scope.thumbsup = function(){
      var method, methodA, typeVoted, result, objTypeVoted,user;
      result = $scope.loggedIn();
      if(!result){
        return
      }

      this.hasOwnProperty('question') ? method = 'question' : method = 'answer';
      typeVoted = method + 'sVoted';
      user = addProperty($scope.user, typeVoted);

      if(method === 'answer'){
        changeScoreUp($scope.answers[this.answer], user[typeVoted], this.answer);
      }
      else{
        $scope.quest = this.question;
        changeScoreUp($scope.questions[this.question], user[typeVoted], this.question);
      }
    };

    $scope.thumbsdown = function(){
      var method, methodA, typeVoted, result, objTypeVoted,user;
      result = $scope.loggedIn();
      if(!result){
        return
      }
      this.hasOwnProperty('question') ? method = 'question' : method = 'answer';
      typeVoted = method + 'sVoted';
      user = addProperty($scope.user, typeVoted);

      if(method === 'answer'){
        $scope.answer = this.answer;
        changeScoreDown($scope.answers[this.answer], user[typeVoted], this.answer);
      }
      else{
        $scope.quest = this.question;
        changeScoreDown($scope.questions[this.question], user[typeVoted], this.question);
      }
    };

    var changeScoreUp = function(itemClicked, userVoted, question){
      if(!userVoted[question]){
        userVoted[question] = 1;
        itemClicked.score += 1;
      }
      else if(userVoted[question] === -1){
        itemClicked.score += 2;
        userVoted[question] = 1;
      }
      else if(userVoted[question] === 1){
        delete userVoted[question];
        itemClicked.score += -1
      }

    };

    var changeScoreDown = function(itemClicked, userVoted, question){
        if(!userVoted[question]){
          userVoted[question] = -1;
          itemClicked.score += -1;
        }
        else if(userVoted[question] === 1){
          itemClicked.score += -2;
          userVoted[question] = -1;
        }
        else if(userVoted[question] === -1){
          delete userVoted[question];
          itemClicked.score += 1
        }  
    };

    $scope.toggleShow = function(){
      $scope.show = !$scope.show;
    };

    $scope.checkFirstAnswer = function(){
      if(this.questions[this.question].answers['default']){
        return false;
      }
      return true;
    };

    $scope.loggedIn = function(){
      return generalService.checkUser($rootScope)
    }

    $scope.checkUser = function(){
      var method;
      this.hasOwnProperty('question') ? method = 'question' : method = 'answer';
      if(generalService.user){
        if(generalService.user.id){
          if(this[method+'s'][this[method]]){
            if(this[method+'s'][this[method]].creator === generalService.user.id){
              return true;
            }
          }
        }
      }
      return false;
    };

    $scope.returnState = function(){
      var method, methodA, typeVoted;
      if (this.user){
        if(this.user.questionsVoted){
          return this.user.questionsVoted[this.question];
        }
      }
    };

    $scope.returnStateAnswer = function(){
      var method, methodA, typeVoted;
      if (this.user){
        if(this.user.answersVoted){
          return this.user.answersVoted[this.answer];
        }
      }
    }

    var findIndexAns = function(str,that){
      for(var i = 0; i < that.this.$parent.question.answers.length; i++){
        if (str === that.this.$parent.question.answers[i].text){
          return i;
        }
      }
    };

    var addProperty = function(user, property){
      if (user.hasOwnProperty(property)){
        return user;
      }
      user[property] = {};
      return user;
    }
  });

