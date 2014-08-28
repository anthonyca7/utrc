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
	'$scope', '$modal', 'schemas', 'Feed', 'Formatters', 'Modifiers', 'titleFilter', 'dateFilter', function ($scope, $modal, schemas, Feed, Formatters, Modifiers, title, date) {

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
			{
				name: 'Transcom Events',
				organization: 'Transcom',
				location: 'transcoms',
				schema: 'transcom',
				feed: "transcom"
			},
			{
				name: 'Transcom Link Configurations',
				organization: 'Transcom',
				location: 'transcomlinkconfigurations',
				schema: 'transcomLinkConfiguration',
				feed: "transcomlinkconfiguration"
			},
			{
				name: 'Transcom Link Conditions',
				organization: 'Transcom',
				location: 'transcomlinkconditions',
				schema: 'transcomLinkCondition',
				feed: "transcomlinkcondition"
			}
		];

		$scope.selectFeed = function (feed) {
			$scope.selectedFeed = feed;
			$scope.headers = schemas.getHeaders(feed.feed);
			$scope.schema = schemas.getByName(feed.feed);
			$scope.updateData();
		};

		$scope.update = function (feedLocation, page, limit, criteria) {
			Feed.get(feedLocation, page, limit, $scope.stringify(criteria))
				.then(function (response) {
					$scope.count = response.data.count;
					$scope.events = response.data.events;
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

		$scope.getDate = function(){
			var currentDate = date(new Date(), "MM-dd-y_hh-mm-a");
			console.log(currentDate);
			return currentDate;
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