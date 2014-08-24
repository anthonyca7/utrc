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