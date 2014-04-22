angular.module('webinterface')
	.controller('mainController', [
		'$scope',
		'$http',
		'transcomWidth',
		'TRANSCOM_SCHEMA',
		function($scope, $http, transcomWidth, TRANSCOM_SCHEMA){
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
					$scope.headers.push({name: headers[i], width: transcomWidth[i]});		
				};

			}

			$scope.generateTable = function(data){
				data.forEach(function(doc){
					var tmp = [];
					$scope.headers.forEach(function (column) {
						var value          = doc['event'],
						    fieldPath      = TRANSCOM_SCHEMA[column.name].path,
						    fieldModifiers = TRANSCOM_SCHEMA[column.name].modifiers;

						for(field in fieldPath){
							if (value[fieldPath[field]] != null) {
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
						
						/*if (typeof value === 'string') {
							value = (value.length >= 25) ? value.substr(0,25):value;
						};*/

						tmp.push(value);
					});
					$scope.table.push(tmp);
				});
			}


			$scope.populateHeaders();
			$scope.updateData(1);



			/*$scope.updateLinks = function(data){
				data.forEach(function(doc){
					for (key in doc.event){
						if ($scope.headers.indexOf(key) === -1) {
							$scope.headers.push(key);
						}
					}
				});
				return $scope.headers;
			}

			$scope.generateTable = function(data, headerTags){
				data.forEach(function(doc){
					var tmp = [];
					var attr;
					for (key in headerTags){
						attr = (doc.event[headerTags[key]]) ? doc.event[headerTags[key]]:"Empty";
						attr = ((typeof attr).toLowerCase() === 'object') ? JSON.stringify(attr):attr;
						//attr = (attr.length > 60) ? attr.substr(0,60)+"..."  : attr;
						tmp.push(attr.toString());
					}
					
					$scope.table.push(tmp);
				});
			}*/



	}]);