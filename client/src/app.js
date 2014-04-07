angular.module('webinterface', [
	'ngCookies',
	'ngResource', 
	'ngRoute', 
])
	.config([
		'$routeProvider', 
		'$locationProvider', 
		function($routeProvider, $locationProvider) {
			$routeProvider
			.when('/data-interface',{
				templateUrl: 'partials/main'
			})
			.when('/login', {
				templateUrl: 'partials/login',
				controller: 'LoginCtrl'
			});

			$locationProvider.html5Mode(true);
	}])
	.run([
		'$rootScope',
		'$location', 
		'Auth',
		function ($rootScope, $location, Auth) {

	    $rootScope.$on('$routeChangeStart', function (event, next) {
	      
	      if (next.authenticate && !Auth.isLoggedIn()) {
	        $location.path('/login');
	      }
	    });
  	}]);
