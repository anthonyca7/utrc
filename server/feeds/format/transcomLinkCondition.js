'use strict';

module.exports.order = [
	'Link ID',
	'Date',
	'DataType',
	'Speed',
	'Travel Time',
	'Travel Time as decimal'
];

module.exports.format = {
	'Link ID': {
		path: ['ID'],
		type: 'integer',
		searchableByInterval: true
	},
	'Date': {
		path: ['asOf'],
		type: 'date',
		modifiers: ['date'],
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
module.exports.index = 'ID';