'use strict';

angular.module('interviewQuestionsApp')
  .controller('MainCtrl', function ($rootScope, $scope, generalService, angularFire, $http, $location, questionsService, usersService) {

    $scope.categories = {};
    $scope.show = false;
    $scope.buttonstate= false;
    $scope.buttonid = -1;
    $scope.questionsVoted ={};
    $scope.answersVoted = {};
    $scope.categorySelected = undefined;
    $scope.user = generalService.user;
    // $scope.$watch( function () { return generalService.user; }, function ( user ) {
    //   // handle it here. e.g.:
    //   $scope.user = user;
    // });

    var myData = new Firebase('https://interview-questions.firebaseio.com/');
    var users = new Firebase('https://interview-questions.firebaseio.com/users');
   
    questionsService.setModel($scope, 'questions');
    usersService.setModel($scope, 'users');
    debugger;


    $scope.q={'user':'13414',
            'content':'k;adslfjaljsdfkjsalkjasasd',
          }
    questionsService.addItem('questions',$scope.q)

    $scope.$on('modalevent', function(event, that){
      $scope.submit.apply(that);
    });

    $scope.$watch('categories',function(){
      debugger;
      if(generalService.categoriesStrings.length !== $scope.categories.length  && $scope.categories.length != 0){
        generalService.categoriesStrings = [];
        for (var key in $scope.categories){
          if($scope.categories[key].hasOwnProperty('title')){
            generalService.categoriesStrings.push($scope.categories[key].title);
          }
        }
      }
    },true);

    $scope.$watch('users',function(){
      if ($scope.users != undefined){
        generalService.users = $scope.users;
        generalService.getUser($scope);
      }
    },true);

  // $scope.$watch( function () { return generalService.user; }, function (user) {
  //   debugger;
  //   $scope.user = user
  //   if(!$scope.$$phase) {
  //     $scope.$apply()
  //   }
  // }, true);


    $scope.submit = function(){
      var quest, indexof;
      this.quest = this.quest.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
      this.quest = this.quest.replace(/ /g, '&nbsp;')
      this.quest = this.quest.replace(/\n/g, "<br />")

      debugger;

      var id = questions.push().name();
      $scope.questions = {}


      var title = generalService.selected;
      quest = this.quest[0].toUpperCase()+this.quest.slice(1);
      for(var i = 0; i < $scope.categories.length; i++){
        if ($scope.categories[i].title.toLowerCase() === title.toLowerCase()){
          indexof=i;
          break;
        }
      }
      if (indexof != undefined){
        for(var i = 0; i < $scope.categories[indexof].questions.length; i++){
          if($scope.categories[indexof].questions.length){
            if($scope.categories[indexof].questions[i].question === quest){
              return;
            }
          }
        }
        $scope.categories[indexof].questions.push({"question":quest,"answers" : [{text :'Be the first to answer!'}],"score" : 0, "creator" : generalService.user.id, "type" : this.type});
      }
      else{
        $scope.categories[$scope.categories.length]={'title': title,'questions':['other']};
        $scope.categories[$scope.categories.length].questions.push({"question" : quest, "answers" : [{text:'Be the first to answer!'}], "score" : 0, "creator" : generalService.user.id, "type":this.type});
        $scope.categories[$scope.categories.length].questions.splice(0,1)
        $scope.categories.length += 1;
      }
    };

    $scope.answerdown = function(){
      this.answer.score -= 1;
    };

    $scope.answerup = function(){
      this.answer.score += 1; 
    };

    $scope.answerSubmit = function(){
      var answer = generalService.linkify(this.answer);
      this.question.answers.push({'text':answer, 'score':0, 'creator':generalService.user.id});
      if (this.question.answers[0].text === "Be the first to answer!" ){
        this.question.answers.splice(0,1);
      }
    };

    $scope.removeQues = function(){
      var index,questionsArr;
      debugger;
      if (this.$parent.category.questions.length === 1){
        for(var key in $scope.categories) {
          if ($scope.categories[key].title){
            if ($scope.categories[key].title === this.$parent.category.title){
              delete $scope.categories[key]
              $scope.categories.length +=1;
              return;
            }
          }
        }
      }
      else{
        questionsArr = this.$parent.category.questions;
        for (var i = 0; i < questionsArr.length; i++) {
          if(questionsArr[i].question === this.question.question){
            questionsArr.splice(i,1)
          }
        }
      }
    };

    $scope.removeAns = function(){
      var index;
      if (this.this.$parent.question.answers.length === 1){
        this.this.$parent.question.answers.unshift({text:'Be the first to answer!'});
      }
      index = findIndexAns(this.answer.text,this);
      this.this.$parent.question.answers.splice(index,1);
    };

    $scope.thumbsup = function(){
      var method, methodA, typeVoted, result
      result = $scope.loggedIn()
      if(!result){
        return
      }

      this.hasOwnProperty('question') ? method = 'question' : method = 'answer';
      if (method === 'question'){ methodA = 'question'; }
      else { methodA = 'text'; }
      typeVoted = method + 'sVoted';
      if ($scope[typeVoted][this[method][methodA]] === 1){
        this[method].score += -1;
        $scope[typeVoted][this[method][methodA]] = 0;
      }
      else if($scope[typeVoted][this[method][methodA]] === -1){
        this[method].score += 2;
        $scope[typeVoted][this[method][methodA]] = 1;
      }
      else{
        $scope[typeVoted][this[method][methodA]] = 1;
        this[method].score += $scope[typeVoted][this[method][methodA]];
        debugger;
      }
    };

    $scope.thumbsdown = function(){
      var method, methodA, typeVoted,result;
      result = $scope.loggedIn()
      if(!result){
        return
      }
      this.hasOwnProperty('question') ? method = 'question' : method = 'answer';
      if (method === 'question'){ methodA = 'question'; }
      else { methodA = 'text'; }
      typeVoted = method + 'sVoted';
      if($scope[typeVoted][this[method][methodA]] === -1){
        this[method].score += 1;
        $scope[typeVoted][this[method][methodA]] = 0;
       // $scope.users[generalService.user].[typeVoted+'Voted']['0'] = this[method];
      }
      else if($scope[typeVoted][this[method][methodA]] === 1){
        this[method].score += -2;
        $scope[typeVoted][this[method][methodA]] = -1;
      }
      else{
        $scope[typeVoted][this[method][methodA]] = -1;
        this[method].score += $scope[typeVoted][this[method][methodA]];
      }
    };

    $scope.toggleShow = function(){
      $scope.show = !$scope.show;
    };

    $scope.checkFirstAnswer = function(){
      if(this.answer.text === 'Be the first to answer!'){
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
          if(this[method].creator === generalService.user.id){
            return true;
          }
        }
      }
      return false;
    };

    $scope.returnState = function(){
      var method, methodA, typeVoted;
      this.hasOwnProperty('question') ? method = 'question'  : method = 'answer';
      if (method === 'question'){ methodA = 'question'; }
      else { methodA = 'text';}
      typeVoted = method + 'sVoted';

      if ($scope[typeVoted][this[method][methodA]]){
        if ($scope[typeVoted][this[method][methodA]] === -2){
          return -1;
        }
        return $scope[typeVoted][this[method][methodA]];
      }
    };

    // var findIndexQs = function(model){
    //   for (var key in model){
    //     if categories.hasOwnProperty.title
    //   }
    // }

    var findIndexAns = function(str,that){
      for(var i = 0; i < that.this.$parent.question.answers.length; i++){
        if (str === that.this.$parent.question.answers[i].text){
          return i;
        }
      }
    };

    angularFire(myData, $scope, "categories");
    angularFire(users, $scope, "users");

    $scope.users = $scope.categories['users']
    generalService.getUser($scope);

  });

