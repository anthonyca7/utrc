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

		$scope.limit = 25;
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
		$scope.paginationCells = 8;

		// Select field scope variables
		$scope.feeds = [
			{
				name: '511NY Events',
				organization: '511NY',
				location: '511NY_events',
				schema: 'NYC511Event',
				feed: 'nyc511event'
			},
			{
				name: '511NY Links',
				organization: '511NY',
				location: '511NY_links',
				schema: 'NYC511Link',
				feed: 'nyc511link'
			},
			{
				name: '511NY WTA Status',
				organization: '511NY',
				location: '511NY_wtastatus',
				schema: 'NYC511WTAStatus',
				feed: 'nyc511wtastatus'
			},
			{
				name: '511NY WTA Segment Data',
				organization: '511NY',
				location: '511NY_wtasegmentdata',
				schema: 'NYC511WTASegmentData',
				feed: 'nyc511wtasegmentdata'
			},
			{
				name: '511NY VMS',
				organization: '511NY',
				location: '511NY_vms',
				schema: 'NYC511WTAVMS',
				feed: 'nyc511vms'
			},
			{
				name: "Older 511NY Events",
				organization: 'Older 511NY',
				location: 'older_NY511FEED_events',
				schema: 'Older511NYEvent',
				feed: 'older511nyevent'
			},
			{
				name: "Older 511NY Link Conditions",
				organization: 'Older 511NY',
				location: 'older_NY511FEED_linkconditions',
				schema: 'Older511NYLinkCondition',
				feed: 'older511nylinkcondition'
			},
			{
				name: "Older 511NY Link Inventory",
				organization: 'Older 511NY',
				location: 'older_NY511FEED_linkinventory',
				schema: 'Older511NYLinkInventory',
				feed: 'older511nylinkinventory'
			},
			{
				name: "Older 511NY Links",
				organization: 'Older 511NY',
				location: 'older_NY511FEED_links',
				schema: 'Older511NYLink',
				feed: 'older511nylink'
			},
			{
				name: "Older 511NY Link WTA Status",
				organization: 'Older 511NY',
				location: 'older_NY511FEED_wtastatus',
				schema: 'Older511NYWtaStatus',
				feed: 'older511nywtastatus'
			},
			{
				name: "NYCDOT Real time traffic speed Data",
				organization: "NYCDOT",
				location: "NYCDOTTrafficSpeed",
				Schema: 'NYCDOTTrafficSpeed',
				feed: 'nycdottrafficspeed'
			},
			{
				name: "MTA Outages",
				organization: "MTA",
				location: "MTAOutages",
				Schema: 'MTAOutage',
				feed: 'mtaoutage'
			},
			{
				name: "MTA Bus Status",
				organization: "MTA",
				location: "MTABusStatus",
				Schema: 'MTAStatus',
				feed: 'mtastatus',
				limit: 0
			},
			{
				name: "MTA Subway Status",
				organization: "MTA",
				location: "MTASubwayStatus",
				Schema: 'MTAStatus',
				feed: 'mtastatus',
				limit: 0
			},
			{
				name: "MTA BT Status",
				organization: "MTA",
				location: "MTABTStatus",
				Schema: 'MTAStatus',
				feed: 'mtastatus',
				limit: 0
			},
			{
				name: "MTA LIRR Status",
				organization: "MTA",
				location: "MTALIRRStatus",
				Schema: 'MTAStatus',
				feed: 'mtastatus',
				limit: 0
			},
			{
				name: "MTA Metro North Status",
				display: "Metro North Status",
				organization: "MTA",
				location: "MTAMetroNorthStatus",
				Schema: 'MTAStatus',
				feed: 'mtastatus',
				limit: 0
			},
			{
				name: "MTA Lost and Found Data",
				organization: "MTA",
				location: "MTALostFound",
				Schema: 'MTALostFound',
				feed: 'mtalostfound',
				limit: 100
			},
			{
				name: 'Transcom Events',
				organization: 'Transcom',
				location: 'transcomEvents',
				schema: 'transcom',
				feed: 'transcom'
			},
			{
				name: 'Transcom Link Configurations',
				organization: 'Transcom',
				location: 'transcomConfigurations',
				schema: 'transcomLinkConfiguration',
				feed: 'transcomlinkconfiguration'
			},
			{
				name: 'Transcom Link Conditions',
				organization: 'Transcom',
				location: 'transcomConditions',
				schema: 'transcomLinkCondition',
				feed: 'transcomlinkcondition'
			}
		];

		$scope.selectFeed = function (feed) {
			$scope.searchQuery = {};
			$scope.criteria = {};
			$scope.filters = {};
			$scope.currentPage = 1;

			$scope.selectedFeed = feed;
			$scope.headers = schemas.getHeaders(feed.feed);
			$scope.schema = schemas.getByName(feed.feed);
			$scope.updateData();
		};

		$scope.update = function (feed, page, limit, criteria) {
			Feed.get(feed.location, page, limit, $scope.stringify(criteria))
				.then(function (response) {
					$scope.count = response.data.count;
					$scope.events = response.data.events;

					if (feed.limit == null) {
						$scope.charLimit = 50;
					}
					else {
						$scope.charLimit = feed.limit;
					}
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
			$scope.update($scope.selectedFeed, $scope.currentPage, $scope.limit, $scope.criteria);
		};

		$scope.reset = function () {
			$scope.limit = 10;
			$scope.automaticUpdate = true;
			$scope.count = 0;
			$scope.events.length = 0;
			$scope.searchQuery = {};
			$scope.criteria = {};
			$scope.filters = {};
			$scope.currentPage = 1;
			$scope.paginationCells = 6;

			$scope.updateData();
		};

		$scope.stringify = function (object) {
			return JSON.stringify(object);
		};

		$scope.getDate = function(){
			var currentDate = date(new Date(), "MM-dd-y_hh-mm-a");
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