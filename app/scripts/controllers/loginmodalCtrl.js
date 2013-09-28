'use strict';

angular.module('interviewQuestionsApp')
 .controller('loginModalCtrl', function ($scope, $modal, $log) {
 	$scope.$on('loginPopup', function() {
 		$scope.open()
 	});

    $scope.open = function () {
      
      var modalInstance = $modal.open({
        templateUrl: '/views/loginmodal.html',
        controller: LoginInstanceCtrl
      });

      modalInstance.result.then(function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  });

  var LoginInstanceCtrl = function ($rootScope,$scope,$modalInstance,generalService) {
    $scope.categories = generalService.categoriesStrings
    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  };