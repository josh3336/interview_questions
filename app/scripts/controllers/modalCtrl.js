'use strict';

angular.module('interviewQuestionsApp')
 .controller('ModalCtrl', function ($scope, $modal, $log) {

    $scope.open = function () {

      var modalInstance = $modal.open({
        templateUrl: '/views/modalans.html',
        controller: ModalInstanceCtrl
      });

      modalInstance.result.then(function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  });

  var ModalInstanceCtrl = function ($rootScope,$scope,$modalInstance,generalService) {
    $scope.categories = generalService.categoriesStrings
    $scope.ok = function () {
      var that = this;
      generalService.selected = this.selected;
      $rootScope.$broadcast('modalevent', that);
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  };