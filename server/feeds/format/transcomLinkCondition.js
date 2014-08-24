'use strict';

module.exports.order = [
	'ID',
	'DataType',
	'Speed',
	'TravelTime',
	'TravelTimeFloat'
];

module.exports.format = {
	'ID': {
		path: ['event', 'ID'],
		type: 'integer',
		searchableByInterval: true
	},
	'DataType': {
		path: ['event', 'DataType']
	},
	'Speed': {
		path: ['event', 'Speed']
	},
	'Travel Time': {
		path: ['event', 'TravelTime'],
		type: 'integer',
		searchableByInterval: true
	},
	'Travel Time as decimal': {
		path: ['event', 'TravelTimeFloat'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	}
};

module.exports.db = 'mongodb';