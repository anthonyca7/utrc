angular.module('app', [
	'ngRoute',
	'templates.app',
	'templates.common',
	'services.notifications',
	'security.module',
	'interface'
]);

angular.module('app').config([
	'$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$routeProvider
			.when('/', {
				templateUrl: 'main-page.tpl.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	}
]);

angular.module('app').run(['security', function (security) {
	security.requestCurrentUser();
}]);

angular.module('app').controller('MainController', [
	'$scope', 'notifications', 'security', function ($scope, notifications, security) {
		$scope.notifications = notifications;
		$scope.isAuthenticated = security.isAuthenticated;
		$scope.isAdmin = security.isAdmin;

		$scope.removeNotification = function (notification) {
			notifications.remove(notification);
		};

		$scope.$on('$routeChangeError', function (event, current, previous, rejection) {
			notifications.pushForCurrentRoute('There was an error. Please contact the webmaster', 'danger', {}, {rejection: rejection});
		});

	}
]);

angular.module('app').controller('HeaderController', [
	'$scope', '$location', 'security', function ($scope, $location, security) {
		$scope.location = $location;
		$scope.home = function () {
			if (security.isAuthenticated()) {
				$location.path('/');
			}
			else {
				$location.path('/');
			}
		};
	}
]);