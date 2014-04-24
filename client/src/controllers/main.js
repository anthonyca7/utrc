angular.module('webinterface')
	.controller('mainController', [
		'$scope',
		'$http',
		'$sce',
		'TRANSCOM_SCHEMA',
		function($scope, $http, $sce, TRANSCOM_SCHEMA){
			$scope.collections = [
				{name: 'Transcom', event: 'Transcom'}
			];
			$scope.collection = $scope.collections[0];
			$scope.headers    = [];
			$scope.table      = [];
			$scope.limit      = 10;
			$scope.filters    = {};
			$scope.title      = 'Data Interface';
			$scope.page       = 5;
			$scope.count      = 0;
			$scope.pagTotalItems  = 8;
			$scope.searchFilter = {};
			
			$scope.updateData = function(page){
				$http.post("/api/event/" + $scope.collection.event + "/" + page + "/" + $scope.limit,
					{ criteria: JSON.stringify($scope.searchFilter) }).
				success(function(data, status, headers, config){
					$scope.count = data.count;
					$scope.table = [];
					$scope.generateTable(data.events);
				}).
				error(function(data, status, headers, config){
					console.log("There was an error");
				});
			}
			
			$scope.setPage = function (page) {
				$scope.updateData(page);
			};

			$scope.populateHeaders = function () {
				var headers = Object.keys(TRANSCOM_SCHEMA);
				for (var i = 0; i < headers.length; i++) {
					$scope.headers.push({name: headers[i], width: TRANSCOM_SCHEMA[headers[i]].width || 100});		
				};

			}

			$scope.CreateSearchObject = function () {
				for(key in $scope.filters){
					var tmp, val;
					if ($scope.filters.hasOwnProperty(key)) {
						if (TRANSCOM_SCHEMA[key] != null) {
							tmp = "event." + TRANSCOM_SCHEMA[key].path.join('.');
							val = $scope.filters[key];
							var o = { $regex: val.toString(), $options: 'i' };
							$scope.searchFilter[tmp] = o;
							console.log($scope.searchFilter[tmp]);
	

							if ($scope.filters[tmp]==="" || $scope.filters[tmp]==null) {
								delete $scope.searchFilter[tmp];
							}

						}
					}
				}
			}

			$scope.generateTable = function(data){
				var tmp = {};
				data.forEach(function(doc){
					$scope.headers.forEach(function (column) {
						var value          = doc['event'],
						    fieldPath      = TRANSCOM_SCHEMA[column.name].path,
						    fieldModifiers = TRANSCOM_SCHEMA[column.name].modifiers;
						var newval;

						for(field in fieldPath){
							newval = value[fieldPath[field]];

							if (angular.isArray(value)) {
								value.forEach(function (obj) {
									if (obj[fieldPath[field]] != null) {
										value = obj[fieldPath[field]];
									}
								});
							}
							else if (newval != null) {
								value = value[fieldPath[field]];
							}
							else{
								value = null
								break;
							}
						}

						for(modifier in fieldModifiers){
							if (angular.isFunction(fieldModifiers[modifier])) {
								value = fieldModifiers[modifier](value);
							}
						}
						
						value = (value != null)?value.toString():value;
						if (typeof value === 'string') {
							value = (value.length >= 120) ? value.substr(0,120)+"...":value;
						}

						tmp[column.name] = value;
					});
					$scope.table.push(tmp);
					tmp = {};
				});
			}

			$scope.populateHeaders();
			$scope.updateData(1);
	}]);