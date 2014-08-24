angular.module('services.formatters', []).factory('Formatters', [
	'dateFilter', function (dateFilter) {

		var service = {types: {}};

		service.string = function (value) {
			return {$regex: value, $options: 'i'};
		};

		service.integer = function (value) {
			if (isNaN(value)) {
				return null;
			}

			return parseInt(value, 10);
		};

		service.float = function (value) {
			if (isNaN(value)) {
				return null;
			}

			return parseFloat(value);
		};

		service.intervalMaker = function (value, cb, extra) {
			var values;
			if (value.indexOf('<>') !== -1) {
				values = value.split('<>');
				return { $gte: cb(values[0].trim()), $lte: cb(values[1].trim()) };
			}
			else if (value.indexOf('>=') !== -1) {
				values = value.split('>=');
				return { $lte: cb(values[0].trim()) };
			}
			else if (value.indexOf('<=') !== -1) {
				values = value.split('<=');
				return { $gte: cb(values[0].trim()) };
			}
			else if (value.indexOf('>') !== -1) {
				values = value.split('>');
				return { $lt: cb(values[0].trim()) };
			}
			else if (value.indexOf('<') !== -1) {
				values = value.split('<');
				return { $gt: cb(values[0].trim()) };
			}
			else {
				return cb(value, true, extra);
			}
		};

		service.date = function (value, noRange) {
			if (noRange) {
				return service.string(value);
			}

			var date = new Date(value);
			value = (date < new Date('1980-12-31T09:00:00-07:00')) ? null : value;

			return value;
		};

		service.boolean = function (value) {
			if (value === 'true') {
				return true;
			}
			if (value === 'false') {
				return false;
			}
			return null;
		};

		service.integerRepresentation = function (value, noRange, extra) {
			if (typeof extra !== 'object' || !Array.isArray(extra.representations)) {
				return null;
			}

			var representations = extra.representations;
			var matchingIndexes = [];
			var expression = new RegExp(value, 'i');

			representations.forEach(function (value, index) {
				if (expression.test(value)) {
					matchingIndexes.push(index);
				}
			});

			return {$in: matchingIndexes};
		};

		return service;
	}]);