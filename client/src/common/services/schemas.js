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
		return schema && schema.order;
	};

	var service = {
		all: function () {
			return $http.get('/api/schema').then(function (response) {
				var schemas = response.data;
				console.log(schemas);
				angular.extend(schemas, helpers);
				return schemas;
			});
		}
	};
	return service;
}]);