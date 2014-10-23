'use strict';

module.exports.format = {
	'ID': {
		path: ['LINK_ID'],
		type: 'integer',
		searchableByInterval: true
	},
	'Route Name': {
		path: ['ROUTE_NAME']
	},
	'Description': {
		path: ['DESCRIPTION']
	},
	'Points': {
		path: ['POINTS'],
		notSearchable: true
	}
}

module.exports.order = [
	'ID',
	'Route Name',
	'Description',
	'Points'
];

module.exports.db = "mongodb";
module.exports.index = "LINK_ID";