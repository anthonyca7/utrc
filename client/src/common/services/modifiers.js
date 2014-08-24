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