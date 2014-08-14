angular.module('modal.criteria',[]).controller('CriteriaController',
  ['$scope', '$modalInstance', 'field', 'type', function ($scope, $modalInstance, field, type) {
	  $scope.type = type;
    $scope.field = field;
    $scope.search = {};


    $scope.submit = function () {
      var search, greater, less;
      greater = $scope.search.greater;
      less = $scope.search.less;

      if (greater) {
        search = greater + "<";
        search = (less) ? search + ">" + less : search;
      }
      else if (less) {
        search = less + ">";
      }

      $modalInstance.close(search);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);