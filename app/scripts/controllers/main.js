'use strict';

angular.module('interviewQuestionsApp')
  .controller('MainCtrl', function ($scope, angularFire) {
    $scope.questions=[];
    $scope.show = false;


    var myData = new Firebase('https://interview-questions.firebaseio.com/');
    console.log('mydata: ', myData);

    $scope.submit = function(){
      var quest
      quest = this.quest[0].toUpperCase()+this.quest.slice(1)
      $scope.questions.push({"question":quest,"answers":[{text:'Be the first to answer!'}],"score":0});
    };

    $scope.answerdown = function(){
      console.log(this);
      this.answer.score -= 1;
    }

    $scope.answerup = function(){
      this.answer.score += 1; 
    }

    $scope.answerSubmit = function(){
     //var answer = replaceURLWithHTMLLinks(this.answer);
      var answer = linkify(this.answer);
      console.log('answer',answer);
      this.question.answers.push({'text':answer, 'score':0});
      console.log(this.question.answers[0].text);
      if (this.question.answers[0].text === "Be the first to answer!" ){
        this.question.answers.splice(0,1);
      };
    }

    $scope.remove = function(){
      var index;
      console.log('deleting');
      console.log(this.$index);
      console.log(this.question);
      console.log('doing',arguments);
      index = findIndex(this.question.question);
      console.log('INDEX',index);
      console.log($scope.questions);
      $scope.questions.splice(index,1);
    };

    $scope.thumbsup = function(){
      var method;
      console.log(this);
      this.hasOwnProperty('question') ? method = 'question' : method = 'answer';
      console.log("METHOD",method);
      console.log(this.$index);
      this[method].score += 1;
      
    };

    $scope.toggleShow = function(){
      $scope.show = !$scope.show;
    }


    $scope.thumbsdown = function(){
      var method;
      this.hasOwnProperty('question') ? method = 'question' : method = 'answer';
      console.log("METHOD",method);
      this[method].score  -= 1;
    };

    function replaceURLWithHTMLLinks(text){
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      return text.replace(exp,"<a href='$1'>$1</a>"); 
    };

    var findIndex = function (str){
      for (var i = 0; i < $scope.questions.length; i++){
        if ($scope.questions[i].question === str ){
          return i;
        }
      }
    };

    function linkify(inputText) {
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
  }

    angularFire(myData, $scope, "questions");
  });
