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
			$scope.data       = null;
			$scope.headers    = [];
			$scope.table      = [];
			$scope.limit      = 10;
			$scope.title      = 'Data Interface';
			
			$scope.updateData = function(page){
				$http.get("/api/event/" + $scope.collection.event + "/" + page + "/" + $scope.limit).
				success(function(data, status, headers, config){
					$scope.data = data;
					$scope.table = [];
					$scope.generateTable(data);
					//$scope.generateTable(data, $scope.updateLinks($scope.data));
				}).
				error(function(data, status, headers, config){
					console.log("There was an error");
				});
			}

			$scope.populateHeaders = function () {
				var headers = Object.keys(TRANSCOM_SCHEMA);
				for (var i = 0; i < headers.length; i++) {
					$scope.headers.push({name: headers[i], width: TRANSCOM_SCHEMA[headers[i]].width || 100});		
				};

			}

			$scope.snippet =
		      '<p style="color:blue">an &#40&#40html\n' +
		      '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
		      'snippet</p>';
		    $scope.deliberatelyTrustDangerousSnippet = function() {
		      return $sce.trustAsHtml($scope.snippet);
		    };

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