angular.module('filters.limitCharacters', []).filter('limitCharacters', function () {
	return function (value, limit, truncate) {

		limit = parseInt(limit, 10);
		if (!truncate || value == null) {
			return value;
		}

		value = value.toString();

		return (value &&
			value.length > limit) ?
			value.substring(0, limit) :
			value;
	};
});