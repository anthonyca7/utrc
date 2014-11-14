angular.module('services.feeds', []).factory('Feed', ['$http', function ($http) {

	var service = {};

	service.get = function (name, page, limit, criteria, dates) {
		return $http.post('/api/feeds/' + name + '/' + page + '/' + limit,
			{ criteria: criteria, dates: dates });
	};

	return service;

}]);