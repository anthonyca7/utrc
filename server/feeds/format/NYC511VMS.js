'use strict';

module.exports.format = {
	'ID': {
		path: ['id'],
		type: 'integer',
		searchableByInterval: true
	},
	'Name': {
		path: ['name']
	},
	'Last Update': {
		path: ['last_update'],
		modifiers: ['date'],
		type: 'date',
		searchableByInterval: true
	},
	'Owner name': {
		path: ['owner_name']
	},
	'Location': {
		path: ['location']
	},
	'Latitude': {
		path: ['lat'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Longitude': {
		path: ['lon'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Message': {
		path: ['message']
	},
	'Status': {
		path: ['status']
	}
}


module.exports.order = [
	'ID',
	'Name',
	'Last Update',
	'Owner name',
	'Location',
	'Latitude',
	'Longitude',
	'Message',
	'Status'
];

module.exports.db = "mongodb";
module.exports.index = "id";