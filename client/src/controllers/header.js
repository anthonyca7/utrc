'use strict';

angular.module('webinterface')
	.controller('headerController', ['$scope', '$location', 'Auth',
	function($scope, $location, Auth){
	  $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/');
      });
    };

  }]);
    
	