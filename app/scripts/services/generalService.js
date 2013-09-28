'use strict';

angular.module('interviewQuestionsApp')
	.service('generalService', function ($cookieStore,$http){
    this.categoriesStrings = [];
    this.selected = undefined;
    this.user = undefined;
    this.users = undefined;

    this.linkify = function(inputText){
      var replacedText, replacePattern1, replacePattern2, replacePattern3;
      replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
      replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
      replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
      return replacedText;
    };

    this.checkUser = function(rootScope){
      if (this.user){
        return true;
      }
      else{
        rootScope.$broadcast('loginPopup');
        return false;
      }

    };

    this.getUser = function(scope){
      if (!this.user){
        var that = this;

        $http.get('/getuser').success(function(data){
          if(data){
            if(scope.users){
              if(!(scope.users[data.id])){
                that.user = data
                that.user['questionsVoted'] = {};
                that.user['answersVoted'] = {};
                scope.user = that.user
                scope.users[that.user.id] = that.user;
              }
              that.user = scope.users[data.id]
            }
          }
        });
      }
      return this.user
    }
  });