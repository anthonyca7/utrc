'use strict';

angular.module('schoolstore')
	.controller('headerController', ['$scope', '$location', 'Auth',
	function($scope, $location, Auth){
	  $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/');
      });
    };

  }]);
    
	