angular.module('services.exceptionHandler', ['services.notifications']);

angular.module('services.exceptionHandler').factory('exceptionHandlerFactory', [
	'$injector', function ($injector) {
		return function ($delegate) {

			return function (exception, cause) {
				var notications = $injector.get('notifications');

				$delegate(exception, cause);

				notications.pushForCurrentRoute('There was an error', 'error', {}, {
					exception: exception,
					cause: cause
				});
			};
		};
	}
]);

angular.module('services.exceptionHandler').config([
	'$provide', function ($provide) {
		$provide.decorator('$exceptionHandler', [
			'$delegate', 'exceptionHandlerFactory', function ($delegate, exceptionHandlerFactory) {
				return exceptionHandlerFactory($delegate);
			}
		]);
	}
]);
