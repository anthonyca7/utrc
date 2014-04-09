angular.module('webinterface')
	.controller('mainController', [
		'$scope',
		'$http',
		'Event',
		function($scope, $http, Event){
			$scope.collections = ["Transcom"];
			$scope.data       = null;
			$scope.headers    = [];
			$scope.table      = [];

			$scope.updateData = function(collection, page, limit){
				$http.get("/api/event/" + collection + "/" + page + "/" + limit).
				success(function(data, status, headers, config){
					data.push({event: {name: "Anthony"}});
					$scope.data = data;
					$scope.generateTable(data, $scope.updateLinks(data));
				}).
				error(function(data, status, headers, config){
					console.log("There was an error");
				});
			}

			$scope.updateLinks = function(data){
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
						tmp.push(attr.toString());
					}
					
					$scope.table.push(tmp);
				});
			}

			$scope.updateData($scope.collections[0], 1, 5);


	}]);