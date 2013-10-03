'use strict';

angular.module('interviewQuestionsApp')
 .controller('ModalCtrl', function ($rootScope, generalService, $scope, $modal, $log) {

    $scope.open = function () {
      var result
      result = $scope.loggedIn()
      if(!result){
        return
      }
      var modalInstance = $modal.open({
        templateUrl: '/views/modalans.html',
        controller: ModalInstanceCtrl
      });

      modalInstance.result.then(function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    $scope.loggedIn = function(){
      return generalService.checkUser($rootScope)
    }
  });

  var ModalInstanceCtrl = function ($timeout,angularFire,$rootScope,$scope,$modalInstance,generalService,questionsService,categoriesService) {
    $scope.categories = generalService.categoriesStrings
    $scope.ok = function () {
      var quest, indexof, question, qid;
      this.quest = this.quest.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
      this.quest = this.quest.replace(/ /g, '&nbsp;')
      this.quest = this.quest.replace(/\n/g, "<br />")

      var title = this.selected;
      quest = this.quest[0].toUpperCase()+this.quest.slice(1);
      question = {"text":quest,"answers" : {default:'default'},"score" : 0, "creator" : generalService.user.id, "type" : this.type}
      questionsService.addItem(question,title);

      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  };