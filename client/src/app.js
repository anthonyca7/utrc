angular.module('webinterface', [
	'ngCookies',
	'ngResource', 
	'ngRoute', 
	'ngSanitize'
])
	.config([
		'$routeProvider', 
		'$locationProvider', 
		'$httpProvider',
		function($routeProvider, $locationProvider, $httpProvider) {
			$routeProvider
			.when('/data-interface',{
				templateUrl: 'partials/main'
			})
			.when('/login', {
				templateUrl: 'partials/login',
				controller: 'LoginCtrl'
			});

			$locationProvider.html5Mode(true);

			$httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
		      return {
		        'responseError': function(response) {
		          if(response.status === 401) {
		            $location.path('/login');
		            return $q.reject(response);
		          }
		          else {
		            return $q.reject(response);
		          }
		        }
		      };
		    }]);
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
