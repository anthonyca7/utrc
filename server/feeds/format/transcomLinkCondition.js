'use strict';

module.exports.order = [
	'ID',
	'DataType',
	'Speed',
	'Travel Time',
	'Travel Time as decimal'
];

module.exports.format = {
	'ID': {
		path: ['ID'],
		type: 'integer',
		searchableByInterval: true
	},
	'DataType': {
		path: ['DataType']
	},
	'Speed': {
		path: ['Speed']
	},
	'Travel Time': {
		path: ['TravelTime'],
		type: 'integer',
		searchableByInterval: true
	},
	'Travel Time as decimal': {
		path: ['TravelTimeFloat'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	}
};

module.exports.db = 'mongodb';