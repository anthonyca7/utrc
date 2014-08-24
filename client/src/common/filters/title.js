angular.module("filters.title", []).filter("title", function () {
	return function (value) {
		if (angular.isString(value) && value.length !== 0) {
			return value[0].toUpperCase() + value.substring(1);
		}
		return value;
	};
});