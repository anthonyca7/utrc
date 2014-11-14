angular.module('services.modifiers', []).factory('Modifiers', ['dateFilter', function (date) {
	var service = {};

	service.def = function (value) {
		return value;
	};

	service.datent = function (value) {
		return date(value, 'EEEE, MMM d, y');
	};

	service.date = function (value) {
		return date(value, 'EEEE, MMM d, y h:mm a');
	};

	service.time = function (value) {
		return date(value, 'h:mm a');
	};

	service.float = function (value) {
		if (typeof value === "number") {
			return value.toFixed(8);
		}
		return value;
	};

	service.complexObject = function (value) {
		var result = [], i;
		var keys = Object.keys(value);

		if (typeof value === 'object' && value.constructor === Array) {
			return complexArray(value);
		}

		for (i = 0; i < keys.length; i++) {	
			if (value[keys[i]] && typeof value[keys[i]] === 'object' && value[keys[i]].constructor === Array) {
				result.push("(" + keys[i] + ":" + service.complexArray(value[keys[i]]) + ")");
			}
			else {
				result.push("(" + keys[i] + ":" + value[keys[i]] + ")");
			}
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

	service.toNumber = function (value) {
		if (typeof value === "object") {
			return value.toNumber();
		}
		return value;
	};

	return service;
}]);