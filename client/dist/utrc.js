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
angular.module('modal.criteria', []).controller('CriteriaController',
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
angular.module('interface', [
	'templates.app',
	'security.authorization',
	'services.schemas',
	'services.feeds',
	'services.formatters',
	'services.modifiers',
	'modal.criteria',
	'ui.bootstrap',
	'filters'
]);

angular.module('interface').config([
	'$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
		$routeProvider.when('/interface', {
			templateUrl: 'interface/interface.tpl.html',
			controller: 'InterfaceController',
			resolve: {
				authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser,
				schemas: ['Schemas', function (Schema) {
					return Schema.all();
				}]
			}
		});
	}
]);

angular.module('interface').controller('InterfaceController', [
	'$scope', '$modal', 'schemas', 'Feed', 'Formatters', 'Modifiers', 'titleFilter', function ($scope, $modal, schemas, Feed, Formatters, Modifiers, title) {

		var criteriaModal = null;

		$scope.limit = 10;
		$scope.automaticUpdate = true;
		$scope.count = 0;
		$scope.events = [];
		$scope.searchQuery = {};
		$scope.headers = {};
		$scope.schema = {};
		$scope.criteria = {};
		$scope.filters = {};
		$scope.maxCharsInCells = 50;

		// Pagination variables
		$scope.currentPage = 1;
		$scope.paginationCells = 6;

		// Select field scope variables
		$scope.feeds = [
			{name: 'Transcom Events', organization: 'Transcom', location: 'transcoms', schema: 'transcom'},
			{name: 'Transcom Link Configurations', organization: 'Transcom', location: 'transcomlinkconfigurations', schema: 'transcomLinkConfiguration'},
			{name: 'Transcom Link Conditions', organization: 'Transcom', location: 'transcomlinkconditions', schema: 'transcomLinkCondition'}
		];

		$scope.selectFeed = function (feed) {
			$scope.selectedFeed = feed;
			$scope.headers = schemas.getHeaders(feed.schema);
			$scope.schema = schemas.getByName(feed.schema);
			console.log($scope.schema);
			$scope.updateData();
		};

		$scope.update = function (feedLocation, page, limit, criteria) {
			Feed.get(feedLocation, page, limit, criteria)
				.then(function (response) {
					$scope.count = response.data.count;
					$scope.events = response.data.events;
					console.log(response.data);
				});
		};

		$scope.canSearchByInterval = function (header, schema) {
			return schema.format[header].searchableByInterval;
		};

		$scope.cannotBeSearched = function (header, schema) {
			return schema.format[header].notSearchable;
		};

		$scope.updateCriteria = function (column, schema, filters, criteria) {
			var eventFormat = schema.format[column],
			    mongoPath = eventFormat.path.join('.');

			if (filters[column] === "") {
				delete criteria[mongoPath];
				$scope.updateData();
				return;
			}

			criteria[mongoPath] = Formatters.intervalMaker(
				filters[column],
					Formatters[eventFormat.type || 'string'] || angular.noop,
				eventFormat.extra
			);

			$scope.autoUpdate();
		};

		function modifyData(value, eventFormat) {
			var modifiers = eventFormat.modifiers;

			if (angular.isArray(modifiers)) {
				modifiers.forEach(function (name) {
					var modifier = Modifiers[name] || Modifiers['def'];
					value = modifier(value, eventFormat.extra);
				});
			}

			if (value && typeof value === 'object') {
				if (value.constructor.name === 'Array') {
					value = Modifiers.complexArray(value);
				} else {
					value = Modifiers.complexObject(value);
				}
			}
			return value;
		}

		$scope.getEventField = function (data, schema, column) {
			var eventFormat = schema.format[column],
			    path = eventFormat.path,
			    cellValue = data, i, j, object;

			for (i = 0; i < path.length; i++) {
				// If the current value is an array then check for each
				// object inside until the property is found
				if (angular.isArray(cellValue)) {
					for (j = 0; j < cellValue.length; j++) {
						object = cellValue[j];

						if (object.hasOwnProperty(path[i])) {
							cellValue = object[path[i]];
							break;
						}
					}
					if (j === cellValue.length) {
						return null;
					}
				} else if (cellValue.hasOwnProperty([path[i]])) {
					cellValue = cellValue[path[i]];
				} else {
					return null;
				}
			}

			return modifyData(cellValue, eventFormat);
		};

		$scope.autoUpdate = function () {
			if ($scope.automaticUpdate) {
				$scope.updateData();
			}
		};
		$scope.updateData = function () {
			$scope.update($scope.selectedFeed.location, $scope.currentPage, $scope.limit, $scope.criteria);
		};

		$scope.reset = function () {
			$scope.limit = 10;
			$scope.automaticUpdate = true;
			$scope.count = 0;
			$scope.events.length = 0;
			$scope.searchQuery = {};
			$scope.headers = {};
			$scope.schema = {};
			$scope.criteria = {};
			$scope.filters = {};
			$scope.currentPage = 1;
			$scope.paginationCells = 6;

			$scope.selectFeed($scope.feeds[0]);
			$scope.updateData();
		};

		$scope.stringify = function (object) {
			return JSON.stringify(object);
		};

		$scope.openModal = function (filters, field, schema) {
			if (!criteriaModal) {
				criteriaModal = $modal.open({
					templateUrl: 'interface/criteria/criteria-modal.tpl.html',
					controller: 'CriteriaController',
					resolve: {
						field: function () {
							return field;
						},
						type: function () {
							return schema.format[field].type;
						}
					}
				});

				criteriaModal.result.then(function (fieldText) {
					criteriaModal = null;
					filters[field] = fieldText;
					$scope.updateCriteria(field, $scope.schema, filters, $scope.criteria);

				}, function () {
					criteriaModal = null;
					console.log("Closed modal");
				});
			}
		};

		$scope.selectFeed($scope.feeds[0]);
		$scope.updateData();
	}
]);

angular.module('interface').controller('rowController',
	['$scope', function ($scope) {
		$scope.clicks = 0;
		$scope.tc = true;

		$scope.fullContent = function () {
			$scope.clicks++;
			if ($scope.clicks % 2 === 0 && $scope.clicks !== 0) {
				$scope.tc = !$scope.tc;
				$scope.clicks = 0;
			}
		};
	}]);
angular.module('filters', [
	'filters.title',
	'filters.limitCharacters'
]);

angular.module('filters.limitCharacters', []).filter('limitCharacters', function () {
	return function (value, limit, truncate) {

		limit = parseInt(limit, 10);
		if (!truncate || value == null) {
			return value;
		}

		value = value.toString();

		return (value &&
			value.length > limit) ?
			value.substring(0, limit) :
			value;
	};
});
angular.module("filters.title", []).filter("title", function () {
	return function (value) {
		if (angular.isString(value) && value.length !== 0) {
			return value[0].toUpperCase() + value.substring(1);
		}
		return value;
	};
});
angular.module('security.authorization', ['security.service'])

	.provider('securityAuthorization', {

		requireAdminUser: [
			'securityAuthorization', function (securityAuthorization) {
				return securityAuthorization.requireAdminUser();
			}
		],

		requireAuthenticatedUser: [
			'securityAuthorization', function (securityAuthorization) {
				return securityAuthorization.requireAuthenticatedUser();
			}
		],

		$get: [
			'security', 'securityRetryQueue', function (security, queue) {
				var service = {

					requireAuthenticatedUser: function () {
						var promise = security.requestCurrentUser().then(function (userInfo) {
							if (!security.isAuthenticated()) {
								return queue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
							}
						});
						return promise;
					},

					requireAdminUser: function () {
						var promise = security.requestCurrentUser().then(function (userInfo) {
							if (!security.isAdmin()) {
								return queue.pushRetryFn('unauthorized-client', service.requireAdminUser);
							}
						});
						return promise;
					}

				};

				return service;
			}
		]
	});
// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.module', [
	'security.service',
	'security.interceptor',
	'security.login',
	'security.authorization'
]);

angular.module('security.interceptor', ['security.retryQueue'])

// This http interceptor listens for authentication failures
	.factory('securityInterceptor', [
		'$injector', 'securityRetryQueue', function ($injector, queue) {
			return function (promise) {
				// Intercept failed requests
				return promise.then(null, function (originalResponse) {
					if (originalResponse.status === 401) {
						// The request bounced because it was not authorized - add a new request to the retry queue
						promise = queue.pushRetryFn('unauthorized-server', function retryRequest() {
							// We must use $injector to get the $http service to prevent circular dependency
							return $injector.get('$http')(originalResponse.config);
						});
					}
					return promise;
				});
			};
		}
	])

// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
	.config([
		'$httpProvider', function ($httpProvider) {
			$httpProvider.responseInterceptors.push('securityInterceptor');
		}
	]);
angular.module('security.login.form', [])

	.controller('LoginFormController', [
		'$scope', '$modalInstance', 'security', function ($scope, $modalInstance, security) {
			$scope.user = {};
			$scope.authError = null;

			$scope.authReason = null;
			if (security.getLoginReason()) {
				$scope.authReason = ( security.isAuthenticated() ) ?
					"You are not authorized" :
					"You need to sign in to continue";
			}

			$scope.login = function () {
				$scope.authError = null;
				security.login($scope.user.username, $scope.user.password).then(function (loggedIn) {
					if (!loggedIn) {
						$scope.authError = "Invalid username or password";
					}
					else {
						$modalInstance.close(true);
					}
				}, function (x) {
					$scope.authError = "Invalid username or password";
				});
			};

			$scope.clearForm = function () {
				$scope.user = {};
			};

			$scope.cancelLogin = function () {
				$modalInstance.dismiss();
			};
		}
	]);

angular.module('security.login', ['security.login.form', 'security.login.toolbar']);
angular.module('security.login.toolbar', [])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
	.directive('loginToolbar', [
		'security', function (security) {
			var directive = {
				templateUrl: 'security/login/toolbar.tpl.html',
				restrict: 'E',
				replace: true,
				scope: true,
				link: function ($scope, $element, $attrs, $controller) {
					$scope.isAuthenticated = security.isAuthenticated;
					$scope.login = security.showLogin;
					$scope.logout = security.logout;
					$scope.$watch(function () {
						return security.currentUser;
					}, function (currentUser) {
						$scope.currentUser = currentUser;
					});
				}
			};
			return directive;
		}
	]);
angular.module('security.retryQueue', [])

// This is a generic retry queue for security failures.  Each item is expected to expose two functions: retry and cancel.
	.factory('securityRetryQueue', [
		'$q', '$log', function ($q, $log) {
			var retryQueue = [];
			var service = {
				// The security service puts its own handler in here!
				onItemAddedCallbacks: [],

				hasMore: function () {
					return retryQueue.length > 0;
				},
				push: function (retryItem) {
					retryQueue.push(retryItem);
					// Call all the onItemAdded callbacks
					angular.forEach(service.onItemAddedCallbacks, function (cb) {
						try {
							cb(retryItem);
						} catch (e) {
							$log.error('securityRetryQueue.push(retryItem): callback threw an error' + e);
						}
					});
				},
				pushRetryFn: function (reason, retryFn) {
					// The reason parameter is optional
					if (arguments.length === 1) {
						retryFn = reason;
						reason = undefined;
					}

					// The deferred object that will be resolved or rejected by calling retry or cancel
					var deferred = $q.defer();
					var retryItem = {
						reason: reason,
						retry: function () {
							// Wrap the result of the retryFn into a promise if it is not already
							$q.when(retryFn()).then(function (value) {
								// If it was successful then resolve our deferred
								deferred.resolve(value);
							}, function (value) {
								// Othewise reject it
								deferred.reject(value);
							});
						},
						cancel: function () {
							// Give up on retrying and reject our deferred
							deferred.reject();
						}
					};
					service.push(retryItem);
					return deferred.promise;
				},
				retryReason: function () {
					return service.hasMore() && retryQueue[0].reason;
				},
				cancelAll: function () {
					while (service.hasMore()) {
						retryQueue.shift().cancel();
					}
				},
				retryAll: function () {
					while (service.hasMore()) {
						retryQueue.shift().retry();
					}
				}
			};
			return service;
		}
	]);

angular.module('security.service', [
	'security.retryQueue',
	'security.login',
	'ui.bootstrap'
])

	.factory('security', [
		'$http', '$q', '$location', 'securityRetryQueue', '$modal', function ($http, $q, $location, queue, $modal) {

			function redirect(url) {
				url = url || '/';
				$location.path(url);
			}

			var loginModal = null;

			function openLoginModal() {
				if (loginModal) {
					throw new Error('Trying to open a modal that is already open!');
				}
				loginModal = $modal.open({
					templateUrl: 'security/login/form.tpl.html',
					controller: 'LoginFormController'
				});

				loginModal.result.then(function (success) {
						loginModal = null;
						queue.retryAll();
					}, function () {
						loginModal = null;
						queue.cancelAll();
						redirect();
					}
				);
			}

			queue.onItemAddedCallbacks.push(function (retryItem) {
				if (queue.hasMore()) {
					service.showLogin();
				}
			});

			var service = {

				getLoginReason: function () {
					return queue.retryReason();
				},

				showLogin: function () {
					openLoginModal();
				},

				login: function (username, password) {
					var request = $http.post('/api/session', {username: username, password: password});
					return request.then(function (response) {
						service.currentUser = response.data.user;
						return service.isAuthenticated();
					});
				},

				logout: function (redirectTo) {
					$http.delete('/api/session').then(function () {
						service.currentUser = null;
						redirect(redirectTo);
					});
				},

				requestCurrentUser: function () {
					if (service.isAuthenticated()) {
						return $q.when(service.currentUser);
					} else {
						return $http.get('/api/users/current').then(function (response) {
							service.currentUser = response.data.user;
							return service.currentUser;
						});
					}
				},

				currentUser: null,

				isAuthenticated: function () {
					return !!service.currentUser;
				},

				isAdmin: function () {
					return !!(service.currentUser && service.currentUser.admin);
				}
			};

			return service;
		}
	]);

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

angular.module('services.feeds', []).factory('Feed', ['$http', function ($http) {

	var service = {};

	service.get = function (name, page, limit, criteria) {
		return $http.post('/api/feeds/' + name + '/' + page + '/' + limit,
			{ criteria: JSON.stringify(criteria || {}) });
	};

	service.download = function (name, criteria) {
		return $http.post('/api/feeds/download/' + name,
			{ criteria: JSON.stringify(criteria || {}) });
	};

	return service;

}]);
angular.module('services.formatters', []).factory('Formatters', [
	'dateFilter', function (dateFilter) {

		var service = {types: {}};

		service.string = function (value) {
			return {$regex: value, $options: 'i'};
		};

		service.integer = function (value) {
			if (isNaN(value)) {
				return null;
			}

			return parseInt(value, 10);
		};

		service.float = function (value) {
			if (isNaN(value)) {
				return null;
			}

			return parseFloat(value);
		};

		service.intervalMaker = function (value, cb, extra) {
			var values;
			if (value.indexOf('<>') !== -1) {
				values = value.split('<>');
				return { $gte: cb(values[0].trim()), $lte: cb(values[1].trim()) };
			}
			else if (value.indexOf('>=') !== -1) {
				values = value.split('>=');
				return { $lte: cb(values[0].trim()) };
			}
			else if (value.indexOf('<=') !== -1) {
				values = value.split('<=');
				return { $gte: cb(values[0].trim()) };
			}
			else if (value.indexOf('>') !== -1) {
				values = value.split('>');
				return { $lt: cb(values[0].trim()) };
			}
			else if (value.indexOf('<') !== -1) {
				values = value.split('<');
				return { $gt: cb(values[0].trim()) };
			}
			else {
				return cb(value, true, extra);
			}
		};

		service.date = function (value, noRange) {
			if (noRange) {
				return service.string(value);
			}

			var date = new Date(value);
			value = (date < new Date('1980-12-31T09:00:00-07:00')) ? null : value;

			return value;
		};

		service.boolean = function (value) {
			if (value === 'true') {
				return true;
			}
			if (value === 'false') {
				return false;
			}
			return null;
		};

		service.integerRepresentation = function (value, noRange, extra) {
			if (typeof extra !== 'object' || !Array.isArray(extra.representations)) {
				return null;
			}

			var representations = extra.representations;
			var matchingIndexes = [];
			var expression = new RegExp(value, 'i');

			representations.forEach(function (value, index) {
				if (expression.test(value)) {
					matchingIndexes.push(index);
				}
			});

			return {$in: matchingIndexes};
		};

		return service;
	}]);
angular.module('services.httpRequestTracker', []);
angular.module('services.httpRequestTracker').factory('httpRequestTracker', [
	'$http', function ($http) {

		var httpRequestTracker = {};
		httpRequestTracker.hasPendingRequests = function () {
			return $http.pendingRequests.length > 0;
		};

		return httpRequestTracker;
	}
]);
angular.module('services.modifiers', []).factory('Modifiers', ['dateFilter', function (date) {
	var service = {};

	service.def = function (value) {
		return value;
	};

	service.date = function (value) {
		return date(value, 'EEEE, MMM d, y h:mm a');
	};

	service.float = function (value) {
		if (typeof value === "number") {
			return value.toFixed(2);
		}
		return value;
	};

	service.complexObject = function (value) {
		var result = [], i;
		var keys = Object.keys(value);

		for (i = 0; i < keys.length; i++) {
			result.push("(" + keys[i] + ":" + value[keys[i]] + ")");
		}

		return "( " + result.join(", ") + " )";
	};

	service.complexArray = function (value) {
		var result = [];

		value.forEach(function (element) {
			if (typeof element === 'object') {
				result.push(service.complexObject(element));
			}
			else {
				result.push(element);
			}
		});

		return result.join(", ");
	};


	service.integerRepresentation = function (value, extra) {
		if (typeof extra !== 'object' || !Array.isArray(extra.representations)) {
			return null;
		}

		return extra.representations[parseInt(value)];
	};

	return service;
}]);
angular.module('services.notifications', []).factory('notifications', [
	'$rootScope', function ($rootScope) {

		var notifications = {
			'STICKY': [],
			'ROUTE_CURRENT': [],
			'ROUTE_NEXT': []
		};
		var notificationsService = {};

		var addNotification = function (notificationsArray, message, type, otherProperties) {
			notification = angular.extend({
				message: message,
				type: type
			}, otherProperties || {});

			notificationsArray.push(notification);
			return notification;
		};

		$rootScope.$on('$routeChangeSuccess', function () {
			notifications.ROUTE_CURRENT.length = 0;

			notifications.ROUTE_CURRENT = angular.copy(notifications.ROUTE_NEXT);
			notifications.ROUTE_NEXT.length = 0;
		});

		notificationsService.getCurrent = function () {
			return [].concat(notifications.STICKY, notifications.ROUTE_CURRENT);
		};

		notificationsService.pushSticky = function (message, type, otherProperties) {
			return addNotification(notifications.STICKY, message, type, otherProperties);
		};

		notificationsService.pushForCurrentRoute = function (message, type, otherProperties) {
			return addNotification(notifications.ROUTE_CURRENT, message, type, otherProperties);
		};

		notificationsService.pushForNextRoute = function (message, type, otherProperties) {
			return addNotification(notifications.ROUTE_NEXT, message, type, otherProperties);
		};

		notificationsService.remove = function (notification) {
			angular.forEach(notifications, function (notificationsByType) {
				var idx = notificationsByType.indexOf(notification);
				if (idx > -1) {
					notificationsByType.splice(idx, 1);
				}
			});
		};

		notificationsService.removeAll = function () {
			angular.forEach(notifications, function (notificationsByType) {
				notificationsByType.length = 0;
			});
		};

		return notificationsService;
	}
]);
angular.module('services.schemas', []).factory('Schemas', ['$q', '$http', function ($q, $http) {
	var helpers = {};

	helpers.getByName = function (name) {
		var schemas = this,
		    result = null;

		schemas.forEach(function (schema) {
			if (schema.name && schema.name === name) {
				result = schema;
			}
		});
		return result;
	};

	helpers.getHeaders = function (name) {
		var schema = this.getByName(name);
		if (!!schema) {
			return Object.keys(schema.format);
		}
		return {};
	};

	var service = {
		all: function () {
			return $http.get('/api/schema').then(function (response) {
				var schemas = response.data;
				angular.extend(schemas, helpers);
				return schemas;
			});
		}
	};
	return service;
}]);
angular.module('templates.app', ['header.tpl.html', 'interface/criteria/criteria-modal.tpl.html', 'interface/interface.tpl.html', 'main-page.tpl.html', 'notifications.tpl.html']);

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    "<div class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\" ng-controller=\"HeaderController\">\n" +
    "	<div class=\"container-fluid\">\n" +
    "		<div class=\"navbar-header\">\n" +
    "			<button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#header-content\">\n" +
    "				<span class=\"sr-only\">Toggle navigation</span>\n" +
    "				<span class=\"icon-bar\"></span>\n" +
    "				<span class=\"icon-bar\"></span>\n" +
    "				<span class=\"icon-bar\"></span>\n" +
    "			</button>\n" +
    "			<a class=\"navbar-brand\" ng-click=\"home()\">UTRC</a>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"collapse navbar-collapse\" id=\"header-content\">\n" +
    "			<login-toolbar></login-toolbar>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("interface/criteria/criteria-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("interface/criteria/criteria-modal.tpl.html",
    "<div class=\"modal-header\">\n" +
    "	<button type=\"button\" class=\"close\" aria-hidden=\"true\" ng-click=\"cancel()\">&times;</button>\n" +
    "	<h3 class=\"modal-title\">Search for {{field}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "	<div ng-if=\"type === 'date'\">\n" +
    "		<p>The recommended the way to search for dates is to use one of these three formats.</p>\n" +
    "		<ul class=\"text-info\">\n" +
    "			<li>yyyy-mm-dd</li>\n" +
    "			<li>yyyy-mm (No day specified)</li>\n" +
    "			<li>yyyy (No month and day specified)</li>\n" +
    "		</ul>\n" +
    "	</div>\n" +
    "\n" +
    "	<form novalidate class=\"form-horizontal\" role=\"form\">\n" +
    "		<div class=\"form-group\">\n" +
    "			<label class=\"col-sm-3 control-label\">Greater than</label>\n" +
    "\n" +
    "			<div class=\"col-sm-9\">\n" +
    "				<input type=\"text\" name=\"greater\" class=\"form-control\" ng-model=\"search.greater\">\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label class=\"col-sm-3 control-label\">Less than</label>\n" +
    "\n" +
    "			<div class=\"col-sm-9\">\n" +
    "				<input type=\"text\" name=\"less\" class=\"form-control\" ng-model=\"search.less\">\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "	<button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\" ng-click=\"cancel()\">Close</button>\n" +
    "	<button type=\"button\" class=\"btn btn-primary\" ng-click=\"submit()\">Search</button>\n" +
    "</div>");
}]);

angular.module("interface/interface.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("interface/interface.tpl.html",
    "<h1 class=\"title\">{{selectedFeed.organization | title}} Feeds</h1>\n" +
    "\n" +
    "<form class=\"form-horizontal col-md-7 well\" role=\"form\">\n" +
    "\n" +
    "	<div class=\"form-group\">\n" +
    "		<label for=\"feed\" class=\"col-md-3 control-label text-info mid-font\">Select your Feed: </label>\n" +
    "\n" +
    "		<div class=\"col-md-6\">\n" +
    "			<select class=\"form-control\"\n" +
    "			        id=\"feed\"\n" +
    "			        ng-model=\"selectedFeed\"\n" +
    "			        ng-change=\"selectFeed(selectedFeed)\"\n" +
    "			        ng-options=\"feed.name group by feed.organization for feed in feeds\"></select>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"form-group\">\n" +
    "		<label for=\"limit\" class=\"col-md-3 control-label text-info mid-font\">Results per page: </label>\n" +
    "\n" +
    "		<div class=\"col-md-6\">\n" +
    "			<input class=\"form-control\" id=\"limit\" ng-model=\"limit\" ng-blur=\"autoUpdate()\"/>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"form-group\">\n" +
    "		<div class=\"col-md-offset-3 add-padding\">\n" +
    "			<a class=\"btn btn-primary\" ng-click=\"updateData()\">\n" +
    "				<span class=\"glyphicon glyphicon glyphicon-refresh\"></span> Update\n" +
    "			</a>\n" +
    "\n" +
    "			<a class=\"btn btn-warning\" ng-click=\"reset()\">\n" +
    "				<span class=\"glyphicon glyphicon-repeat\"></span> Reset\n" +
    "			</a>\n" +
    "\n" +
    "			<a class=\"btn btn-success\"\n" +
    "			   target=\"_self\"\n" +
    "			   ng-href=\"/api/feeds/download/{{selectedFeed.location | title}}/{{stringify(criteria)}}\">\n" +
    "				<span class=\"glyphicon glyphicon-cloud-download\"></span> Download Results\n" +
    "			</a>\n" +
    "		</div>\n" +
    "		<!--<div class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"automaticUpdate\"> Update Automatically</label></div>-->\n" +
    "	</div>\n" +
    "</form>\n" +
    "\n" +
    "<div class=\"col-md-5\">\n" +
    "	<div class=\"pag-dividor\"></div>\n" +
    "	<div ng-show=\"count!=0\" class=\"text-primary result-text pull-right\">{{count}} events found</div>\n" +
    "	<br><br>\n" +
    "	<pagination ng-model=\"currentPage\"\n" +
    "	            ng-change=\"updateData()\"\n" +
    "	            total-items=\"count\"\n" +
    "	            items-per-page=\"limit\"\n" +
    "	            max-size=\"paginationCells\"\n" +
    "	            class=\"pagination-sm pag pull-right\"\n" +
    "	            boundary-links=\"true\"\n" +
    "	            rotate=\"false\">\n" +
    "	</pagination>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"table-container\">\n" +
    "	<table class=\"table table-bordered table-striped table-hover\">\n" +
    "\n" +
    "		<tr>\n" +
    "			<th>Result</th>\n" +
    "			<th ng-repeat=\"header in headers track by $index\" class=\"overflow-ellipsis\">\n" +
    "				<div>{{header}}</div>\n" +
    "\n" +
    "				<div class=\"field_input\">\n" +
    "					<input ng-model=\"filters[header]\"\n" +
    "					       ng-change=\"updateCriteria(header, schema, filters, criteria)\"\n" +
    "					       ng-disabled=\"cannotBeSearched(header, schema)\"\n" +
    "						/>\n" +
    "					<img src=\"/static/img/search-icon.png\"\n" +
    "					     class=\"field_img\"\n" +
    "					     ng-show=\"canSearchByInterval(header, schema)\"\n" +
    "					     ng-click=\"openModal(filters, header, schema)\"/>\n" +
    "				</div>\n" +
    "			</th>\n" +
    "		</tr>\n" +
    "\n" +
    "		<tr ng-if=\"events.length==0\">\n" +
    "			<td colspan=\"{{headers.length}}\">\n" +
    "				<h3>No events were found</h3>\n" +
    "			</td>\n" +
    "		</tr>\n" +
    "\n" +
    "\n" +
    "		<tr ng-if=\"events.length!=0\" ng-repeat=\"event in events track by $index\" ng-controller=\"rowController\">\n" +
    "			<td>{{ (currentPage - 1) * limit + $index + 1 }}</td>\n" +
    "			<td ng-repeat=\"header in headers\" ng-click=\"fullContent()\">\n" +
    "				<div>{{ getEventField(event, schema, header)|limitCharacters:50:tc }}</div>\n" +
    "			</td>\n" +
    "		</tr>\n" +
    "	</table>\n" +
    "</div>");
}]);

angular.module("main-page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("main-page.tpl.html",
    "<h1>Welcome to the UTRC data feed application</h1>\n" +
    "<p><a ng-href=\"/interface\">Data Interface</a></p>");
}]);

angular.module("notifications.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("notifications.tpl.html",
    "<div ng-class=\"['alert', 'alert-'+notification.type, 'notification']\"\n" +
    "     ng-repeat=\"notification in notifications.getCurrent()\">\n" +
    "	<button class=\"close\" ng-click=\"removeNotification(notification)\">x</button>\n" +
    "	{{notification.message}}\n" +
    "</div>");
}]);

angular.module('templates.common', ['security/login/form.tpl.html', 'security/login/toolbar.tpl.html']);

angular.module("security/login/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/login/form.tpl.html",
    "<div class=\"modal-header\">\n" +
    "	<h4>Sign in</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "	<form name=\"form\" novalidate class=\"form-horizontal\" role=\"form\">\n" +
    "		<div class=\"alert alert-warning\" ng-show=\"authReason\">{{authReason}}</div>\n" +
    "		<div class=\"alert alert-danger\" ng-show=\"authError\">{{authError}}</div>\n" +
    "\n" +
    "		<div class=\"alert alert-info\" ng-show=\"!authReason && !authError\">Please enter your login details</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label for=\"usernameField\" class=\"col-sm-3 control-label\">Username</label>\n" +
    "\n" +
    "			<div class=\"col-sm-9\">\n" +
    "				<input type=\"text\"\n" +
    "				       name=\"login\"\n" +
    "				       ng-model=\"user.username\"\n" +
    "				       class=\"form-control\"\n" +
    "				       id=\"usernameField\"\n" +
    "				       placeholder=\"Username\"\n" +
    "				       required\n" +
    "				       autofocus>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label for=\"passwordField\" class=\"col-sm-3 control-label\">Password</label>\n" +
    "\n" +
    "			<div class=\"col-sm-9\">\n" +
    "				<input type=\"password\"\n" +
    "				       name=\"pass\"\n" +
    "				       ng-model=\"user.password\"\n" +
    "				       class=\"form-control\"\n" +
    "				       id=\"passwordField\"\n" +
    "				       placeholder=\"Password\"\n" +
    "				       required>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "	<button class=\"btn btn-primary\" ng-click=\"login()\" ng-disabled='form.$invalid'>Sign in</button>\n" +
    "	<button class=\"btn btn-danger\" ng-click=\"clearForm()\">Clear</button>\n" +
    "	<button class=\"btn btn-warning\" ng-click=\"cancelLogin()\">Cancel</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("security/login/toolbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/login/toolbar.tpl.html",
    "<ul class=\"nav pull-right\">\n" +
    "	<li class=\"divider-vertical\"></li>\n" +
    "	<li ng-if=\"isAuthenticated()\" class=\"logout\">\n" +
    "		<form class=\"navbar-form\">\n" +
    "			<button class=\"btn logout\" ng-click=\"logout()\">Log out</button>\n" +
    "		</form>\n" +
    "	</li>\n" +
    "	<li ng-if=\"!isAuthenticated()\" class=\"login\">\n" +
    "		<form class=\"navbar-form\">\n" +
    "			<button class=\"btn login\" ng-click=\"login()\">Log in</button>\n" +
    "		</form>\n" +
    "	</li>\n" +
    "</ul>");
}]);
