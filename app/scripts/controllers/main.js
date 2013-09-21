'use strict';

angular.module('interviewQuestionsApp')
  .controller('MainCtrl', function ($scope, generalService, angularFire, $cookies, $cookieStore) {
    $scope.categories = [];
    $scope.show = false;
    $scope.$cookieStore = $cookieStore;
    $scope.buttonstate= false;
    $scope.buttonid = -1;
    $scope.questionsVoted ={};
    $scope.answersVoted = {};
    $scope.categorySelected = undefined;

    $scope.$on('modalevent', function(event, that){
      $scope.submit.apply(that);
    });

    $scope.$watch('categories',function(){
      if(generalService.categoriesStrings.length !== $scope.categories.length){
        generalService.categoriesStrings = [];
        for (var i = 0; i < $scope.categories.length; i++){
          generalService.categoriesStrings.push($scope.categories[i].title);
        }
      }
    },true);


    if(!$cookieStore.get('myId')){
      $cookieStore.put('myId',Math.ceil(Math.random()*100000000));
    }
    $scope.user = $cookieStore.get('myId');

    var myData = new Firebase('https://interview-questions.firebaseio.com/');
    console.log('mydata: ', myData);

    $scope.submit = function(){
      var quest, indexof;
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
        $scope.categories[indexof].questions.push({"question":quest,"answers":[{text:'Be the first to answer!'}],"score":0, "creator": $scope.$cookieStore.get('myId')});
      }
      else{
        $scope.categories.push({'title': title,'questions':['other']});
        $scope.categories[$scope.categories.length-1].questions.push({"question":quest,"answers":[{text:'Be the first to answer!'}],"score":0, "creator": $scope.$cookieStore.get('myId')});
        $scope.categories[$scope.categories.length-1].questions.splice(0,1)
      }
    };

    $scope.answerdown = function(){
      this.answer.score -= 1;
    };

    $scope.answerup = function(){
      this.answer.score += 1; 
    };

    $scope.answerSubmit = function(){
     //var answer = replaceURLWithHTMLLinks(this.answer);
      var answer = generalService.linkify(this.answer);
      this.question.answers.push({'text':answer, 'score':0, 'creator': $scope.$cookieStore.get('myId')});
      if (this.question.answers[0].text === "Be the first to answer!" ){
        this.question.answers.splice(0,1);
      }
    };

    $scope.removeQues = function(){
      var index,questionsArr;
      debugger
      if (this.$parent.category.questions.length === 1){
        for(var i = 0 ; i < $scope.categories.length; i++) {
          if ($scope.categories[i].title === this.$parent.category.title){
            $scope.categories.splice(i,1);
            return;
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
      var method, methodA, typeVoted;
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
      }
    };

    $scope.thumbsdown = function(){
      var method, methodA, typeVoted;
      this.hasOwnProperty('question') ? method = 'question' : method = 'answer';
      if (method === 'question'){ methodA = 'question'; }
      else { methodA = 'text'; }
      typeVoted = method + 'sVoted';
      if($scope[typeVoted][this[method][methodA]] === -1){
        this[method].score += 1;
        $scope[typeVoted][this[method][methodA]] = 0;
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

    $scope.checkUser = function(){
      var method;
      this.hasOwnProperty('question') ? method = 'question' : method = 'answer';
      if(this[method].creator === $scope.user){
        return true;
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

    var findIndex = function (str){
      for (var i = 0; i < $scope.questions.length; i++){
        if ($scope.questions[i].question === str ){
          return i;
        }
      }
    };

    var findIndexAns = function(str,that){
      for(var i = 0; i < that.this.$parent.question.answers.length; i++){
        if (str === that.this.$parent.question.answers[i].text){
          return i;
        }
      }
    };

    angularFire(myData, $scope, "categories");
  });
