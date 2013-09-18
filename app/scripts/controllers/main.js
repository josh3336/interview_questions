'use strict';

angular.module('interviewQuestionsApp')
  .controller('MainCtrl', function ($scope, angularFire, $cookies, $cookieStore) {
    $scope.questions=[];
    $scope.show = false;
    $scope.$cookieStore = $cookieStore;
    $scope.buttonstate= false;
    $scope.buttonid = -1;
    $scope.questionsVoted ={};

    if(!$cookieStore.get('myId')){
      //$cookieStore.put('myId',Math.ceil(Math.random()*100000000));
      $cookieStore.put('myId',5);
    }
    $scope.user = $cookieStore.get('myId');

    var myData = new Firebase('https://interview-questions.firebaseio.com/');
    console.log('mydata: ', myData);

    $scope.submit = function(){
      var quest;
      quest = this.quest[0].toUpperCase()+this.quest.slice(1);
      for(var i = 0; i < $scope.questions.length; i++){
        console.log(quest, $scope.questions[i].question);
        if($scope.questions[i].question === quest){
          return;
        }
      }
      $scope.questions.push({"question":quest,"answers":[{text:'Be the first to answer!'}],"score":0, "creator": $scope.$cookieStore.get('myId')});
    };

    $scope.answerdown = function(){
      this.answer.score -= 1;
    };

    $scope.answerup = function(){
      this.answer.score += 1; 
    };

    $scope.answerSubmit = function(){
     //var answer = replaceURLWithHTMLLinks(this.answer);
      var answer = linkify(this.answer);
      this.question.answers.push({'text':answer, 'score':0, 'creator': $scope.$cookieStore.get('myId')});
      if (this.question.answers[0].text === "Be the first to answer!" ){
        this.question.answers.splice(0,1);
      }
    };

    $scope.remove = function(){
      var index;
      index = findIndex(this.question.question);
      $scope.questions.splice(index,1);
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
      var method;
      if($scope.questionsVoted[this.question.question] === 1){
        $scope.questionsVoted[this.question.question] = -1;
      }
      else{
        $scope.questionsVoted[this.question.question] = 1;
      }
      this.hasOwnProperty('question') ? method = 'question' : method = 'answer';
      this[method].score += $scope.questionsVoted[this.question.question];
      
    };

    $scope.thumbsdown = function(){
      var method;
      if($scope.questionsVoted[this.question.question] === 1){
        $scope.questionsVoted[this.question.question] = -2;
      }
      else{
        $scope.questionsVoted[this.question.question] = -1;
      }
      this.hasOwnProperty('question') ? method = 'question' : method = 'answer';
      console.log("METHOD",method);
      this[method].score  += $scope.questionsVoted[this.question.question];
    };

    $scope.toggleShow = function(){
      $scope.show = !$scope.show;
    };

    $scope.checkUser = function(){
      if(this.question.creator === $scope.user){
        return true;
      }
      return false;
    };

    $scope.returnState = function(){
      //console.log('gangsta',this);
      //console.log('what is the state',this.state)
      if ($scope.questionsVoted[this.question.question]){
        if ($scope.questionsVoted[this.question.question] === -2){
          return -1;
        }
        return $scope.questionsVoted[this.question.question];
      }
    };

    var findIndex = function (str){
      for (var i = 0; i < $scope.questions.length; i++){
        if ($scope.questions[i].question === str ){
          return i;
        }
      }
    };

    var linkify = function(inputText) {
      var replacedText, replacePattern1, replacePattern2, replacePattern3;

      //URLs starting with http://, https://, or ftp://
      replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

      //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

      //Change email addresses to mailto:: links.
      replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
      replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

      return replacedText;
    };

    var findIndexAns = function(str,that){
      for(var i = 0; i < that.this.$parent.question.answers.length; i++){
        if (str === that.this.$parent.question.answers[i].text){
          return i;
        }
      }
    };

    angularFire(myData, $scope, "questions");
  });
